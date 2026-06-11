import type { ScorePrediction } from '@/lib/prediction'

interface ScorePredictionsProps {
  scores: ScorePrediction[]
}

export default function ScorePredictions({ scores }: ScorePredictionsProps) {
  return (
    <div className="space-y-2">
      <div className="kicker kicker-gold mb-4">LIKELY SCORELINES</div>
      <div className="grid grid-cols-3 gap-2">
        {scores.map((s, i) => (
          <div
            key={i}
            className={`relative rounded-xl p-3 text-center border transition-all ${
              i === 0
                ? 'bg-grass-pop/10 border-grass-pop/30'
                : 'bg-white/[0.02] border-white/5'
            }`}
          >
            {i === 0 && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] bg-grass-pop text-pitch px-2 py-0.5 rounded-full font-bold">
                MOST LIKELY
              </span>
            )}
            <div className="font-mono text-xl font-black text-chalk mt-1">
              {s.homeScore}
              <span className="text-muted mx-0.5">-</span>
              {s.awayScore}
            </div>
            <div className="text-[10px] text-dim mt-1 font-medium">
              {Math.round(s.probability * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
