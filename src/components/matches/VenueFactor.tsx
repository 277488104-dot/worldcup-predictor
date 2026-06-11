import type { Venue, Team } from '@/types/worldcup'

interface VenueFactorProps {
  venue: Venue
  homeTeam: Team
  awayTeam: Team
}

export default function VenueFactor({ venue }: VenueFactorProps) {
  return (
    <div>
      <div className="card-elevated p-5 mb-5 flex items-center gap-4">
        <span className="text-4xl">🏟️</span>
        <div>
          <div className="text-lg font-extrabold text-chalk">{venue.name}</div>
          <div className="text-xs text-dim">{venue.city} · {venue.capacity.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">海拔</div>
          <div className="font-mono text-xl font-black text-grass-pop">{venue.altitude}m</div>
          <div className="text-[10px] text-dim mt-1">{venue.altitude < 500 ? '低海拔 · 无影响' : '高海拔 · 需适应'}</div>
        </div>
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">气候</div>
          <div className="font-mono text-xl font-black text-grass-pop">{venue.climate}</div>
          <div className="text-[10px] text-dim mt-1">{venue.description?.slice(0, 20) || '条件适中'}</div>
        </div>
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">时区</div>
          <div className="font-mono text-xl font-black text-grass-pop">{venue.timezone}</div>
          <div className="text-[10px] text-dim mt-1">对跨洲球队有时差影响</div>
        </div>
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">容量</div>
          <div className="font-mono text-xl font-black text-grass-pop">{(venue.capacity / 1000).toFixed(0)}k</div>
          <div className="text-[10px] text-dim mt-1">大型场馆 · 氛围热烈</div>
        </div>
      </div>

      <div className="mt-5 p-4 bg-grass-pop/5 rounded-xl text-xs text-grass-pop leading-relaxed">
        🟢 本场比赛在 {venue.city} 进行。{venue.altitude < 500 ? '低海拔环境对球员体能影响极小。' : '较高海拔可能影响球员表现。'}{venue.capacity > 60000 ? ' 大型场馆的主场氛围值得关注。' : ''}
      </div>
    </div>
  )
}
