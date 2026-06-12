#!/usr/bin/env node
/**
 * Sync script: fetches 2026 matches AND standings from Zafronix,
 * writes both to public/data/*.json, rebuilds on change.
 *
 * Cron: runs every 30 min via crontab
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ZAFRONIX_KEY = process.env.ZAFRONIX_KEY || ''
const MATCHES_PATH = path.join(__dirname, 'public', 'data', 'matches.json')
const STANDINGS_PATH = path.join(__dirname, 'public', 'data', 'standings.json')
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

async function syncMatches() {
  const data = await zfetch('/matches?year=2026')
  if (!data?.data || !Array.isArray(data.data)) {
    console.log('[sync] no matches from API')
    return 0
  }

  const apiMatches = data.data
  const local = JSON.parse(fs.readFileSync(MATCHES_PATH, 'utf-8'))
  let changed = 0

  for (const apiMatch of apiMatches) {
    const mappedId = apiMatch.id.replace(/^\d+-/, 'match-')
    const localMatch = local.find(m => m.id === mappedId)
    if (!localMatch) continue

    const hasScore = apiMatch.homeScore !== null && apiMatch.awayScore !== null
    const oldScore = `${localMatch.homeScore ?? '?'}-${localMatch.awayScore ?? '?'}`
    const newScore = `${apiMatch.homeScore ?? '?'}-${apiMatch.awayScore ?? '?'}`
    let apiStatus = apiMatch.status === 'completed' || apiMatch.result ? 'finished' : 'scheduled'

    if (hasScore && oldScore !== newScore) {
      console.log(`[sync] ${apiMatch.id} → ${mappedId}: ${oldScore} → ${newScore} (${apiStatus})`)
      localMatch.homeScore = apiMatch.homeScore
      localMatch.awayScore = apiMatch.awayScore
      changed++
    }

    if (apiStatus === 'finished' && localMatch.status !== 'finished') {
      console.log(`[sync] ${apiMatch.id} → ${mappedId}: status ${localMatch.status} → finished`)
      localMatch.status = 'finished'
      if (!changed || oldScore === newScore) changed++
    }
  }

  if (changed > 0) {
    fs.writeFileSync(MATCHES_PATH, JSON.stringify(local, null, 2))
    console.log(`[sync] wrote ${changed} match changes`)
  }
  return changed
}

async function syncStandings() {
  const data = await zfetch('/standings?year=2026')
  if (!data?.groups || Object.keys(data.groups).length === 0) {
    console.log('[sync] no standings from API')
    return 0
  }

  const old = fs.existsSync(STANDINGS_PATH) ? JSON.parse(fs.readFileSync(STANDINGS_PATH, 'utf-8')) : {}
  const oldJson = JSON.stringify(old)
  const newJson = JSON.stringify(data.groups)

  if (oldJson === newJson) {
    console.log('[sync] standings unchanged')
    return 0
  }

  fs.writeFileSync(STANDINGS_PATH, JSON.stringify(data.groups, null, 2))
  console.log('[sync] standings updated')
  return 1
}

async function main() {
  console.log(`[sync] ${new Date().toISOString()} — starting`)

  const [matchChanged, standingsChanged] = await Promise.all([
    syncMatches(),
    syncStandings(),
  ])

  const totalChanged = matchChanged + standingsChanged
  if (totalChanged === 0) {
    console.log('[sync] no changes detected')
    return
  }

  // Git commit
  try {
    execSync('git add public/data/matches.json public/data/standings.json', { cwd: __dirname, stdio: 'pipe' })
    execSync(`git commit -m "sync: update scores & standings [auto]"`, { cwd: __dirname, stdio: 'pipe' })
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
