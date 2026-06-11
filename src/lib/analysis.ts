import type { Team, Venue, Match } from '@/types/worldcup'
import { getH2H } from '@/lib/data'

// ==========================================
// Rich analysis engine for match predictions
// ==========================================

export interface AnalysisPoint {
  title: string
  detail: string
  advantage: 'home' | 'away' | 'neutral'
  icon: string
  score: number // 1-10 impact score
}

export interface MatchAnalysis {
  overview: string
  points: AnalysisPoint[]
  scorePrediction: { home: number; away: number }
  tacticalNote: string
  headToHeadNote: string
  upsetAlert: string | null
}

// ========== STAR PLAYERS ==========
const STARS: Record<string, string> = {
  arg: '梅西 (Messi)', bra: '维尼修斯 (Vinícius Jr.)', fra: '姆巴佩 (Mbappé)',
  eng: '贝林厄姆 (Bellingham)', esp: '亚马尔 (Yamal)', ger: '穆西亚拉 (Musiala)',
  por: 'C罗 (C. Ronaldo)', ned: '范戴克 (Van Dijk)', jpn: '三笘薫 (Mitoma)',
  kor: '孙兴慜 (Son Heung-min)', usa: '普利西奇 (Pulisic)', mex: 'S·希门尼斯 (Giménez)',
  uru: '巴尔韦德 (Valverde)', cro: '莫德里奇 (Modrić)', mar: '阿什拉夫 (Hakimi)',
  bel: '德布劳内 (De Bruyne)', sen: '马内 (Mané)', col: 'L·迪亚斯 (Luis Díaz)',
  egy: '萨拉赫 (Salah)', nor: '哈兰德 (Haaland)', can: 'A·戴维斯 (Davies)',
  sui: '扎卡 (Xhaka)', swe: '伊萨克 (Isak)', irn: '塔雷米 (Taremi)',
  aus: '苏塔 (Souttar)', ecu: '凯塞多 (Caicedo)', civ: '阿莱 (Haller)',
  gha: '库杜斯 (Kudus)', alg: '马赫雷斯 (Mahrez)', tur: '恰尔汗奥卢 (Çalhanoğlu)',
  cze: '绍切克 (Souček)', rsa: '塔乌 (Tau)', sco: '罗伯逊 (Robertson)',
  tun: '斯希里 (Skhiri)', pan: '卡拉斯基利亚 (Carrasquilla)',
  par: '阿尔米隆 (Almirón)', uzb: '肖穆罗多夫 (Shomurodov)',
  nzl: '伍德 (Wood)', bih: '哲科 (Džeko)', qat: '阿菲夫 (Afif)',
  cod: '巴坎布 (Bakambu)', aut: '阿拉巴 (Alaba)', ksa: '阿尔多萨里 (Al-Dawsari)',
  hai: '普利瓦尔 (Pierrot)', cuw: '巴库纳 (Bacuna)', jor: '塔马里 (Al-Taamari)',
  irq: '阿里 (Ali)', cpv: '门德斯 (Mendes)',
}
function star(id: string) { return STARS[id] || '核心球员' }

// ========== CONFEDERATION STRENGTH ==========
const CONF_STRENGTH: Record<string, number> = {
  UEFA: 85, CONMEBOL: 82, CAF: 62, AFC: 58, CONCACAF: 55, OFC: 30,
}
const CONF_NAMES: Record<string, string> = {
  UEFA: '欧洲', CONMEBOL: '南美', CAF: '非洲', AFC: '亚洲', CONCACAF: '中北美', OFC: '大洋洲',
}

// ========== HELPER: describe rank gap with richer language ==========
function describeRankGap(home: Team, away: Team): { text: string; advantage: 'home' | 'away' | 'neutral'; score: number } {
  const diff = home.fifaRank - away.fifaRank
  if (diff < -30) return { text: `${home.nameCn}（#${home.fifaRank}）排名远高于 ${away.nameCn}（#${away.fifaRank}），差距超过30位，纸面实力悬殊`, advantage: 'home', score: 9 }
  if (diff < -15) return { text: `${home.nameCn}（#${home.fifaRank}）排名明显高于 ${away.nameCn}（#${away.fifaRank}），领先${Math.abs(diff)}位`, advantage: 'home', score: 7 }
  if (diff < -5) return { text: `${home.nameCn}（#${home.fifaRank}）排名略高于 ${away.nameCn}（#${away.fifaRank}），领先${Math.abs(diff)}位`, advantage: 'home', score: 5 }
  if (diff > 30) return { text: `${away.nameCn}（#${away.fifaRank}）排名远高于 ${home.nameCn}（#${home.fifaRank}），差距超过30位`, advantage: 'away', score: 9 }
  if (diff > 15) return { text: `${away.nameCn}（#${away.fifaRank}）排名明显高于 ${home.nameCn}（#${home.fifaRank}），领先${diff}位`, advantage: 'away', score: 7 }
  if (diff > 5) return { text: `${away.nameCn}（#${away.fifaRank}）排名略高于 ${home.nameCn}（#${home.fifaRank}），领先${diff}位`, advantage: 'away', score: 5 }
  return { text: `两队 FIFA 排名接近（#${home.fifaRank} vs #${away.fifaRank}），仅差${Math.abs(diff)}位`, advantage: 'neutral', score: 1 }
}

// ========== 1. FIFA RANKING ANALYSIS ==========
function analyzeRanking(home: Team, away: Team): AnalysisPoint {
  const { text, advantage, score } = describeRankGap(home, away)
  const trend = home.fifaRank < 50 && away.fifaRank < 50
    ? '两队均为世界前50强队'
    : home.fifaRank > 70 || away.fifaRank > 70
    ? '排名较低的一方需超常发挥才有机会'
    : ''
  return { title: 'FIFA 排名', detail: text + (trend ? '。' + trend : ''), advantage, icon: '🏆', score }
}

// ========== 2. RECENT FORM ==========
function analyzeForm(home: Team, away: Team): AnalysisPoint {
  const sf = home.stats.recentForm, of = away.stats.recentForm
  const diff = sf - of
  let detail: string, advantage: 'home' | 'away' | 'neutral', score: number
  if (diff > 15) {
    detail = `${home.nameCn} 近期状态火热（${sf}），明显优于 ${away.nameCn}（${of}）。连胜势头将极大提升球队信心。`
    advantage = 'home'; score = 8
  } else if (diff > 5) {
    detail = `${home.nameCn} 近期状态（${sf}）优于 ${away.nameCn}（${of}），近几场比赛表现更稳定。`
    advantage = 'home'; score = 6
  } else if (diff < -15) {
    detail = `${away.nameCn} 近期状态火热（${of}），明显优于 ${home.nameCn}（${sf}）。`
    advantage = 'away'; score = 8
  } else if (diff < -5) {
    detail = `${away.nameCn} 近期状态（${of}）优于 ${home.nameCn}（${sf}）。`
    advantage = 'away'; score = 6
  } else {
    detail = `两队近期状态接近（${sf} vs ${of}），均保持了较好的竞技水平。`
    advantage = 'neutral'; score = 2
  }
  return { title: '近期状态', detail, advantage, icon: '📊', score }
}

// ========== 3. ATTACK vs DEFENSE MATCHUP ==========
function analyzeAttackDefense(home: Team, away: Team): AnalysisPoint {
  const ha = home.stats.attack, hd = home.stats.defense
  const aa = away.stats.attack, ad = away.stats.defense
  const homeEdge = ha - ad // home attack vs away defense
  const awayEdge = aa - hd // away attack vs home defense

  let detail = ''
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 3

  if (homeEdge > 10 && awayEdge < 0) {
    detail = `${home.nameCn} 的锋线（进攻${ha}）面对 ${away.nameCn} 防线（防守${ad}）有显著优势。${away.nameCn} 进攻难以突破 ${home.nameCn} 防守。`
    advantage = 'home'; score = 8
  } else if (awayEdge > 10 && homeEdge < 0) {
    detail = `${away.nameCn} 的锋线（进攻${aa}）面对 ${home.nameCn} 防线（防守${hd}）有显著优势。`
    advantage = 'away'; score = 8
  } else if (homeEdge > 5) {
    detail = `${home.nameCn} 进攻端（${ha}）略占上风，但 ${away.nameCn} 防守（${ad}）也具备一定抵抗力。`
    advantage = 'home'; score = 5
  } else if (awayEdge > 5) {
    detail = `${away.nameCn} 进攻端（${aa}）略占上风。`
    advantage = 'away'; score = 5
  } else {
    detail = `双方攻防实力接近。${home.nameCn} 攻${ha}/守${hd}，${away.nameCn} 攻${aa}/守${ad}。`
    advantage = 'neutral'; score = 2
  }
  return { title: '攻防对位', detail, advantage, icon: '⚔️', score }
}

// ========== 4. CONFEDERATION & STYLE ==========
function analyzeConfederation(home: Team, away: Team): AnalysisPoint {
  const hc = CONF_STRENGTH[home.confederation] || 50
  const ac = CONF_STRENGTH[away.confederation] || 50
  const hcn = CONF_NAMES[home.confederation] || home.confederation
  const acn = CONF_NAMES[away.confederation] || away.confederation

  let detail = `${home.nameCn}（${hcn}）vs ${away.nameCn}（${acn}）。`
  const diff = hc - ac
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 3

  if (diff > 15) {
    detail += `欧洲/南美球队通常在世界杯赛场对阵亚非球队时占据技术和战术优势。`
    advantage = 'home'; score = 6
  } else if (diff < -15) {
    detail += `欧洲/南美球队通常在世界杯赛场占据技术和战术优势。`
    advantage = 'away'; score = 6
  } else {
    detail += `同级别大洲球队交锋，风格差异可能成为变数。`
    advantage = 'neutral'; score = 2
  }
  return { title: '大洲对抗', detail, advantage, icon: '🌍', score }
}

// ========== 5. VENUE FACTORS ==========
function analyzeVenue(home: Team, away: Team, venue: Venue): AnalysisPoint {
  let detail = ''
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 2

  // Altitude
  if (venue.altitude > 2000) {
    detail += `🏔️ ${venue.name} 海拔 ${venue.altitude}m，高海拔将显著影响球员体能和球的飞行轨迹。`
    score += 3
  } else if (venue.altitude > 1000) {
    detail += `🏔️ ${venue.name} 海拔 ${venue.altitude}m，有一定高原影响。`
    score += 1
  }

  // CONCACAF advantage
  if (home.confederation === 'CONCACAF' && away.confederation !== 'CONCACAF') {
    detail += `🏠 ${home.nameCn} 作为中北美球队，对北美气候和场地更为适应。`
    advantage = 'home'; score += 2
  } else if (away.confederation === 'CONCACAF' && home.confederation !== 'CONCACAF') {
    detail += `🏠 ${away.nameCn} 作为中北美球队，对北美气候和场地更为适应。`
    advantage = 'away'; score += 2
  }

  // Travel distance / climate
  if (venue.climate.includes('Subtropical') || venue.climate.includes('Humid')) {
    detail += `💧 ${venue.climate} 气候可能对不适应湿热环境的球队造成额外消耗。`
    score += 1
  }

  // Attendance pressure
  if (venue.capacity > 70000) {
    detail += ` 现场${(venue.capacity/1000).toFixed(0)}k观众将营造巨大声浪。`
    score += 1
  }

  return { title: '场地因素', detail: detail || `${venue.name}，${venue.capacity.toLocaleString()}座，${venue.climate}`, advantage, icon: '🏟️', score }
}

// ========== 6. TOURNAMENT EXPERIENCE ==========
function analyzeExperience(home: Team, away: Team): AnalysisPoint {
  const he = home.stats.experience, ae = away.stats.experience
  let detail: string, advantage: 'home' | 'away' | 'neutral', score: number
  if (he > ae + 15) {
    detail = `${home.nameCn} 大赛经验丰富（${he}），多名球员经历过世界杯淘汰赛，关键时刻更冷静。${away.nameCn}（${ae}）相对缺乏大赛历练。`
    advantage = 'home'; score = 7
  } else if (ae > he + 15) {
    detail = `${away.nameCn} 大赛经验丰富（${ae}），${home.nameCn}（${he}）相对缺乏。`
    advantage = 'away'; score = 7
  } else if (he > ae + 5) {
    detail = `${home.nameCn}（${he}）略占经验优势。`
    advantage = 'home'; score = 4
  } else if (ae > he + 5) {
    detail = `${away.nameCn}（${ae}）略占经验优势。`
    advantage = 'away'; score = 4
  } else {
    detail = `两队大赛经验相当（${he} vs ${ae}）。`
    advantage = 'neutral'; score = 1
  }
  return { title: '大赛经验', detail, advantage, icon: '🎖️', score }
}

// ========== 7. HEAD-TO-HEAD HISTORY ==========
function analyzeH2H(home: Team, away: Team): AnalysisPoint {
  const h2h = getH2H(home.id, away.id)
  if (!h2h || h2h.matches.length === 0) {
    return { title: '历史交锋', detail: '两队近年来无正式比赛交手记录，遭遇战增加不确定性。', advantage: 'neutral', icon: '📜', score: 1 }
  }
  const recent = h2h.matches.slice(-5)
  let homeWins = 0, awayWins = 0, draws = 0
  for (const m of recent) {
    const isHomeTeam = m.homeTeamId === home.id
    const hScore = isHomeTeam ? m.homeScore : m.awayScore
    const aScore = isHomeTeam ? m.awayScore : m.homeScore
    if (hScore > aScore) homeWins++
    else if (aScore > hScore) awayWins++
    else draws++
  }
  const total = recent.length
  let detail: string, advantage: 'home' | 'away' | 'neutral', score: number
  if (homeWins >= 4) {
    detail = `${home.nameCn} 近${total}次交手中${homeWins}胜${draws}平${awayWins}负，历史战绩碾压式占优。`
    advantage = 'home'; score = 8
  } else if (awayWins >= 4) {
    detail = `${away.nameCn} 近${total}次交手中${awayWins}胜${draws}平${homeWins}负，历史战绩碾压式占优。`
    advantage = 'away'; score = 8
  } else if (homeWins > awayWins) {
    detail = `${home.nameCn} 近${total}次交手${homeWins}胜${draws}平${awayWins}负，心理上略占上风。`
    advantage = 'home'; score = 5
  } else if (awayWins > homeWins) {
    detail = `${away.nameCn} 近${total}次交手${awayWins}胜${draws}平${homeWins}负，心理上略占上风。`
    advantage = 'away'; score = 5
  } else {
    detail = `近${total}次交手${homeWins}胜${draws}平${awayWins}负，势均力敌。`
    advantage = 'neutral'; score = 2
  }
  return { title: '历史交锋', detail, advantage, icon: '📜', score }
}

// ========== 8. PLAYING STYLE / TACTICAL ==========
function analyzeStyle(home: Team, away: Team): AnalysisPoint {
  const s = home.stats, o = away.stats
  const homeStyle = s.attack > s.defense + 10 ? '进攻型' : s.defense > s.attack + 10 ? '防守反击型' : '均衡型'
  const awayStyle = o.attack > o.defense + 10 ? '进攻型' : o.defense > o.attack + 10 ? '防守反击型' : '均衡型'

  let detail = `${home.nameCn} 偏向${homeStyle}（进攻${s.attack}/防守${s.defense}），${away.nameCn} 偏向${awayStyle}（进攻${o.attack}/防守${o.defense}）。`
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 3

  // High possession = control style
  if (s.possession > o.possession + 15) {
    detail += `${home.nameCn} 控球能力明显占优（${s.possession} vs ${o.possession}），预计将主导比赛节奏。`
    advantage = 'home'; score = 6
  } else if (o.possession > s.possession + 15) {
    detail += `${away.nameCn} 控球能力明显占优（${o.possession} vs ${s.possession}），预计将主导比赛节奏。`
    advantage = 'away'; score = 6
  }
  // Attack vs defense style clash
  if (homeStyle === '进攻型' && awayStyle === '防守反击型') {
    detail += ` 典型的矛与盾对决。`
    score += 1
  }

  return { title: '战术风格', detail, advantage, icon: '🎯', score }
}

// ========== 9. KEY PLAYERS / STAR POWER ==========
function analyzeKeyPlayers(home: Team, away: Team): AnalysisPoint {
  const hs = home.stats, os = away.stats
  const homeStar = star(home.id)
  const awayStar = star(away.id)

  // Star power: attack + experience rank gives "big game player" score
  const homeStarPower = hs.attack + hs.experience
  const awayStarPower = os.attack + os.experience

  let detail = `${home.nameCn} 核心: ${homeStar} | ${away.nameCn} 核心: ${awayStar}。`
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 3

  if (homeStarPower > awayStarPower + 20) {
    detail += `${home.nameCn} 球星个人能力更突出，关键时刻可能决定比赛。`
    advantage = 'home'; score = 7
  } else if (awayStarPower > homeStarPower + 20) {
    detail += `${away.nameCn} 球星个人能力更突出。`
    advantage = 'away'; score = 7
  } else {
    detail += `双方核心球员能力接近，球星对决将是比赛看点。`
    score = 4
  }
  return { title: '核心球员', detail, advantage, icon: '⭐', score }
}

// ========== 10. WORLD CUP PEDIGREE ==========
function analyzePedigree(home: Team, away: Team): AnalysisPoint {
  const champions = new Set(['arg','bra','fra','eng','esp','ger','uru','ita'])
  const hChamp = champions.has(home.id)
  const aChamp = champions.has(away.id)

  let detail = ''
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 2

  if (hChamp && !aChamp) {
    detail = `${home.nameCn} 拥有世界杯冠军底蕴，大赛基因是无形优势。${away.nameCn} 尚未染指过世界杯。`
    advantage = 'home'; score = 5
  } else if (aChamp && !hChamp) {
    detail = `${away.nameCn} 拥有世界杯冠军底蕴。${home.nameCn} 尚未染指过世界杯。`
    advantage = 'away'; score = 5
  } else if (hChamp && aChamp) {
    detail = `两队都拥有世界杯冠军血统，冠军底蕴相当。`
    score = 3
  } else {
    detail = `两队都渴望在世界杯舞台证明自己，对胜利的渴望同样强烈。`
    score = 1
  }
  return { title: '世界杯底蕴', detail, advantage, icon: '👑', score }
}

// ========== 11. FITNESS / PHYSICAL ==========
function analyzeFitness(home: Team, away: Team): AnalysisPoint {
  const hf = home.stats.fitness, af = away.stats.fitness
  let detail: string, advantage: 'home' | 'away' | 'neutral', score: number
  if (hf > af + 10) {
    detail = `${home.nameCn} 体能储备（${hf}）优于 ${away.nameCn}（${af}），比赛末段可能占据体能优势，尤其在高强度对抗中。`
    advantage = 'home'; score = 6
  } else if (af > hf + 10) {
    detail = `${away.nameCn} 体能储备（${af}）优于 ${home.nameCn}（${hf}）。`
    advantage = 'away'; score = 6
  } else {
    detail = `两队体能水平接近（${hf} vs ${af}）。`
    advantage = 'neutral'; score = 1
  }
  return { title: '体能储备', detail, advantage, icon: '💪', score }
}

// ========== 12. UPSET POTENTIAL ==========
function analyzeUpset(home: Team, away: Team, points: AnalysisPoint[]): string | null {
  const homeScore = points.filter(p => p.advantage === 'home').reduce((s, p) => s + p.score, 0)
  const awayScore = points.filter(p => p.advantage === 'away').reduce((s, p) => s + p.score, 0)
  const rankGap = Math.abs(home.fifaRank - away.fifaRank)

  if (rankGap > 25 && ((home.fifaRank < away.fifaRank && awayScore > homeScore * 0.6) || (away.fifaRank < home.fifaRank && homeScore > awayScore * 0.6))) {
    const underdog = home.fifaRank > away.fifaRank ? home.nameCn : away.nameCn
    return `⚠️ 警惕冷门！${underdog} 虽排名落后，但在多项分析指标上并不逊色，具备爆冷条件。`
  }
  if (rankGap > 40) {
    const strong = home.fifaRank < away.fifaRank ? home.nameCn : away.nameCn
    return `${strong} 纸面实力明显占优，但世界杯赛场上从不缺少以弱胜强的故事。`
  }
  return null
}

// ========== SCORE PREDICTION ==========
function predictScore(home: Team, away: Team, venue: Venue, h2hNote: string): { home: number; away: number } {
  const s = home.stats, o = away.stats
  let hg = 1.1 + (s.attack - o.defense) * 0.012 + s.recentForm * 0.005
  let ag = 0.9 + (o.attack - s.defense) * 0.012 + o.recentForm * 0.005

  if (home.confederation === 'CONCACAF') hg += 0.2
  if (away.confederation === 'CONCACAF') ag += 0.2
  if (venue.altitude > 2000) { hg += 0.15; ag += 0.15 }
  if (h2hNote.includes('碾压')) { hg += 0.3; ag -= 0.1 }

  return {
    home: Math.max(0, Math.round(hg * 10) / 10),
    away: Math.max(0, Math.round(ag * 10) / 10),
  }
}

// ========== MAIN ANALYZE FUNCTION ==========
export function analyzeMatch(home: Team, away: Team, venue: Venue): MatchAnalysis {
  const points: AnalysisPoint[] = [
    analyzeRanking(home, away),
    analyzeForm(home, away),
    analyzeAttackDefense(home, away),
    analyzeConfederation(home, away),
    analyzeVenue(home, away, venue),
    analyzeExperience(home, away),
    analyzeH2H(home, away),
    analyzeStyle(home, away),
    analyzeKeyPlayers(home, away),
    analyzePedigree(home, away),
    analyzeFitness(home, away),
  ]

  const totalHome = points.filter(p => p.advantage === 'home').reduce((s, p) => s + p.score, 0)
  const totalAway = points.filter(p => p.advantage === 'away').reduce((s, p) => s + p.score, 0)

  let overview: string
  if (totalHome > totalAway + 15) {
    overview = `${home.nameCn} 在多项关键指标上占据明显优势，取胜概率较高。${away.nameCn} 需在防守端做到极致并抓住有限的反击机会，才有可能制造冷门。`
  } else if (totalAway > totalHome + 15) {
    overview = `${away.nameCn} 在多项关键指标上占据明显优势，取胜概率较高。${home.nameCn} 需依靠主场优势和顽强斗志争取积分。`
  } else if (totalHome > totalAway + 5) {
    overview = `${home.nameCn} 综合实力略占上风，但优势并不稳固。${away.nameCn} 完全有能力在比赛中拿分，预计将是一场胶着的较量。`
  } else if (totalAway > totalHome + 5) {
    overview = `${away.nameCn} 综合实力略占上风。${home.nameCn} 完全有能力在比赛中拿分。`
  } else {
    overview = `两队实力旗鼓相当，多项指标难分高下。这场比赛的结果很可能由临场发挥、定位球或个别球星的灵光一现决定。`
  }

  const h2hNote = points.find(p => p.title === '历史交锋')!.detail
  const upsetAlert = analyzeUpset(home, away, points)

  const overallAdv = totalHome > totalAway ? 'home' : totalAway > totalHome ? 'away' : 'neutral'

  return {
    overview,
    points,
    scorePrediction: predictScore(home, away, venue, h2hNote),
    tacticalNote: overallAdv === 'home'
      ? `${home.nameCn} 应利用优势控制比赛节奏，尽早进球将迫使 ${away.nameCn} 压上进攻，暴露更多防守空档。`
      : overallAdv === 'away'
      ? `${away.nameCn} 应利用优势控制比赛节奏。${home.nameCn} 需稳守反击，耐心等待机会。`
      : `双方势均力敌，中场的控制权将成为胜负手。定位球和替补球员的发挥可能改变战局。`,
    headToHeadNote: h2hNote,
    upsetAlert,
  }
}
