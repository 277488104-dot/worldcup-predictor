import type { Team, Venue } from '@/types/worldcup'
import { predictMatch, predictScores, computeTeamScore } from '@/lib/prediction'
import { STAT_LABELS } from '@/lib/constants'

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'

function buildPostMatchPrompt(data: {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  homeScore: number
  awayScore: number
  matchDetail: Record<string, unknown> | null
}): string {
  const { homeTeam, awayTeam, venue, homeScore, awayScore, matchDetail } = data
  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const scores = predictScores(homeTeam, awayTeam, venue)
  const homeBase = computeTeamScore(homeTeam.stats)
  const awayBase = computeTeamScore(awayTeam.stats)

  const realWinner = homeScore > awayScore ? homeTeam.nameCn : awayScore > homeScore ? awayTeam.nameCn : '平局'
  const predictedWinner = prediction.homeWin > prediction.awayWin ? homeTeam.nameCn : prediction.awayWin > prediction.homeWin ? awayTeam.nameCn : '平局'
  const aiCorrect = realWinner === predictedWinner

  // Goals detail
  let goalsText = '无进球数据'
  if (matchDetail?.goals && Array.isArray(matchDetail.goals)) {
    goalsText = (matchDetail.goals as Array<Record<string,unknown>>)
      .map(g => `${g.minute}′ ${g.team === 'home' ? homeTeam.nameCn : awayTeam.nameCn} ${g.scorer}`)
      .join('; ')
  }

  // Lineups
  let lineupsText = '无阵容数据'
  if (matchDetail?.lineups && typeof matchDetail.lineups === 'object') {
    const lu = matchDetail.lineups as Record<string, Array<Record<string,unknown>>>
    const hStarters = (lu.home || []).filter(p => p.starter).map(p => `${p.player}(${p.position})`).join(', ')
    const aStarters = (lu.away || []).filter(p => p.starter).map(p => `${p.player}(${p.position})`).join(', ')
    lineupsText = `${homeTeam.nameCn}首发: ${hStarters || '无'}\n${awayTeam.nameCn}首发: ${aStarters || '无'}`
  }

  const fmtStats = (t: Team) =>
    Object.entries(t.stats).map(([k,v]) => `${STAT_LABELS[k as keyof typeof STAT_LABELS]}:${v}`).join('/')

  const top2Scores = scores.slice(0,2).map(s => `${s.homeScore}-${s.awayScore}(${(s.probability*100).toFixed(1)}%)`).join(' / ')

  return `你是一位资深足球评论员，刚看完一场2026世界杯比赛。请根据以下数据撰写赛后复盘分析。

【比赛结果】
${homeTeam.nameCn}（${homeTeam.fifaCode}）${homeScore} - ${awayScore} ${awayTeam.nameCn}（${awayTeam.fifaCode}）
获胜方: ${realWinner}

【AI赛前预测】
预测: ${predictedWinner}胜 | ${homeTeam.nameCn}胜率${Math.round(prediction.homeWin*100)}% / 平${Math.round(prediction.draw*100)}% / ${awayTeam.nameCn}胜率${Math.round(prediction.awayWin*100)}%
预测比分Top2: ${top2Scores}
AI方向: ${aiCorrect ? '✅ 正确' : '❌ 错误'}

【两队赛前数据】
${homeTeam.nameCn}: FIFA#${homeTeam.fifaRank} | ${fmtStats(homeTeam)} | 综合${Math.round(homeBase)}
${awayTeam.nameCn}: FIFA#${awayTeam.fifaRank} | ${fmtStats(awayTeam)} | 综合${Math.round(awayBase)}

【比赛场地】
${venue.name} / ${venue.city} / 容量${venue.capacity?.toLocaleString() || '?'}人 / 海拔${venue.altitude}m

【进球过程】
${goalsText}

【双方阵容】
${lineupsText}
${matchDetail?.attendance ? `到场观众: ${matchDetail.attendance.toLocaleString()}人` : ''}

【输出要求】
用 HTML 输出，4 个 section：

<section>
<h3 style="color:#4ade80;font-size:16px;margin-bottom:8px;font-weight:700">⚽ 一、比赛回顾</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">用 150-250 字还原比赛关键节点：谁在第几分钟进球？比赛节奏如何？转折点在哪？描述要有画面感，像专业球评。</p>
</section>

<section>
<h3 style="color:#f0c040;font-size:16px;margin-bottom:8px;font-weight:700">🎯 二、AI预测复盘</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">对比AI预测和实际结果。预测对了什么？错了什么？为什么对了/错了？分析模型判断的依据和现实的偏差原因。不回避错误。</p>
</section>

<section>
<h3 style="color:#d0d0c8;font-size:16px;margin-bottom:8px;font-weight:700">🔍 三、战术与球员分析</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">从阵容、进球过程、场地数据中提炼战术洞察。谁的关键表现决定了比赛？阵型配置是否合理？换人时机如何？</p>
</section>

<section>
<h3 style="color:#4ade80;font-size:16px;margin-bottom:8px;font-weight:700">🔮 四、后续展望</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">这场比赛对两队的出线形势意味着什么？对下场比赛有何启示？球队状态是上升还是下降？</p>
</section>

风格: 专业足球评论口吻，有观点有数据，敢于下判断。
主队数据用 <strong style="color:#4ade80">...</strong>，客队用 <strong style="color:#f0c040">...</strong>。
只输出 HTML，不要任何 markdown 或额外说明。`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { homeTeam, awayTeam, venue, homeScore, awayScore, matchDetail } = body

    if (!homeTeam || !awayTeam || !venue || homeScore == null || awayScore == null) {
      return Response.json({ error: '缺少必要数据' }, { status: 400 })
    }

    const apiKey = process.env.DEEPSEEK_KEY
    if (!apiKey) {
      return Response.json({ error: 'DeepSeek API key not configured' }, { status: 500 })
    }

    const prompt = buildPostMatchPrompt({ homeTeam, awayTeam, venue, homeScore, awayScore, matchDetail })

    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位资深足球评论员，擅长赛后战术复盘。输出HTML，专业、有洞察力。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2560,
        stream: true,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('DeepSeek stream error:', res.status, errText)
      return Response.json({ error: `API error: ${res.status}` }, { status: 502 })
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || !trimmed.startsWith('data:')) continue
              const data = trimmed.slice(5).trim()
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                continue
              }
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`))
                }
              } catch { /* skip */ }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          console.error('Stream read error:', err)
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('Post-match review error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
