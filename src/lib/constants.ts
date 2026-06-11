export const STAGE_LABELS = {
  group: '小组赛',
  round32: '1/16 决赛',
  round16: '1/8 决赛',
  quarter: '1/4 决赛',
  semi: '半决赛',
  third: '季军赛',
  final: '决赛',
} as const

export const STAT_LABELS: Record<string, string> = {
  attack: '进攻',
  defense: '防守',
  possession: '控球',
  fitness: '体能',
  experience: '经验',
  recentForm: '近期状态',
}

export const CONFEDERATION_COLORS: Record<string, string> = {
  AFC: '#00d4ff',
  CAF: '#22c55e',
  CONCACAF: '#ff6b35',
  CONMEBOL: '#7c3aed',
  OFC: '#eab308',
  UEFA: '#3b82f6',
}
