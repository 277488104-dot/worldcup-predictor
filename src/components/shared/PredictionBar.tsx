'use client'

interface PredictionBarProps {
  homeWin: number
  draw: number
  awayWin: number
  homeTeam: string
  awayTeam: string
  confidence: number
}

export default function PredictionBar({ homeWin, draw, awayWin, homeTeam, awayTeam, confidence }: PredictionBarProps) {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-chalk font-semibold">{homeTeam} 胜</span>
          <span className="font-mono text-grass-pop font-bold">{Math.round(homeWin * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-green" style={{ width: `${homeWin * 100}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted font-medium">平局</span>
          <span className="font-mono text-muted font-bold">{Math.round(draw * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-muted" style={{ width: `${draw * 100}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-chalk font-semibold">{awayTeam} 胜</span>
          <span className="font-mono text-gold font-bold">{Math.round(awayWin * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-gold" style={{ width: `${awayWin * 100}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 p-3 bg-grass-pop/5 rounded-xl">
        <div className="w-10 h-10 rounded-full border-2 border-grass-pop flex items-center justify-center font-mono text-sm font-black text-grass-pop">
          {Math.round(confidence * 100)}
        </div>
        <div className="text-xs">
          <div className="text-chalk font-semibold">预测置信度</div>
          <div className="text-muted">基于 6 维模型 + 历史交锋 + 场馆</div>
        </div>
      </div>
    </div>
  )
}
