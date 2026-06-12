#!/usr/bin/env node
/**
 * Sync script: fetches 2026 matches from Zafronix API and updates matches.json.
 * If any scores changed, rebuilds and restarts.
 *
 * Usage:   node sync-scores.js
 * Cron:    */30 * * * * cd /opt/worldcup-predictor && ZAFRONIX_KEY=zwc_free_... node sync-scores.js >> /var/log/worldcup-sync.log 2>&1
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ZAFRONIX_KEY = process.env.ZAFRONIX_KEY || ''
const MATCHES_PATH = path.join(__dirname, 'public', 'data', 'matches.json')
const BASE = 'https://api.zafronix.com/fifa/worldcup/v1'

if (!ZAFRONIX_KEY) {
  console.error('[sync] ZAFRONIX_KEY not set, exiting')
  process.exit(0)
}

async function zfetch(endpoint) {
  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      headers: { 'x-api-key': ZAFRONIX_KEY },
    })
    if (!res.ok) {
      console.error(`[sync] fetch ${endpoint} → ${res.status}`)
      return null
    }
    return res.json()
  } catch (err) {
    console.error('[sync] fetch error:', err.message)
    return null
  }
}

async function main() {
  console.log(`[sync] ${new Date().toISOString()} — starting`)

  const data = await zfetch('/matches?year=2026')
  if (!data?.data || !Array.isArray(data.data)) {
    console.log('[sync] no matches from API, skipping')
    return
  }

  const apiMatches = data.data
  console.log(`[sync] got ${apiMatches.length} matches from API`)

  // Read local matches
  const local = JSON.parse(fs.readFileSync(MATCHES_PATH, 'utf-8'))
  let changed = 0

  for (const apiMatch of apiMatches) {
    const localMatch = local.find(m => m.id === apiMatch.id)
    if (!localMatch) {
      console.log(`[sync] ${apiMatch.id}: not in local data, skipping`)
      continue
    }

    const hasScore = apiMatch.homeScore !== null && apiMatch.awayScore !== null
    const oldScore = `${localMatch.homeScore ?? '?'}-${localMatch.awayScore ?? '?'}`
    const newScore = `${apiMatch.homeScore ?? '?'}-${apiMatch.awayScore ?? '?'}`

    // Map API status to our status
    let apiStatus = 'scheduled'
    if (apiMatch.status === 'completed' || apiMatch.result) apiStatus = 'finished'

    if (hasScore && oldScore !== newScore) {
      console.log(`[sync] ${apiMatch.id}: ${oldScore} → ${newScore} (${apiStatus})`)
      localMatch.homeScore = apiMatch.homeScore
      localMatch.awayScore = apiMatch.awayScore
      changed++
    }

    if (apiStatus === 'finished' && localMatch.status !== 'finished') {
      console.log(`[sync] ${apiMatch.id}: status ${localMatch.status} → finished`)
      localMatch.status = 'finished'
      if (!changed || oldScore === newScore) changed++
    }
  }

  if (changed === 0) {
    console.log('[sync] no changes detected')
    return
  }

  // Write updated matches
  fs.writeFileSync(MATCHES_PATH, JSON.stringify(local, null, 2))
  console.log(`[sync] wrote ${changed} changes`)

  // Git commit
  try {
    execSync('git add public/data/matches.json', { cwd: __dirname, stdio: 'pipe' })
    execSync(`git commit -m "sync: update ${changed} match scores [auto]"`, { cwd: __dirname, stdio: 'pipe' })
    console.log('[sync] committed')
  } catch (err) {
    console.error('[sync] git commit note:', err.message)
  }

  // Rebuild and restart
  console.log('[sync] rebuilding...')
  try {
    execSync('npm run build', { cwd: __dirname, stdio: 'pipe' })
    execSync('pm2 restart worldcup --update-env', { stdio: 'pipe' })
    console.log('[sync] rebuild + restart done')
  } catch (err) {
    console.error('[sync] build/restart failed:', err.message)
  }
}

main().catch(err => console.error('[sync] fatal:', err))
