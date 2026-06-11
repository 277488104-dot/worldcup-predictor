import type { Team } from '@/types/worldcup'
import { getAllTeams } from './data'

// ── Leaderboards ──────────────────────────────────────────────────────────────

/**
 * Top N teams by a single stat dimension.
 */
export function getTopTeamsByStat(
  stat: keyof Team['stats'],
  limit: number = 5,
): Team[] {
  return getAllTeams()
    .sort((a, b) => b.stats[stat] - a.stats[stat])
    .slice(0, limit)
}

/**
 * Return all teams sorted by a composite sum of their stats.
 */
export function getTeamsByCompositeStrength(): Team[] {
  return getAllTeams()
    .map(team => ({
      team,
      total:
        team.stats.attack +
        team.stats.defense +
        team.stats.possession +
        team.stats.fitness +
        team.stats.experience +
        team.stats.recentForm,
    }))
    .sort((a, b) => b.total - a.total)
    .map(({ team }) => team)
}

// ── Visual helpers ────────────────────────────────────────────────────────────

/**
 * Map a 0-100 stat value to a hex color for strength visualization.
 */
export function getTeamStrengthColor(value: number): string {
  if (value >= 80) return '#00d4ff'
  if (value >= 60) return '#22c55e'
  if (value >= 40) return '#eab308'
  if (value >= 20) return '#f97316'
  return '#ef4444'
}

/**
 * Map a 0-100 stat value to a human-readable tier label.
 */
export function getStatTier(value: number): string {
  if (value >= 85) return 'S'
  if (value >= 70) return 'A'
  if (value >= 55) return 'B'
  if (value >= 40) return 'C'
  if (value >= 25) return 'D'
  return 'E'
}

// ── Computed stats ────────────────────────────────────────────────────────────

/**
 * Average of all six stats for a team.
 */
export function getTeamAverage(team: Team): number {
  const s = team.stats
  const total = s.attack + s.defense + s.possession + s.fitness + s.experience + s.recentForm
  return Math.round((total / 6) * 10) / 10
}

/**
 * Difference between a team's attack and defense stats.
 * Positive = attacking bias, negative = defensive bias.
 */
export function getStyleBias(team: Team): number {
  return team.stats.attack - team.stats.defense
}

/**
 * Return the highest stat value for a team, with its name.
 */
export function getTopStat(
  team: Team,
): { name: string; value: number } {
  const s = team.stats
  const entries = Object.entries(s) as [keyof typeof s, number][]
  const top = entries.reduce((best, curr) => (curr[1] > best[1] ? curr : best))
  return { name: top[0], value: top[1] }
}

/**
 * Return the lowest stat value for a team, with its name.
 */
export function getWeakestStat(
  team: Team,
): { name: string; value: number } {
  const s = team.stats
  const entries = Object.entries(s) as [keyof typeof s, number][]
  const bottom = entries.reduce((worst, curr) => (curr[1] < worst[1] ? curr : worst))
  return { name: bottom[0], value: bottom[1] }
}

// ── Radar data ────────────────────────────────────────────────────────────────

/**
 * Format a team's stats for a radar/spider chart (labels + values).
 */
export function getTeamRadarData(team: Team): {
  labels: string[]
  values: number[]
} {
  const keys: (keyof Team['stats'])[] = [
    'attack',
    'defense',
    'possession',
    'fitness',
    'experience',
    'recentForm',
  ]
  return {
    labels: keys,
    values: keys.map(k => team.stats[k]),
  }
}

// ── Comparison ────────────────────────────────────────────────────────────────

/**
 * Head-to-head stat comparison between two teams.
 */
export function compareTeams(a: Team, b: Team): {
  stat: keyof Team['stats']
  a: number
  b: number
  winner: 'a' | 'b' | 'draw'
}[] {
  const keys: (keyof Team['stats'])[] = [
    'attack',
    'defense',
    'possession',
    'fitness',
    'experience',
    'recentForm',
  ]
  return keys.map(stat => ({
    stat,
    a: a.stats[stat],
    b: b.stats[stat],
    winner: a.stats[stat] > b.stats[stat] ? 'a' : a.stats[stat] < b.stats[stat] ? 'b' : 'draw',
  }))
}
