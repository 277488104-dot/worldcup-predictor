import { getVenueById, getAllVenues } from '@/lib/data'
import { notFound } from 'next/navigation'

export function generateStaticParams() { return getAllVenues().map(v => ({ id: v.id })) }

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const venue = getVenueById(params.id)
  if (!venue) notFound()

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-10 p-8 md:p-12 bg-gradient-to-br from-turf via-grass to-pitch border border-white/5">
        <div className="absolute inset-0 pitch-stripes opacity-20" />
        <div className="relative z-10">
          <span className="text-6xl mb-4 block">🏟️</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-chalk">{venue.name}</h1>
          <p className="text-dim mt-2">{venue.city}, {venue.country}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="card-glass p-5 text-center">
          <div className="text-[10px] text-dim mb-1">容量</div>
          <div className="font-mono text-2xl font-black text-grass-pop">{(venue.capacity / 1000).toFixed(0)}k</div>
        </div>
        <div className="card-glass p-5 text-center">
          <div className="text-[10px] text-dim mb-1">海拔</div>
          <div className="font-mono text-2xl font-black text-grass-pop">{venue.altitude}m</div>
        </div>
        <div className="card-glass p-5 text-center">
          <div className="text-[10px] text-dim mb-1">气候</div>
          <div className="font-mono text-2xl font-black text-grass-pop">{venue.climate}</div>
        </div>
        <div className="card-glass p-5 text-center">
          <div className="text-[10px] text-dim mb-1">时区</div>
          <div className="font-mono text-2xl font-black text-grass-pop">{venue.timezone}</div>
        </div>
      </div>

      {venue.description && (
        <p className="text-sm text-dim leading-relaxed">{venue.description}</p>
      )}
    </main>
  )
}
