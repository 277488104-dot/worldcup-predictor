import { getAllVenues } from '@/lib/data'
import VenueCard from '@/components/venues/VenueCard'
import PageTransitionWrapper from '@/components/layout/PageTransitionWrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '比赛场馆 · 2026 世界杯',
}

export default function VenuesPage() {
  const venues = getAllVenues()

  return (
    <PageTransitionWrapper>
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-2">比赛场馆</h1>
      <p className="text-muted mb-10">{venues.length} 个场馆 · 美国、加拿大、墨西哥</p>

      {/* Venue map placeholder */}
      <div className="bg-surface rounded-3xl border border-white/5 mb-12 flex items-center justify-center" style={{ height: 400 }}>
        <div className="text-center">
          <span className="text-5xl block mb-3 opacity-30">🗺</span>
          <p className="text-muted text-sm">场馆地图</p>
        </div>
      </div>

      {/* Venue grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {venues.map(venue => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </main>
    </PageTransitionWrapper>
  )
}
