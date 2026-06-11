import type { Team, Venue, H2HRecord } from '@/types/worldcup'
import { predictMatch, computeTeamScore, computeVenueFactor } from '@/lib/prediction'
import { STAT_LABELS } from '@/lib/constants'

interface ReviewProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  h2h: H2HRecord | undefined
}

function strong(text: string) {
  return `<strong style="color:#4ade80">${text}</strong>`
}
function strongGold(text: string) {
  return `<strong style="color:#f0c040">${text}</strong>`
}

function findTopStrengths(team: Team): string[] {
  return (Object.entries(team.stats) as [string, number][])
    .filter(([, v]) => v >= 80)
    .map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS])
}

function findWeakness(team: Team): string[] {
  return (Object.entries(team.stats) as [string, number][])
    .filter(([, v]) => v <= 55)
    .map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS])
}

export function generateReview({ homeTeam, awayTeam, venue, h2h }: ReviewProps): string {
  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const homeScore = computeTeamScore(homeTeam.stats)
  const awayScore = computeTeamScore(awayTeam.stats)
  const homeVf = computeVenueFactor(homeTeam, venue)
  const awayVf = computeVenueFactor(awayTeam, venue)
  const rankDiff = Math.abs(homeTeam.fifaRank - awayTeam.fifaRank)

  // Home top strengths/weaknesses
  const homeStrengths = findTopStrengths(homeTeam)
  const awayStrengths = findTopStrengths(awayTeam)
  const homeWeak = findWeakness(homeTeam)

  // Paragraph 1 — Strength comparison
  const p1HomeBetter = Math.round(homeScore) > Math.round(awayScore)
  const p1 = `
    <p style="margin-bottom:12px">
      <span style="color:#f5f5f0;font-weight:700">📊 实力对比</span><br>
      ${homeTeam.nameCn} FIFA 排名第 ${homeTeam.fifaRank} 位${
        rankDiff <= 3 ? '，与对手实力极为接近。' :
        homeTeam.fifaRank < awayTeam.fifaRank ? '，整体实力领先于对手。' : '，排名上处于下风。'
      }
      球队的${homeStrengths.slice(0, 2).map(s => strong(s)).join('和')}是最大武器。
      ${homeWeak.length > 0 ? `但${homeWeak.join('、')}方面存在短板。` : ''}
      ${awayTeam.nameCn} 方面，${awayStrengths.slice(0, 2).map(s => strongGold(s)).join('和')}值得关注。
      综合评分 ${Math.round(homeScore)} vs ${Math.round(awayScore)}${p1HomeBetter ? '，主队稍占上风。' : '，实力接近。'}
    </p>`

  // Paragraph 2 — Venue
  const p2 = `
    <p style="margin-bottom:12px">
      <span style="color:#f5f5f0;font-weight:700">🏟️ 场地因素</span><br>
      比赛在 ${venue.name}（${venue.city}, ${venue.country}）进行。
      ${venue.altitude < 500 ? '低海拔环境对球员体能影响极小，两队均可正常发挥。' :
        venue.altitude < 2500 ? `${venue.altitude}m 的中高海拔可能对不适应高原的球队造成额外挑战。` :
        `${venue.altitude}m 的极高海拔将成为重要变量。`}
      ${venue.capacity > 70000 ? `${(venue.capacity/1000).toFixed(0)}k 观众的主场氛围将为比赛增添巨大压力。` : ''}
      ${homeTeam.confederation === 'CONCACAF' && awayTeam.confederation !== 'CONCACAF'
        ? ` ${homeTeam.nameCn} 作为中北美球队，更适应北美场馆条件（修正因子 ${homeVf.toFixed(2)}）。`
        : awayTeam.confederation === 'CONCACAF' && homeTeam.confederation !== 'CONCACAF'
        ? ` ${awayTeam.nameCn} 作为中北美球队，更适应北美场馆条件（修正因子 ${awayVf.toFixed(2)}）。`
        : ' 两队在场馆适应方面无明显差距。'}
    </p>`

  // Paragraph 3 — H2H
  let p3 = ''
  if (h2h && h2h.matches.length > 0) {
    const total = h2h.matches.length
    const homeWins = h2h.matches.filter(m =>
      (m.homeTeamId === homeTeam.id && m.homeScore > m.awayScore) ||
      (m.awayTeamId === homeTeam.id && m.awayScore > m.homeScore)
    ).length
    const awayWins = h2h.matches.filter(m =>
      (m.homeTeamId === awayTeam.id && m.homeScore > m.awayScore) ||
      (m.awayTeamId === awayTeam.id && m.awayScore > m.homeScore)
    ).length
    const draws = total - homeWins - awayWins
    p3 = `
    <p style="margin-bottom:12px">
      <span style="color:#f5f5f0;font-weight:700">📈 交锋历史</span><br>
      两队历史上交手 ${total} 次。${homeTeam.nameCn} 以 ${homeWins} 胜 ${draws} 平 ${awayWins} 负${
        homeWins > awayWins ? '占据明显优势。' : awayWins > homeWins ? '处于下风。' : '，实力极为接近。'
      }${draws >= 2 ? ' 多次出现平局表明两队交手常常胶着。' : ''}
    </p>`
  }

  // Paragraph 4 — Key factors
  const factors = prediction.factors
  const homeAdv = factors.filter(f => f.advantage === 'home')
  const awayAdv = factors.filter(f => f.advantage === 'away')
  const p4 = `
    <p style="margin-bottom:12px">
      <span style="color:#f5f5f0;font-weight:700">⚡ 关键因素</span><br>
      ${homeAdv.length > awayAdv.length
        ? `${homeTeam.nameCn} 在 ${homeAdv.map(f => f.name).join('、')} 等 <b>${homeAdv.length}</b> 个维度上占优。`
        : awayAdv.length > homeAdv.length
        ? `${awayTeam.nameCn} 在 ${awayAdv.map(f => f.name).join('、')} 等 <b>${awayAdv.length}</b> 个维度上占优。`
        : '双方在关键维度上势均力敌。'}
      ${Math.abs(homeAdv.length - awayAdv.length) <= 1
        ? '这场比赛的胜负将取决于临场战术执行和球员个人发挥。'
        : '多维度的综合优势可能成为决定性因素。'}
    </p>`

  // Paragraph 5 — Prediction + disclaimer
  const p5 = `
    <p>
      <span style="color:#f5f5f0;font-weight:700">🔮 AI 综合判断</span><br>
      综合 8 项因素分析，<strong style="color:#4ade80">${homeTeam.nameCn} 以 ${Math.round(prediction.homeWin * 100)}% 的胜率被看好</strong>，
      平局概率 ${Math.round(prediction.draw * 100)}%，${awayTeam.nameCn} 胜率 ${Math.round(prediction.awayWin * 100)}%。
      模型的置信度为 ${Math.round(prediction.confidence * 100)}%。
      ${rankDiff <= 5
        ? `<br><span style="font-size:11px;color:#889988;margin-top:4px;display:inline-block">⚠️ 两队排名仅差 ${rankDiff} 位，实际比赛走势取决于临场发挥，预测仅供参考。</span>`
        : ''}
      ${venue.altitude > 1500
        ? `<br><span style="font-size:11px;color:#889988;margin-top:4px;display:inline-block">⚠️ ${venue.name} 的高海拔环境将增加比赛的不确定性。</span>`
        : ''}
    </p>`

  return p1 + p2 + p3 + p4 + p5
}
