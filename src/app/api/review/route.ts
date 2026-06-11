import type { Team, Venue, H2HRecord } from '@/types/worldcup'
import { predictMatch, computeTeamScore, computeVenueFactor } from '@/lib/prediction'
import { STAT_LABELS } from '@/lib/constants'

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24h

const cache = new Map<string, { html: string; ts: number }>()

function buildPrompt(data: {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  h2h: H2HRecord | undefined
}): string {
  const { homeTeam, awayTeam, venue, h2h } = data
  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const homeScore = computeTeamScore(homeTeam.stats)
  const awayScore = computeTeamScore(awayTeam.stats)
  const homeVf = computeVenueFactor(homeTeam, venue)
  const awayVf = computeVenueFactor(awayTeam, venue)

  const homeStats = Object.entries(homeTeam.stats)
    .map(([k, v]) => `${STAT_LABELS[k as keyof typeof STAT_LABELS]}: ${v}`)
    .join(', ')
  const awayStats = Object.entries(awayTeam.stats)
    .map(([k, v]) => `${STAT_LABELS[k as keyof typeof STAT_LABELS]}: ${v}`)
    .join(', ')

  const factors = prediction.factors
    .map(f => {
      const adv = f.advantage === 'home' ? homeTeam.nameCn : f.advantage === 'away' ? awayTeam.nameCn : '持平'
      return `${f.name}(权重${f.weight}): ${adv}占优`
    })
    .join('; ')

  const h2hSummary = h2h?.matches?.length
    ? h2h.matches.map(m => {
        const h = m.homeTeamId === homeTeam.id ? homeTeam.nameCn : awayTeam.nameCn
        const a = m.awayTeamId === homeTeam.id ? homeTeam.nameCn : awayTeam.nameCn
        return `${m.date.slice(0,4)} ${h} ${m.homeScore}-${m.awayScore} ${a}`
      }).join('; ')
    : '无历史交锋记录'

  return `你是一位资深足球评论员，为2026世界杯比赛撰写赛前分析。请根据以下数据生成 HTML 格式的赛前球评：

【球队数据】
${homeTeam.nameCn}（${homeTeam.nameCn}）：FIFA排名第${homeTeam.fifaRank}位，所属${homeTeam.confederation}，教练${homeTeam.coach}
六维能力 - ${homeStats}
综合评分: ${Math.round(homeScore)}，场馆修正因子: ${homeVf.toFixed(2)}
强项: ${Object.entries(homeTeam.stats).filter(([,v]) => v >= 80).map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS]).join('、') || '无特别突出'}
短板: ${Object.entries(homeTeam.stats).filter(([,v]) => v <= 55).map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS]).join('、') || '无特别短板'}

${awayTeam.nameCn}（${awayTeam.nameCn}）：FIFA排名第${awayTeam.fifaRank}位，所属${awayTeam.confederation}，教练${awayTeam.coach}
六维能力 - ${awayStats}
综合评分: ${Math.round(awayScore)}，场馆修正因子: ${awayVf.toFixed(2)}
强项: ${Object.entries(awayTeam.stats).filter(([,v]) => v >= 80).map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS]).join('、') || '无特别突出'}
短板: ${Object.entries(awayTeam.stats).filter(([,v]) => v <= 55).map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS]).join('、') || '无特别短板'}

【比赛场地】
${venue.name}，${venue.city}, ${venue.country}，容量${venue.capacity.toLocaleString()}人，海拔${venue.altitude}m

【AI预测结果】
${homeTeam.nameCn}胜率: ${Math.round(prediction.homeWin * 100)}%，平局: ${Math.round(prediction.draw * 100)}%，${awayTeam.nameCn}胜率: ${Math.round(prediction.awayWin * 100)}%
置信度: ${Math.round(prediction.confidence * 100)}%
8因素分析: ${factors}

【历史交锋】
${h2hSummary}

【输出要求】
1. 生成5段HTML，每段用 <p style="margin-bottom:12px"> 包裹
2. 每段开头用 <span style="color:#f5f5f0;font-weight:700">标题emoji 标题</span><br> 作为小标题
3. 五段分别是：📊 实力对比、🏟️ 场地因素、📈 交锋历史、⚡ 关键因素、🔮 AI 综合判断
4. 重点数据用 <strong style="color:#4ade80">...</strong>（主队）或 <strong style="color:#f0c040">...</strong>（客队）高亮
5. 语言风格：专业足球评论口吻，有洞察力，不只是复述数据
6. 最后一段给出综合判断，解释为什么AI给出这样的胜率
7. 只输出HTML片段，不要markdown代码块，不要任何额外说明`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { homeTeam, awayTeam, venue, h2h } = body as {
      homeTeam: Team
      awayTeam: Team
      venue: Venue
      h2h: H2HRecord | undefined
    }

    if (!homeTeam || !awayTeam || !venue) {
      return Response.json({ error: '缺少必要数据' }, { status: 400 })
    }

    // Check cache
    const cacheKey = `${homeTeam.id}-${awayTeam.id}-${venue.id}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return Response.json({ html: cached.html, cached: true })
    }

    const apiKey = process.env.DEEPSEEK_KEY
    if (!apiKey) {
      // Fallback: return null so client uses template
      return Response.json({ html: null, reason: 'no-key' })
    }

    const prompt = buildPrompt({ homeTeam, awayTeam, venue, h2h })

    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位资深足球评论员，擅长数据驱动的赛前分析。你输出HTML片段，风格专业有洞察力。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('DeepSeek API error:', res.status, errText)
      return Response.json({ html: null, reason: 'api-error', status: res.status })
    }

    const json = await res.json()
    const html = json.choices?.[0]?.message?.content?.trim() ?? ''

    if (html) {
      cache.set(cacheKey, { html, ts: Date.now() })
      return Response.json({ html, cached: false })
    }

    return Response.json({ html: null, reason: 'empty-response' })
  } catch (err) {
    console.error('Review API error:', err)
    return Response.json({ html: null, reason: 'exception' })
  }
}
