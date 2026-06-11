import { getGroups, getTeamsByGroup } from '@/lib/data'
import { predictMatch } from '@/lib/prediction'
import { getAllVenues } from '@/lib/data'
import type { Team } from '@/types/worldcup'

function simulateGroupStandings(groupId: string): Team[] {
  const teams = getTeamsByGroup(groupId)
  if (teams.length === 0) return []
  const venue = getAllVenues()[0]
  const points: Record<string, number> = {}
  teams.forEach(t => { points[t.id] = 0 })

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const p = predictMatch(teams[i], teams[j], venue)
      if (p.homeWin > p.awayWin && p.homeWin > p.draw) {
        points[teams[i].id] += 3
      } else if (p.awayWin > p.homeWin && p.awayWin > p.draw) {
        points[teams[j].id] += 3
      } else {
        points[teams[i].id] += 1
        points[teams[j].id] += 1
      }
    }
  }

  return teams.sort((a, b) => (points[b.id] ?? 0) - (points[a.id] ?? 0))
}

export default function BracketPage() {
  const groups = getGroups()
  const venues = getAllVenues()
  const defaultVenue = venues[0]

  // Get top 2 from each group
  const groupWinners: Team[] = []
  const groupRunnersUp: Team[] = []
  groups.forEach(g => {
    const standings = simulateGroupStandings(g.id)
    if (!standings[0] || !standings[1]) return
    groupWinners.push(standings[0])
    groupRunnersUp.push(standings[1])
  })

  if (groupWinners.length < 12 || groupRunnersUp.length < 12) {
    return <main className="max-w-7xl mx-auto px-5 py-24 text-center"><p className="text-muted">数据加载中...</p></main>
  }
  const r32: { home: Team; away: Team }[] = []
  for (let i = 0; i < 12; i += 2) {
    r32.push({ home: groupWinners[i], away: groupRunnersUp[i + 1] })
    r32.push({ home: groupWinners[i + 1], away: groupRunnersUp[i] })
  }

  function predictWinner(home: Team, away: Team): Team {
    const p = predictMatch(home, away, defaultVenue)
    return p.homeWin >= p.awayWin ? home : away
  }

  const r16 = r32.map(m => m.home && m.away ? predictWinner(m.home, m.away) : m.home || m.away)
  const r16Pairs: { home: Team; away: Team }[] = []
  for (let i = 0; i < r16.length; i += 2) {
    r16Pairs.push({ home: r16[i], away: r16[i + 1] })
  }

  const qf = r16Pairs.map(m => predictWinner(m.home, m.away))
  const qfPairs: { home: Team; away: Team }[] = []
  for (let i = 0; i < qf.length; i += 2) {
    qfPairs.push({ home: qf[i], away: qf[i + 1] })
  }

  const sf = qfPairs.map(m => predictWinner(m.home, m.away))
  const sfPairs: { home: Team; away: Team }[] = [
    { home: sf[0], away: sf[1] },
    { home: sf[2], away: sf[3] },
  ]

  const finalists = sfPairs.map(m => predictWinner(m.home, m.away))
  const champion = predictWinner(finalists[0], finalists[1])

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-5 py-16 sm:py-24">
      <div className="text-center mb-10">
        <div className="kicker kicker-gold mb-2">KNOCKOUT BRACKET</div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">
          淘汰赛<span className="text-gold">晋级树</span>
        </h1>
        <p className="text-sm text-muted mt-2">
          AI 预测 — 小组赛晋级 → 冠军之路
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px] sm:min-w-[800px]">
          {/* Round labels */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {['32 强', '16 强', '1/4 决赛', '半决赛', '决赛'].map((label, i) => (
              <div key={label} className={`text-center text-[8px] sm:text-[9px] tracking-[0.15em] font-bold ${
                i >= 3 ? 'text-gold' : 'text-dim'
              }`}>{label}</div>
            ))}
          </div>

          {/* Bracket body */}
          <div className="grid grid-cols-5 gap-2 text-[9px] sm:text-[10px]">
            {/* R32 */}
            <div className="flex flex-col gap-1">
              {r32.map((m, i) => (
                <div key={i} className={`${i % 2 === 0 && i > 0 ? 'mt-2' : ''}`}>
                  <div className={`rounded-md px-2 py-1.5 flex justify-between items-center border ${
                    i % 2 === 0 ? 'bg-white/[0.02] border-white/5' : 'bg-white/[0.02] border-white/5'
                  }`}>
                    <span>{m.home.flagUrl} <span className="font-bold text-chalk text-[8px] sm:text-[9px]">{m.home.nameCn.slice(0, 4)}</span></span>
                    <span className="text-grass-pop font-mono font-bold text-[8px]">{Math.round(predictMatch(m.home, m.away, defaultVenue).homeWin * 100)}%</span>
                  </div>
                  <div className="rounded-md px-2 py-1.5 flex justify-between items-center mt-0.5 border bg-white/[0.02] border-white/5">
                    <span>{m.away.flagUrl} <span className="font-bold text-chalk text-[8px] sm:text-[9px]">{m.away.nameCn.slice(0, 4)}</span></span>
                    <span className="text-gold font-mono font-bold text-[8px]">{Math.round(predictMatch(m.home, m.away, defaultVenue).awayWin * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* R16 */}
            <div className="flex flex-col gap-1">
              {r16Pairs.map((m, i) => (
                <div key={i} className="mt-[8px]">
                  <div className="rounded-md px-2 py-1.5 flex justify-between items-center border bg-grass-pop/5 border-grass-pop/10">
                    <span>{m.home.flagUrl} <span className="font-bold text-chalk text-[8px] sm:text-[9px]">{m.home.nameCn.slice(0, 4)}</span></span>
                  </div>
                  <div className="rounded-md px-2 py-1.5 flex justify-between items-center mt-0.5 border bg-white/[0.02] border-white/5">
                    <span>{m.away.flagUrl} <span className="font-bold text-chalk text-[8px] sm:text-[9px]">{m.away.nameCn.slice(0, 4)}</span></span>
                  </div>
                </div>
              ))}
            </div>

            {/* QF */}
            <div className="flex flex-col gap-1">
              {qfPairs.map((m, i) => (
                <div key={i} className="mt-[32px]">
                  <div className="rounded-md px-2 py-1.5 flex justify-between items-center border bg-grass-pop/5 border-grass-pop/10">
                    <span>{m.home.flagUrl} <span className="font-bold text-chalk text-[8px] sm:text-[9px]">{m.home.nameCn.slice(0, 4)}</span></span>
                  </div>
                  <div className="rounded-md px-2 py-1.5 flex justify-between items-center mt-0.5 border bg-white/[0.02] border-white/5">
                    <span>{m.away.flagUrl} <span className="font-bold text-chalk text-[8px] sm:text-[9px]">{m.away.nameCn.slice(0, 4)}</span></span>
                  </div>
                </div>
              ))}
            </div>

            {/* SF */}
            <div className="flex flex-col gap-1">
              {sfPairs.map((m, i) => (
                <div key={i} className="mt-[72px]">
                  <div className="rounded-md px-2 py-1.5 flex justify-between items-center border border-gold/20 bg-gold/5">
                    <span>{m.home.flagUrl} <span className="font-bold text-chalk text-[8px] sm:text-[9px]">{m.home.nameCn.slice(0, 4)}</span></span>
                  </div>
                  <div className="rounded-md px-2 py-1.5 flex justify-between items-center mt-0.5 border bg-white/[0.02] border-white/5">
                    <span>{m.away.flagUrl} <span className="font-bold text-chalk text-[8px] sm:text-[9px]">{m.away.nameCn.slice(0, 4)}</span></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Final */}
            <div className="flex flex-col justify-center items-center mt-[130px]">
              <div className="rounded-xl border-2 border-gold bg-gold/[0.04] p-3 sm:p-4 text-center w-full">
                <div className="text-xl sm:text-3xl mb-1">🏆</div>
                <div className="font-display text-sm sm:text-lg font-extrabold text-gold">{champion.nameCn}</div>
                <div className="text-[8px] sm:text-[9px] text-dim mt-1">{champion.flagUrl} FIFA #{champion.fifaRank}</div>
              </div>

              <div className="mt-4 p-2 sm:p-3 bg-grass-pop/5 rounded-lg text-center">
                <div className="text-[8px] text-dim">AI 预测冠军</div>
                <div className="font-mono text-xs sm:text-sm font-black text-grass-pop">
                  {Math.round(predictMatch(finalists[0], finalists[1], defaultVenue).homeWin * 100)}% 概率
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-4 sm:p-6 card-glass text-center max-w-lg mx-auto">
        <div className="text-xs text-dim mb-2">📢 免责声明</div>
        <p className="text-[10px] sm:text-xs text-muted leading-relaxed">
          本晋级树基于 AI 模型对小组赛积分和淘汰赛胜负的模拟预测生成，仅供娱乐参考。
          实际比赛结果受多种不可预测因素影响，请勿用于任何形式的赌博活动。
        </p>
      </div>
    </main>
  )
}
