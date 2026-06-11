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
    gsap.fromTo(ref.current,
      { y: 30, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, delay: index * 0.05, ease: 'power2.out' },
    )
  }, [index])

  if (!home || !away || !venue) return null

  return (
    <div ref={ref} style={{ opacity: 1 }}>
      <Link href={`/matches/${match.id}`}
        className="block no-underline group bg-[#0d220d] border border-white/15 rounded-2xl p-5 hover:border-grass-pop/30 transition-all hover:bg-[#0f280f]">

        {/* Top row */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <span className="text-chalk/90 font-semibold">{toBeijingDate(match.date)}</span>
          <span className="font-mono font-extrabold text-grass-pop">{toBeijingTime(match.date)}</span>
          <span className="badge badge-stage text-[11px]">{STAGE_LABELS[match.stage]}</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <span className="text-[42px] group-hover:scale-110 transition-transform leading-none">{home.flagUrl}</span>
            <span className="text-sm font-extrabold text-chalk truncate w-full text-center">{home.nameCn}</span>
            <span className="text-xs text-chalk/70 font-semibold">#{home.fifaRank}</span>
          </div>

          <div className="flex-shrink-0 text-center px-4">
            {match.status === 'finished' ? (
              <span className="font-mono text-[28px] font-black text-grass-pop">{match.homeScore}-{match.awayScore}</span>
            ) : match.status === 'live' ? (
              <span className="font-mono text-[28px] font-black text-danger">{match.homeScore}-{match.awayScore}</span>
            ) : (
              <span className="text-[22px] font-black text-chalk/40">VS</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <span className="text-[42px] group-hover:scale-110 transition-transform leading-none">{away.flagUrl}</span>
            <span className="text-sm font-extrabold text-chalk truncate w-full text-center">{away.nameCn}</span>
            <span className="text-xs text-chalk/70 font-semibold">#{away.fifaRank}</span>
          </div>
        </div>

        {/* Venue */}
        <div className="mt-5 pt-3 border-t border-white/20 text-xs text-chalk/70 text-center font-semibold">
          📍 {venue.city} · {venue.name}
        </div>
      </Link>
    </div>
  )
}
