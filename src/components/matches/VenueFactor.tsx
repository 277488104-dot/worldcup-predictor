'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedProgress from '@/components/shared/AnimatedProgress'
import type { Venue, Team } from '@/types/worldcup'

gsap.registerPlugin(ScrollTrigger)

function venueAdaptationScore(team: Team, venue: Venue): number {
  let score = 70
  if (team.confederation === 'CONCACAF') score += 15
  if (venue.altitude > 1500) score -= 8
  if (venue.altitude > 2500) score -= 10
  return Math.min(100, Math.max(0, score))
}

function getAdaptationColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  return '#f97316'
}

export default function VenueFactor({ venue, homeTeam, awayTeam }: { venue: Venue; homeTeam: Team; awayTeam: Team }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.venue-row', {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: containerRef.current, start: 'top 90%' },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const homeScore = venueAdaptationScore(homeTeam, venue)
  const awayScore = venueAdaptationScore(awayTeam, venue)

  const factors: { label: string; value: string }[] = [
    { label: '海拔', value: `${venue.altitude.toLocaleString()} m` },
    { label: '气候', value: venue.climate },
    { label: '时区', value: venue.timezone },
    { label: '容量', value: `${venue.capacity.toLocaleString()} 座` },
  ]

  return (
    <section className="bg-surface rounded-2xl p-6 border border-white/5">
      <h3 className="text-lg font-bold mb-4">场地影响</h3>

      {/* Venue info */}
      <div ref={containerRef}>
        <div className="venue-row text-center mb-6">
          <p className="text-sm text-muted">{venue.city}, {venue.country}</p>
        </div>

        {/* Factor grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {factors.map(f => (
            <div key={f.label} className="venue-row bg-surface-light rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">{f.label}</p>
              <p className="text-sm font-semibold">{f.value}</p>
            </div>
          ))}
        </div>

        {/* Team adaptation scores */}
        <div className="space-y-4">
          <div className="venue-row">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold">{homeTeam.nameCn}</span>
              <span className="text-xs font-mono" style={{ color: getAdaptationColor(homeScore) }}>
                {homeScore}/100
              </span>
            </div>
            <AnimatedProgress value={homeScore} color={getAdaptationColor(homeScore)} />
          </div>
          <div className="venue-row">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold">{awayTeam.nameCn}</span>
              <span className="text-xs font-mono" style={{ color: getAdaptationColor(awayScore) }}>
                {awayScore}/100
              </span>
            </div>
            <AnimatedProgress value={awayScore} color={getAdaptationColor(awayScore)} />
          </div>
        </div>
      </div>
    </section>
  )
}
