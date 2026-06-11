import type { Team, Venue, Match } from '@/types/worldcup'

// ==========================================
// Detailed analysis reasons for predictions
// ==========================================

export interface AnalysisPoint {
  title: string
  detail: string
  advantage: 'home' | 'away' | 'neutral'
  icon: string
}

export interface MatchAnalysis {
  overview: string
  points: AnalysisPoint[]
  keyPlayer: { home: string; away: string }
  tacticalNote: string
  scorePrediction: { home: number; away: number }
}

// Real player star names for key teams
const STARS: Record<string, string> = {
  arg: '梅西 (Messi)',
  bra: '维尼修斯 (Vinícius Jr.)',
  fra: '姆巴佩 (Mbappé)',
  eng: '贝林厄姆 (Bellingham)',
  esp: '亚马尔 (Yamal)',
  ger: '穆西亚拉 (Musiala)',
  por: 'B费 (Bruno Fernandes)',
  ned: '范戴克 (Van Dijk)',
  ita: '巴雷拉 (Barella)',
  jpn: '三笘薫 (Mitoma)',
  kor: '孙兴慜 (Son)',
  usa: '普利西奇 (Pulisic)',
  mex: '阿尔瓦雷斯 (Álvarez)',
  uru: '巴尔韦德 (Valverde)',
  cro: '莫德里奇 (Modrić)',
  mar: '阿什拉夫 (Hakimi)',
  bel: '德布劳内 (De Bruyne)',
  sen: '马内 (Mané)',
  col: '路易斯·迪亚斯 (Luis Díaz)',
  egy: '萨拉赫 (Salah)',
  nor: '哈兰德 (Haaland)',
  can: '阿方索·戴维斯 (Davies)',
  sui: '扎卡 (Xhaka)',
  tun: '斯希里 (Skhiri)',
  swe: '伊萨克 (Isak)',
  irn: '塔雷米 (Taremi)',
  aus: '苏塔 (Souttar)',
  ecu: '凯塞多 (Caicedo)',
  qat: '阿菲夫 (Afif)',
  civ: '阿莱 (Haller)',
  gha: '库杜斯 (Kudus)',
  alg: '马赫雷斯 (Mahrez)',
  aut: '阿拉巴 (Alaba)',
  cze: '绍切克 (Souček)',
  rsa: '塔乌 (Tau)',
  sco: '罗伯逊 (Robertson)',
  tur: '恰尔汗奥卢 (Çalhanoğlu)',
  nzl: '伍德 (Wood)',
  cpv: '门德斯 (Mendes)',
  ksa: '阿尔多萨里 (Al-Dawsari)',
  pan: '卡拉斯基利亚 (Carrasquilla)',
  par: '阿尔米隆 (Almirón)',
  uzb: '肖穆罗多夫 (Shomurodov)',
  cod: '巴坎布 (Bakambu)',
  hai: '普利瓦尔 (Pierrot)',
  cuw: '巴库纳 (Bacuna)',
  jor: '塔马里 (Al-Taamari)',
  irq: '阿里 (Ali)',
  bih: '哲科 (Džeko)',
}

function getStar(teamId: string): string {
  return STARS[teamId] || '核心球员'
}

function describeRank(home: Team, away: Team): string {
  const diff = home.fifaRank - away.fifaRank
  if (diff < -20) return `${home.nameCn} 排名远高于 ${away.nameCn}（领先 ${Math.abs(diff)} 位），纸面实力明显占优`
  if (diff < -5) return `${home.nameCn} 排名高于 ${away.nameCn}（领先 ${Math.abs(diff)} 位），整体实力更胜一筹`
  if (diff > 20) return `${away.nameCn} 排名远高于 ${home.nameCn}（领先 ${diff} 位），纸面实力明显占优`
  if (diff > 5) return `${away.nameCn} 排名高于 ${home.nameCn}（领先 ${diff} 位），整体实力更胜一筹`
  return `两队 FIFA 排名接近（相差 ${Math.abs(diff)} 位），实力在伯仲之间`
}

function describeStats(home: Team, away: Team): string[] {
  const lines: string[] = []
  const s = home.stats, o = away.stats
  if (s.attack > o.attack + 10) lines.push(`${home.nameCn} 进攻火力更强（进攻 ${s.attack} vs ${o.attack}）`)
  if (o.attack > s.attack + 10) lines.push(`${away.nameCn} 进攻火力更强（进攻 ${o.attack} vs ${s.attack}）`)
  if (s.defense > o.defense + 10) lines.push(`${home.nameCn} 防守更稳固（防守 ${s.defense} vs ${o.defense}）`)
  if (o.defense > s.defense + 10) lines.push(`${away.nameCn} 防守更稳固（防守 ${o.defense} vs ${s.defense}）`)
  if (s.recentForm > o.recentForm + 10) lines.push(`${home.nameCn} 近期状态更好（状态 ${s.recentForm} vs ${o.recentForm}）`)
  if (o.recentForm > s.recentForm + 10) lines.push(`${away.nameCn} 近期状态更好（状态 ${o.recentForm} vs ${s.recentForm}）`)
  if (s.experience > o.experience + 10) lines.push(`${home.nameCn} 大赛经验更丰富（经验 ${s.experience} vs ${o.experience}）`)
  if (o.experience > s.experience + 10) lines.push(`${away.nameCn} 大赛经验更丰富（经验 ${o.experience} vs ${s.experience}）`)
  return lines
}

function describeVenue(home: Team, away: Team, venue: Venue): string[] {
  const lines: string[] = []
  if (venue.altitude > 2000) {
    lines.push(`🏔️ ${venue.name} 海拔 ${venue.altitude}m，高海拔对非 CONCACAF 球队体能是考验`)
  } else if (venue.altitude > 1000) {
    lines.push(`🏔️ ${venue.name} 海拔 ${venue.altitude}m，有一定高原影响`)
  }
  if (home.confederation === 'CONCACAF' && away.confederation !== 'CONCACAF') {
    lines.push(`🏠 ${home.nameCn} 作为 CONCACAF 球队，对北美场地更为适应`)
  }
  if (away.confederation === 'CONCACAF' && home.confederation !== 'CONCACAF') {
    lines.push(`🏠 ${away.nameCn} 作为 CONCACAF 球队，对北美场地更为适应`)
  }
  lines.push(`🏟️ ${venue.name} 可容纳 ${venue.capacity.toLocaleString()} 人，${venue.climate} 气候`)
  return lines
}

function predictScore(home: Team, away: Team, venue: Venue): { home: number; away: number } {
  const s1 = home.stats.attack - away.stats.defense
  const s2 = away.stats.attack - home.stats.defense
  // Base expected goals
  let hg = 1.2 + s1 * 0.015
  let ag = 1.0 + s2 * 0.015

  // Home continent boost
  if (home.confederation === 'CONCACAF') hg += 0.2
  if (away.confederation === 'CONCACAF') ag += 0.2

  // Altitude factor
  if (venue.altitude > 2000) { hg += 0.1; ag += 0.1 }

  return {
    home: Math.max(0, Math.round(hg * 10) / 10),
    away: Math.max(0, Math.round(ag * 10) / 10),
  }
}

export function analyzeMatch(home: Team, away: Team, venue: Venue): MatchAnalysis {
  const statLines = describeStats(home, away)
  const venueLines = describeVenue(home, away, venue)
  const rankDesc = describeRank(home, away)

  const s = home.stats, o = away.stats
  const homeStrength = (s.attack + s.defense + s.experience + s.recentForm) / 4
  const awayStrength = (o.attack + o.defense + o.experience + o.recentForm) / 4

  const points: AnalysisPoint[] = [
    {
      title: 'FIFA 排名分析',
      detail: rankDesc,
      advantage: home.fifaRank < away.fifaRank ? 'home' : away.fifaRank < home.fifaRank ? 'away' : 'neutral',
      icon: '🏆',
    },
    {
      title: '近期状态对比',
      detail: `${home.nameCn} 近期状态评分 ${s.recentForm}，${away.nameCn} ${o.recentForm}。` +
        (s.recentForm > o.recentForm ? `${home.nameCn} 状态更佳` : o.recentForm > s.recentForm ? `${away.nameCn} 状态更佳` : '两队状态相当'),
      advantage: s.recentForm > o.recentForm ? 'home' : o.recentForm > s.recentForm ? 'away' : 'neutral',
      icon: '📊',
    },
    {
      title: '攻防数据',
      detail: statLines.length > 0 ? statLines[0] : '两队攻防数据接近，难分伯仲',
      advantage: homeStrength > awayStrength + 5 ? 'home' : awayStrength > homeStrength + 5 ? 'away' : 'neutral',
      icon: '⚔️',
    },
    {
      title: '场地因素',
      detail: venueLines[venueLines.length - 1],
      advantage: home.confederation === 'CONCACAF' && away.confederation !== 'CONCACAF' ? 'home'
        : away.confederation === 'CONCACAF' && home.confederation !== 'CONCACAF' ? 'away' : 'neutral',
      icon: '🏟️',
    },
    {
      title: '核心球员',
      detail: `${getStar(home.id)} vs ${getStar(away.id)} — 关键球员的发挥将直接影响比赛走势`,
      advantage: 'neutral',
      icon: '⭐',
    },
  ]

  const overall = homeStrength > awayStrength + 5 ? 'home'
    : awayStrength > homeStrength + 5 ? 'away' : 'neutral'

  const overview = overall === 'home'
    ? `${home.nameCn} 在综合实力、FIFA 排名和近期状态上略占上风，加之场地适应优势，取胜概率较高。但 ${away.nameCn} ${away.stats.defense > 60 ? '防守稳固，' : ''}不可轻视。`
    : overall === 'away'
    ? `${away.nameCn} 在综合实力、FIFA 排名和近期状态上略占上风，取胜概率较高。${home.nameCn} 需依靠 ${home.stats.defense > 60 ? '防守反击' : '全力进攻'} 争取机会。`
    : `两队实力接近，任何结果都有可能。${home.nameCn} 和 ${away.nameCn} 各有优势，这场比赛将非常胶着。`

  return {
    overview,
    points,
    keyPlayer: { home: getStar(home.id), away: getStar(away.id) },
    tacticalNote: overall === 'home'
      ? `${home.nameCn} 应利用 ${home.stats.attack > home.stats.defense ? '进攻优势' : '稳固防守'} 掌控节奏，${away.nameCn} 需抓住反击机会`
      : overall === 'away'
      ? `${away.nameCn} 应利用 ${away.stats.attack > away.stats.defense ? '进攻优势' : '稳固防守'} 掌控节奏，${home.nameCn} 需抓住反击机会`
      : `双方势均力敌，中场的争夺将成为比赛关键`,
    scorePrediction: predictScore(home, away, venue),
  }
}
