import type { Team, Venue, H2HRecord } from '@/types/worldcup'
import { generateReview } from '@/lib/review'

interface AIReviewProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  h2h: H2HRecord | undefined
}

export default function AIReview({ homeTeam, awayTeam, venue, h2h }: AIReviewProps) {
  const html = generateReview({ homeTeam, awayTeam, venue, h2h })

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

      <div className="border-l-[3px] border-gold/30 py-3 px-4 sm:px-5 rounded-r-lg bg-white/[0.01]">
        <div
          className="text-xs sm:text-sm leading-relaxed text-dim [&_strong]:text-grass-pop [&_strong_.text-gold]:text-gold"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
