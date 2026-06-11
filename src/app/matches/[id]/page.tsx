import { getMatchById, getTeamById, getVenueById, getAllMatches, getH2H } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import type { Metadata } from 'next'
import RadarCompare from '@/components/matches/RadarCompare'
import PredictionCard from '@/components/matches/PredictionCard'
import H2HTimeline from '@/components/matches/H2HTimeline'
import VenueFactor from '@/components/matches/VenueFactor'

export function generateStaticParams() {
  return getAllMatches().map(m => ({ id: m.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const match = getMatchById(params.id)
  if (!match) return { title: '未找到' }
  const home = getTeamById(match.homeTeamId)!
  const away = getTeamById(match.awayTeamId)!
  return { title: `${home.nameCn} vs ${away.nameCn} · 2026 世界杯` }
}

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id)
  if (!match) notFound()

  const home = getTeamById(match.homeTeamId)!
  const away = getTeamById(match.awayTeamId)!
  const venue = getVenueById(match.venueId)!
  const h2h = getH2H(home.id, away.id)

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Match header */}
      <div className="bg-surface rounded-3xl p-8 md:p-12 mb-12 border border-white/5 text-center">
        <div className="text-sm text-muted mb-2">
          {toBeijingDate(match.date)}
          {' · '}
          {toBeijingTime(match.date)}
        </div>
        <div className="text-xs mb-4">
          <span className={`px-3 py-1 rounded-full text-xs ${match.stage === 'group' ? 'bg-accent/10 text-accent' : 'bg-knockout/10 text-knockout'}`}>
            {STAGE_LABELS[match.stage]}{match.groupId ? ` · ${match.groupId} 组` : ''}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl md:text-7xl">{home.flagUrl}</span>
            <h2 className="text-lg md:text-2xl font-bold">{home.nameCn}</h2>
            <span className="text-xs text-muted">FIFA #{home.fifaRank}</span>
          </div>

          <div className="text-center">
            {match.status === 'finished' ? (
              <div className="text-4xl md:text-6xl font-extrabold text-accent font-mono">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="text-3xl md:text-5xl font-bold text-muted">VS</div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl md:text-7xl">{away.flagUrl}</span>
            <h2 className="text-lg md:text-2xl font-bold">{away.nameCn}</h2>
            <span className="text-xs text-muted">FIFA #{away.fifaRank}</span>
          </div>
        </div>

        <div className="mt-6 text-sm text-muted">
           📍 {venue.name} · {venue.city}, {venue.country} · {venue.capacity.toLocaleString()} 座
        </div>
      </div>

      {/* Analysis grid — Radar + Prediction */}
      <div className="grid lg:grid-cols-2 gap-8">
        <RadarCompare homeTeam={home} awayTeam={away} />
        <PredictionCard homeTeam={home} awayTeam={away} venue={venue} />
      </div>

      {/* H2H + Venue */}
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        {h2h ? (
          <H2HTimeline h2h={h2h} homeTeam={home} awayTeam={away} />
        ) : (
          <div className="bg-surface rounded-2xl p-6 border border-white/5 min-h-[200px] flex items-center justify-center text-muted">
            <p>暂无历史交锋数据</p>
          </div>
        )}
        <VenueFactor venue={venue} homeTeam={home} awayTeam={away} />
      </div>
    </main>
  )
}
