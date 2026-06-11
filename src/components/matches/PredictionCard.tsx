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
        {/* Win probabilities */}
        <div className="space-y-3 mb-4">
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{homeTeam.nameCn} 胜</span>
              <span className="text-sm font-mono text-accent">{pctStr(prediction.homeWin)}</span>
            </div>
            <div className="h-2.5 bg-surface-light rounded-full overflow-hidden">
              <div className="pred-bar h-full rounded-full" style={{ width: pctStr(prediction.homeWin), backgroundColor: '#00d4ff' }} />
            </div>
          </div>
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">平局</span>
              <span className="text-sm font-mono text-muted">{pctStr(prediction.draw)}</span>
            </div>
            <div className="h-2.5 bg-surface-light rounded-full overflow-hidden">
              <div className="pred-bar h-full rounded-full" style={{ width: pctStr(prediction.draw), backgroundColor: '#64748b' }} />
            </div>
          </div>
          <div className="pred-row">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{awayTeam.nameCn} 胜</span>
              <span className="text-sm font-mono text-cta">{pctStr(prediction.awayWin)}</span>
            </div>
            <div className="h-2.5 bg-surface-light rounded-full overflow-hidden">
              <div className="pred-bar h-full rounded-full" style={{ width: pctStr(prediction.awayWin), backgroundColor: '#ff6b35' }} />
            </div>
          </div>
        </div>

        {/* Score + key factors (compact row) */}
        <div className="pred-row grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface-light/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted mb-1">预期比分</p>
            <p className="text-xl font-black font-mono" style={{ color: wColor }}>
              {analysis.predictedScoreline}
            </p>
          </div>
          <div className="bg-surface-light/50 rounded-xl p-3 flex flex-wrap items-center justify-center gap-1.5">
            {analysis.points.slice(0, 6).map(pt => {
              const sc = advColor(pt.advantage)
              return (
                <span key={pt.title} className="text-[11px] px-2 py-0.5 rounded-md font-medium"
                  style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                  {pt.icon} {pt.title}
                </span>
              )
            })}
          </div>
        </div>

        {/* Expand button */}
        <div className="pred-row mb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2.5 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-sm font-semibold transition-colors border border-accent/20"
          >
            {expanded ? '收起分析 ▲' : '📊 展开多维分析 ▼'}
          </button>
        </div>

        {/* EXPANDED SECTION */}
        {expanded && (
          <div className="border-t border-white/5 pt-4 space-y-4">
            {/* 11-dimension one-liner cards */}
            <div className="space-y-2">
              {analysis.points.map((pt) => {
                const sc = advColor(pt.advantage)
                const sb = scoreBadge(pt.score)
                const side = pt.advantage === 'home' ? homeTeam.nameCn : pt.advantage === 'away' ? awayTeam.nameCn : '-'
                return (
                  <div key={pt.title} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                    style={{ background: sc.bg, borderColor: sc.border }}>
                    <span className="text-base flex-shrink-0">{pt.icon}</span>
                    <span className="text-xs font-semibold flex-shrink-0 w-16" style={{ color: sc.text }}>{pt.title}</span>
                    <span className="flex-1 text-xs text-muted truncate" title={pt.detail}>{pt.detail}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: sb.bg, color: sb.text }}>{pt.score}/10</span>
                    <span className="text-[10px] font-medium flex-shrink-0 w-14 text-right" style={{ color: sc.text }}>
                      ↑ {side}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Score reasoning */}
            <div className="bg-gradient-to-r from-accent/10 to-cta/10 border border-accent/20 rounded-xl p-4">
              <p className="text-xs text-accent mb-1 font-semibold">🎯 比分预测</p>
              <div className="flex items-center justify-center gap-5 mb-3">
                <span className="text-lg font-bold">{homeTeam.nameCn}</span>
                <span className="text-2xl font-black font-mono text-accent text-glow">{analysis.predictedScoreline}</span>
                <span className="text-lg font-bold">{awayTeam.nameCn}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{analysis.scoreReasoning}</p>
            </div>

            {/* Upset alert */}
            {analysis.upsetAlert && (
              <div className="bg-cta/10 border border-cta/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-cta">{analysis.upsetAlert}</p>
              </div>
            )}

            {/* FINAL CONCLUSION */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <p className="text-xs text-accent mb-2 font-semibold">📋 最终结论</p>
              <p className="text-sm leading-relaxed">{conclusion}</p>
            </div>
          </div>
        )}

        {/* User prediction buttons */}
        {!submitted ? (
          <div className="pred-row flex gap-2">
            <button onClick={() => handlePredict('home')}
              className="flex-1 py-3 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent font-semibold text-sm transition-colors border border-accent/20">
              {homeTeam.nameCn} 胜
            </button>
            <button onClick={() => handlePredict('draw')}
              className="flex-1 py-3 rounded-xl bg-muted/10 hover:bg-muted/20 text-muted font-semibold text-sm transition-colors border border-white/10">
              平局
            </button>
            <button onClick={() => handlePredict('away')}
              className="flex-1 py-3 rounded-xl bg-cta/10 hover:bg-cta/20 text-cta font-semibold text-sm transition-colors border border-cta/20">
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
