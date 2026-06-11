import type { Team, Venue } from '@/types/worldcup'
import { predictMatch } from '@/lib/prediction'
import PredictionBar from '@/components/shared/PredictionBar'

interface PredictionCardProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
}

export default function PredictionCard({ homeTeam, awayTeam, venue }: PredictionCardProps) {
  const prediction = predictMatch(homeTeam, awayTeam, venue)

  return (
    <div>
      <PredictionBar
        homeWin={prediction.homeWin}
        draw={prediction.draw}
        awayWin={prediction.awayWin}
        homeTeam={homeTeam.nameCn}
        awayTeam={awayTeam.nameCn}
        confidence={prediction.confidence}
      />

      <div className="flex flex-wrap gap-2 mt-6">
        {prediction.factors.map((f, i) => (
          <span key={i}
            className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              f.advantage === 'home' ? 'bg-grass-pop/10 text-grass-pop' :
              f.advantage === 'away' ? 'bg-gold/10 text-gold' :
              'bg-white/5 text-muted'
            }`}
          >
            {f.name} → {f.advantage === 'home' ? homeTeam.nameCn : f.advantage === 'away' ? awayTeam.nameCn : 'NEUTRAL'}
          </span>
        ))}
      </div>
    </div>
  )
}
