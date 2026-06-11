import { getMatchById, getTeamById, getVenueById, getAllMatches, getH2H } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import RadarCompare from '@/components/matches/RadarCompare'
import PredictionCard from '@/components/matches/PredictionCard'
import H2HTimeline from '@/components/matches/H2HTimeline'
import VenueFactor from '@/components/matches/VenueFactor'

export function generateStaticParams() {
  return getAllMatches().map(m => ({ id: m.id }))
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = getMatchById(id)
  if (!match) notFound()

  const home = getTeamById(match.homeTeamId)!
  const away = getTeamById(match.awayTeamId)!
  const venue = getVenueById(match.venueId)!
  const h2h = getH2H(home.id, away.id)

  const isLive = match.status === 'live'
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      {/* Breadcrumb */}
      <div className="text-[11px] text-dim mb-6">
        <a href="/matches" className="text-grass-pop hover:underline">赛程</a>
        {' / '}
        {match.groupId && <span>{match.groupId} 组 · </span>}
        <span>{STAGE_LABELS[match.stage]}</span>
        {' / '}
        <span className="text-chalk">{home.nameCn} vs {away.nameCn}</span>
      </div>

      {/* Scoreboard Hero */}
      <div className="card-elevated p-8 md:p-12 mb-10 text-center">
        {/* Status badges */}
        <div className="flex justify-center gap-3 mb-6">
          {isLive && (
            <span className="badge badge-live text-[11px] px-4 py-1.5">
              <span className="live-dot" /> LIVE {match.homeScore}-{match.awayScore}'
            </span>
          )}
          {match.status === 'finished' && (
            <span className="badge bg-white/5 text-dim text-[11px] px-4 py-1.5">已结束</span>
          )}
          <span className="badge badge-stage text-[11px] px-4 py-1.5">
            {STAGE_LABELS[match.stage]}{match.groupId ? ` · ${match.groupId} 组` : ''}
          </span>
        </div>

        {/* Teams + Score */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl md:text-7xl">{home.flagUrl}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-chalk">{home.nameCn}</h2>
            <span className="text-xs text-muted font-semibold">FIFA #{home.fifaRank}</span>
          </div>

          <div className="text-center min-w-[120px]">
            {hasScore ? (
              <div className={`font-mono text-5xl md:text-7xl font-black tracking-[-0.04em] ${isLive ? 'text-grass-pop num-glow' : 'text-chalk'}`}>
                {match.homeScore}<span className="text-muted/30 mx-1">:</span>{match.awayScore}
              </div>
            ) : (
              <div className="text-4xl md:text-6xl font-black text-muted/20">VS</div>
            )}
            <div className="text-[11px] text-dim mt-3">
              {toBeijingDate(match.date)} · {toBeijingTime(match.date)}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl md:text-7xl">{away.flagUrl}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-chalk">{away.nameCn}</h2>
            <span className="text-xs text-muted font-semibold">FIFA #{away.fifaRank}</span>
          </div>
        </div>

        {/* Venue bar */}
        <div className="mt-8 flex justify-center gap-4 text-[11px] text-dim">
          <span>📍 {venue.name}</span>
          <span>{venue.city}, {venue.country}</span>
          <span>{venue.capacity.toLocaleString()} seats</span>
        </div>
      </div>

      {/* Analysis Grid: Radar + Prediction */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card-glass p-6">
          <div className="kicker kicker-green mb-4">TEAM COMPARISON</div>
          <h3 className="font-display text-xl font-extrabold mb-6">战力<span className="text-grass-pop">雷达</span></h3>
          <RadarCompare homeTeam={home} awayTeam={away} />
        </div>
        <div className="card-glass p-6">
          <div className="kicker kicker-gold mb-4">AI PREDICTION</div>
          <h3 className="font-display text-xl font-extrabold mb-6">智能<span className="text-gold">预测</span></h3>
          <PredictionCard homeTeam={home} awayTeam={away} venue={venue} />
        </div>
      </div>

      {/* H2H + Venue */}
      <div className="grid lg:grid-cols-2 gap-6">
        {h2h ? (
          <div className="card-glass p-6">
            <div className="kicker kicker-green mb-4">HEAD TO HEAD</div>
            <h3 className="font-display text-xl font-extrabold mb-6">历史<span className="text-grass-pop">交锋</span></h3>
            <H2HTimeline h2h={h2h} homeTeam={home} awayTeam={away} />
          </div>
        ) : (
          <div className="card-glass p-6 flex items-center justify-center text-muted text-sm min-h-[200px]">
            暂无历史交锋数据
          </div>
        )}
        <div className="card-glass p-6">
          <div className="kicker kicker-gold mb-4">VENUE FACTOR</div>
          <h3 className="font-display text-xl font-extrabold mb-6">场馆<span className="text-gold">分析</span></h3>
          <VenueFactor venue={venue} homeTeam={home} awayTeam={away} />
        </div>
      </div>
    </main>
  )
}
