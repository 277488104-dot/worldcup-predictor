import { getVenueById, getAllVenues, getAllMatches, getTeamById } from '@/lib/data'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return getAllVenues().map(v => ({ id: v.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const venue = getVenueById(params.id)
  if (!venue) return { title: '未找到' }
  return { title: `${venue.name} · ${venue.city} · 2026 世界杯` }
}

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const venue = getVenueById(params.id)
  if (!venue) notFound()

  const matches = getAllMatches().filter(m => m.venueId === venue.id)

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero section */}
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-accent/20 via-surface to-knockout/10 border border-white/5">
        <div className="p-8 md:p-12">
          <div className="text-center mb-6">
            <span className="text-6xl block mb-4 opacity-40">🏟</span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{venue.name}</h1>
            <p className="text-muted text-sm">{venue.city}, {venue.country}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-surface/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">容量</p>
              <p className="text-sm font-semibold">{venue.capacity.toLocaleString()}</p>
            </div>
            <div className="bg-surface/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">海拔</p>
              <p className="text-sm font-semibold">{venue.altitude.toLocaleString()} m</p>
            </div>
            <div className="bg-surface/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">气候</p>
              <p className="text-sm font-semibold">{venue.climate}</p>
            </div>
            <div className="bg-surface/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted mb-1">时区</p>
              <p className="text-sm font-semibold">{venue.timezone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5 mb-12">
        <h2 className="text-lg font-bold mb-3">场馆介绍</h2>
        <p className="text-sm text-muted leading-relaxed">{venue.description}</p>
      </div>

      {/* Matches at this venue */}
      <div>
        <h2 className="text-lg font-bold mb-4">在此场馆进行的比赛 ({matches.length})</h2>
        {matches.length === 0 ? (
          <div className="bg-surface rounded-2xl p-6 border border-white/5 text-center text-muted text-sm">
            暂无比赛安排
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map(match => {
              const home = getTeamById(match.homeTeamId)
              const away = getTeamById(match.awayTeamId)
              if (!home || !away) return null

              return (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <div className="bg-surface rounded-xl p-4 border border-white/5 hover:border-accent/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted">
                          {toBeijingDate(match.date)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${match.stage === 'group' ? 'bg-accent/10 text-accent' : 'bg-knockout/10 text-knockout'}`}>
                          {STAGE_LABELS[match.stage]}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{home.nameCn}</span>
                        <span className="text-xs text-muted">vs</span>
                        <span className="text-sm font-semibold">{away.nameCn}</span>
                      </div>

                      <span className="text-xs text-muted">
                        {toBeijingTime(match.date)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
