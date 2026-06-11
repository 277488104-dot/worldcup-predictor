import type { Team, Venue } from '@/types/worldcup'
import { getH2H } from '@/lib/data'

// ==========================================
// Rich analysis engine for match predictions
// ==========================================

export interface AnalysisPoint {
  title: string
  detail: string
  advantage: 'home' | 'away' | 'neutral'
  icon: string
  score: number
}

export interface MatchAnalysis {
  overview: string
  points: AnalysisPoint[]
  scorePrediction: { home: number; away: number }
  scoreReasoning: string
  conclusion: string
  tacticalNote: string
  upsetAlert: string | null
  predictedScoreline: string
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

// ========== HELPER ==========
function describeRankGap(home: Team, away: Team): { detail: string; advantage: 'home' | 'away' | 'neutral'; score: number } {
  const diff = home.fifaRank - away.fifaRank
  if (diff < -30) return { detail: `${home.nameCn}（FIFA #${home.fifaRank}）排名远高于 ${away.nameCn}（FIFA #${away.fifaRank}），差距超过 30 位，纸面实力悬殊巨大，${home.nameCn} 在个人能力和战术体系上均占据明显优势。`, advantage: 'home', score: 9 }
  if (diff < -15) return { detail: `${home.nameCn}（FIFA #${home.fifaRank}）的世界排名明显高于 ${away.nameCn}（FIFA #${away.fifaRank}），领先 ${Math.abs(diff)} 个位次。这反映出两队在大赛成绩、球员质量和整体实力上的差距是真实存在的。`, advantage: 'home', score: 7 }
  if (diff < -5) return { detail: `${home.nameCn}（FIFA #${home.fifaRank}）的排名略高于 ${away.nameCn}（FIFA #${away.fifaRank}），领先 ${Math.abs(diff)} 位。排名差距虽然不大，但 ${home.nameCn} 近年来面对同级别对手时展现出的稳定性略胜一筹。`, advantage: 'home', score: 5 }
  if (diff > 30) return { detail: `${away.nameCn}（FIFA #${away.fifaRank}）排名远高于 ${home.nameCn}（FIFA #${home.fifaRank}），差距超过 30 位，纸面实力悬殊巨大。`, advantage: 'away', score: 9 }
  if (diff > 15) return { detail: `${away.nameCn}（FIFA #${away.fifaRank}）的世界排名明显高于 ${home.nameCn}（FIFA #${home.fifaRank}），领先 ${diff} 个位次。这反映出两队在大赛成绩、球员质量和整体实力上的差距是真实存在的。`, advantage: 'away', score: 7 }
  if (diff > 5) return { detail: `${away.nameCn}（FIFA #${away.fifaRank}）的排名略高于 ${home.nameCn}（FIFA #${home.fifaRank}），领先 ${diff} 位。排名差距虽然不大，但 ${away.nameCn} 近年来面对同级别对手时展现出的稳定性略胜一筹。`, advantage: 'away', score: 5 }
  return { detail: `两队 FIFA 排名非常接近（#${home.fifaRank} vs #${away.fifaRank}），仅相差 ${Math.abs(diff)} 位，从排名角度看双方处于同一实力层级。`, advantage: 'neutral', score: 1 }
}

// ========== 1. FIFA RANKING ==========
function analyzeRanking(home: Team, away: Team): AnalysisPoint {
  const { detail, advantage, score } = describeRankGap(home, away)
  const rankGap = Math.abs(home.fifaRank - away.fifaRank)
  let trend = ''
  if (rankGap > 20) {
    trend = `从历史数据来看，FIFA 排名差距超过 20 位的比赛中，排名更高的一方胜率约为 65%-70%。`
  } else if (rankGap > 10) {
    trend = `FIFA 排名差距在 10-20 位之间的比赛，强队胜率约为 55%-60%，冷门并不罕见。`
  } else {
    trend = `排名接近的比赛往往取决于临场发挥和细节处理。`
  }
  return { title: 'FIFA 排名分析', detail: detail + ' ' + trend, advantage, icon: '🏆', score }
}

// ========== 2. RECENT FORM ==========
function analyzeForm(home: Team, away: Team): AnalysisPoint {
  const sf = home.stats.recentForm, of = away.stats.recentForm
  const diff = sf - of
  let detail: string, advantage: 'home' | 'away' | 'neutral', score: number
  if (diff > 15) {
    detail = `${home.nameCn} 近期状态极为火热（评分 ${sf}，本项满分 100），远超 ${away.nameCn}（${of}）。${home.nameCn} 在最近几场比赛中攻防两端表现俱佳，球队士气高涨，球员间配合默契度达到高峰。反观 ${away.nameCn}，近期状态起伏不定，防守端暴露出不少问题，这在本场比赛中可能被对手重点针对。`
    advantage = 'home'; score = 8
  } else if (diff > 5) {
    detail = `${home.nameCn} 近期状态（${sf}）明显优于 ${away.nameCn}（${of}）。${home.nameCn} 最近比赛展现出更强的整体性和稳定性，球队正处在上升通道中。${away.nameCn} 需要尽快调整状态以应对这场硬仗。`
    advantage = 'home'; score = 6
  } else if (diff < -15) {
    detail = `${away.nameCn} 近期状态极为火热（${of}），远超 ${home.nameCn}（${sf}）。${away.nameCn} 在最近几场比赛中攻防两端表现俱佳，球队士气高涨。反观 ${home.nameCn}，近期状态起伏不定。`
    advantage = 'away'; score = 8
  } else if (diff < -5) {
    detail = `${away.nameCn} 近期状态（${of}）明显优于 ${home.nameCn}（${sf}），${away.nameCn} 最近比赛展现出更强的整体性和稳定性。`
    advantage = 'away'; score = 6
  } else {
    detail = `两队近期状态旗鼓相当（${home.nameCn} ${sf} vs ${away.nameCn} ${of}），都保持了较好的竞技水平和比赛节奏。这意味着比赛的胜负将更多取决于其他维度——比如球星个人能力、战术针对性和临门一脚的效率。`
    advantage = 'neutral'; score = 2
  }
  return { title: '近期状态', detail, advantage, icon: '📊', score }
}

// ========== 3. ATTACK vs DEFENSE MATCHUP ==========
function analyzeAttackDefense(home: Team, away: Team): AnalysisPoint {
  const ha = home.stats.attack, hd = home.stats.defense
  const aa = away.stats.attack, ad = away.stats.defense
  const homeEdge = ha - ad
  const awayEdge = aa - hd

  let detail = `从数据层面看，${home.nameCn} 进攻端评分 ${ha}、防守端 ${hd}；${away.nameCn} 进攻端 ${aa}、防守端 ${ad}。`

  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 3

  if (homeEdge > 10 && awayEdge < 0) {
    detail += `${home.nameCn} 的锋线在面对 ${away.nameCn} 防线时拥有显著优势（进攻评分领先 ${homeEdge} 分），同时 ${away.nameCn} 的攻击线难以对 ${home.nameCn} 的稳固防线构成实质威胁（防守评分领先 ${Math.abs(awayEdge)} 分）。这种攻防双优的局面意味着 ${home.nameCn} 可以更从容地掌控比赛节奏，通过持续施压寻找破门机会，而不用担心防线被打穿。`
    advantage = 'home'; score = 8
  } else if (awayEdge > 10 && homeEdge < 0) {
    detail += `${away.nameCn} 的锋线在面对 ${home.nameCn} 防线时拥有显著优势，同时 ${home.nameCn} 的攻击线难以对 ${away.nameCn} 的稳固防线构成实质威胁。`
    advantage = 'away'; score = 8
  } else if (homeEdge > 5) {
    detail += `总体来看 ${home.nameCn} 在攻防两端略占上风，尤其是在进攻端具备制造威胁的能力。不过 ${away.nameCn} 的防线并非不堪一击，他们有能力在大部分时间里维持防守阵型。`
    advantage = 'home'; score = 5
  } else if (awayEdge > 5) {
    detail += `总体来看 ${away.nameCn} 在攻防两端略占上风，尤其是在进攻端具备制造威胁的能力。`
    advantage = 'away'; score = 5
  } else {
    detail += `双方在攻防两端的实力非常接近，谁能在比赛中率先破门将占据极大的心理优势。预计比赛将非常胶着，定位球或个别球员的灵光一现很可能决定最终的胜负。`
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

  const diff = hc - ac
  let detail = `${home.nameCn} 来自${hcn}足联，${away.nameCn} 来自${acn}足联。`
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 3

  if (Math.abs(diff) > 15) {
    const stronger = diff > 0 ? home.nameCn : away.nameCn
    const weaker = diff > 0 ? away.nameCn : home.nameCn
    detail += `${stronger} 所在的大洲整体足球水平更高，这意味着他们在预选赛阶段经历了更高强度的对抗，球员在高压环境下的处理球能力更为成熟。${weaker} 虽然在自身大洲内表现出色，但面对来自更高水平大洲的对手时，往往需要一段适应期。在世界杯历史上，跨大洲对抗中传统强洲球队的胜率明显更高。`
    advantage = diff > 0 ? 'home' : 'away'; score = 6
  } else {
    detail += `两队来自同一水平层级的大洲，在洲际比赛中积累的经验和对抗强度较为接近，这一因素在本场比赛中影响有限。`
    score = 2
  }
  return { title: '大洲对抗', detail, advantage, icon: '🌍', score }
}

// ========== 5. VENUE FACTORS ==========
function analyzeVenue(home: Team, away: Team, venue: Venue): AnalysisPoint {
  let detail = ''
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 2
  const factors: string[] = []

  if (venue.altitude > 2000) {
    factors.push(`海拔高达 ${venue.altitude} 米的 ${venue.name} 是本场比赛的关键变量。高海拔环境下空气稀薄，足球飞行轨迹与低海拔有明显差异，同时球员的体能消耗将大幅增加。对于那些不习惯高原作战的球队来说，这往往意味着比赛后 20 分钟的跑动能力会出现明显下滑。`)
    score += 3
  } else if (venue.altitude > 1000) {
    factors.push(`${venue.name} 海拔 ${venue.altitude} 米，处于中等海拔，对球员体能有一定影响但并不极端。`)
    score += 1
  }

  if (home.confederation === 'CONCACAF' && away.confederation !== 'CONCACAF') {
    factors.push(`${home.nameCn} 作为中北美及加勒比地区的球队，对北美大陆的气候条件、场地类型和旅行节奏更为熟悉。这种"准主场"优势在世界杯历史上多次被验证——2014 年巴西世界杯南美球队的集体强势就是最好的例子。`)
    advantage = 'home'; score += 2
  } else if (away.confederation === 'CONCACAF' && home.confederation !== 'CONCACAF') {
    factors.push(`${away.nameCn} 作为中北美及加勒比地区的球队，对北美大陆的气候条件、场地类型和旅行节奏更为熟悉，拥有"准主场"优势。`)
    advantage = 'away'; score += 2
  } else if (home.confederation !== 'CONCACAF' && away.confederation !== 'CONCACAF') {
    factors.push(`两队均非北美球队，需要共同适应 ${venue.city} 的场地条件和气候环境，这一因素对双方影响均等。`)
  }

  if (venue.climate.includes('Subtropical') || venue.climate.includes('Humid')) {
    factors.push(`${venue.climate} 气候条件下，高湿度会加速球员体液流失和体能消耗。对于习惯干燥或温带气候的球队，这种环境需要额外的适应。`)
    score += 1
  }

  if (venue.capacity > 70000) {
    factors.push(`超过 ${(venue.capacity/1000).toFixed(0)}k 名观众的现场助威将营造出震撼的氛围，这种大赛气氛对球员的心理素质是不小的考验。`)
    score += 1
  }

  detail = factors.join(' ')
  if (!detail) detail = `${venue.name}（${venue.capacity.toLocaleString()} 座，${venue.climate}）——场地条件对双方影响均等。`
  return { title: '场地因素', detail, advantage, icon: '🏟️', score }
}

// ========== 6. TOURNAMENT EXPERIENCE ==========
function analyzeExperience(home: Team, away: Team): AnalysisPoint {
  const he = home.stats.experience, ae = away.stats.experience
  let detail: string, advantage: 'home' | 'away' | 'neutral', score: number
  if (he > ae + 15) {
    detail = `${home.nameCn} 的大赛经验极其丰富（评分 ${he}），阵中多名球员经历过世界杯淘汰赛甚至决赛的洗礼。在世界杯这样的高压舞台上，经验往往比技术更能决定关键时刻的选择——知道什么时候该控球消耗时间、什么时候该大举压上、什么时候该战术犯规，这些"软技能"是 ${away.nameCn}（${ae}）目前相对欠缺的。`
    advantage = 'home'; score = 7
  } else if (ae > he + 15) {
    detail = `${away.nameCn} 的大赛经验极其丰富（${ae}），阵中多名球员经历过世界杯淘汰赛甚至决赛的洗礼。在世界杯这样的高压舞台上，经验往往比技术更能决定关键时刻的选择。${home.nameCn}（${he}）在这方面相对欠缺。`
    advantage = 'away'; score = 7
  } else if (he > ae + 5) {
    detail = `${home.nameCn}（${he}）在大赛经验上略占优势。${away.nameCn}（${ae}）虽然也不乏国际比赛经验，但在世界杯级别的关键场次处理上可能稍显稚嫩。`
    advantage = 'home'; score = 4
  } else if (ae > he + 5) {
    detail = `${away.nameCn}（${ae}）在大赛经验上略占优势。`
    advantage = 'away'; score = 4
  } else {
    detail = `两队都拥有丰富的国际大赛经验（${he} vs ${ae}），阵中均有在欧洲顶级联赛效力的核心球员，大赛压力对他们来说并不陌生。`
    advantage = 'neutral'; score = 1
  }
  return { title: '大赛经验', detail, advantage, icon: '🎖️', score }
}

// ========== 7. HEAD-TO-HEAD ==========
function analyzeH2H(home: Team, away: Team): AnalysisPoint {
  const h2h = getH2H(home.id, away.id)
  if (!h2h || h2h.matches.length === 0) {
    return { title: '历史交锋', detail: '两队近年来无正式比赛交手记录。遭遇战最大的特点是不可预测性——双方都没有实战经验可以参考，战术部署更多依赖赛前的情报分析和教练团队的临场判断。这种情况对实力稍弱的一方可能有利，因为他们可以不受历史包袱的束缚，放手一搏。', advantage: 'neutral', icon: '📜', score: 1 }
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
    detail = `${home.nameCn} 在双方近 ${total} 次交手中取得了 ${homeWins} 胜 ${draws} 平 ${awayWins} 负的压倒性优势。这种历史战绩不仅反映了实力差距，更重要的是建立了一种心理上的统治力——${away.nameCn} 球员在面对 ${home.nameCn} 时难免会有"宿命感"，这在高压比赛中往往是致命的。`
    advantage = 'home'; score = 8
  } else if (awayWins >= 4) {
    detail = `${away.nameCn} 在双方近 ${total} 次交手中取得了 ${awayWins} 胜 ${draws} 平 ${homeWins} 负的压倒性优势。这种历史战绩不仅反映了实力差距，更建立了一种心理上的统治力。`
    advantage = 'away'; score = 8
  } else if (homeWins > awayWins) {
    detail = `${home.nameCn} 在近 ${total} 次交锋中取得 ${homeWins} 胜 ${draws} 平 ${awayWins} 负的战绩，心理层面略占上风。虽然优势并非压倒性，但在势均力敌的比赛中，心理优势往往能转化为场上优势。`
    advantage = 'home'; score = 5
  } else if (awayWins > homeWins) {
    detail = `${away.nameCn} 在近 ${total} 次交锋中取得 ${awayWins} 胜 ${draws} 平 ${homeWins} 负的战绩，心理层面略占上风。`
    advantage = 'away'; score = 5
  } else {
    detail = `近 ${total} 次对阵 ${homeWins} 胜 ${draws} 平 ${awayWins} 负，双方势均力敌，历史交锋记录不倾向于任何一方。`
    advantage = 'neutral'; score = 2
  }
  return { title: '历史交锋', detail, advantage, icon: '📜', score }
}

// ========== 8. STYLE & TACTICAL ==========
function analyzeStyle(home: Team, away: Team): AnalysisPoint {
  const s = home.stats, o = away.stats
  const homeStyle = s.attack > s.defense + 10 ? '进攻主导型' : s.defense > s.attack + 10 ? '防守反击型' : '攻守均衡型'
  const awayStyle = o.attack > o.defense + 10 ? '进攻主导型' : o.defense > o.attack + 10 ? '防守反击型' : '攻守均衡型'

  let detail = `${home.nameCn} 的战术风格偏向${homeStyle}（进攻 ${s.attack}/防守 ${s.defense}），${away.nameCn} 则偏向${awayStyle}（进攻 ${o.attack}/防守 ${o.defense}）。`
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 3

  if (s.possession > o.possession + 15) {
    detail += `控球能力方面 ${home.nameCn}（${s.possession}）远胜 ${away.nameCn}（${o.possession}），预计 ${home.nameCn} 将掌控大部分球权，通过耐心的传递组织寻找防线缝隙。${away.nameCn} 可能会长时间处于无球防守状态，这对体能和专注度都是巨大考验。`
    advantage = 'home'; score = 6
  } else if (o.possession > s.possession + 15) {
    detail += `控球能力方面 ${away.nameCn}（${o.possession}）远胜 ${home.nameCn}（${s.possession}），预计 ${away.nameCn} 将掌控大部分球权。`
    advantage = 'away'; score = 6
  } else {
    detail += `控球率方面两队差距不大，比赛的节奏控制将取决于中场的直接对话。`
  }

  if (homeStyle === '进攻主导型' && awayStyle === '防守反击型') {
    detail += `这将是一场经典的"矛与盾"对决。${home.nameCn} 需要在攻坚战中保持耐心，同时警惕 ${away.nameCn} 利用反击在转换中制造威胁。`
    score += 1
  }
  if (homeStyle === '防守反击型' && awayStyle === '进攻主导型') {
    detail += `${home.nameCn} 很可能选择收缩防线、让出控球权，利用 ${away.nameCn} 压上后的空间打反击。这种战术在世界杯赛场上屡试不爽。`
    score += 1
  }

  return { title: '战术风格', detail, advantage, icon: '🎯', score }
}

// ========== 9. KEY PLAYERS ==========
function analyzeKeyPlayers(home: Team, away: Team): AnalysisPoint {
  const homeStar = star(home.id)
  const awayStar = star(away.id)
  const hs = home.stats, os = away.stats
  const homeSP = hs.attack + hs.experience
  const awaySP = os.attack + os.experience

  let detail = `${home.nameCn} 的核心球员是 ${homeStar}，${away.nameCn} 的核心则是 ${awayStar}。`
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 3

  if (homeSP > awaySP + 20) {
    detail += `从球星个人综合能力来看，${home.nameCn} 明显更强。${homeStar} 具备凭借一己之力改变比赛走势的能力——一个任意球、一次个人突破或一脚禁区外的远射，都可能决定比赛结果。${away.nameCn} 需要制定针对性的盯防策略来限制这位核心球员的发挥空间。`
    advantage = 'home'; score = 7
  } else if (awaySP > homeSP + 20) {
    detail += `从球星个人综合能力来看，${away.nameCn} 明显更强。${awayStar} 具备凭借一己之力改变比赛走势的能力。${home.nameCn} 需要制定针对性的盯防策略。`
    advantage = 'away'; score = 7
  } else {
    detail += `双方核心球员能力接近，这场比赛在某种程度上就是两位球星的直接对话。谁能在大场面上更好地发挥，谁就更有可能带领球队取得胜利。`
    score = 4
  }
  return { title: '核心球员', detail, advantage, icon: '⭐', score }
}

// ========== 10. WORLD CUP PEDIGREE ==========
function analyzePedigree(home: Team, away: Team): AnalysisPoint {
  const champions = new Set(['arg','bra','fra','eng','esp','ger','uru'])
  const hChamp = champions.has(home.id)
  const aChamp = champions.has(away.id)

  let detail = ''
  let advantage: 'home' | 'away' | 'neutral' = 'neutral'
  let score = 2

  if (hChamp && !aChamp) {
    detail = `${home.nameCn} 是世界杯冠军得主，拥有深厚的冠军基因和大赛文化。这种底蕴是金钱买不到的——球员们从小就在"我们是一个足球王国"的氛围中成长，在关键时刻会展现出更强的自信和抗压能力。${away.nameCn} 尚未达到这一高度，面对冠军球队时可能会不自觉地放低姿态。`
    advantage = 'home'; score = 5
  } else if (aChamp && !hChamp) {
    detail = `${away.nameCn} 是世界杯冠军得主，拥有深厚的冠军基因和大赛文化。${home.nameCn} 尚未达到这一高度，面对冠军球队时可能会不自觉地放低姿态。`
    advantage = 'away'; score = 5
  } else if (hChamp && aChamp) {
    detail = `两队都拥有世界杯冠军血统，在足球历史的长河中留下了属于自己的印记。这种级别的对决，冠军底蕴将相互抵消，比赛回归到纯粹的足球较量。`
    score = 3
  } else {
    detail = `两队虽未赢得过世界杯，但这并不意味着缺乏竞争力。世界杯赛场上，非传统强队创造的奇迹是最动人的故事线之一。`
    score = 1
  }
  return { title: '世界杯底蕴', detail, advantage, icon: '👑', score }
}

// ========== 11. FITNESS ==========
function analyzeFitness(home: Team, away: Team): AnalysisPoint {
  const hf = home.stats.fitness, af = away.stats.fitness
  let detail: string, advantage: 'home' | 'away' | 'neutral', score: number
  if (hf > af + 10) {
    detail = `${home.nameCn} 在体能储备方面（${hf}）明显优于 ${away.nameCn}（${af}）。体能优势在比赛的最后 20-30 分钟会体现得尤为明显——当 ${away.nameCn} 球员开始出现体能下滑时，${home.nameCn} 依然可以保持高强度的奔跑和逼抢，这段时间往往是进球的高发期。`
    advantage = 'home'; score = 6
  } else if (af > hf + 10) {
    detail = `${away.nameCn} 在体能储备方面（${af}）明显优于 ${home.nameCn}（${hf}）。体能优势在比赛的最后 20-30 分钟会体现得尤为明显。`
    advantage = 'away'; score = 6
  } else {
    detail = `两队的体能储备水平接近（${hf} vs ${af}），体能因素不会成为决定比赛走向的关键变量。`
    advantage = 'neutral'; score = 1
  }
  return { title: '体能储备', detail, advantage, icon: '💪', score }
}

// ========== SCORE PREDICTION WITH DETAILED REASONING ==========
function predictScoreWithReasoning(
  home: Team, away: Team, venue: Venue, points: AnalysisPoint[]
): { home: number; away: number; reasoning: string; scoreline: string } {
  const s = home.stats, o = away.stats

  const totalHome = points.filter(p => p.advantage === 'home').reduce((a, p) => a + p.score, 0)
  const totalAway = points.filter(p => p.advantage === 'away').reduce((a, p) => a + p.score, 0)
  const gap = totalHome - totalAway

  // Base expected goals from stats
  let hg = 1.2 + (s.attack - o.defense) * 0.012 + s.recentForm * 0.005
  let ag = 0.9 + (o.attack - s.defense) * 0.012 + o.recentForm * 0.005

  // Adjust for advantage gap
  if (gap > 10) { hg += 0.4; ag -= 0.15 }
  else if (gap > 5) { hg += 0.2 }
  else if (gap < -10) { ag += 0.4; hg -= 0.15 }
  else if (gap < -5) { ag += 0.2 }

  // Venue adjustments
  if (home.confederation === 'CONCACAF') hg += 0.2
  if (away.confederation === 'CONCACAF') ag += 0.2
  if (venue.altitude > 2000) { hg += 0.15; ag += 0.15 }

  // Round to 1 decimal
  const homeGoals = Math.max(0, Math.round(hg * 10) / 10)
  const awayGoals = Math.max(0, Math.round(ag * 10) / 10)

  // Generate detailed reasoning
  const dominantSide = gap > 5 ? 'home' : gap < -5 ? 'away' : 'neutral'
  const homeAvg = (s.attack + s.defense + s.recentForm + s.experience + s.fitness) / 5
  const awayAvg = (o.attack + o.defense + o.recentForm + o.experience + o.fitness) / 5

  let reasoning = ''
  if (dominantSide === 'home') {
    reasoning = `${home.nameCn} 在综合评分（${homeAvg.toFixed(1)} vs ${awayAvg.toFixed(1)}）、FIFA 排名和近期状态等多个维度上均占据优势。`

    if (s.attack > o.defense + 10) {
      reasoning += `${home.nameCn} 的进攻火力（${s.attack}）明显强于 ${away.nameCn} 的防守能力（${o.defense}），预计 ${home.nameCn} 将创造出足够多的进球机会。`
    } else {
      reasoning += `虽然 ${away.nameCn} 的防线具备一定抵抗力，但 ${home.nameCn} 的整体进攻体系运转流畅，找到破门机会只是时间问题。`
    }

    if (awayAvg > 60) {
      reasoning += `${away.nameCn} 并非毫无还手之力，他们在 ${away.stats.attack > away.stats.defense ? '进攻端具备一定威胁' : '防守端有一定韧性'}，可能会在某个时段给 ${home.nameCn} 制造麻烦并取得进球。`
    } else if (s.defense > 75) {
      reasoning += `${home.nameCn} 的防守端极为稳固（${s.defense}），${away.nameCn} 想要攻破他们的大门难度极大。零封的可能性不容忽视。`
    }
  } else if (dominantSide === 'away') {
    reasoning = `${away.nameCn} 在综合评分（${awayAvg.toFixed(1)} vs ${homeAvg.toFixed(1)}）等多个维度上占据优势。`
  } else {
    reasoning = `两队综合实力非常接近（${home.nameCn} ${homeAvg.toFixed(1)} vs ${away.nameCn} ${awayAvg.toFixed(1)}），各项指标均呈现胶着状态。比赛的胜负很可能取决于一个定位球、一次失误或某位球星的个人闪光。`
  }

  if (venue.altitude > 2000) {
    reasoning += ` 考虑到 ${venue.name} 的高海拔（${venue.altitude}m）对球员体能的影响，下半场后段的进球概率可能会有所增加。`
  }

  // Scoreline
  const predictedHome = Math.round(homeGoals)
  const predictedAway = Math.round(awayGoals)
  const scoreline = `${predictedHome}-${predictedAway}`

  return { home: homeGoals, away: awayGoals, reasoning, scoreline }
}

// ========== 12. UPSET POTENTIAL ==========
function analyzeUpset(home: Team, away: Team, points: AnalysisPoint[]): string | null {
  const homeScore = points.filter(p => p.advantage === 'home').reduce((s, p) => s + p.score, 0)
  const awayScore = points.filter(p => p.advantage === 'away').reduce((s, p) => s + p.score, 0)
  const rankGap = Math.abs(home.fifaRank - away.fifaRank)

  if (rankGap > 25 && ((home.fifaRank < away.fifaRank && awayScore > homeScore * 0.5) || (away.fifaRank < home.fifaRank && homeScore > awayScore * 0.5))) {
    const underdog = home.fifaRank > away.fifaRank ? home.nameCn : away.nameCn
    return `⚠️ 警惕冷门！${underdog} 虽然 FIFA 排名落后超过 25 位，但在近期状态、攻防数据和战术风格等多个分析维度上并不明显处于下风。在世界杯历史上，类似的"纸面实力悬殊"但实际势均力敌的比赛，冷门概率高于市场预期。博彩市场可能高估了排名优势方的胜率。`
  }
  if (rankGap > 40) {
    const strong = home.fifaRank < away.fifaRank ? home.nameCn : away.nameCn
    return `${strong} 的纸面实力占据压倒性优势，但足球是圆的。2018 年韩国 2-0 德国、2022 年沙特 2-1 阿根廷已经告诉我们——任何轻敌都可能付出惨痛代价。${strong} 需要保持专注，避免重蹈覆辙。`
  }
  return null
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
  const gap = totalHome - totalAway
  const strongSide = gap > 5 ? home : gap < -5 ? away : null

  // Build comprehensive overview
  let overview = ''
  if (strongSide === home) {
    overview = `${home.nameCn} 在我们评估的 11 个分析维度中，在 ${points.filter(p => p.advantage === 'home').length} 个维度上占据优势（总分 ${totalHome} vs ${totalAway}），综合实力明显占优。最突出的优势体现在 ${points.filter(p => p.advantage === 'home').sort((a,b) => b.score - a.score).slice(0,3).map(p => p.title).join('、')} 等关键环节。`
    if (totalAway > totalHome * 0.6) {
      overview += `不过 ${away.nameCn} 在 ${points.filter(p => p.advantage === 'away').map(p => p.title).join('、')} 方面展现出竞争力，具备给对手制造麻烦的能力，不应被轻视。`
    }
  } else if (strongSide === away) {
    overview = `${away.nameCn} 在 ${points.filter(p => p.advantage === 'away').length} 个分析维度上占据优势（总分 ${totalAway} vs ${totalHome}），综合实力明显占优。`
  } else {
    overview = `两队在 11 个分析维度中各有胜负——${home.nameCn} 在 ${points.filter(p => p.advantage === 'home').map(p => p.title).join('、')} 方面占优，${away.nameCn} 则在 ${points.filter(p => p.advantage === 'away').map(p => p.title).join('、')} 方面更胜一筹。总体来看，这是一场势均力敌的较量，任何结果都有可能出现。`
  }

  const scoreData = predictScoreWithReasoning(home, away, venue, points)
  const upsetAlert = analyzeUpset(home, away, points)

  return {
    overview,
    points,
    scorePrediction: { home: scoreData.home, away: scoreData.away },
    scoreReasoning: scoreData.reasoning,
    conclusion: '',
    tacticalNote: strongSide === home
      ? `${home.nameCn} 最有效的策略是尽早取得进球——一旦领先，他们可以充分利用 ${away.nameCn} 必须压上进攻留下的身后空间。${away.nameCn} 则应立足防守、耐心等待反击机会，争取将比赛拖入有利于自己的节奏。`
      : strongSide === away
      ? `${away.nameCn} 最有效的策略是尽早取得进球——一旦领先，他们可以充分利用 ${home.nameCn} 必须压上进攻留下的身后空间。${home.nameCn} 则应立足防守、耐心等待反击机会，争取将比赛拖入有利于自己的节奏。`
      : `这是一场谁都不敢轻举妄动的较量。中场的争夺将决定比赛走向——谁能赢得更多二次球权、谁能在转换中更快地找到空档，谁就更接近胜利。`,
    upsetAlert,
    predictedScoreline: scoreData.scoreline,
  }
}
