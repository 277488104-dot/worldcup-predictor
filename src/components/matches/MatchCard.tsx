'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { getTeamById, getVenueById } from '@/lib/data'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import type { Match } from '@/types/worldcup'

interface MatchCardProps {
  match: Match
  index: number
}

export default function MatchCard({ match, index }: MatchCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const home = getTeamById(match.homeTeamId)
  const away = getTeamById(match.awayTeamId)
  const venue = getVenueById(match.venueId)
  if (!home || !away || !venue) return null

  useEffect(() => {
    gsap.from(ref.current, {
      y: 30, opacity: 0, scale: 0.97,
      duration: 0.4, delay: index * 0.05, ease: 'power2.out',
    })
  }, [index])

  return (
    <div ref={ref}>
      <Link href={`/matches/${match.id}`} className="card-glass p-5 block no-underline group">
        <div className="flex items-center justify-between mb-4 text-[10px]">
          <span className="text-dim">{toBeijingDate(match.date)}</span>
          <span className="font-mono font-bold text-grass-pop">{toBeijingTime(match.date)}</span>
          <span className="badge badge-stage">{STAGE_LABELS[match.stage]}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className="text-3xl group-hover:scale-110 transition-transform">{home.flagUrl}</span>
            <span className="text-xs font-bold text-chalk truncate w-full text-center">{home.nameCn}</span>
          </div>
          <div className="flex-shrink-0 text-center px-3">
            {match.status === 'finished' ? (
              <span className="font-mono text-2xl font-black text-grass-pop">{match.homeScore}-{match.awayScore}</span>
            ) : match.status === 'live' ? (
              <span className="font-mono text-2xl font-black text-danger">{match.homeScore}-{match.awayScore}</span>
            ) : (
              <span className="text-lg font-black text-muted/20">VS</span>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className="text-3xl group-hover:scale-110 transition-transform">{away.flagUrl}</span>
            <span className="text-xs font-bold text-chalk truncate w-full text-center">{away.nameCn}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-dim text-center">
          📍 {venue.city} · {venue.name}
        </div>
      </Link>
    </div>
  )
}
