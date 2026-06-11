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
  const gridRef = useRef<HTMLDivElement>(null)
  const matches = getTodayMatches()

  useEffect(() => {
    if (!matches.length || !gridRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.match-item',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top bottom-=80',
            once: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [matches.length])

  if (matches.length === 0) {
    return (
      <section className="py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end gap-3 mb-10">
            <div className="w-1 h-7 rounded-full bg-grass-pop" />
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-chalk">
              今日<span className="text-grass-pop">焦点</span>
            </h2>
          </div>
          <div className="card-glass text-center py-20">
            <span className="text-7xl block mb-6 opacity-20">⚽</span>
            <p className="text-lg text-chalk/80 font-semibold">今日无比赛</p>
            <p className="text-sm text-chalk/60 mt-2">请关注后续赛程，精彩即将上演</p>
          </div>
        </div>
      </section>
    )
  }

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
          <span className="text-sm text-chalk/70 font-semibold">{matches.length} 场比赛</span>
        </div>

        <div ref={gridRef} className="match-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches.map(match => {
            const home = getTeamById(match.homeTeamId)
            const away = getTeamById(match.awayTeamId)
            const venue = getVenueById(match.venueId)
            if (!home || !away || !venue) return null

            return (
              <Link key={match.id} href={`/matches/${match.id}`}
                className="match-item block no-underline group bg-[#0d220d] border border-white/15 rounded-2xl overflow-hidden hover:border-grass-pop/30 hover:bg-[#0f280f] transition-all"
                style={{ opacity: 1 }}
              >
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-black/25 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs text-chalk/80 font-semibold">
                    <span>{toBeijingDate(match.date).slice(5)}</span>
                    <span className="font-mono font-extrabold text-grass-pop">{toBeijingTime(match.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    {match.stage !== 'group' && (
                      <span className="badge badge-stage">{STAGE_LABELS[match.stage]}</span>
                    )}
                    <span className="text-chalk/60 font-medium">{venue.city}</span>
                  </div>
                </div>

                {/* Teams */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <span className="text-[42px] group-hover:scale-110 transition-transform leading-none">{home.flagUrl}</span>
                      <span className="text-sm font-extrabold text-chalk truncate w-full text-center">{home.nameCn}</span>
                    </div>

                    <div className="flex-shrink-0 text-center">
                      {match.status === 'finished' ? (
                        <span className="font-mono text-[28px] font-black text-grass-pop num-glow">
                          {match.homeScore}-{match.awayScore}
                        </span>
                      ) : match.status === 'live' ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-mono text-[28px] font-black text-danger">
                            {match.homeScore}-{match.awayScore}
                          </span>
                          <span className="badge badge-live">LIVE</span>
                        </div>
                      ) : (
                        <span className="text-[22px] font-black text-chalk/40">VS</span>
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <span className="text-[42px] group-hover:scale-110 transition-transform leading-none">{away.flagUrl}</span>
                      <span className="text-sm font-extrabold text-chalk truncate w-full text-center">{away.nameCn}</span>
                    </div>
                  </div>

                  {/* Venue footer */}
                  <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-center gap-2 text-xs text-chalk/70 font-semibold">
                    <span>📍 {venue.name}</span>
                    <span className="text-chalk/30">·</span>
                    <span>{(venue.capacity / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
