'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { predictMatch } from '@/lib/prediction'
import { analyzeMatch } from '@/lib/analysis'
import type { Team, Venue } from '@/types/worldcup'

gsap.registerPlugin(ScrollTrigger)

function pctStr(v: number): string {
  return `${(v * 100).toFixed(1)}%`
}

function isHome(a: string) {
  return a === 'home'
}
function isAway(a: string) {
  return a === 'away'
}

export default function PredictionCard({ homeTeam, awayTeam, venue }: { homeTeam: Team; awayTeam: Team; venue: Venue }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [userPick, setUserPick] = useState<'home' | 'draw' | 'away' | null>(null)

  const prediction = useMemo(() => predictMatch(homeTeam, awayTeam, venue), [homeTeam, awayTeam, venue])
  const analysis = useMemo(() => analyzeMatch(homeTeam, awayTeam, venue), [homeTeam, awayTeam, venue])

  const wColor = prediction.homeWin > prediction.awayWin ? '#00d4ff' : prediction.awayWin > prediction.homeWin ? '#ff6b35' : '#f0c040'

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pred-bar', {
        width: '0%', duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
      })
      gsap.from('.pred-row', {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.06,
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const handlePredict = (pick: 'home' | 'draw' | 'away') => {
    setUserPick(pick)
    setSubmitted(true)
  }

  return (
    <section className="bg-surface rounded-2xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">智能预测</h3>
        <span className="text-xs text-muted bg-surface-light px-2 py-1 rounded">
          置信度 {(prediction.confidence * 100).toFixed(0)}%
        </span>
      </div>

      <div ref={containerRef}>
        {/* Win probabilities with gauge-style bars */}
        <div className="space-y-4 mb-4">
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">{homeTeam.nameCn} 胜</span>
              <span className="text-sm font-mono text-accent">{pctStr(prediction.homeWin)}</span>
            </div>
            <div className="h-3 bg-surface-light rounded-full overflow-hidden">
              <div className="pred-bar h-full rounded-full" style={{ width: pctStr(prediction.homeWin), backgroundColor: '#00d4ff' }} />
            </div>
          </div>
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">平局</span>
              <span className="text-sm font-mono text-muted">{pctStr(prediction.draw)}</span>
            </div>
            <div className="h-3 bg-surface-light rounded-full overflow-hidden">
              <div className="pred-bar h-full rounded-full" style={{ width: pctStr(prediction.draw), backgroundColor: '#64748b' }} />
            </div>
          </div>
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">{awayTeam.nameCn} 胜</span>
              <span className="text-sm font-mono text-cta">{pctStr(prediction.awayWin)}</span>
            </div>
            <div className="h-3 bg-surface-light rounded-full overflow-hidden">
              <div className="pred-bar h-full rounded-full" style={{ width: pctStr(prediction.awayWin), backgroundColor: '#ff6b35' }} />
            </div>
          </div>
        </div>

        {/* Score prediction */}
        <div className="pred-row bg-surface-light/50 rounded-xl p-4 mb-4 text-center">
          <p className="text-xs text-muted mb-2">预期比分</p>
          <p className="text-2xl font-black font-mono" style={{ color: wColor }}>
            {analysis.scorePrediction.home} - {analysis.scorePrediction.away}
          </p>
        </div>

        {/* Quick factor chips */}
        <div className="pred-row flex flex-wrap gap-2 mb-4">
          {prediction.factors.map(f => (
            <span key={f.name}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: isHome(f.advantage) ? 'rgba(0,212,255,.15)' : isAway(f.advantage) ? 'rgba(255,107,53,.15)' : 'rgba(100,116,139,.15)',
                color: isHome(f.advantage) ? '#00d4ff' : isAway(f.advantage) ? '#ff6b35' : '#8892b0',
              }}
            >
              {isHome(f.advantage) ? '↑' : isAway(f.advantage) ? '↓' : '='} {f.name}
            </span>
          ))}
        </div>

                {/* Expand button */}
        <div className="pred-row mb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2.5 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-sm font-semibold transition-colors border border-accent/20"
          >
            {expanded ? '收起详细分析 ▲' : '📊 展开详细分析（11维度 + 比分预测） ▼'}
          </button>
        </div>

        {/* Detailed analysis (expandable) */}
        {expanded && (
          <div className="border-t border-white/5 pt-4 mb-4 space-y-5">
            {/* Overview */}
            <div className="bg-accent/5 border border-accent/10 rounded-xl p-4">
              <p className="text-xs text-accent mb-2 font-semibold">📋 综合评估</p>
              <p className="text-sm leading-relaxed">{analysis.overview}</p>
            </div>

            {/* Score Prediction Card */}
            <div className="bg-gradient-to-r from-accent/10 to-cta/10 border border-accent/20 rounded-xl p-4">
              <p className="text-xs text-accent mb-2 font-semibold">🎯 比分预测</p>
              <div className="flex items-center justify-center gap-6 mb-3">
                <span className="text-xl font-bold">{homeTeam.nameCn}</span>
                <span className="text-3xl font-black font-mono text-accent text-glow">{analysis.predictedScoreline}</span>
                <span className="text-xl font-bold">{awayTeam.nameCn}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{analysis.scoreReasoning}</p>
            </div>

            {/* Upset alert */}
            {analysis.upsetAlert && (
              <div className="bg-cta/10 border border-cta/20 rounded-xl p-4">
                <p className="text-sm font-semibold text-cta">{analysis.upsetAlert}</p>
              </div>
            )}

            {/* Analysis points with score badges */}
            <div className="space-y-4">
              <p className="text-xs text-muted font-semibold tracking-wide">📊 11维度详细分析</p>
              {analysis.points.map((pt, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-lg mt-0.5">{pt.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{pt.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold"
                      style={{
                        background: pt.score >= 7 ? 'rgba(255,107,53,.2)' : pt.score >= 4 ? 'rgba(240,192,64,.15)' : 'rgba(100,116,139,.15)',
                        color: pt.score >= 7 ? '#ff6b35' : pt.score >= 4 ? '#f0c040' : '#8892b0',
                      }}
                    >{pt.score}/10</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{pt.detail}</p>
                </div>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{
                    background: isHome(pt.advantage) ? 'rgba(0,212,255,.15)' : isAway(pt.advantage) ? 'rgba(255,107,53,.15)' : 'rgba(100,116,139,.15)',
                    color: isHome(pt.advantage) ? '#00d4ff' : isAway(pt.advantage) ? '#ff6b35' : '#8892b0',
                  }}
                >
                  {isHome(pt.advantage) ? '↑ ' + homeTeam.nameCn : isAway(pt.advantage) ? '↑ ' + awayTeam.nameCn : '均等'}
                </span>
              </div>
              ))}
            </div>

            {/* Tactical note */}
            <div className="bg-surface-light/30 rounded-xl p-4">
              <p className="text-xs text-muted mb-1 font-semibold">🎯 战术建议</p>
              <p className="text-sm leading-relaxed">{analysis.tacticalNote}</p>
            </div>
          </div>
        )}

        {/* User prediction buttons */}
        {!submitted ? (
          <div className="pred-row flex gap-2">
            <button
              onClick={() => handlePredict('home')}
              className="flex-1 py-3 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent font-semibold text-sm transition-colors border border-accent/20"
            >
              {homeTeam.nameCn} 胜
            </button>
            <button
              onClick={() => handlePredict('draw')}
              className="flex-1 py-3 rounded-xl bg-muted/10 hover:bg-muted/20 text-muted font-semibold text-sm transition-colors border border-white/10"
            >
              平局
            </button>
            <button
              onClick={() => handlePredict('away')}
              className="flex-1 py-3 rounded-xl bg-cta/10 hover:bg-cta/20 text-cta font-semibold text-sm transition-colors border border-cta/20"
            >
              {awayTeam.nameCn} 胜
            </button>
          </div>
        ) : (
          <div className="pred-row text-center bg-accent/5 rounded-xl p-4 border border-accent/10">
            <p className="text-sm text-accent font-medium">
              ✓ 你预测了 {userPick === 'home' ? homeTeam.nameCn + ' 胜' : userPick === 'draw' ? '平局' : awayTeam.nameCn + ' 胜'}
            </p>
            <p className="text-xs text-muted mt-1">预测已记录，赛后将公布准确率统计</p>
          </div>
        )}
      </div>
    </section>
  )
}
