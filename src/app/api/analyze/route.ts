import type { Team, Venue, Player } from '@/types/worldcup'
import { predictMatch, predictScores, computeTeamScore, computeVenueFactor } from '@/lib/prediction'
import { runSimulation } from '@/lib/simulation'
import { STAT_LABELS } from '@/lib/constants'

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'

function fmtPlayers(players: Player[]): string {
  return players.slice(0, 5).map(p =>
    `${p.name}(#${p.number} ${p.position} ${p.age}岁 ${p.club})`
  ).join('\n')
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

  // Position counts
  const countPos = (ps: Player[], pos: string) => ps.filter(p => p.position === pos).length
  const homeFW = countPos(homePlayers, 'FW')
  const homeMF = countPos(homePlayers, 'MF')
  const homeDF = countPos(homePlayers, 'DF')
  const awayFW = countPos(awayPlayers, 'FW')
  const awayMF = countPos(awayPlayers, 'MF')
  const awayDF = countPos(awayPlayers, 'DF')

  // Strength & weakness
  const topStats = (t: Team) =>
    Object.entries(t.stats).filter(([,v]) => v >= 80).map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS]).join('、') || '无明显强项'
  const weakStats = (t: Team) =>
    Object.entries(t.stats).filter(([,v]) => v <= 55).map(([k]) => STAT_LABELS[k as keyof typeof STAT_LABELS]).join('、') || '无明显短板'

  return `你是一位资深足球分析师，曾为《队报》《踢球者》撰写战术专栏。请基于以下全面数据，撰写一场2026世界杯比赛的深度分析报告。

══════════════════════════════════════
【𝟙 球队基本面】
══════════════════════════════════════
${homeTeam.nameCn}（${homeTeam.fifaCode}）
  FIFA排名: #${homeTeam.fifaRank} | 洲联: ${homeTeam.confederation} | 教练: ${homeTeam.coach}
  六维能力: ${fmtStats(homeTeam)}
  综合战力: ${Math.round(homeScore)} | 场馆修正因子: ${homeVf.toFixed(2)}
  核心优势: ${topStats(homeTeam)}
  潜在短板: ${weakStats(homeTeam)}
  阵容年龄均值: ${homeAgeAvg}岁 | 前锋${homeFW}人/中场${homeMF}人/后卫${homeDF}人

${awayTeam.nameCn}（${awayTeam.fifaCode}）
  FIFA排名: #${awayTeam.fifaRank} | 洲联: ${awayTeam.confederation} | 教练: ${awayTeam.coach}
  六维能力: ${fmtStats(awayTeam)}
  综合战力: ${Math.round(awayScore)} | 场馆修正因子: ${awayVf.toFixed(2)}
  核心优势: ${topStats(awayTeam)}
  潜在短板: ${weakStats(awayTeam)}
  阵容年龄均值: ${awayAgeAvg}岁 | 前锋${awayFW}人/中场${awayMF}人/后卫${awayDF}人

══════════════════════════════════════
【𝟚 关键球员】
══════════════════════════════════════
${homeTeam.nameCn} 核心: ${fmtPlayers(homePlayers)}
${awayTeam.nameCn} 核心: ${fmtPlayers(awayPlayers)}

══════════════════════════════════════
【𝟛 比赛场地】
══════════════════════════════════════
场馆: ${venue.name || "未知"} | 城市: ${venue.city}, ${venue.country}
容量: ${venue.capacity?.toLocaleString()}人 | 海拔: ${venue.altitude}m
气候: ${venue.climate || "温带"} | 时区: ${venue.timezone}

══════════════════════════════════════
【𝟜 交锋历史】
══════════════════════════════════════
${h2hSummary}

══════════════════════════════════════
【𝟝 模型计算结果】
══════════════════════════════════════
公式预测: ${homeTeam.nameCn}胜${Math.round(prediction.homeWin*100)}% | 平${Math.round(prediction.draw*100)}% | ${awayTeam.nameCn}胜${Math.round(prediction.awayWin*100)}%
置信度: ${Math.round(prediction.confidence*100)}%
泊松比分预测(Top3): ${topScores}

蒙特卡洛1000次模拟:
  胜率: ${homeTeam.nameCn}${Math.round(sim.homeWinRate*100)}% vs ${awayTeam.nameCn}${Math.round(sim.awayWinRate*100)}% | 平${Math.round(sim.drawRate*100)}%
  Top5比分分布: ${simTop}

8因素分析:
${factors}

══════════════════════════════════════
【输出要求】
══════════════════════════════════════

用 HTML 输出，按以下 6 个 SECTION 结构。每段 200-350 字，有洞察力，不只是复述数据。

<section>
<h3 style="color:#4ade80;font-size:16px;margin-bottom:10px;font-weight:700">📊 一、实力全景对比</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">比较两队 FIFA 排名、六维雷达图、综合战力。分析谁在哪些维度上有明显优势。引用具体数值，说明为什么这些差距重要。</p>
</section>

<section>
<h3 style="color:#f0c040;font-size:16px;margin-bottom:10px;font-weight:700">👥 二、球员与阵容分析</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">分析关键球员的对位。比较双方阵容年龄结构（老将经验 vs 年轻冲击力）。讨论阵型配置（前锋/中场/后卫分布）可能带来的战术特点。指出可能决定比赛的个人对决。</p>
</section>

<section>
<h3 style="color:#f5f5f0;font-size:16px;margin-bottom:10px;font-weight:700">🏟️ 三、场地与环境因素</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">分析 ${venue.name || "未知"} 的场地特征：海拔${venue.altitude}m对体能的影响、${venue.capacity?.toLocaleString()}人容量的主场氛围、${venue.climate || "温带"}气候对比赛节奏的影响、时区适应问题。结合两队洲联归属（${homeTeam.confederation} vs ${awayTeam.confederation}）判断谁更适应北美场地。</p>
</section>

<section>
<h3 style="color:#d0d0c8;font-size:16px;margin-bottom:10px;font-weight:700">📈 四、交锋历史与心理博弈</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">解读历史交锋数据。如果有交手记录，分析过往结果的模式（一边倒？经常平局？）。如果没有交锋，讨论"遭遇战"的心理层面——谁更擅长打这种比赛？</p>
</section>

<section>
<h3 style="color:#f0c040;font-size:16px;margin-bottom:10px;font-weight:700">🎲 五、模型预测与蒙特卡洛</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">解读公式预测和模拟结果。为什么模型给出这个胜率？蒙特卡洛模拟与公式是否一致？如果不一致，为什么？最可能出现的比分是哪些？蒙特卡洛的分布告诉了我们什么公式没告诉的信息（比如极端比分的概率）？</p>
</section>

<section>
<h3 style="color:#4ade80;font-size:16px;margin-bottom:10px;font-weight:700">🔮 六、最终结论</h3>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8">给出最终判断。包含以下内容：</p>
<p style="margin-bottom:8px;line-height:1.8;color:#d0d0c8"><strong style="color:#4ade80">▸ 比赛走势预判：</strong>开场节奏如何？谁可能先进球？下半场变数？</p>
<p style="margin-bottom:8px;line-height:1.8;color:#d0d0c8"><strong style="color:#f0c040">▸ 关键胜负手：</strong>这场比赛最可能被什么因素决定？</p>
<p style="margin-bottom:8px;line-height:1.8;color:#d0d0c8"><strong style="color:#d0d0c8">▸ 翻车预警：</strong>什么情况下预测会出错？</p>
<p style="margin-bottom:12px;line-height:1.8;color:#d0d0c8"><strong style="color:#4ade80">▸ 推荐比分一：X-X</strong>（概率最高）—— 为什么这个比分最可能？</p>
<p style="margin-bottom:12px;line-height:1.8;color:#d0d0c8"><strong style="color:#f0c040">▸ 推荐比分二：X-X</strong>（次可能）—— 什么情况下会打出这个比分？</p>
<p style="margin-bottom:10px;line-height:1.8;color:#d0d0c8"><strong style="color:#d0d0c8">▸ 一句话总结：</strong>用一句让你记住这场比赛的话收尾。</p>
</section>

【写作要求】
- 每段 200-350 字，必须有数据支撑的分析，不要空洞的套话
- 主队数据用 <strong style="color:#4ade80">...</strong> 高亮，客队用 <strong style="color:#f0c040">...</strong>
- 风格：专业足球评论员的深度分析，敢于做出判断
- 6个因素必须全部覆盖：实力对比、球员阵容、场地环境、交锋心理、模型数据、综合结论
- **两个推荐比分必须醒目展示**，用泊松模型 Top2 结果填入，并解释为什么
- 只输出 HTML，不要 markdown 代码块，不要任何额外说明或前缀`
}

export async function POST(request: Request) {
  const body = await request.json()
  const { homeTeam, awayTeam, venue, h2hSummary, homePlayers, awayPlayers } = body

  if (!homeTeam || !awayTeam || !venue) {
    return Response.json({ error: '缺少必要数据' }, { status: 400 })
  }

  const apiKey = process.env.DEEPSEEK_KEY
  if (!apiKey) {
    return Response.json({ error: 'DeepSeek API key not configured' }, { status: 500 })
  }

  const prompt = buildPrompt({
    homeTeam, awayTeam, venue, h2hSummary,
    homePlayers: homePlayers || [],
    awayPlayers: awayPlayers || [],
  })

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位资深足球分析师，曾为《队报》《踢球者》撰写战术专栏。用专业、有洞察力的语言输出比赛分析HTML，每段200-350字，必须有数据支撑。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3072,
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
