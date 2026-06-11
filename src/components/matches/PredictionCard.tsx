import type { Team, Venue } from '@/types/worldcup'
import { predictMatch, predictScores } from '@/lib/prediction'
import PredictionBar from '@/components/shared/PredictionBar'
import ScorePredictions from '@/components/shared/ScorePredictions'

interface PredictionCardProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
}

export default function PredictionCard({ homeTeam, awayTeam, venue }: PredictionCardProps) {
  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const scores = predictScores(homeTeam, awayTeam, venue)

  return (
    <div>
      <PredictionBar
        homeWin={prediction.homeWin}
        draw={prediction.draw}
        awayWin={prediction.awayWin}
        homeTeam={homeTeam.nameCn}
        awayTeam={awayTeam.nameCn}
        confidence={prediction.confidence}
      />

      <div className="mt-6">
        <ScorePredictions scores={scores} />
      </div>

      {/* Expanded factor analysis */}
      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="kicker kicker-green mb-4">FACTOR ANALYSIS</div>
        <div className="space-y-2">
          {prediction.factors.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold w-[90px] text-center ${
                f.advantage === 'home' ? 'bg-grass-pop/10 text-grass-pop' :
                f.advantage === 'away' ? 'bg-gold/10 text-gold' :
                'bg-white/5 text-muted'
              }`}>
                {f.advantage === 'home' ? `← ${homeTeam.nameCn.slice(0, 2)}` :
                 f.advantage === 'away' ? `${awayTeam.nameCn.slice(0, 2)} →` :
                 '⚖️ 均衡'}
              </span>
              <span className="text-xs text-chalk/80 flex-1">{f.name}</span>
              <div className="flex items-center gap-1">
                {f.advantage === 'home' ? (
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className={`w-2 h-2 rounded-full mx-px ${j < Math.round(f.weight * 5) ? 'bg-grass-pop' : 'bg-white/[0.05]'}`} />
                    ))}
                  </div>
                ) : f.advantage === 'away' ? (
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className={`w-2 h-2 rounded-full mx-px ${j < Math.round(f.weight * 5) ? 'bg-gold' : 'bg-white/[0.05]'}`} />
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-muted">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary insight */}
      <div className="mt-5 p-4 bg-grass-pop/5 rounded-xl text-xs leading-relaxed">
        <div className="font-bold text-grass-pop mb-2">📊 AI 分析总结</div>
        <p className="text-chalk/70">
          {prediction.homeWin > prediction.awayWin
            ? `${homeTeam.nameCn} 在综合战力上占优，FIFA 排名和近期状态均处于上风。`
            : prediction.awayWin > prediction.homeWin
            ? `${awayTeam.nameCn} 在综合战力上占优，FIFA 排名和近期状态均处于上风。`
            : '两队实力接近，这场比赛将非常胶着。'}
          {venue.altitude > 1500
            ? ` ${venue.name} 的高海拔（${venue.altitude}m）将成为额外变量，对未适应的球队影响明显。`
            : ''}
          {Math.abs(homeTeam.fifaRank - awayTeam.fifaRank) < 10
            ? ' 排名差距极小，胜负将取决于临场发挥和战术执行。'
            : ''}
        </p>
      </div>
    </div>
  )
}
