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
  const draws = h2h.matches.length - homeWins - awayWins

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.h2h-item', {
        x: -30, opacity: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top bottom-=50' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const total = h2h.matches.length
  const homeWinRate = Math.round((homeWins / total) * 100)
  const awayWinRate = Math.round((awayWins / total) * 100)
  const drawRate = Math.round((draws / total) * 100)

  return (
    <div ref={ref}>
      {/* Win/Loss summary with visual bars */}
      <div className="flex justify-around mb-8 pb-6 border-b border-white/5 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full border-4 border-grass-pop flex items-center justify-center">
            <div className="text-2xl font-black text-grass-pop">{homeWins}</div>
          </div>
          <div className="text-xl font-black text-grass-pop">{homeWinRate}%</div>
          <div className="text-[10px] text-dim">{homeTeam.nameCn} 胜</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center">
            <div className="text-2xl font-black text-muted">{draws}</div>
          </div>
          <div className="text-xl font-black text-muted">{drawRate}%</div>
          <div className="text-[10px] text-dim">平局</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full border-4 border-gold flex items-center justify-center">
            <div className="text-2xl font-black text-gold">{awayWins}</div>
          </div>
          <div className="text-xl font-black text-gold">{awayWinRate}%</div>
          <div className="text-[10px] text-dim">{awayTeam.nameCn} 胜</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 border-l border-grass-pop/10 space-y-5">
        {recent.map((m, i) => {
          const h = getTeamById(m.homeTeamId)
          const a = getTeamById(m.awayTeamId)
          const winner = m.homeScore > m.awayScore ? 'home' : m.awayScore > m.homeScore ? 'away' : 'draw'
          const isHomeWin = winner === 'home' && m.homeTeamId === homeTeam.id || winner === 'away' && m.awayTeamId === homeTeam.id

          return (
            <div key={i} className="h2h-item relative">
              <div className={`absolute left-[-22px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ${
                winner === 'draw' ? 'bg-muted ring-muted/10' : isHomeWin ? 'bg-grass-pop ring-grass-pop/10' : 'bg-gold ring-gold/10'
              }`} />
              <div className="text-[10px] text-dim mb-1">{m.date?.slice(0, 10)} · {m.tournament}</div>
              <div className="text-xs font-semibold text-chalk">
                {h?.nameCn} {m.homeScore}-{m.awayScore} {a?.nameCn}
              </div>
            </div>
          )
        })}
      </div>

      {/* Insight */}
      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="p-4 bg-grass-pop/5 rounded-xl text-xs leading-relaxed">
          <div className="font-bold text-grass-pop mb-2">📋 交锋洞察</div>
          <p className="text-chalk/70">
            两队历史交锋 {total} 场。
            {homeWins > awayWins
              ? ` ${homeTeam.nameCn} 以 ${homeWins} 胜 ${draws} 平 ${awayWins} 负占据明显优势，胜率高达 ${homeWinRate}%。`
              : awayWins > homeWins
              ? ` ${awayTeam.nameCn} 以 ${awayWins} 胜 ${draws} 平 ${homeWins} 负占据明显优势，胜率达 ${awayWinRate}%。`
              : ` 双方互有胜负，${homeWins} 胜 ${draws} 平 ${awayWins} 负的纪录显示实力极为接近。`}
            {draws >= 2 ? ' 多次出现平局表明两队交手常常胶着。' : ''}
            {Math.abs(homeWins - awayWins) <= 1 ? ' 历史战绩几乎持平，心理因素不占主导。' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
