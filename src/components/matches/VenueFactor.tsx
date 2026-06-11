import type { Venue, Team } from '@/types/worldcup'
import { computeVenueFactor, computeTeamScore } from '@/lib/prediction'

interface VenueFactorProps {
  venue: Venue
  homeTeam: Team
  awayTeam: Team
}

export default function VenueFactor({ venue, homeTeam, awayTeam }: VenueFactorProps) {
  const homeVenueFactor = computeVenueFactor(homeTeam, venue)
  const awayVenueFactor = computeVenueFactor(awayTeam, venue)
  const homeBase = computeTeamScore(homeTeam.stats)
  const awayBase = computeTeamScore(awayTeam.stats)
  const homeAdj = homeBase * homeVenueFactor
  const awayAdj = awayBase * awayVenueFactor

  return (
    <div>
      {/* Venue header */}
      <div className="card-elevated p-5 mb-5 flex items-center gap-4">
        <span className="text-4xl">🏟️</span>
        <div>
          <div className="text-lg font-extrabold text-chalk">{venue.name}</div>
          <div className="text-xs text-dim">{venue.city}, {venue.country} · {venue.capacity.toLocaleString()} seats</div>
        </div>
      </div>

      {/* Venue stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">海拔</div>
          <div className="font-mono text-xl font-black text-grass-pop">{venue.altitude}m</div>
          <div className="text-[10px] text-dim mt-1">{venue.altitude < 500 ? '低海拔 · 无影响' : venue.altitude < 1500 ? '中海拔 · 轻微影响' : '高海拔 · 需适应'}</div>
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
          <div className="text-[10px] text-dim mt-1">{venue.capacity > 60000 ? '超大型 · 氛围浓烈' : '标准场馆'}</div>
        </div>
      </div>

      {/* Team impact comparison */}
      <div className="card-glass p-4 mb-5">
        <div className="text-xs text-dim font-semibold mb-4">场馆对两队影响对比</div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-chalk font-semibold">{homeTeam.nameCn}</span>
              <span className={`font-mono text-xs ${homeVenueFactor >= 1 ? 'text-grass-pop' : 'text-gold'}`}>
                {homeVenueFactor > 1 ? '+' : ''}{Math.round((homeVenueFactor - 1) * 100)}%
              </span>
            </div>
            <div className="progress-bar h-2">
              <div className={`progress-fill h-2 ${homeVenueFactor >= 1 ? 'progress-fill-green' : 'progress-fill-gold'}`}
                style={{ width: `${Math.max(homeAdj / (homeAdj + awayAdj) * 100, 5)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-chalk font-semibold">{awayTeam.nameCn}</span>
              <span className={`font-mono text-xs ${awayVenueFactor >= 1 ? 'text-grass-pop' : 'text-gold'}`}>
                {awayVenueFactor > 1 ? '+' : ''}{Math.round((awayVenueFactor - 1) * 100)}%
              </span>
            </div>
            <div className="progress-bar h-2">
              <div className={`progress-fill h-2 ${awayVenueFactor >= 1 ? 'progress-fill-green' : 'progress-fill-gold'}`}
                style={{ width: `${Math.max(awayAdj / (homeAdj + awayAdj) * 100, 5)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="p-4 bg-grass-pop/5 rounded-xl text-xs leading-relaxed">
        <div className="font-bold text-grass-pop mb-2">🏟️ 场馆洞察</div>
        <p className="text-chalk/70">
          本场比赛在 {venue.city} 的 {venue.name} 进行。
          {venue.altitude < 500
            ? '低海拔环境对球员体能影响极小，两队均可正常发挥。'
            : venue.altitude < 2500
            ? `${venue.altitude}m 的中高海拔可能对不适应高原的球队造成呼吸困难和体能下降。`
            : `${venue.altitude}m 的极高海拔将成为重要变量，客场球队需提前适应。`}
          {venue.capacity > 70000
            ? ` 超过 7 万观众的主场氛围将为比赛增添巨大压力。`
            : ''}
          {homeTeam.confederation === 'CONCACAF' && awayTeam.confederation !== 'CONCACAF'
            ? ` ${homeTeam.nameCn} 作为中北美球队，更适应北美场馆条件。`
            : homeTeam.confederation !== 'CONCACAF' && awayTeam.confederation === 'CONCACAF'
            ? ` ${awayTeam.nameCn} 作为中北美球队，更适应北美场馆条件。`
            : ''}
        </p>
      </div>
    </div>
  )
}
