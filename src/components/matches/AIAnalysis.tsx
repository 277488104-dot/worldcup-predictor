'use client'

import { useState, useRef, useCallback } from 'react'
import type { Team, Venue, Player } from '@/types/worldcup'

interface AIAnalysisProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  h2hSummary: string
  homePlayers: Player[]
  awayPlayers: Player[]
}

type Status = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export default function AIAnalysis({ homeTeam, awayTeam, venue, h2hSummary, homePlayers, awayPlayers }: AIAnalysisProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [html, setHtml] = useState('')
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const [activeModel, setActiveModel] = useState('')

  const startAnalysis = useCallback(async (endpoint: string, model?: string) => {
    setStatus('loading')
    setHtml('')
    setError('')
    setActiveModel(model || 'deepseek')
    abortRef.current = new AbortController()

    try {
      const body: Record<string, unknown> = { homeTeam, awayTeam, venue, h2hSummary, homePlayers, awayPlayers }
      if (model) body.model = model

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
  }, [homeTeam, awayTeam, venue, h2hSummary, homePlayers, awayPlayers])

  return (
    <div className="card-glass p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🧠</span>
        <div>
          <div className="kicker kicker-gold">DEEPSEEK AI · 6维分析</div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold">
            AI 深度<span className="text-gold">分析</span>
          </h3>
        </div>
        <div className="ml-auto text-[10px] text-dim bg-white/[0.03] rounded-full px-3 py-1">
          球员 · 场地 · 交锋 · 模型
        </div>
      </div>

      {/* ===== IDLE STATE: Multi-model buttons ===== */}
      {status === 'idle' && (
        <div className="py-6 sm:py-8">
          <p className="text-xs sm:text-sm text-dim mb-6 leading-relaxed text-center">
            综合 <strong className="text-chalk">公式预测模型</strong> + <strong className="text-chalk">蒙特卡洛1000次模拟</strong> + <strong className="text-chalk">8因素分析</strong>，由 AI 给出完整分析报告。
          </p>

          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {/* DeepSeek */}
            <button
              onClick={() => startAnalysis('/api/analyze')}
              className="group relative flex flex-col items-center gap-3 p-4 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-grass-pop/20 transition-all duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#4ade80]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">🧠</span>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm font-extrabold text-chalk group-hover:text-grass-pop transition-colors">DeepSeek</div>
                <div className="text-[9px] sm:text-[10px] text-dim mt-0.5">V4 自部署</div>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-grass-pop/0 group-hover:ring-grass-pop/8 transition-all" />
            </button>

            {/* Claude */}
            <button
              onClick={() => startAnalysis('/api/relay-analyze', 'claude')}
              className="group relative flex flex-col items-center gap-3 p-4 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-gold/20 transition-all duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#f0c040]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">🟠</span>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm font-extrabold text-chalk group-hover:text-gold transition-colors">Claude</div>
                <div className="text-[9px] sm:text-[10px] text-dim mt-0.5">Sonnet 4.5</div>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/0 group-hover:ring-gold/8 transition-all" />
            </button>

            {/* GPT */}
            <button
              onClick={() => startAnalysis('/api/relay-analyze', 'gpt')}
              className="group relative flex flex-col items-center gap-3 p-4 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald/20 transition-all duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">⚡</span>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm font-extrabold text-chalk group-hover:text-emerald transition-colors">GPT</div>
                <div className="text-[9px] sm:text-[10px] text-dim mt-0.5">5.5</div>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-emerald/0 group-hover:ring-emerald/8 transition-all" />
            </button>

            {/* Gemini */}
            <button
              onClick={() => startAnalysis('/api/relay-analyze', 'gemini')}
              className="group relative flex flex-col items-center gap-3 p-4 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-400/20 transition-all duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#60a5fa]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">💎</span>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm font-extrabold text-chalk group-hover:text-blue-400 transition-colors">Gemini</div>
                <div className="text-[9px] sm:text-[10px] text-dim mt-0.5">3.1 Pro</div>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-blue-400/0 group-hover:ring-blue-400/8 transition-all" />
            </button>
          </div>

          <p className="text-[9px] sm:text-[10px] text-dim mt-5 text-center">
            点击任一 AI 模型开始流式分析 · 可分别调用看不同结果
          </p>
        </div>
      )}

      {/* Loading: spinner before first byte */}
      {status === 'loading' && (
        <div className="py-10 text-center">
          <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
          <p className="text-xs text-dim">正在连接 {activeModel === 'claude' ? 'Claude' : activeModel === 'gpt' ? 'GPT' : 'DeepSeek'}...</p>
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
            onClick={() => startAnalysis('/api/analyze')}
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
          <button onClick={() => startAnalysis('/api/analyze')} className="text-xs text-grass-pop hover:underline">
            🔄 重试
          </button>
        </div>
      )}
    </div>
  )
}
