import type { Team } from '@/types/worldcup'
import { getAllTeams } from './data'

export function getTopTeamsByStat(stat: keyof Team['stats'], limit: number = 5): Team[] {
  return getAllTeams()
    .sort((a, b) => b.stats[stat] - a.stats[stat])
    .slice(0, limit)
}

export function getTeamStrengthColor(value: number): string {
  if (value >= 80) return '#00d4ff'
  if (value >= 60) return '#22c55e'
  if (value >= 40) return '#eab308'
  if (value >= 20) return '#f97316'
  return '#ef4444'
}
