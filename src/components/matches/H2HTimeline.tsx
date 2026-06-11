'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { H2HRecord, Team } from '@/types/worldcup'
import { getTeamById } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

function getResultLabel(
  homeScore: number,
  awayScore: number,
  homeTeamId: string,
  targetTeamId: string,
): { label: string; color: string } {
  const isHome = targetTeamId === homeTeamId
  const selfScore = isHome ? homeScore : awayScore
  const oppScore = isHome ? awayScore : homeScore

  if (selfScore > oppScore) return { label: '胜', color: '#00d4ff' }
  if (selfScore < oppScore) return { label: '负', color: '#ff6b35' }
  return { label: '平', color: '#64748b' }
}

export default function H2HTimeline({ h2h, homeTeam }: { h2h: H2HRecord; homeTeam: Team; awayTeam: Team }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const recent = h2h.matches.slice(-5).reverse()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.h2h-row', {
        y: 30, opacity: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: containerRef.current, start: 'top 90%' },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-surface rounded-2xl p-6 border border-white/5">
      <h3 className="text-lg font-bold mb-4">历史交锋</h3>
      <div ref={containerRef} className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-white/10" />

        <div className="flex flex-col gap-5">
          {recent.map((m, i) => {
            const homeForMatch = getTeamById(m.homeTeamId)
            const awayForMatch = getTeamById(m.awayTeamId)
            const result = getResultLabel(m.homeScore, m.awayScore, m.homeTeamId, homeTeam.id)

            return (
              <div key={`${m.date}-${i}`} className="h2h-row flex gap-5 items-start relative">
                {/* Dot on timeline */}
                <div className="relative z-10 mt-1">
                  <div
                    className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center"
                    style={{ backgroundColor: `${result.color}20`, borderColor: result.color }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color }} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted mb-1">
                    <span>{m.date}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-muted" />
                    <span>{m.tournament}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{homeForMatch?.nameCn ?? m.homeTeamId}</span>
                    <span className="text-sm font-mono font-bold" style={{ color: result.color }}>
                      {m.homeScore} - {m.awayScore}
                    </span>
                    <span className="text-sm font-semibold">{awayForMatch?.nameCn ?? m.awayTeamId}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
