'use client'

import { useState, useCallback, useRef } from 'react'
import type { Team, Venue } from '@/types/worldcup'
import { predictMatch, predictScores } from '@/lib/prediction'

interface PostMatchReviewProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  homeScore: number
  awayScore: number
  matchDetail?: Record<string, unknown> | null
}

export default function PostMatchReview({ homeTeam, awayTeam, venue, homeScore, awayScore, matchDetail }: PostMatchReviewProps) {
  const [aiHtml, setAiHtml] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'streaming' | 'done'>('idle')
  const abortRef = useRef<AbortController | null>(null)

  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const scores = predictScores(homeTeam, awayTeam, venue)

  const realWinner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw'
  const predictedWinner = prediction.homeWin > prediction.awayWin ? 'home' : prediction.awayWin > prediction.homeWin ? 'away' : 'draw'
  const predictionCorrect = realWinner === predictedWinner
  const predictedScore = scores[0]
  const scoreDiffCorrect = Math.abs(
    (homeScore - awayScore) - (predictedScore.homeScore - predictedScore.awayScore)
  )

  const startAIReview = useCallback(async () => {
    setStatus('loading')
    setAiHtml('')
    abortRef.current = new AbortController()
    try {
      const res = await fetch('/api/post-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeTeam, awayTeam, venue, homeScore, awayScore, matchDetail }),
        signal: abortRef.current.signal,
      })
      if (!res.ok) { setStatus('idle'); return }
      setStatus('streaming')
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buf = '', acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop() || ''
        for (const line of lines) {
          if (!line.trim().startsWith('data:')) continue
          const d = line.trim().slice(5).trim()
          if (d === '[DONE]') { setStatus('done'); return }
          try { const p = JSON.parse(d); if (p.text) { acc += p.text; setAiHtml(acc) } } catch {}
        }
      }
      setStatus('done')
    } catch { setStatus('idle') }
  }, [homeTeam, awayTeam, venue, homeScore, awayScore, matchDetail])

  return (
    <div className="rounded-2xl border-2 border-gold/30 bg-gold/[0.03] p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-xl">
          {predictionCorrect && scoreDiffCorrect === 0 ? '🎯' : predictionCorrect ? '✅' : '❌'}
        </div>
        <div>
          <div className="kicker kicker-gold">POST-MATCH REVIEW</div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-chalk">
            赛后<span className="text-gold">复盘</span>
          </h3>
        </div>
      </div>

      {/* Result comparison — always visible */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-6 mb-5">
        <div className={`rounded-xl p-3 sm:p-4 text-center bg-[#0d220d] border ${predictionCorrect ? 'border-grass-pop/20' : 'border-gold/20'}`}>
          <div className="text-[9px] sm:text-[10px] text-dim mb-2">🤖 AI 预测</div>
          <div className="font-mono text-lg sm:text-2xl font-black text-grass-pop">{predictedScore.homeScore}-{predictedScore.awayScore}</div>
          <div className="text-[9px] sm:text-[10px] text-dim mt-2">
            {homeTeam.nameCn} {Math.round(prediction.homeWin * 100)}% · 平 {Math.round(prediction.draw * 100)}% · {awayTeam.nameCn} {Math.round(prediction.awayWin * 100)}%
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className={`text-lg sm:text-2xl font-black ${predictionCorrect ? 'text-grass-pop' : 'text-gold'}`}>{predictionCorrect ? '✓' : '✗'}</span>
        </div>
        <div className={`rounded-xl p-3 sm:p-4 text-center border ${realWinner === predictedWinner ? 'bg-grass-pop/5 border-grass-pop/30' : 'bg-gold/5 border-gold/20'}`}>
          <div className="text-[9px] sm:text-[10px] text-dim mb-2">⚡ 实际比分</div>
          <div className="font-mono text-lg sm:text-2xl font-black text-chalk">{homeScore}-{awayScore}</div>
          <div className="text-[9px] sm:text-[10px] text-dim mt-2">
            {realWinner === 'home' ? `${homeTeam.nameCn} 获胜` : realWinner === 'away' ? `${awayTeam.nameCn} 获胜` : '平局'}
          </div>
        </div>
      </div>

      {/* Quick accuracy */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
        <div className="bg-[#0d220d] rounded-xl p-3 sm:p-4 text-center border border-white/10">
          <div className="text-[9px] sm:text-[10px] text-dim mb-1">胜方预测</div>
          <div className={`text-xs sm:text-sm font-extrabold ${predictionCorrect ? 'text-grass-pop' : 'text-gold'}`}>{predictionCorrect ? '准确 ✓' : '错误 ✗'}</div>
        </div>
        <div className="bg-[#0d220d] rounded-xl p-3 sm:p-4 text-center border border-white/10">
          <div className="text-[9px] sm:text-[10px] text-dim mb-1">比分偏差</div>
          <div className={`text-xs sm:text-sm font-extrabold ${scoreDiffCorrect <= 1 ? 'text-grass-pop' : 'text-gold'}`}>{scoreDiffCorrect === 0 ? '精准命中！' : scoreDiffCorrect <= 1 ? '基本准确' : `差 ${scoreDiffCorrect} 球`}</div>
        </div>
      </div>

      {/* AI Deep Review section */}
      {status === 'idle' && (
        <div className="text-center py-6">
          <button onClick={startAIReview} className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-extrabold">
            <span className="text-lg">🤖</span> 生成 DeepSeek 深度复盘
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div className="text-center py-6">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-dim">DeepSeek 正在分析...</p>
        </div>
      )}

      {(status === 'streaming' || status === 'done') && (
        <div className="border-l-[3px] border-gold/30 py-3 px-4 sm:px-5 rounded-r-lg bg-white/[0.01]">
          <div className="text-xs sm:text-sm leading-relaxed text-dim [&_strong]:text-grass-pop [&_h3]:font-display [&_section]:mb-5 [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: aiHtml }} />
          {status === 'streaming' && <span className="inline-block w-2 h-4 bg-gold animate-pulse ml-1" />}
        </div>
      )}

      {status === 'done' && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
          <span className="text-[10px] text-grass-pop font-bold">✓ DeepSeek 复盘完成</span>
          <button onClick={startAIReview} className="text-[10px] text-dim hover:text-chalk ml-auto">🔄 重新分析</button>
        </div>
      )}
    </div>
  )
}
