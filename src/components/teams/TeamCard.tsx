'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import type { Team } from '@/types/worldcup'
import { CONFEDERATION_COLORS, STAT_LABELS } from '@/lib/constants'

function statColor(val: number): string {
  if (val >= 80) return '#00d4ff'
  if (val >= 60) return '#22c55e'
  if (val >= 40) return '#eab308'
  if (val >= 20) return '#f97316'
  return '#ef4444'
}

export default function TeamCard({ team }: { team: Team }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    ctxRef.current = gsap.context(() => {}, cardRef)
    return () => ctxRef.current?.revert()
  }, [])

  const confColor = CONFEDERATION_COLORS[team.confederation] || '#888'

  return (
    <Link href={`/teams/${team.id}`} aria-label={`${team.nameCn} (${team.name}) - FIFA #${team.fifaRank}`}>
      <div
        className="relative h-72 cursor-pointer group"
        style={{ perspective: '800px' }}
        onMouseEnter={() => ctxRef.current?.add(() => {
          gsap.to(cardRef.current, { rotateY: 180, duration: 0.6, ease: 'power2.inOut' })
        })}
        onMouseLeave={() => ctxRef.current?.add(() => {
          gsap.to(cardRef.current, { rotateY: 0, duration: 0.6, ease: 'power2.inOut' })
        })}
      >
        <div ref={cardRef} className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {/* ===== FRONT ===== */}
          <div
            className="absolute inset-0 bg-surface rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3 overflow-hidden card-hover"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: confColor }} />
            <span className="flag-display text-5xl">{team.flagUrl}</span>
            <div className="text-center px-2">
              <h3 className="text-base font-bold text-white">{team.nameCn}</h3>
              <p className="text-xs text-muted mt-0.5">{team.name}</p>
            </div>
            <span className="text-[10px] text-muted bg-white/5 px-2 py-0.5 rounded-full">FIFA #{team.fifaRank}</span>
          </div>

          {/* ===== BACK ===== */}
          <div
            className="absolute inset-0 bg-surface rounded-2xl border border-white/5 px-4 py-5 flex flex-col justify-center gap-2"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: confColor }} />
            <h3 className="text-xs font-bold text-center mb-1 text-muted">
              {team.nameCn} <span className="font-mono" style={{ color: confColor }}>#{team.fifaRank}</span>
            </h3>
            {(Object.keys(team.stats) as (keyof typeof team.stats)[]).map(key => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px] text-muted w-12 text-right">{STAT_LABELS[key] || key}</span>
                <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${team.stats[key]}%`, backgroundColor: statColor(team.stats[key]) }}
                  />
                </div>
                <span className="text-[10px] text-muted w-5 text-right font-mono">{team.stats[key]}</span>
              </div>
            ))}
            <div className="text-center mt-2">
              <span className="text-[10px] text-muted/50">{team.coach}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
