// Zafronix World Cup API — free tier, 1000 req/day
// API key stored in NEXT_PUBLIC_ZAFRONIX_KEY env var

const BASE = 'https://api.zafronix.com/v1'

function getKey(): string {
  return process.env.NEXT_PUBLIC_ZAFRONIX_KEY ?? process.env.ZAFRONIX_KEY ?? ''
}

async function zfetch(path: string) {
  const key = getKey()
  if (!key) return null
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'x-api-key': key },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

export interface LiveMatch {
  id: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  status: string
  minute: number | null
  stage: string
  date: string
  venue: string
  city: string
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
  try {
    const data = await zfetch('/matches?tournament=2026&status=live')
    if (!data?.matches) return []
    return data.matches.map((m: Record<string, unknown>) => ({
      id: String(m.id ?? ''),
      home: String(m.home_team ?? m.home ?? ''),
      away: String(m.away_team ?? m.away ?? ''),
      homeScore: typeof m.home_score === 'number' ? m.home_score : null,
      awayScore: typeof m.away_score === 'number' ? m.away_score : null,
      status: String(m.status ?? 'scheduled'),
      minute: typeof m.minute === 'number' ? m.minute : null,
      stage: String(m.stage ?? ''),
      date: String(m.date ?? ''),
      venue: String(m.venue ?? ''),
      city: String(m.city ?? ''),
    }))
  } catch {
    return []
  }
}

export async function getRecentResults(): Promise<LiveMatch[]> {
  try {
    const data = await zfetch('/matches?tournament=2026&status=finished&limit=20')
    if (!data?.matches) return []
    return data.matches.map((m: Record<string, unknown>) => ({
      id: String(m.id ?? ''),
      home: String(m.home_team ?? m.home ?? ''),
      away: String(m.away_team ?? m.away ?? ''),
      homeScore: typeof m.home_score === 'number' ? m.home_score : null,
      awayScore: typeof m.away_score === 'number' ? m.away_score : null,
      status: 'finished',
      minute: 90,
      stage: String(m.stage ?? ''),
      date: String(m.date ?? ''),
      venue: String(m.venue ?? ''),
      city: String(m.city ?? ''),
    }))
  } catch {
    return []
  }
}

export async function getUpcomingMatches(): Promise<LiveMatch[]> {
  try {
    const data = await zfetch('/matches?tournament=2026&status=scheduled&limit=20')
    if (!data?.matches) return []
    return data.matches.map((m: Record<string, unknown>) => ({
      id: String(m.id ?? ''),
      home: String(m.home_team ?? m.home ?? ''),
      away: String(m.away_team ?? m.away ?? ''),
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      minute: null,
      stage: String(m.stage ?? ''),
      date: String(m.date ?? ''),
      venue: String(m.venue ?? ''),
      city: String(m.city ?? ''),
    }))
  } catch {
    return []
  }
}
