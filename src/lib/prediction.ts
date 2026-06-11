import type { Team, TeamStats, Venue, PredictionResult } from '@/types/worldcup'

const WEIGHTS: Record<keyof TeamStats, number> = {
  attack: 0.2,
  defense: 0.2,
  possession: 0.15,
  fitness: 0.1,
  experience: 0.15,
  recentForm: 0.2,
}

export function computeTeamScore(stats: TeamStats): number {
  return (
    stats.attack * WEIGHTS.attack +
    stats.defense * WEIGHTS.defense +
    stats.possession * WEIGHTS.possession +
    stats.fitness * WEIGHTS.fitness +
    stats.experience * WEIGHTS.experience +
    stats.recentForm * WEIGHTS.recentForm
  )
}

export function computeVenueFactor(team: Team, venue: Venue): number {
  let factor = 1.0
  if (team.confederation === 'CONCACAF') factor += 0.05
  if (venue.altitude > 1500) factor -= 0.03
  if (venue.altitude > 2500) factor -= 0.05
  return factor
}

function compareAdvantage(
  homeVal: number, awayVal: number, label: string, weight: number,
): PredictionResult['factors'][number] {
  return {
    name: label,
    advantage: homeVal > awayVal ? 'home' : homeVal < awayVal ? 'away' : 'neutral',
    weight,
  }
}

export interface ScorePrediction {
  homeScore: number
  awayScore: number
  probability: number
}

/**
 * Generate 3 most likely scorelines based on expected goals.
 *
 * Uses a Poisson-inspired approach: expected goals derived from attack/defense stats,
 * then picks the 3 most probable discrete scorelines.
 */
export function predictScores(homeTeam: Team, awayTeam: Team, venue: Venue): ScorePrediction[] {
  const hAtk = homeTeam.stats.attack / 100
  const hDef = homeTeam.stats.defense / 100
  const aAtk = awayTeam.stats.attack / 100
  const aDef = awayTeam.stats.defense / 100

  // Expected goals: attack vs defense, adjusted by venue
  const venueAdj = venue.altitude > 1500 ? 1.15 : 1.0
  const hXg = (hAtk * (1 - aDef) * 3.5 + 0.3) * venueAdj
  const aXg = (aAtk * (1 - hDef) * 3.0 + 0.2) * venueAdj

  // Poisson PMF approximation
  function poisson(k: number, lambda: number): number {
    if (lambda === 0) return k === 0 ? 1 : 0
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k)
  }
  function factorial(n: number): number {
    return n <= 1 ? 1 : n * factorial(n - 1)
  }

  const candidates: ScorePrediction[] = []
  for (let h = 0; h <= 5; h++) {
    for (let a = 0; a <= 5; a++) {
      const p = poisson(h, hXg) * poisson(a, aXg)
      candidates.push({ homeScore: h, awayScore: a, probability: p })
    }
  }

  candidates.sort((a, b) => b.probability - a.probability)
  return candidates.slice(0, 3)
}

export function predictMatch(
  homeTeam: Team,
  awayTeam: Team,
  venue: Venue,
): PredictionResult {
  const homeBase = computeTeamScore(homeTeam.stats)
  const awayBase = computeTeamScore(awayTeam.stats)

  const homeVenueFactor = computeVenueFactor(homeTeam, venue)
  const awayVenueFactor = computeVenueFactor(awayTeam, venue)

  const homeAdjusted = homeBase * homeVenueFactor
  const awayAdjusted = awayBase * awayVenueFactor

  const total = homeAdjusted + awayAdjusted
  const homeEdge = total > 0 ? homeAdjusted / total : 0.5

  const drawBase = 0.25
  const homeWin = homeEdge * (1 - drawBase)
  const awayWin = (1 - homeEdge) * (1 - drawBase)

  const rankDiff = Math.abs(homeTeam.fifaRank - awayTeam.fifaRank)
  const scoreDiff = Math.abs(homeBase - awayBase)
  const confidence = Math.min(0.95, 0.5 + rankDiff / 100 + scoreDiff / 200)

  const s = homeTeam.stats as TeamStats
  const o = awayTeam.stats as TeamStats

  return {
    homeWin: Math.round(homeWin * 1000) / 1000,
    draw: Math.round(drawBase * 1000) / 1000,
    awayWin: Math.round(awayWin * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    factors: [
      compareAdvantage(-homeTeam.fifaRank, -awayTeam.fifaRank, 'FIFA 排名', 0.3),
      compareAdvantage(s.recentForm, o.recentForm, '近期状态', 0.2),
      compareAdvantage(homeAdjusted, awayAdjusted, '场地适应', 0.15),
      compareAdvantage(s.attack, o.defense, '攻击 vs 防守', 0.2),
      compareAdvantage(s.defense, o.attack, '防守 vs 攻击', 0.15),
      compareAdvantage(s.possession, o.possession, '控球能力', 0.1),
      compareAdvantage(s.fitness, o.fitness, '体能储备', 0.1),
      compareAdvantage(s.experience, o.experience, '大赛经验', 0.1),
    ],
  }
}
