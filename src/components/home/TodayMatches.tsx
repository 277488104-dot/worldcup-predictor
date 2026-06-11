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
        y: 50, opacity: 0, scale: 0.95,
        duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.match-grid', start: 'top bottom-=80' },
      })
    }, ref)
    return () => ctx.revert()
  }, [matches.length])

  return (
    <section ref={ref} id="today" className="py-24 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end gap-3 mb-10">
          <div className="w-1 h-7 rounded-full bg-grass-pop" />
          <div className="flex-1">
            <div className="kicker kicker-green mb-1">
              TODAY · {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-chalk">
              今日<span className="text-grass-pop">焦点</span>
            </h2>
          </div>
          <span className="text-xs text-muted">{matches.length} 场比赛</span>
        </div>

        {matches.length === 0 ? (
          <div className="card-glass text-center py-20">
            <span className="text-7xl block mb-6 opacity-20">⚽</span>
            <p className="text-lg text-muted font-semibold">今日无比赛</p>
            <p className="text-xs text-dim mt-2">请关注后续赛程，精彩即将上演</p>
          </div>
        ) : (
          <div className="match-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => {
              const home = getTeamById(match.homeTeamId)
              const away = getTeamById(match.awayTeamId)
              const venue = getVenueById(match.venueId)
              if (!home || !away || !venue) return null

              return (
                <Link key={match.id} href={`/matches/${match.id}`}
                  className="match-item card-glass overflow-hidden block no-underline group"
                >
                  <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/5">
                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <span>{toBeijingDate(match.date).slice(5)}</span>
                      <span className="font-mono font-bold text-grass-pop">{toBeijingTime(match.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px]">
                      {match.stage !== 'group' && (
                        <span className="badge badge-stage">{STAGE_LABELS[match.stage]}</span>
                      )}
                      <span className="text-dim">{venue.city}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{home.flagUrl}</span>
                        <span className="text-sm font-bold text-chalk truncate w-full text-center">{home.nameCn}</span>
                      </div>

                      <div className="flex-shrink-0 text-center">
                        {match.status === 'finished' ? (
                          <span className="font-mono text-3xl font-black text-grass-pop num-glow">
                            {match.homeScore}-{match.awayScore}
                          </span>
                        ) : match.status === 'live' ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-3xl font-black text-danger">
                              {match.homeScore}-{match.awayScore}
                            </span>
                            <span className="badge badge-live animate-pulse">LIVE</span>
                          </div>
                        ) : (
                          <span className="text-xl font-black text-muted/20">VS</span>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{away.flagUrl}</span>
                        <span className="text-sm font-bold text-chalk truncate w-full text-center">{away.nameCn}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-dim">
                      <span>📍 {venue.name}</span>
                      <span className="w-1 h-1 rounded-full bg-dim/20" />
                      <span className="font-semibold text-muted">{(venue.capacity / 1000).toFixed(0)}k</span>
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
