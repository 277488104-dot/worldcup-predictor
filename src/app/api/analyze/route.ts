import type { Team, Venue } from '@/types/worldcup'
import { predictMatch, computeTeamScore, computeVenueFactor } from '@/lib/prediction'
import { runSimulation } from '@/lib/simulation'
import { STAT_LABELS } from '@/lib/constants'

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'

function buildPrompt(data: {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  h2hSummary: string
}): string {
  const { homeTeam, awayTeam, venue, h2hSummary } = data
  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const sim = runSimulation(homeTeam, awayTeam, venue)
  const homeScore = computeTeamScore(homeTeam.stats)
  const awayScore = computeTeamScore(awayTeam.stats)
  const homeVf = computeVenueFactor(homeTeam, venue)
  const awayVf = computeVenueFactor(awayTeam, venue)

  const fmtStats = (t: Team) =>
    Object.entries(t.stats).map(([k, v]) => `${STAT_LABELS[k as keyof typeof STAT_LABELS]}:${v}`).join('/')

  const factors = prediction.factors
    .map(f => {
      const adv = f.advantage === 'home' ? homeTeam.nameCn : f.advantage === 'away' ? awayTeam.nameCn : '持平'
      return `${f.name}(权重${f.weight.toFixed(0)}):${adv}占优`
    })
    .join('\n')

  const simTop = sim.results.slice(0, 5)
    .map(r => `${r.homeScore}-${r.awayScore} (${r.count}次/${(r.count/10).toFixed(1)}%)`)
    .join('\n')

  return `你是一位资深足球数据分析师。请根据以下数据，对这场比赛进行完整的 AI 预测分析。

【球队数据】
${homeTeam.nameCn}: FIFA#${homeTeam.fifaRank} | 六维: ${fmtStats(homeTeam)} | 综合:${Math.round(homeScore)} | 场馆因子:${homeVf.toFixed(2)}
${awayTeam.nameCn}: FIFA#${awayTeam.fifaRank} | 六维: ${fmtStats(awayTeam)} | 综合:${Math.round(awayScore)} | 场馆因子:${awayVf.toFixed(2)}

【场馆】${venue.name} / ${venue.city}, ${venue.country} / 容量${venue.capacity.toLocaleString()} / 海拔${venue.altitude}m

【公式预测】${homeTeam.nameCn}胜${Math.round(prediction.homeWin*100)}% 平${Math.round(prediction.draw*100)}% ${awayTeam.nameCn}胜${Math.round(prediction.awayWin*100)}% | 置信度${Math.round(prediction.confidence*100)}%

【蒙特卡洛1000次模拟】
胜率: ${homeTeam.nameCn}${Math.round(sim.homeWinRate*100)}% vs ${awayTeam.nameCn}${Math.round(sim.awayWinRate*100)}% | 平局${Math.round(sim.drawRate*100)}%
Top5比分: ${simTop}

【8因素分析】
${factors}

【历史交锋】${h2hSummary}

【输出格式要求 - 严格遵循】
请用 HTML 格式输出，按以下结构，每个部分用 <section> 包裹：

<section>
<h3 style="color:#4ade80;font-size:16px;margin-bottom:8px;font-weight:700">📊 智能预测分析</h3>
<p style="margin-bottom:10px;line-height:1.7;color:#d0d0c8">详细解释公式模型为什么给出这个胜率，结合排名差距、六维对比、场馆修正，用专业足球评论口吻。数据用 <strong style="color:#4ade80">绿色(主队)</strong> 和 <strong style="color:#f0c040">金色(客队)</strong> 高亮。</p>
</section>

<section>
<h3 style="color:#f0c040;font-size:16px;margin-bottom:8px;font-weight:700">🎲 蒙特卡洛模拟解读</h3>
<p style="margin-bottom:10px;line-height:1.7;color:#d0d0c8">解读1000次模拟的结果。模拟与公式是否存在偏差？为什么？最可能出现的比分是哪些？模拟告诉我们什么公式没告诉我们的信息？</p>
</section>

<section>
<h3 style="color:#d0d0c8;font-size:16px;margin-bottom:8px;font-weight:700">⚡ 胜负手分析</h3>
<p style="margin-bottom:10px;line-height:1.7;color:#d0d0c8">从8个因素中挑出最关键的2-3个胜负手，深入解释为什么这些因素可能决定比赛走向。用到具体的六维数据对比。</p>
</section>

<section>
<h3 style="color:#d0d0c8;font-size:16px;margin-bottom:8px;font-weight:700">🔮 最终结论</h3>
<p style="margin-bottom:10px;line-height:1.7;color:#d0d0c8">给出一个完整总结：推荐比分、比赛走势预判（谁先进球？节奏如何？）、关键变量（什么情况下预测会翻车？）、一句话总结。</p>
</section>

语言风格：专业、有洞察力、数据驱动但不说教。每段200-300字。
只输出 HTML，不要 markdown 代码块，不要额外说明。`
}

export async function POST(request: Request) {
  const body = await request.json()
  const { homeTeam, awayTeam, venue, h2hSummary } = body

  if (!homeTeam || !awayTeam || !venue) {
    return Response.json({ error: '缺少必要数据' }, { status: 400 })
  }

  const apiKey = process.env.DEEPSEEK_KEY
  if (!apiKey) {
    return Response.json({ error: 'DeepSeek API key not configured' }, { status: 500 })
  }

  const prompt = buildPrompt({ homeTeam, awayTeam, venue, h2hSummary })

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位资深足球数据分析师。用专业、有洞察力的语言输出比赛分析HTML。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('DeepSeek stream error:', res.status, errText)
    return Response.json({ error: `API error: ${res.status}` }, { status: 502 })
  }

  // Stream the SSE response back to client
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
            } catch {
              // skip unparseable chunks
            }
          }
        }

        // Flush remaining buffer
        if (buffer.trim() && buffer.trim().startsWith('data:')) {
          const data = buffer.trim().slice(5).trim()
          if (data !== '[DONE]') {
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
}
