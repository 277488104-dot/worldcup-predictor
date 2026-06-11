'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { getTodayMatches, getTeamById, getVenueById } from '@/lib/data'
import { STAGE_LABELS } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

export default function TodayMatches() {
  const sectionRef = useRef<HTMLElement>(null)
  const matches = getTodayMatches()

  useEffect(() => {
    if (matches.length === 0) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.match-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.matches-grid', start: 'top bottom-=80' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [matches.length])

  return (
    <section ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end gap-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            今日<span className="text-accent text-glow">焦点</span>
          </h2>
          <span className="text-xs text-muted/50 pb-1 tracking-widest uppercase">Today</span>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-7xl block mb-6 opacity-30">⚽</span>
            <p className="text-xl text-muted font-medium">今日无比赛安排</p>
            <p className="text-sm text-muted/50 mt-2">关注后续赛程，精彩即将到来</p>
          </div>
        ) : (
          <div className="matches-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => {
              const homeTeam = getTeamById(match.homeTeamId)
              const awayTeam = getTeamById(match.awayTeamId)
              const venue = getVenueById(match.venueId)
              if (!homeTeam || !awayTeam || !venue) return null

              const matchTime = new Date(match.date)
              const timeStr = matchTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
              const dateStr = matchTime.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })

              return (
                <Link key={match.id} href={`/matches/${match.id}`}
                  className="match-card group block bg-surface rounded-2xl border border-white/5 card-hover overflow-hidden"
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-5 py-3 bg-surface-light/50 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted/70">{dateStr}</span>
                      <span className="text-sm font-mono text-accent font-bold">{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {match.stage !== 'group' && (
                        <span className="text-[10px] bg-knockout/20 text-knockout px-2 py-0.5 rounded-full font-semibold">
                          {STAGE_LABELS[match.stage]}
                        </span>
                      )}
                      <span className="text-xs text-muted/60">{venue.city}</span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      {/* Home */}
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <span className="flag-display text-4xl">{homeTeam.flagUrl}</span>
                        <span className="text-sm font-bold text-white truncate w-full text-center">{homeTeam.nameCn}</span>
                        <span className="text-[10px] text-muted">FIFA #{homeTeam.fifaRank}</span>
                      </div>

                      {/* VS / Score */}
                      <div className="flex-shrink-0 px-3">
                        {match.status === 'finished' ? (
                          <div className="text-center">
                            <span className="text-3xl font-black text-accent font-mono text-glow">
                              {match.homeScore}-{match.awayScore}
                            </span>
                          </div>
                        ) : match.status === 'live' ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-black text-cta font-mono text-glow-cta">
                              {match.homeScore}-{match.awayScore}
                            </span>
                            <span className="text-[10px] text-cta bg-cta/10 px-2 py-0.5 rounded-full animate-pulse font-bold">LIVE</span>
                          </div>
                        ) : (
                          <span className="text-xl font-black text-muted/40">VS</span>
                        )}
                      </div>

                      {/* Away */}
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <span className="flag-display text-4xl">{awayTeam.flagUrl}</span>
                        <span className="text-sm font-bold text-white truncate w-full text-center">{awayTeam.nameCn}</span>
                        <span className="text-[10px] text-muted">FIFA #{awayTeam.fifaRank}</span>
                      </div>
                    </div>

                    {/* Venue footer */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-1 text-[10px] text-muted/50">
                      <span>🏟️</span>
                      <span>{venue.name}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-muted/30 mx-1" />
                      <span>{venue.capacity.toLocaleString()} 座</span>
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
