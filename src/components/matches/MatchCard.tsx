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

  useEffect(() => {
    if (!ref.current) return
    gsap.from(ref.current, {
      y: 30, opacity: 0, scale: 0.97,
      duration: 0.4, delay: index * 0.05, ease: 'power2.out',
    })
  }, [index])

  if (!home || !away || !venue) return null

  return (
    <div ref={ref}>
      <Link href={`/matches/${match.id}`} className="card-glass p-5 block no-underline group hover:border-grass-pop/30 transition-all">
        {/* Top row: date + time + stage */}
        <div className="flex items-center justify-between mb-4 text-[11px]">
          <span className="text-muted font-medium">{toBeijingDate(match.date)}</span>
          <span className="font-mono font-bold text-grass-pop">{toBeijingTime(match.date)}</span>
          <span className="badge badge-stage">{STAGE_LABELS[match.stage]}</span>
        </div>

        {/* Teams face-off */}
        <div className="flex items-center justify-between gap-3">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <span className="text-4xl group-hover:scale-110 transition-transform">{home.flagUrl}</span>
            <span className="text-sm font-bold text-chalk truncate w-full text-center">{home.nameCn}</span>
            <span className="text-[10px] text-muted font-semibold">#{home.fifaRank}</span>
          </div>

          {/* VS / Score */}
          <div className="flex-shrink-0 text-center px-4">
            {match.status === 'finished' ? (
              <span className="font-mono text-3xl font-black text-grass-pop">{match.homeScore}-{match.awayScore}</span>
            ) : match.status === 'live' ? (
              <span className="font-mono text-3xl font-black text-danger">{match.homeScore}-{match.awayScore}</span>
            ) : (
              <span className="text-2xl font-black text-muted">VS</span>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <span className="text-4xl group-hover:scale-110 transition-transform">{away.flagUrl}</span>
            <span className="text-sm font-bold text-chalk truncate w-full text-center">{away.nameCn}</span>
            <span className="text-[10px] text-muted font-semibold">#{away.fifaRank}</span>
          </div>
        </div>

        {/* Venue footer */}
        <div className="mt-5 pt-3 border-t border-white/15 text-[11px] text-chalk/70 text-center font-medium">
          📍 {venue.city} · {venue.name}
        </div>
      </Link>
    </div>
  )
}
