import type { Team, TeamStats, Venue, PredictionResult } from '@/types/worldcup'

const WEIGHTS: Record<keyof TeamStats, number> = {
  attack: 0.2,
  defense: 0.2,
  possession: 0.15,
  fitness: 0.1,
  experience: 0.15,
  recentForm: 0.2,
}

/**
 * Compute a weighted composite score (0-100) from a team's stat vector.
 */
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

/**
 * Adjust a team's effective score by venue conditions (climate, altitude).
 *
 * - CONCACAF teams (host region) get a slight familiarity bonus at any venue.
 * - High-altitude venues penalise non-CONCACAF teams (unacclimated).
 */
export function computeVenueFactor(team: Team, venue: Venue): number {
  let factor = 1.0

  // Host-region familiarity bonus
  if (team.confederation === 'CONCACAF') {
    factor += 0.05
  }

  // Altitude penalty for teams not used to it
  if (venue.altitude > 1500) {
    factor -= 0.03
  }
  if (venue.altitude > 2500) {
    factor -= 0.05
  }

  return factor
}

/**
 * Compare two stats and return which team has the advantage.
 */
function compareAdvantage(
  homeVal: number,
  awayVal: number,
  label: string,
  weight: number,
): PredictionResult['factors'][number] {
  return {
    name: label,
    advantage: homeVal > awayVal ? 'home' : homeVal < awayVal ? 'away' : 'neutral',
    weight,
  }
}

/**
 * Predict the outcome of a single match given two teams and a venue.
 *
 * Algorithm:
 * 1. Compute each team's weighted base score from their stats.
 * 2. Apply venue-factor adjustments.
 * 3. Map adjusted scores to win probabilities, reserving 25 % for a draw.
 * 4. Compute confidence from the FIFA rank gap and score differential.
 * 5. Return the probabilities and an ordered list of advantage factors.
 */
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

  // Confidence: driven by rank disparity AND score differential
  const rankDiff = Math.abs(homeTeam.fifaRank - awayTeam.fifaRank)
  const scoreDiff = Math.abs(homeBase - awayBase)
  const confidence = Math.min(
    0.95,
    0.5 + rankDiff / 100 + scoreDiff / 200,
  )

  const s = homeTeam.stats as TeamStats
  const o = awayTeam.stats as TeamStats

  return {
    homeWin: Math.round(homeWin * 1000) / 1000,
    draw: Math.round(drawBase * 1000) / 1000,
    awayWin: Math.round(awayWin * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    factors: [
      compareAdvantage(
        -homeTeam.fifaRank,
        -awayTeam.fifaRank,
        'FIFA 排名',
        0.3,
      ),
      compareAdvantage(s.recentForm, o.recentForm, '近期状态', 0.2),
      compareAdvantage(
        homeAdjusted,
        awayAdjusted,
        '场地适应',
        0.15,
      ),
      compareAdvantage(s.attack, o.defense, '攻击 vs 防守', 0.2),
      compareAdvantage(s.defense, o.attack, '防守 vs 攻击', 0.15),
    ],
  }
}
