'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getTeamById } from '@/lib/data'
import type { H2HRecord, Team } from '@/types/worldcup'

gsap.registerPlugin(ScrollTrigger)

interface H2HTimelineProps {
  h2h: H2HRecord
  homeTeam: Team
  awayTeam: Team
}

export default function H2HTimeline({ h2h, homeTeam, awayTeam }: H2HTimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const recent = h2h.matches.slice(-5).reverse()

  const homeWins = h2h.matches.filter(m =>
    (m.homeTeamId === homeTeam.id && m.homeScore > m.awayScore) ||
    (m.awayTeamId === homeTeam.id && m.awayScore > m.homeScore)
  ).length
  const awayWins = h2h.matches.filter(m =>
    (m.homeTeamId === awayTeam.id && m.homeScore > m.awayScore) ||
    (m.awayTeamId === awayTeam.id && m.awayScore > m.homeScore)
  ).length

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.h2h-item', {
        x: -30, opacity: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top bottom-=50' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref}>
      <div className="flex justify-around mb-8 pb-6 border-b border-white/5 text-center">
        <div>
          <div className="text-2xl font-black text-grass-pop">{homeWins}</div>
          <div className="text-[10px] text-dim">{homeTeam.nameCn} 胜</div>
        </div>
        <div>
          <div className="text-2xl font-black text-muted">{h2h.matches.length - homeWins - awayWins}</div>
          <div className="text-[10px] text-dim">平局</div>
        </div>
        <div>
          <div className="text-2xl font-black text-gold">{awayWins}</div>
          <div className="text-[10px] text-dim">{awayTeam.nameCn} 胜</div>
        </div>
      </div>

      <div className="relative pl-6 border-l border-grass-pop/10 space-y-5">
        {recent.map((m, i) => {
          const h = getTeamById(m.homeTeamId)
          const a = getTeamById(m.awayTeamId)
          const winner = m.homeScore > m.awayScore ? 'home' : m.awayScore > m.homeScore ? 'away' : 'draw'
          const isHomeWin = winner === 'home' && m.homeTeamId === homeTeam.id || winner === 'away' && m.awayTeamId === homeTeam.id

          return (
            <div key={i} className="h2h-item relative">
              <div className={`absolute left-[-22px] top-1.5 w-2.5 h-2.5 rounded-full ${
                winner === 'draw' ? 'bg-muted' : isHomeWin ? 'bg-grass-pop' : 'bg-gold'
              }`} />
              <div className="text-[10px] text-dim mb-1">{m.date?.slice(0, 10)} · {m.tournament}</div>
              <div className="text-xs font-semibold text-chalk">
                {h?.nameCn} {m.homeScore}-{m.awayScore} {a?.nameCn}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
