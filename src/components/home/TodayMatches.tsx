'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { getTodayMatches, getTeamById, getVenueById } from '@/lib/data'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'

gsap.registerPlugin(ScrollTrigger)

export default function TodayMatches() {
  const ref = useRef<HTMLElement>(null)
  const matches = getTodayMatches()

  useEffect(() => {
    if (!matches.length) return
    const ctx = gsap.context(() => {
      gsap.from('.match-item', {
        y: 60, opacity: 0, scale: 0.95,
        duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.match-grid', start: 'top bottom-=50' },
      })
    }, ref)
    return () => ctx.revert()
  }, [matches.length])

  return (
    <section ref={ref} id="today" className="py-28 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded-lg bg-emerald/15 flex items-center justify-center text-emerald text-xs">●</span>
            <span className="text-xs text-tertiary tracking-[0.2em] uppercase font-semibold">Today&apos;s Fixtures</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-[-0.02em] text-primary">
            今日<span className="text-gradient">焦点</span>
          </h2>
          <div className="accent-line mt-4" />
        </div>

        {matches.length === 0 ? (
          <div className="glass-card text-center py-20">
            <span className="text-7xl block mb-6 opacity-20">⚽</span>
            <p className="text-lg text-secondary font-semibold">今日无比赛安排</p>
            <p className="text-sm text-tertiary mt-2">请关注后续赛程，精彩即将上演</p>
          </div>
        ) : (
          <div className="match-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => {
              const home = getTeamById(match.homeTeamId)
              const away = getTeamById(match.awayTeamId)
              const venue = getVenueById(match.venueId)
              if (!home || !away || !venue) return null

              return (
                <Link key={match.id} href={`/matches/${match.id}`}
                  className="match-item glass-card overflow-hidden block group no-underline"
                >
                  {/* Top metadata bar */}
                  <div className="flex items-center justify-between px-5 py-3 bg-raised/50 border-b border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-tertiary">{toBeijingDate(match.date).slice(5)}</span>
                      <span className="font-number text-sm text-accent font-bold">{toBeijingTime(match.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {match.stage !== 'group' && (
                        <span className="text-[9px] bg-purple/10 text-purple px-2 py-0.5 rounded-full font-bold">{STAGE_LABELS[match.stage]}</span>
                      )}
                      <span className="text-xs text-tertiary">{venue.city}</span>
                    </div>
                  </div>

                  {/* Teams face-off */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      {/* Home */}
                      <div className="flex flex-col items-center gap-2.5 flex-1 min-w-0">
                        <span className="flag-premium text-4xl group-hover:scale-110 transition-transform duration-300">{home.flagUrl}</span>
                        <span className="text-sm font-bold text-primary truncate w-full text-center">{home.nameCn}</span>
                        <span className="num-badge text-[10px]">#{home.fifaRank}</span>
                      </div>

                      {/* VS / Score */}
                      <div className="flex-shrink-0 text-center">
                        {match.status === 'finished' ? (
                          <span className="font-number text-3xl font-black text-gradient text-glow">{match.homeScore}-{match.awayScore}</span>
                        ) : match.status === 'live' ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-number text-3xl font-black text-passion glow-text-cta">{match.homeScore}-{match.awayScore}</span>
                            <span className="text-[9px] bg-passion/15 text-passion px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xl font-black text-secondary/20">VS</span>
                            <p className="text-[8px] text-tertiary mt-1 group-hover:text-accent transition-colors">预测 →</p>
                          </div>
                        )}
                      </div>

                      {/* Away */}
                      <div className="flex flex-col items-center gap-2.5 flex-1 min-w-0">
                        <span className="flag-premium text-4xl group-hover:scale-110 transition-transform duration-300">{away.flagUrl}</span>
                        <span className="text-sm font-bold text-primary truncate w-full text-center">{away.nameCn}</span>
                        <span className="num-badge text-[10px]">#{away.fifaRank}</span>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="mt-5 pt-4 border-t border-subtle flex items-center justify-center gap-2 text-[10px] text-tertiary">
                      <span>📍</span>
                      <span>{venue.name}</span>
                      <span className="w-1 h-1 rounded-full bg-tertiary/20" />
                      <span className="font-semibold text-secondary">{(venue.capacity/1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
