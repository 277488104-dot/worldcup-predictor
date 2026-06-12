'use client'

import { useEffect, useState } from 'react'
import { getLiveMatches, type LiveMatch } from '@/lib/live-scores'

export default function LiveScoreBar() {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    getLiveMatches().then(data => {
      if (data.length) {
        setMatches(data)
        setHasData(true)
      }
    })
    const interval = setInterval(async () => {
      const data = await getLiveMatches()
      if (data.length) {
        setMatches(data)
        setHasData(true)
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!hasData) return null

  const doubled = [...matches, ...matches]

  return (
    <div className="bg-black/30 border border-grass-pop/5 rounded-xl py-3 overflow-hidden">
      <div className="flex items-center gap-0 animate-ticker" style={{ width: 'max-content' }}>
        {doubled.map((m, i) => (
          <span key={`${m.id}-${i}`} className="inline-flex items-center gap-3 mx-6 text-xs whitespace-nowrap">
            <span className="badge badge-live">
              <span className="live-dot" /> LIVE
              {m.homeScore !== null && m.awayScore !== null
                ? ` ${m.homeScore}-${m.awayScore}`
                : ''}
              {m.minute ? ` ${m.minute}'` : ''}
            </span>
            <span className="text-chalk/80 font-semibold">{m.home}</span>
            {m.homeScore !== null && (
              <span className="font-mono font-bold text-grass-pop num-glow">{m.homeScore}</span>
            )}
            <span className="text-muted">-</span>
            {m.awayScore !== null && (
              <span className="font-mono font-bold text-chalk">{m.awayScore}</span>
            )}
            <span className="text-chalk/80 font-semibold">{m.away}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
