'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPredictions, deletePrediction, type SavedPrediction } from '@/lib/storage'
import { getAllMatches } from '@/lib/data'

export default function MyPredictions() {
  const [predictions, setPredictions] = useState<SavedPrediction[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setPredictions(getPredictions())
    setLoaded(true)
  }, [])

  const handleDelete = (matchId: string) => {
    setPredictions(deletePrediction(matchId))
  }

  if (!loaded) return null

  if (predictions.length === 0) {
    return (
      <section className="py-24 px-5 text-center">
        <div className="max-w-md mx-auto">
          <span className="text-6xl block mb-6 opacity-15">🔮</span>
          <h3 className="font-display text-2xl font-extrabold text-chalk mb-3">你还没预测过</h3>
          <p className="text-sm text-muted mb-6">去比赛页面预测比分，结果会显示在这里</p>
          <Link href="/matches" className="btn-primary">
            📅 去看看比赛
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-5 max-w-3xl mx-auto">
      <div className="flex items-end gap-3 mb-10">
        <div className="w-1 h-7 rounded-full bg-gold" />
        <div>
          <div className="kicker kicker-gold mb-1">MY PREDICTIONS</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">
            我的<span className="text-gold">预测</span>
          </h2>
        </div>
        <span className="text-sm text-muted ml-auto">{predictions.length} 场</span>
      </div>

      <div className="space-y-3">
        {predictions.map(p => {
          const allMatches = getAllMatches()
          const match = allMatches.find(m => m.id === p.matchId)
          const isFinished = match?.status === 'finished'

          return (
            <div key={p.matchId}
              className="bg-[#0d220d] border border-white/10 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted mb-1">
                  {match && <span>{match.groupId} 组 · {isFinished ? '已结束' : '未开赛'}</span>}
                </div>
                <div className="text-sm font-bold text-chalk">
                  {p.homeTeamName} vs {p.awayTeamName}
                </div>
              </div>

              <div className="font-mono font-bold text-grass-pop">
                {p.predictedHomeScore}-{p.predictedAwayScore}
              </div>

              {isFinished && match?.homeScore !== undefined && (
                <div className="text-xs text-center">
                  <div className="text-dim text-[9px]">实际</div>
                  <div className={`font-mono font-bold text-xs ${
                    match.homeScore === p.predictedHomeScore && match.awayScore === p.predictedAwayScore
                      ? 'text-grass-pop' : 'text-gold'
                  }`}>
                    {match.homeScore}-{match.awayScore}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleDelete(p.matchId)}
                className="text-muted hover:text-danger text-sm px-2"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
