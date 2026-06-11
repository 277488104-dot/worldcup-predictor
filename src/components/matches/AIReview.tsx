'use client'

import { useState, useEffect } from 'react'
import type { Team, Venue, H2HRecord } from '@/types/worldcup'
import { generateReview } from '@/lib/review'

interface AIReviewProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  h2h: H2HRecord | undefined
}

export default function AIReview({ homeTeam, awayTeam, venue, h2h }: AIReviewProps) {
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchReview() {
      try {
        const res = await fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ homeTeam, awayTeam, venue, h2h }),
        })
        const data = await res.json()
        if (!cancelled) {
          if (data.html) {
            setHtml(data.html)
          } else {
            setHtml(generateReview({ homeTeam, awayTeam, venue, h2h }))
          }
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setHtml(generateReview({ homeTeam, awayTeam, venue, h2h }))
          setLoading(false)
        }
      }
    }
    fetchReview()
    return () => { cancelled = true }
  }, [homeTeam, awayTeam, venue, h2h])

  const showSkeleton = loading || html === null

  return (
    <div className="card-glass p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🤖</span>
        <div>
          <div className="kicker kicker-gold">AI MATCH PREVIEW</div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold">
            AI <span className="text-gold">球评</span>
          </h3>
        </div>
      </div>

      {showSkeleton ? (
        <div className="border-l-[3px] border-gold/20 py-3 px-4 sm:px-5 rounded-r-lg bg-white/[0.01] space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i}>
              <div className="h-3 sm:h-4 bg-white/[0.06] rounded w-24 mb-2 animate-pulse" />
              <div className="h-2.5 sm:h-3 bg-white/[0.04] rounded w-full animate-pulse" />
              <div className="h-2.5 sm:h-3 bg-white/[0.04] rounded w-11/12 mt-1 animate-pulse" />
              {i % 2 === 0 && (
                <div className="h-2.5 sm:h-3 bg-white/[0.04] rounded w-3/4 mt-1 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border-l-[3px] border-gold/30 py-3 px-4 sm:px-5 rounded-r-lg bg-white/[0.01]">
          <div
            className="text-xs sm:text-sm leading-relaxed text-dim [&_strong]:text-grass-pop [&_strong_.text-gold]:text-gold"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  )
}
