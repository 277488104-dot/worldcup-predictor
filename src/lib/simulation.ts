import type { Team, Venue } from '@/types/worldcup'
import { computeTeamScore, computeVenueFactor } from '@/lib/prediction'

export interface SimResult {
  homeScore: number
  awayScore: number
  count: number
}

interface SimSummary {
  homeWins: number
  draws: number
  awayWins: number
  results: SimResult[]
  homeWinRate: number
  drawRate: number
  awayWinRate: number
}

const SIM_COUNT = 1000
const NOISE = 12 // standard deviation for Gaussian noise

function gaussianRandom(mean = 0, stdev = 1): number {
  const u = 1 - Math.random()
  const v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(Math.max(u, 0.0001))) * Math.cos(2.0 * Math.PI * v)
  return z * stdev + mean
}

function simulateScore(strength: number): number {
  // Expected goals ~ strength * 0.04
  const xg = Math.max(0, strength * 0.04 + gaussianRandom(0, 0.5))
  // Poisson draw
  let goals = 0
  let p = Math.exp(-xg)
  let s = p
  const u = Math.random()
  while (u > s && goals < 10) {
    goals++
    p *= xg / goals
    s += p
  }
  return goals
}

export function runSimulation(homeTeam: Team, awayTeam: Team, venue: Venue): SimSummary {
  const homeBase = computeTeamScore(homeTeam.stats) * computeVenueFactor(homeTeam, venue)
  const awayBase = computeTeamScore(awayTeam.stats) * computeVenueFactor(awayTeam, venue)

  const scoreMap = new Map<string, number>()
  let homeWins = 0, draws = 0, awayWins = 0

  for (let i = 0; i < SIM_COUNT; i++) {
    const hNoise = homeBase + gaussianRandom(0, NOISE)
    const aNoise = awayBase + gaussianRandom(0, NOISE)
    const hGoals = simulateScore(Math.max(0, hNoise))
    const aGoals = simulateScore(Math.max(0, aNoise))
    const key = `${hGoals}-${aGoals}`
    scoreMap.set(key, (scoreMap.get(key) ?? 0) + 1)
    if (hGoals > aGoals) homeWins++
    else if (hGoals === aGoals) draws++
    else awayWins++
  }

  const results: SimResult[] = Array.from(scoreMap.entries())
    .map(([key, count]) => {
      const [h, a] = key.split('-').map(Number)
      return { homeScore: h, awayScore: a, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    homeWins,
    draws,
    awayWins,
    results,
    homeWinRate: homeWins / SIM_COUNT,
    drawRate: draws / SIM_COUNT,
    awayWinRate: awayWins / SIM_COUNT,
  }
}
