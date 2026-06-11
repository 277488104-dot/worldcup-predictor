'use client'

import { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { predictMatch } from '@/lib/prediction'
import type { Team, Venue } from '@/types/worldcup'

gsap.registerPlugin(ScrollTrigger)

function pctStr(v: number): string {
  return `${(v * 100).toFixed(1)}%`
}

function probabilityColor(advantage: 'home' | 'away' | 'neutral'): string {
  if (advantage === 'home') return '#00d4ff'
  if (advantage === 'away') return '#ff6b35'
  return '#64748b'
}

export default function PredictionCard({ homeTeam, awayTeam, venue }: { homeTeam: Team; awayTeam: Team; venue: Venue }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prediction = useMemo(() => predictMatch(homeTeam, awayTeam, venue), [homeTeam, awayTeam, venue])

  const winner =
    prediction.homeWin > prediction.awayWin
      ? homeTeam.nameCn
      : prediction.awayWin > prediction.homeWin
        ? awayTeam.nameCn
        : '平局'

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pred-bar', {
        width: '0%', duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
      })
      gsap.from('.pred-row', {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.08,
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-surface rounded-2xl p-6 border border-white/5">
      <h3 className="text-lg font-bold mb-4">智能预测</h3>

      <div ref={containerRef}>
        {/* Winner highlight */}
        <div className="pred-row text-center mb-6">
          <p className="text-xs text-muted mb-1">预测结果</p>
          <p className="text-2xl font-extrabold" style={{ color: prediction.homeWin > prediction.awayWin ? '#00d4ff' : '#ff6b35' }}>
            {winner} 优势
          </p>
          <p className="text-xs text-muted mt-1">
            置信度 {(prediction.confidence * 100).toFixed(0)}%
          </p>
        </div>

        {/* Probability bars */}
        <div className="space-y-3 mb-6">
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted">{homeTeam.nameCn} 胜</span>
              <span className="text-xs font-mono text-accent">{pctStr(prediction.homeWin)}</span>
            </div>
            <div className="h-2 bg-surface-light rounded-full overflow-hidden">
              <div
                className="pred-bar h-full rounded-full"
                style={{ width: pctStr(prediction.homeWin), backgroundColor: '#00d4ff' }}
              />
            </div>
          </div>
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted">平局</span>
              <span className="text-xs font-mono" style={{ color: '#64748b' }}>{pctStr(prediction.draw)}</span>
            </div>
            <div className="h-2 bg-surface-light rounded-full overflow-hidden">
              <div
                className="pred-bar h-full rounded-full"
                style={{ width: pctStr(prediction.draw), backgroundColor: '#64748b' }}
              />
            </div>
          </div>
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted">{awayTeam.nameCn} 胜</span>
              <span className="text-xs font-mono text-cta">{pctStr(prediction.awayWin)}</span>
            </div>
            <div className="h-2 bg-surface-light rounded-full overflow-hidden">
              <div
                className="pred-bar h-full rounded-full"
                style={{ width: pctStr(prediction.awayWin), backgroundColor: '#ff6b35' }}
              />
            </div>
          </div>
        </div>

        {/* Factor breakdown */}
        <div className="space-y-2 mb-6">
          <p className="text-xs text-muted mb-2">关键因素</p>
          {prediction.factors.map((f, i) => (
            <div key={f.name} className="pred-row flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: probabilityColor(f.advantage) }}
                />
                <span className="text-sm">{f.name}</span>
              </div>
              <span className="text-xs text-muted">权重 {(f.weight * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>

        {/* Disabled prediction button */}
        <div className="pred-row">
          <button
            disabled
            className="w-full py-3 rounded-xl bg-accent/10 text-accent/50 font-semibold text-sm cursor-not-allowed"
          >
            预测功能即将上线
          </button>
        </div>
      </div>
    </section>
  )
}
