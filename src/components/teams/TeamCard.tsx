'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import type { Team } from '@/types/worldcup'
import { CONFEDERATION_COLORS, STAT_LABELS } from '@/lib/constants'

function statColor(v: number): string {
  if (v >= 80) return '#00d4ff'
  if (v >= 60) return '#22c55e'
  if (v >= 40) return '#eab308'
  return '#ef4444'
}

export default function TeamCard({ team }: { team: Team }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)
  const confColor = CONFEDERATION_COLORS[team.confederation] || '#888'

  useEffect(() => {
    ctxRef.current = gsap.context(() => {}, cardRef)
    return () => ctxRef.current?.revert()
  }, [])

  const flipIn = useCallback(() => {
    ctxRef.current?.add(() => gsap.to(cardRef.current, { rotateY: 180, duration: .55, ease: 'power2.inOut' }))
  }, [])
  const flipOut = useCallback(() => {
    ctxRef.current?.add(() => gsap.to(cardRef.current, { rotateY: 0, duration: .55, ease: 'power2.inOut' }))
  }, [])

  return (
    <Link href={`/teams/${team.id}`} className="block" style={{ perspective: '800px' }}
      onMouseEnter={flipIn} onMouseLeave={flipOut}>
      <div ref={cardRef} className="relative h-72 w-full" style={{ transformStyle: 'preserve-3d' }}>
        {/* FRONT */}
        <div className="absolute inset-0 card flex flex-col items-center justify-center gap-3 overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${confColor}, transparent)` }} />
          <span className="flag-display text-5xl">{team.flagUrl}</span>
          <div className="text-center px-3">
            <h3 className="text-base font-bold text-text-primary">{team.nameCn}</h3>
            <p className="text-xs text-muted mt-0.5">{team.name}</p>
          </div>
          <span className="text-[10px] text-muted bg-white/5 px-3 py-1 rounded-full font-semibold">FIFA #{team.fifaRank}</span>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 card flex flex-col justify-center gap-1.5 px-4 py-5 overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${confColor}, transparent)` }} />
          <h3 className="text-xs font-bold text-center mb-1 text-text-secondary">
            {team.nameCn} <span className="font-mono" style={{ color: confColor }}>#{team.fifaRank}</span>
          </h3>
          {(Object.keys(team.stats) as (keyof typeof team.stats)[]).map(key => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-muted w-12 text-right">{STAT_LABELS[key]}</span>
              <div className="flex-1 stat-bar">
                <div className="stat-bar-fill" style={{ width: `${team.stats[key]}%`, background: `linear-gradient(90deg, ${statColor(team.stats[key])}, ${statColor(team.stats[key])}88)` }} />
              </div>
              <span className="text-[10px] text-muted w-5 text-right font-mono">{team.stats[key]}</span>
            </div>
          ))}
          <p className="text-center text-[10px] text-muted/50 mt-2">{team.coach}</p>
        </div>
      </div>
    </Link>
  )
}
