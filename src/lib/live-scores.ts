// API-Football integration — free tier via rapidapi
// Sign up: https://rapidapi.com/api-sports/api/api-football
// Then set NEXT_PUBLIC_RAPIDAPI_KEY in Vercel env vars

const API_BASE = 'https://api-football-v1.p.rapidapi.com/v3'

interface LiveScore {
  id: string
  homeTeamId: number
  awayTeamId: number
  homeScore: number
  awayScore: number
  status: string
  elapsed: number
  homeName: string
  awayName: string
}

async function apiFetch(path: string): Promise<any> {
  const key = process.env.NEXT_PUBLIC_RAPIDAPI_KEY
  if (!key) return null

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    },
    next: { revalidate: 60 }, // cache 60s
  })
  if (!res.ok) return null
  return res.json()
}

export async function getLiveWorldCupMatches(): Promise<LiveScore[]> {
  try {
    // World Cup 2026 league ID (will be available closer to tournament)
    // For now try both 2022 World Cup (1) and future 2026
    const data = await apiFetch('/fixtures?league=1&season=2026&live=all')
    if (!data?.response?.length) {
      // Fallback: try live fixtures across all leagues
      const fallback = await apiFetch('/fixtures?live=all')
      return (fallback?.response || []).map((f: any) => ({
        id: String(f.fixture.id),
        homeTeamId: f.teams.home.id,
        awayTeamId: f.teams.away.id,
        homeScore: f.goals.home ?? 0,
        awayScore: f.goals.away ?? 0,
        status: f.fixture.status.short,
        elapsed: f.fixture.status.elapsed ?? 0,
        homeName: f.teams.home.name,
        awayName: f.teams.away.name,
      }))
    }
    return data.response.map((f: any) => ({
      id: String(f.fixture.id),
      homeTeamId: f.teams.home.id,
      awayTeamId: f.teams.away.id,
      homeScore: f.goals.home ?? 0,
      awayScore: f.goals.away ?? 0,
      status: f.fixture.status.short,
      elapsed: f.fixture.status.elapsed ?? 0,
      homeName: f.teams.home.name,
      awayName: f.teams.away.name,
    }))
  } catch {
    return []
  }
}

export async function getFinishedMatches(): Promise<LiveScore[]> {
  try {
    const data = await apiFetch('/fixtures?league=1&season=2026&status=FT')
    return (data?.response || []).map((f: any) => ({
      id: String(f.fixture.id),
      homeTeamId: f.teams.home.id,
      awayTeamId: f.teams.away.id,
      homeScore: f.goals.home ?? 0,
      awayScore: f.goals.away ?? 0,
      status: 'FT',
      elapsed: 90,
      homeName: f.teams.home.name,
      awayName: f.teams.away.name,
    }))
  } catch {
    return []
  }
}
