import type { TeamStats, MatchStage } from '@/types/worldcup'

// ── Stage labels (Chinese) ────────────────────────────────────────────────────

export const STAGE_LABELS: Record<MatchStage, string> = {
  group: '小组赛',
  round32: '1/16 决赛',
  round16: '1/8 决赛',
  quarter: '1/4 决赛',
  semi: '半决赛',
  third: '季军赛',
  final: '决赛',
}

// ── Stat dimension labels ─────────────────────────────────────────────────────

export const STAT_LABELS: Record<keyof TeamStats, string> = {
  attack: '进攻',
  defense: '防守',
  possession: '控球',
  fitness: '体能',
  experience: '经验',
  recentForm: '近期状态',
}

// ── Confederation colors ──────────────────────────────────────────────────────

export const CONFEDERATION_COLORS: Record<string, string> = {
  AFC: '#00d4ff',
  CAF: '#22c55e',
  CONCACAF: '#ff6b35',
  CONMEBOL: '#7c3aed',
  OFC: '#eab308',
  UEFA: '#3b82f6',
}

export const CONFEDERATION_LABELS: Record<string, string> = {
  AFC: '亚洲足联',
  CAF: '非洲足联',
  CONCACAF: '中北美及加勒比足联',
  CONMEBOL: '南美足联',
  OFC: '大洋洲足联',
  UEFA: '欧洲足联',
}

// ── Match status labels ───────────────────────────────────────────────────────

export const MATCH_STATUS_LABELS: Record<string, string> = {
  scheduled: '未开赛',
  live: '进行中',
  finished: '已结束',
}

export const MATCH_STATUS_COLORS: Record<string, string> = {
  scheduled: '#64748b',
  live: '#ef4444',
  finished: '#22c55e',
}

// ── Prediction UI ──────────────────────────────────────────────────────────────

/** Probability brackets for coloring win chances. */
export const PROBABILITY_COLORS = {
  low: '#f97316',      // < 33 %
  medium: '#eab308',   // 33-60 %
  high: '#22c55e',     // 60-80 %
  dominant: '#00d4ff', // > 80 %
} as const

export function getProbabilityColor(pct: number): string {
  if (pct > 0.8) return PROBABILITY_COLORS.dominant
  if (pct > 0.6) return PROBABILITY_COLORS.high
  if (pct >= 0.33) return PROBABILITY_COLORS.medium
  return PROBABILITY_COLORS.low
}

// ── Ranking tiers ─────────────────────────────────────────────────────────────

/**
 * Categorize a FIFA ranking into a display tier.
 * Lower rank number = stronger team.
 */
export function getRankTier(rank: number): { label: string; color: string } {
  if (rank <= 5) return { label: 'S', color: '#00d4ff' }
  if (rank <= 15) return { label: 'A', color: '#22c55e' }
  if (rank <= 30) return { label: 'B', color: '#eab308' }
  if (rank <= 50) return { label: 'C', color: '#f97316' }
  return { label: 'D', color: '#ef4444' }
}

// ── Stage ordering ────────────────────────────────────────────────────────────

/**
 * Ordered list of knockout stages (ascending depth).
 */
export const KNOCKOUT_STAGES: MatchStage[] = [
  'round32',
  'round16',
  'quarter',
  'semi',
  'third',
  'final',
]

/**
 * Number of teams remaining at each knockout stage.
 */
export const KNOCKOUT_TEAM_COUNT: Record<string, number> = {
  round32: 32,
  round16: 16,
  quarter: 8,
  semi: 4,
  third: 2,
  final: 2,
}
