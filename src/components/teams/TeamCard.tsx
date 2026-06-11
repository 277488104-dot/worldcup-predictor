'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import type { Team } from '@/types/worldcup'
import { CONFEDERATION_COLORS, STAT_LABELS } from '@/lib/constants'

export default function TeamCard({ team }: { team: Team }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    ctxRef.current = gsap.context(() => {}, cardRef)
    return () => ctxRef.current?.revert()
  }, [])

  const handleMouseEnter = () => {
    ctxRef.current?.add(() => {
      gsap.to(cardRef.current, { rotateY: 180, duration: 0.6, ease: 'power2.inOut' })
    })
  }
  const handleMouseLeave = () => {
    ctxRef.current?.add(() => {
      gsap.to(cardRef.current, { rotateY: 0, duration: 0.6, ease: 'power2.inOut' })
    })
  }

  const confColor = CONFEDERATION_COLORS[team.confederation] || '#888'

  return (
    <Link href={`/teams/${team.id}`} aria-label={`${team.nameCn} (${team.name}) - FIFA #${team.fifaRank}`}>
      <div
        className="relative h-64 cursor-pointer"
        style={{ perspective: '800px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={cardRef} className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {/* Front */}
          <div
            className="absolute inset-0 bg-surface rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-5xl">{team.flagUrl}</span>
            <div className="text-center">
              <h3 className="text-lg font-bold">{team.nameCn}</h3>
              <p className="text-sm text-muted">{team.name}</p>
            </div>
            <span className="text-xs text-muted">FIFA #{team.fifaRank}</span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-surface rounded-2xl border border-white/5 px-4 py-4 flex flex-col justify-center gap-2"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: confColor }}>
              {team.nameCn} · #{team.fifaRank}
            </h3>
            {(Object.keys(team.stats) as (keyof typeof team.stats)[]).map(key => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-muted w-14">{STAT_LABELS[key] || key}</span>
                <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${team.stats[key]}%` }} />
                </div>
                <span className="text-xs text-muted w-6 text-right font-mono">{team.stats[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
