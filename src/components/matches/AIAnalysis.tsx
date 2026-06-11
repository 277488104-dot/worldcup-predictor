'use client'

import { useState, useRef, useCallback } from 'react'
import type { Team, Venue } from '@/types/worldcup'

interface AIAnalysisProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  h2hSummary: string
}

type Status = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export default function AIAnalysis({ homeTeam, awayTeam, venue, h2hSummary }: AIAnalysisProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [html, setHtml] = useState('')
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const startAnalysis = useCallback(async () => {
    setStatus('loading')
    setHtml('')
    setError('')
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeTeam, awayTeam, venue, h2hSummary }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        setError(err.error || `请求失败 (${res.status})`)
        setStatus('error')
        return
      }

      setStatus('streaming')
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') {
            setStatus('done')
            return
          }
          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              accumulated += parsed.text
              setHtml(accumulated)
            }
          } catch { /* skip */ }
        }
      }

      setStatus('done')
    } catch (err: unknown) {
      const error = err as Error
      if (error.name === 'AbortError') {
        setStatus('idle')
        return
      }
      setError(error.message || '网络错误')
      setStatus('error')
    }
  }, [homeTeam, awayTeam, venue, h2hSummary])

  return (
    <div className="card-glass p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🧠</span>
        <div>
          <div className="kicker kicker-gold">DEEPSEEK AI ANALYSIS</div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold">
            AI 深度<span className="text-gold">分析</span>
          </h3>
        </div>
        <div className="ml-auto text-[10px] text-dim bg-white/[0.03] rounded-full px-3 py-1">
          预测 + 蒙特卡洛 + 结论
        </div>
      </div>

      {/* Idle state: big start button */}
      {status === 'idle' && (
        <div className="py-8 sm:py-12 text-center">
          <p className="text-xs sm:text-sm text-dim mb-6 leading-relaxed max-w-md mx-auto">
            DeepSeek 将综合 <strong className="text-chalk">公式预测模型</strong>、<strong className="text-chalk">蒙特卡洛1000次模拟</strong> 和
            <strong className="text-chalk">8因素分析</strong>，给出完整的 AI 分析报告。
          </p>
          <button
            onClick={startAnalysis}
            className="btn-primary inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-extrabold tracking-wider"
          >
            <span className="text-lg">🚀</span>
            开始 AI 深度分析
          </button>
          <p className="text-[9px] sm:text-[10px] text-dim mt-4">
            预计耗时 5-15 秒 · 流式实时输出
          </p>
        </div>
      )}

      {/* Loading: spinner before first byte */}
      {status === 'loading' && (
        <div className="py-10 text-center">
          <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
          <p className="text-xs text-dim">正在连接 DeepSeek...</p>
        </div>
      )}

      {/* Streaming + Done: show html */}
      {(status === 'streaming' || status === 'done') && (
        <div className="border-l-[3px] border-gold/30 py-3 px-4 sm:px-5 rounded-r-lg bg-white/[0.01]">
          <div
            className="text-xs sm:text-sm leading-relaxed text-dim [&_strong]:text-grass-pop [&_h3]:font-display [&_section]:mb-5 [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {status === 'streaming' && (
            <span className="inline-block w-2 h-4 bg-gold animate-pulse ml-1 align-text-bottom" />
          )}
        </div>
      )}

      {/* Done: status badge + retry button */}
      {status === 'done' && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
          <span className="text-[10px] text-grass-pop font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-grass-pop" />
            分析完成
          </span>
          <button
            onClick={startAnalysis}
            className="text-[10px] text-dim hover:text-chalk transition-colors ml-auto"
          >
            🔄 重新分析
          </button>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="py-8 text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-xs text-danger mb-4">{error}</p>
          <button onClick={startAnalysis} className="text-xs text-grass-pop hover:underline">
            🔄 重试
          </button>
        </div>
      )}
    </div>
  )
}
