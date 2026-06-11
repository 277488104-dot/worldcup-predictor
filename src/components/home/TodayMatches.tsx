'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { getTodayMatches, getTeamById, getVenueById } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function TodayMatches() {
  const sectionRef = useRef<HTMLElement>(null)
  const matches = getTodayMatches()

  useEffect(() => {
    if (matches.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.match-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.matches-grid',
            start: 'top bottom-=100',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [matches.length])

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          今日<span className="text-accent">比赛</span>
        </h2>

        {matches.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <div className="text-5xl mb-4">⚽</div>
            <p className="text-lg">今日无比赛安排</p>
            <p className="text-sm text-muted/60 mt-2">
              请关注后续赛程，精彩赛事即将开始
            </p>
          </div>
        ) : (
          <div className="matches-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => {
              const homeTeam = getTeamById(match.homeTeamId)
              const awayTeam = getTeamById(match.awayTeamId)
              const venue = getVenueById(match.venueId)

              if (!homeTeam || !awayTeam) return null

              const matchTime = new Date(match.date)
              const timeStr = matchTime.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })

              return (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="match-card group block bg-surface hover:bg-surface-light border border-white/5 hover:border-accent/30 rounded-xl p-5 transition-colors duration-300"
                >
                  {/* Top row: time + venue */}
                  <div className="flex items-center justify-between text-sm text-muted mb-4">
                    <span className="font-mono text-accent">{timeStr}</span>
                    <span>{venue?.city ?? 'TBD'}</span>
                    {match.status === 'live' && (
                      <span className="bg-cta text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Home team */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono text-muted">{homeTeam.fifaCode}</span>
                    <span className="font-semibold text-white">{homeTeam.nameCn}</span>
                    {match.homeScore !== undefined && (
                      <span className="ml-auto text-2xl font-bold font-mono text-white">
                        {match.homeScore}
                      </span>
                    )}
                  </div>

                  {/* Away team */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted">{awayTeam.fifaCode}</span>
                    <span className="font-semibold text-white">{awayTeam.nameCn}</span>
                    {match.awayScore !== undefined && (
                      <span className="ml-auto text-2xl font-bold font-mono text-white">
                        {match.awayScore}
                      </span>
                    )}
                  </div>

                  {/* VS divider */}
                  {match.homeScore === undefined && (
                    <div className="text-center text-xs text-muted/40 mt-2">VS</div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
