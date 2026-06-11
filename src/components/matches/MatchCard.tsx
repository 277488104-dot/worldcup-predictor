'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Match } from '@/types/worldcup'
import { getTeamById, getVenueById } from '@/lib/data'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'

gsap.registerPlugin(ScrollTrigger)

export default function MatchCard({ match, index }: { match: Match; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const home = getTeamById(match.homeTeamId)
  const away = getTeamById(match.awayTeamId)
  const venue = getVenueById(match.venueId)

  useEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 40, opacity: 0, duration: 0.5, delay: index * 0.05,
        scrollTrigger: { trigger: cardRef.current, start: 'top 90%' },
      })
    }, cardRef)
    return () => ctx.revert()
  }, [index])

  if (!home || !away || !venue) return null

  return (
    <Link href={`/matches/${match.id}`}>
      <div ref={cardRef} className="bg-surface rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all group">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-muted">{toBeijingDate(match.date)}</span>
            <span className="text-xs text-muted ml-2">{toBeijingTime(match.date)} 北京时间</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded ${match.stage === 'group' ? 'bg-accent/10 text-accent' : 'bg-knockout/10 text-knockout'}`}>
            {STAGE_LABELS[match.stage]}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <span className="text-3xl block mb-1">{home.flagUrl}</span>
            <span className="text-sm font-semibold">{home.nameCn}</span>
          </div>

          <div className="text-center px-4">
            {match.status === 'finished' ? (
              <span className="text-2xl font-bold text-accent font-mono">{match.homeScore}-{match.awayScore}</span>
            ) : (
              <span className="text-lg font-bold text-muted">VS</span>
            )}
          </div>

          <div className="text-center flex-1">
            <span className="text-3xl block mb-1">{away.flagUrl}</span>
            <span className="text-sm font-semibold">{away.nameCn}</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted text-center">
          {venue.name} · {venue.city}
        </div>
      </div>
    </Link>
  )
}
