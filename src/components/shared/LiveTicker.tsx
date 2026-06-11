'use client'

import { useEffect, useRef, useState } from 'react'
import { getLiveMatches, getTeamById } from '@/lib/data'

export default function LiveTicker() {
  const [matches, setMatches] = useState(getLiveMatches())

  useEffect(() => {
    const interval = setInterval(() => { setMatches(getLiveMatches()) }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!matches.length) return null

  const doubled = [...matches, ...matches]

  return (
    <div className="bg-black/30 border border-grass-pop/5 rounded-xl py-3 overflow-hidden">
      <div className="flex items-center gap-0 animate-ticker" style={{ width: 'max-content' }}>
        {doubled.map((m, i) => {
          const home = getTeamById(m.homeTeamId)
          const away = getTeamById(m.awayTeamId)
          if (!home || !away) return null
          return (
            <span key={`${m.id}-${i}`} className="inline-flex items-center gap-3 mx-6 text-xs whitespace-nowrap">
              <span className="badge badge-live">
                <span className="live-dot" /> LIVE {m.homeScore}-{m.awayScore}'
              </span>
              <span className="text-chalk/80 font-semibold">{home.fifaCode}</span>
              <span className="font-mono font-bold text-grass-pop num-glow">{m.homeScore}</span>
              <span className="text-muted">-</span>
              <span className="font-mono font-bold text-chalk">{m.awayScore}</span>
              <span className="text-chalk/80 font-semibold">{away.fifaCode}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
