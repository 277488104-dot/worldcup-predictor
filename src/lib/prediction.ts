import type { Team, TeamStats, Venue, PredictionResult } from '@/types/worldcup'

const WEIGHTS = {
  attack: 0.2,
  defense: 0.2,
  possession: 0.15,
  fitness: 0.1,
  experience: 0.15,
  recentForm: 0.2,
}

function computeTeamScore(stats: TeamStats): number {
  return (
    stats.attack * WEIGHTS.attack +
    stats.defense * WEIGHTS.defense +
    stats.possession * WEIGHTS.possession +
    stats.fitness * WEIGHTS.fitness +
    stats.experience * WEIGHTS.experience +
    stats.recentForm * WEIGHTS.recentForm
  )
}

function venueFactor(team: Team, venue: Venue): number {
  let factor = 1.0
  if (team.confederation === 'CONCACAF') factor += 0.05
  if (venue.altitude > 1500 && team.confederation !== 'CONCACAF') factor -= 0.03
  if (venue.altitude > 2500) factor -= 0.05
  return factor
}

export function predictMatch(
  homeTeam: Team,
  awayTeam: Team,
  venue: Venue
): PredictionResult {
  const homeBase = computeTeamScore(homeTeam.stats)
  const awayBase = computeTeamScore(awayTeam.stats)

  const homeVenue = venueFactor(homeTeam, venue)
  const awayVenue = venueFactor(awayTeam, venue)

  const homeAdjusted = homeBase * homeVenue
  const awayAdjusted = awayBase * awayVenue

  const total = homeAdjusted + awayAdjusted
  const homeEdge = homeAdjusted / total

  const drawBase = 0.25
  const homeWin = homeEdge * (1 - drawBase)
  const awayWin = (1 - homeEdge) * (1 - drawBase)

  const rankDiff = homeTeam.fifaRank - awayTeam.fifaRank
  const confidence = Math.min(0.95, 0.5 + Math.abs(rankDiff) / 100)

  return {
    homeWin: Math.round(homeWin * 1000) / 1000,
    draw: Math.round(drawBase * 1000) / 1000,
    awayWin: Math.round(awayWin * 1000) / 1000,
    confidence,
    factors: [
      { name: 'FIFA 排名', advantage: rankDiff < 0 ? 'home' : rankDiff > 0 ? 'away' : 'neutral', weight: 0.3 },
      { name: '近期状态', advantage: homeTeam.stats.recentForm > awayTeam.stats.recentForm ? 'home' : homeTeam.stats.recentForm < awayTeam.stats.recentForm ? 'away' : 'neutral', weight: 0.2 },
      { name: '场地适应', advantage: homeVenue > awayVenue ? 'home' : homeVenue < awayVenue ? 'away' : 'neutral', weight: 0.15 },
      { name: '攻击力', advantage: homeTeam.stats.attack > awayTeam.stats.defense ? 'home' : 'away', weight: 0.2 },
      { name: '防守力', advantage: homeTeam.stats.defense > awayTeam.stats.attack ? 'home' : 'away', weight: 0.15 },
    ],
  }
}
