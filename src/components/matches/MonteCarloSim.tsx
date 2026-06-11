import type { Team, Venue } from '@/types/worldcup'
import { runSimulation } from '@/lib/simulation'
import { predictMatch } from '@/lib/prediction'

interface MonteCarloSimProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
}

export default function MonteCarloSim({ homeTeam, awayTeam, venue }: MonteCarloSimProps) {
  const sim = runSimulation(homeTeam, awayTeam, venue)
  const formula = predictMatch(homeTeam, awayTeam, venue)
  const maxCount = sim.results[0]?.count ?? 1

  return (
    <div className="card-glass p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="kicker kicker-green mb-4">MONTE CARLO SIMULATION</div>
      <h3 className="font-display text-lg sm:text-xl font-extrabold mb-6">
        蒙特卡洛<span className="text-grass-pop">模拟</span>
      </h3>

      {/* Summary cards */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
        <div className="bg-grass-pop/8 border border-grass-pop/15 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center">
          <div className="text-[8px] sm:text-[9px] text-dim tracking-wide mb-1">模拟次数</div>
          <div className="font-mono text-lg sm:text-2xl font-black text-grass-pop">1000</div>
        </div>
        <div className="text-muted text-base sm:text-lg">→</div>
        <div className="bg-grass-pop/10 border border-grass-pop/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center">
          <div className="text-[8px] sm:text-[9px] text-dim tracking-wide mb-1">{homeTeam.nameCn.slice(0, 4)} 胜</div>
          <div className="font-mono text-lg sm:text-2xl font-black text-grass-pop">{sim.homeWins}</div>
          <div className="text-[9px] text-grass-pop font-semibold mt-0.5">{(sim.homeWinRate * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center">
          <div className="text-[8px] sm:text-[9px] text-dim tracking-wide mb-1">平局</div>
          <div className="font-mono text-lg sm:text-2xl font-black text-muted">{sim.draws}</div>
          <div className="text-[9px] text-muted font-semibold mt-0.5">{(sim.drawRate * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center">
          <div className="text-[8px] sm:text-[9px] text-dim tracking-wide mb-1">{awayTeam.nameCn.slice(0, 4)} 胜</div>
          <div className="font-mono text-lg sm:text-2xl font-black text-gold">{sim.awayWins}</div>
          <div className="text-[9px] text-gold font-semibold mt-0.5">{(sim.awayWinRate * 100).toFixed(1)}%</div>
        </div>
      </div>

      {/* Scoreline histogram */}
      <div className="mb-4">
        <div className="text-[9px] sm:text-[10px] text-dim tracking-wide mb-3">
          比分频次分布 (Top {sim.results.length})
        </div>
        <div className="space-y-1.5">
          {sim.results.map(r => (
            <div key={`${r.homeScore}-${r.awayScore}`} className="flex items-center gap-2 sm:gap-3">
              <span className="font-mono text-[10px] sm:text-xs text-chalk w-7 sm:w-8 font-bold">
                {r.homeScore}-{r.awayScore}
              </span>
              <div className="flex-1 h-5 sm:h-6 bg-white/[0.03] rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center justify-end pr-2 transition-all duration-700"
                  style={{
                    width: `${(r.count / maxCount) * 100}%`,
                    background: r.homeScore > r.awayScore
                      ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                      : r.homeScore < r.awayScore
                      ? '#f0c040'
                      : '#889988',
                  }}
                >
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-pitch">{r.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison with formula */}
      <div className="p-3 sm:p-4 bg-grass-pop/5 rounded-xl flex items-start gap-3">
        <span className="text-lg sm:text-xl">🎲</span>
        <div className="text-[10px] sm:text-xs text-dim leading-relaxed">
          <span className="text-grass-pop font-bold">公式预测: {homeTeam.nameCn} {Math.round(formula.homeWin * 100)}% / 平局 {Math.round(formula.draw * 100)}% / {awayTeam.nameCn} {Math.round(formula.awayWin * 100)}%</span>
          <br />
          模拟结果偏差: 胜率差 {Math.abs(sim.homeWinRate - formula.homeWin).toFixed(1)}% 。
          {Math.abs(sim.homeWinRate - formula.homeWin) <= 0.04
            ? '蒙特卡洛模拟与统计公式高度一致，模型可信度很高。'
            : '模拟与公式存在一定偏差，建议综合两种方法判断。'}
        </div>
      </div>
    </div>
  )
}
