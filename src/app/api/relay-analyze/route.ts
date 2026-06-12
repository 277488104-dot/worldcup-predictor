import type { Team, Venue, Player } from '@/types/worldcup'
import { predictMatch, predictScores, computeTeamScore, computeVenueFactor } from '@/lib/prediction'
import { runSimulation } from '@/lib/simulation'
import { STAT_LABELS } from '@/lib/constants'

const RELAY_URL = 'https://nova.cervus.cn/v1/chat/completions'
const RELAY_KEY = process.env.RELAY_KEY || ''

// Model options: display name → relay model ID
const MODELS: Record<string, string> = {
  'claude': '[鹿鹿2]claude-4.5-sonnet',
  'gpt': '[鹿鹿2]gpt-5.5',
  'gemini': '[鹿鹿2]gemini-2.5-pro',
}

function buildPrompt(data: {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  h2hSummary: string
  homePlayers: Player[]
  awayPlayers: Player[]
}): string {
  const { homeTeam, awayTeam, venue, h2hSummary, homePlayers, awayPlayers } = data
  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const scores = predictScores(homeTeam, awayTeam, venue)
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

  const topScores = scores.map(s => `${s.homeScore}-${s.awayScore}(${(s.probability*100).toFixed(1)}%)`).join(' / ')

  const homeAgeAvg = homePlayers.length > 0
    ? (homePlayers.reduce((s,p) => s + p.age, 0) / homePlayers.length).toFixed(1)
    : '?'
  const awayAgeAvg = awayPlayers.length > 0
    ? (awayPlayers.reduce((s,p) => s + p.age, 0) / awayPlayers.length).toFixed(1)
    : '?'

  const topStats = (t: Team) =>
    Object.entries(t.stats).filter(([,v]) => v >= 80).map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS]).join('、') || '无明显强项'
  const weakStats = (t: Team) =>
    Object.entries(t.stats).filter(([,v]) => v <= 55).map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS]).join('、') || '无明显短板'

  return `你是一位资深足球分析师。基于以下全面数据撰写2026世界杯比赛深度分析。

【球队数据】
${homeTeam.nameCn}: FIFA#${homeTeam.fifaRank} | 六维: ${fmtStats(homeTeam)} | 综合:${Math.round(homeScore)} | 场馆因子:${homeVf.toFixed(2)}
核心优势: ${topStats(homeTeam)} | 短板: ${weakStats(homeTeam)} | 阵容年龄均值: ${homeAgeAvg}岁
${awayTeam.nameCn}: FIFA#${awayTeam.fifaRank} | 六维: ${fmtStats(awayTeam)} | 综合:${Math.round(awayScore)} | 场馆因子:${awayVf.toFixed(2)}
核心优势: ${topStats(awayTeam)} | 短板: ${weakStats(awayTeam)} | 阵容年龄均值: ${awayAgeAvg}岁

【场地】${venue.name} / ${venue.city} / 容量${venue.capacity?.toLocaleString() || '?'}人 / 海拔${venue.altitude}m / 气候${venue.climate || '温带'}

【模型结果】
公式预测: ${homeTeam.nameCn}胜${Math.round(prediction.homeWin*100)}% 平${Math.round(prediction.draw*100)}% ${awayTeam.nameCn}胜${Math.round(prediction.awayWin*100)}%
置信度: ${Math.round(prediction.confidence*100)}%
泊松比分Top3: ${topScores}
蒙特卡洛1000次: ${homeTeam.nameCn}${Math.round(sim.homeWinRate*100)}% vs ${awayTeam.nameCn}${Math.round(sim.awayWinRate*100)}% | 平${Math.round(sim.drawRate*100)}%
Top5比分: ${simTop}

【8因素】${factors}

【交锋】${h2hSummary}

【输出要求】
用HTML输出6个section:

<section>
<h3 style="color:#4ade80;font-size:16px;margin-bottom:10px;font-weight:700">📊 一、实力全景对比</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">比较两队FIFA排名、六维雷达、综合战力。主队数据用 <strong style="color:#4ade80">...</strong> 高亮，客队用 <strong style="color:#f0c040">...</strong>。</p>
</section>

<section>
<h3 style="color:#f0c040;font-size:16px;margin-bottom:10px;font-weight:700">👥 二、球员与阵容分析</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">分析关键球员、年龄结构、阵型配置。</p>
</section>

<section>
<h3 style="color:#f5f5f0;font-size:16px;margin-bottom:10px;font-weight:700">🏟️ 三、场地与环境因素</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">分析场地特征、海拔影响、容量氛围。</p>
</section>

<section>
<h3 style="color:#d0d0c8;font-size:16px;margin-bottom:10px;font-weight:700">📈 四、交锋历史与心理博弈</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">解读历史交锋或遭遇战心理。</p>
</section>

<section>
<h3 style="color:#f0c040;font-size:16px;margin-bottom:10px;font-weight:700">🎲 五、模型预测与蒙特卡洛</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">解读公式和模拟结果。蒙特卡洛与公式是否一致？</p>
</section>

<section>
<h3 style="color:#4ade80;font-size:16px;margin-bottom:10px;font-weight:700">🔮 六、最终结论</h3>
<p style="margin-bottom:8px;line-height:1.8;color:#d0d0c8"><strong style="color:#4ade80">▸ 推荐比分一: X-X</strong>（概率最高）—— 为什么？</p>
<p style="margin-bottom:8px;line-height:1.8;color:#d0d0c8"><strong style="color:#f0c040">▸ 推荐比分二: X-X</strong>（次可能）—— 什么情况下？</p>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">▸ 走势预判 / 翻车预警 / 一句话总结。</p>
</section>

每段200-350字，专业有洞察力。只输出HTML，不要任何额外说明。`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { homeTeam, awayTeam, venue, h2hSummary, homePlayers, awayPlayers, model } = body

    if (!homeTeam || !awayTeam || !venue) {
      return Response.json({ error: '缺少必要数据' }, { status: 400 })
    }

    if (!RELAY_KEY) {
      return Response.json({ error: 'RELAY_KEY not configured' }, { status: 500 })
    }

    const modelId = MODELS[model] || MODELS['claude']
    const prompt = buildPrompt({ homeTeam, awayTeam, venue, h2hSummary, homePlayers: homePlayers || [], awayPlayers: awayPlayers || [] })

    const res = await fetch(RELAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RELAY_KEY}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: '你是一位资深足球分析师。输出HTML分析，专业有洞察力。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 3072,
        stream: true,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Relay API error:', res.status, errText)
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
          if (buffer.trim()?.startsWith('data:')) {
            const data = buffer.trim().slice(5).trim()
            if (data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`))
              } catch {}
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
    console.error('Relay analyze error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
