'use client'

import { useState } from 'react'
import type { Team, Match } from '@/types/worldcup'
import { savePrediction, getPredictionForMatch } from '@/lib/storage'

interface PredictButtonProps {
  match: Match
  homeTeam: Team
  awayTeam: Team
}

export default function PredictButton({ match, homeTeam, awayTeam }: PredictButtonProps) {
  const existing = typeof window !== 'undefined' ? getPredictionForMatch(match.id) : undefined
  const [predicted, setPredicted] = useState(!!existing)
  const [scores, setScores] = useState(existing ? { h: existing.predictedHomeScore, a: existing.predictedAwayScore } : { h: 1, a: 0 })
  const [showPicker, setShowPicker] = useState(false)

  const handleSave = () => {
    savePrediction({
      matchId: match.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeTeamName: homeTeam.nameCn,
      awayTeamName: awayTeam.nameCn,
      predictedHomeScore: scores.h,
      predictedAwayScore: scores.a,
    })
    setPredicted(true)
    setShowPicker(false)
  }

  if (match.status !== 'scheduled') return null

  return (
    <div className="mt-4">
      {!predicted && !showPicker && (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-grass-pop/20 to-emerald/20 border border-grass-pop/30 text-grass-pop text-sm font-bold hover:bg-grass-pop/30 transition-all"
        >
          🎯 我要预测这场
        </button>
      )}

      {showPicker && (
        <div className="bg-[#0d220d] border border-grass-pop/20 rounded-xl p-4 space-y-3">
          <div className="text-xs text-chalk font-bold text-center">选择你的预测比分</div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-dim">{homeTeam.nameCn}</span>
              <select
                value={scores.h}
                onChange={e => setScores(s => ({ ...s, h: +e.target.value }))}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-lg font-mono font-bold text-grass-pop text-center focus:outline-none focus:border-grass-pop/40"
              >
                {[0,1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n} className="bg-[#0d220d]">{n}</option>
                ))}
              </select>
            </div>
            <span className="text-muted font-bold text-lg">:</span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-dim">{awayTeam.nameCn}</span>
              <select
                value={scores.a}
                onChange={e => setScores(s => ({ ...s, a: +e.target.value }))}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-lg font-mono font-bold text-gold text-center focus:outline-none focus:border-grass-pop/40"
              >
                {[0,1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n} className="bg-[#0d220d]">{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-lg bg-grass-pop text-pitch text-xs font-bold"
            >
              确认预测
            </button>
            <button
              onClick={() => setShowPicker(false)}
              className="px-4 py-2 rounded-lg bg-white/5 text-muted text-xs"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {predicted && (
        <div className="bg-grass-pop/5 border border-grass-pop/10 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-dim">你的预测:</span>
            <span className="font-mono font-bold text-grass-pop">{scores.h}</span>
            <span className="text-muted">-</span>
            <span className="font-mono font-bold text-gold">{scores.a}</span>
            <button
              onClick={() => setShowPicker(true)}
              className="text-[10px] text-muted hover:text-chalk underline ml-2"
            >
              修改
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
