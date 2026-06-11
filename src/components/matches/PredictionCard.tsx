'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { predictMatch } from '@/lib/prediction'
import { analyzeMatch } from '@/lib/analysis'
import type { Team, Venue } from '@/types/worldcup'

gsap.registerPlugin(ScrollTrigger)

function pctStr(v: number): string { return `${(v * 100).toFixed(1)}%` }

function advColor(a: string) {
  if (a === 'home') return { bg: 'rgba(0,212,255,.12)', text: '#00d4ff', border: 'rgba(0,212,255,.2)' }
  if (a === 'away') return { bg: 'rgba(255,107,53,.12)', text: '#ff6b35', border: 'rgba(255,107,53,.2)' }
  return { bg: 'rgba(100,116,139,.08)', text: '#8892b0', border: 'rgba(100,116,139,.15)' }
}
function scoreBadge(s: number) {
  if (s >= 7) return { bg: 'rgba(255,107,53,.18)', text: '#ff6b35' }
  if (s >= 4) return { bg: 'rgba(240,192,64,.15)', text: '#f0c040' }
  return { bg: 'rgba(100,116,139,.12)', text: '#8892b0' }
}

export default function PredictionCard({ homeTeam, awayTeam, venue }: { homeTeam: Team; awayTeam: Team; venue: Venue }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [userPick, setUserPick] = useState<'home' | 'draw' | 'away' | null>(null)

  const prediction = useMemo(() => predictMatch(homeTeam, awayTeam, venue), [homeTeam, awayTeam, venue])
  const analysis = useMemo(() => analyzeMatch(homeTeam, awayTeam, venue), [homeTeam, awayTeam, venue])

  const wColor = prediction.homeWin > prediction.awayWin ? '#00d4ff' : prediction.awayWin > prediction.homeWin ? '#ff6b35' : '#f0c040'

  // Build conclusion
  const totalHome = analysis.points.filter(p => p.advantage === 'home').reduce((s, p) => s + p.score, 0)
  const totalAway = analysis.points.filter(p => p.advantage === 'away').reduce((s, p) => s + p.score, 0)
  const conclusion = totalHome > totalAway + 10
    ? `${homeTeam.nameCn} 在 ${analysis.points.filter(p => p.advantage === 'home').length} 项指标中占优（得分 ${totalHome} vs ${totalAway}），综合实力明显更强。预计将主导比赛节奏，最终取胜概率较大。${awayTeam.nameCn} 需在防守端做到极致，并抓住定位球或反击机会，才可能制造冷门。`
    : totalAway > totalHome + 10
    ? `${awayTeam.nameCn} 在 ${analysis.points.filter(p => p.advantage === 'away').length} 项指标中占优（得分 ${totalAway} vs ${totalHome}），综合实力明显更强。预计将主导比赛节奏，最终取胜概率较大。${homeTeam.nameCn} 需在防守端做到极致，并抓住定位球或反击机会，才可能制造冷门。`
    : `两队各项指标非常接近（${homeTeam.nameCn} ${totalHome} vs ${awayTeam.nameCn} ${totalAway}），这是一场真正的五五开较量。比赛结果很可能由临场发挥、定位球或球星的个人闪光决定。`

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pred-bar', { width: '0%', duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' } })
      gsap.from('.pred-row', { y: 20, opacity: 0, duration: 0.5, stagger: 0.06,
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' } })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-surface rounded-2xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">智能预测</h3>
        <span className="text-xs text-muted bg-surface-light px-2 py-1 rounded">
          置信度 {(prediction.confidence * 100).toFixed(0)}%
        </span>
      </div>

      <div ref={containerRef}>
        {/* Win probabilities */}
        <div className="space-y-3 mb-4">
          {[
            { label: homeTeam.nameCn + ' 胜', pct: prediction.homeWin, color: '#00d4ff' },
            { label: '平局', pct: prediction.draw, color: '#64748b' },
            { label: awayTeam.nameCn + ' 胜', pct: prediction.awayWin, color: '#ff6b35' },
          ].map(b => (
            <div className="pred-row" key={b.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{b.label}</span>
                <span className="text-sm font-mono" style={{ color: b.color }}>{pctStr(b.pct)}</span>
              </div>
              <div className="h-2.5 bg-surface-light rounded-full overflow-hidden">
                <div className="pred-bar h-full rounded-full" style={{ width: pctStr(b.pct), backgroundColor: b.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* 3 Score Predictions */}
        <div className="pred-row grid grid-cols-3 gap-2 mb-4">
          {[
            { score: analysis.predictedScoreline, label: '最大可能', color: wColor },
            { score: analysis.altScoreline2 || `${Math.max(0,Math.round(analysis.scorePrediction.home)-1)}-${Math.round(analysis.scorePrediction.away)+1}`, label: '冷门比分', color: '#ff6b35' },
            { score: `${Math.round(analysis.scorePrediction.home)}-${Math.round(analysis.scorePrediction.away)}`, label: '最常见', color: '#8892b0' },
          ].map((s, i) => (
            <div key={i} className="bg-surface-light/50 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-muted mb-0.5">{s.label}</p>
              <p className="text-lg font-black font-mono" style={{ color: s.color }}>{s.score}</p>
            </div>
          ))}
        </div>

        {/* Key factors chips */}
        <div className="pred-row flex flex-wrap gap-1.5 mb-4">
          {analysis.points.map(pt => {
            const sc = advColor(pt.advantage)
            return (
              <span key={pt.title} className="text-[11px] px-2 py-0.5 rounded-md font-medium"
                style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                {pt.icon}
              </span>
            )
          })}
        </div>

        {/* Expand button */}
        <div className="pred-row mb-4">
          <button onClick={() => setExpanded(!expanded)}
            className="w-full py-2.5 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-sm font-semibold transition-colors border border-accent/20">
            {expanded ? '收起分析 ▲' : '📊 展开11维度分析 ▼'}
          </button>
        </div>

        {/* EXPANDED: Full analysis with NO truncation */}
        {expanded && (
          <div className="border-t border-white/5 pt-4 space-y-4">

            {/* 3 score predictions with detailed explanations */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-center">
                <p className="text-[11px] text-accent font-semibold mb-1">🏆 最大可能</p>
                <p className="text-2xl font-black font-mono text-accent text-glow mb-2">{analysis.predictedScoreline}</p>
                <p className="text-[10px] text-muted leading-relaxed text-left">{analysis.scoreReasoning}</p>
              </div>
              <div className="bg-cta/10 border border-cta/20 rounded-xl p-3 text-center">
                <p className="text-[11px] text-cta font-semibold mb-1">⚠️ 冷门比分</p>
                <p className="text-2xl font-black font-mono text-cta mb-2">{analysis.altScoreline2 || `${Math.max(0,Math.round(analysis.scorePrediction.home)-1)}-${Math.round(analysis.scorePrediction.away)}`}</p>
                <p className="text-[10px] text-muted leading-relaxed text-left">如果 {totalHome > totalAway ? awayTeam.nameCn : homeTeam.nameCn} 在防守端表现出色并抓住反击机会，可能出现此冷门比分。世界杯历史上，实力悬殊的比赛中以弱胜强的案例屡见不鲜。</p>
              </div>
              <div className="bg-surface-light/50 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-[11px] text-muted font-semibold mb-1">⚽ 平局可能</p>
                <p className="text-2xl font-black font-mono text-muted mb-2">1-1</p>
                <p className="text-[10px] text-muted leading-relaxed text-left">如果双方陷入中场绞杀且都未能把握住关键机会，1-1 平局是小组赛最常见的僵持比分。</p>
              </div>
            </div>

            {/* Upset alert */}
            {analysis.upsetAlert && (
              <div className="bg-cta/10 border border-cta/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-cta">{analysis.upsetAlert}</p>
              </div>
            )}

            {/* 11 Analysis Dimensions in FULL DETAIL */}
            <p className="text-xs text-muted font-semibold tracking-wide">📊 11维度详细分析</p>
            <div className="space-y-3">
              {analysis.points.map((pt) => {
                const sc = advColor(pt.advantage)
                const sb = scoreBadge(pt.score)
                const side = pt.advantage === 'home' ? homeTeam.nameCn : pt.advantage === 'away' ? awayTeam.nameCn : '均等'
                return (
                  <div key={pt.title} className="rounded-xl p-4 border" style={{ background: sc.bg, borderColor: sc.border }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{pt.icon}</span>
                      <span className="text-sm font-bold" style={{ color: sc.text }}>{pt.title}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ml-auto" style={{ background: sb.bg, color: sb.text }}>{pt.score}/10</span>
                      <span className="text-[10px] font-medium" style={{ color: sc.text }}>↑ {side}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#cbd5e1' }}>{pt.detail}</p>
                  </div>
                )
              })}
            </div>

            {/* Final conclusion */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <p className="text-xs text-accent mb-2 font-semibold">📋 最终结论</p>
              <p className="text-sm leading-relaxed">{conclusion}</p>
            </div>
          </div>
        )}

        {/* Vote buttons */}
        {!submitted ? (
          <div className="pred-row flex gap-2">
            {[
              { label: homeTeam.nameCn + ' 胜', pick: 'home' as const, cls: 'bg-accent/10 hover:bg-accent/20 text-accent border-accent/20' },
              { label: '平局', pick: 'draw' as const, cls: 'bg-muted/10 hover:bg-muted/20 text-muted border-white/10' },
              { label: awayTeam.nameCn + ' 胜', pick: 'away' as const, cls: 'bg-cta/10 hover:bg-cta/20 text-cta border-cta/20' },
            ].map(b => (
              <button key={b.pick} onClick={() => { setUserPick(b.pick); setSubmitted(true) }}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors border ${b.cls}`}>
                {b.label}
              </button>
            ))}
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
