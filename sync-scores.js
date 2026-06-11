#!/usr/bin/env node
/**
 * Sync script: fetches finished/live matches from Zafronix API and updates
 * matches.json in the project. If any scores changed, rebuilds and restarts.
 *
 * Usage: node sync-scores.js
 * Designed for cron: */30 * * * * cd /opt/worldcup-predictor && node sync-scores.js
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ZAFRONIX_KEY = process.env.ZAFRONIX_KEY || ''
const MATCHES_PATH = path.join(__dirname, 'public', 'data', 'matches.json')
const BASE = 'https://api.zafronix.com/v1'

if (!ZAFRONIX_KEY) {
  console.error('[sync] ZAFRONIX_KEY not set, exiting')
  process.exit(0)
}

async function zfetch(endpoint) {
  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      headers: { 'x-api-key': ZAFRONIX_KEY },
    })
    if (!res.ok) return { matches: [] }
    return res.json()
  } catch (err) {
    console.error('[sync] fetch error:', err.message)
    return { matches: [] }
  }
}

function mapMatch(m) {
  return {
    id: String(m.id ?? ''),
    home: String(m.home_team ?? m.home ?? ''),
    away: String(m.away_team ?? m.away ?? ''),
    homeScore: typeof m.home_score === 'number' ? m.home_score : null,
    awayScore: typeof m.away_score === 'number' ? m.away_score : null,
    status: String(m.status ?? 'scheduled'),
    minute: typeof m.minute === 'number' ? m.minute : null,
    stage: String(m.stage ?? ''),
    date: String(m.date ?? ''),
  }
}

async function main() {
  console.log(`[sync] ${new Date().toISOString()} — starting sync`)

  // Fetch finished + live matches
  const [finished, live] = await Promise.all([
    zfetch('/matches?tournament=2026&status=finished&limit=30'),
    zfetch('/matches?tournament=2026&status=live'),
  ])

  const apiMatches = []
  if (finished?.matches) apiMatches.push(...finished.matches.map(mapMatch))
  if (live?.matches) apiMatches.push(...live.matches.map(mapMatch))

  if (apiMatches.length === 0) {
    console.log('[sync] no results from API, skipping')
    return
  }

  console.log(`[sync] got ${apiMatches.length} matches from API (${finished?.matches?.length || 0} finished, ${live?.matches?.length || 0} live)`)

  // Read local matches
  const local = JSON.parse(fs.readFileSync(MATCHES_PATH, 'utf-8'))
  let changed = 0

  for (const apiMatch of apiMatches) {
    const localMatch = local.find(m => m.id === apiMatch.id)
    if (!localMatch) continue

    const hasNewScore = apiMatch.homeScore !== null && apiMatch.awayScore !== null
    const oldScore = `${localMatch.homeScore ?? '?'}-${localMatch.awayScore ?? '?'}`
    const newScore = `${apiMatch.homeScore ?? '?'}-${apiMatch.awayScore ?? '?'}`

    if (hasNewScore && oldScore !== newScore) {
      console.log(`[sync] ${apiMatch.id}: ${oldScore} → ${newScore} (${apiMatch.status})`)
      localMatch.homeScore = apiMatch.homeScore
      localMatch.awayScore = apiMatch.awayScore
      changed++
    }

    if (apiMatch.status === 'finished' && localMatch.status !== 'finished') {
      console.log(`[sync] ${apiMatch.id}: status ${localMatch.status} → finished`)
      localMatch.status = 'finished'
      changed++
    }

    if (apiMatch.status === 'live' && localMatch.status !== 'live') {
      console.log(`[sync] ${apiMatch.id}: status ${localMatch.status} → live`)
      localMatch.status = 'live'
      changed++
    }
  }

  if (changed === 0) {
    console.log('[sync] no changes detected')
    return
  }

  // Write updated matches
  fs.writeFileSync(MATCHES_PATH, JSON.stringify(local, null, 2))
  console.log(`[sync] wrote ${changed} changes to matches.json`)

  // Git commit
  try {
    execSync('git add public/data/matches.json', { cwd: __dirname })
    execSync(`git commit -m "sync: update ${changed} match scores [auto]"`, { cwd: __dirname })
    console.log('[sync] committed')
  } catch (err) {
    console.error('[sync] git commit failed:', err.message)
  }

  // Rebuild and restart
  console.log('[sync] rebuilding...')
  try {
    execSync('npm run build', { cwd: __dirname, stdio: 'inherit' })
    execSync('pm2 restart worldcup --update-env', { stdio: 'inherit' })
    console.log('[sync] rebuild + restart done')
  } catch (err) {
    console.error('[sync] build/restart failed:', err.message)
  }
}

main().catch(err => console.error('[sync] fatal:', err))
