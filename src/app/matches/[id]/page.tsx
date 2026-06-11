import { getMatchById, getTeamById, getVenueById, getAllMatches, getH2H, getPlayersByTeam } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS, STAT_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import RadarCompare from '@/components/matches/RadarCompare'
import PredictionCard from '@/components/matches/PredictionCard'
import H2HTimeline from '@/components/matches/H2HTimeline'
import VenueFactor from '@/components/matches/VenueFactor'
import PostMatchReview from '@/components/matches/PostMatchReview'
import AIReview from '@/components/matches/AIReview'
import MonteCarloSim from '@/components/matches/MonteCarloSim'
import PredictButton from '@/components/shared/PredictButton'
import { computeTeamScore, computeVenueFactor } from '@/lib/prediction'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return getAllMatches().map(m => ({ id: m.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const match = getMatchById(id)
  if (!match) return { title: '比赛未找到' }
  const home = getTeamById(match.homeTeamId)
  const away = getTeamById(match.awayTeamId)
  if (!home || !away) return { title: '比赛未找到' }
  return {
    title: `${home.nameCn} vs ${away.nameCn} · WC26 AI 预测`,
    description: `AI 预测 ${home.nameCn} vs ${away.nameCn} 比赛结果 · 胜率分析 · 比分预测 · ${match.status === 'finished' ? '赛后复盘' : '赛前预测'}`,
    openGraph: {
      title: `${home.nameCn} vs ${away.nameCn} · 世界杯 AI 预测`,
      description: `${home.nameCn} ${home.flagUrl} vs ${away.nameCn} ${away.flagUrl} · 点击查看 AI 胜率预测和比分分析`,
      type: 'article',
    },
  }
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = getMatchById(id)
  if (!match) notFound()

  const home = getTeamById(match.homeTeamId)!
  const away = getTeamById(match.awayTeamId)!
  const venue = getVenueById(match.venueId)!
  const h2h = getH2H(home.id, away.id)
  const homePlayers = getPlayersByTeam(home.id)
  const awayPlayers = getPlayersByTeam(away.id)

  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined

  const homeScore = computeTeamScore(home.stats)
  const awayScore = computeTeamScore(away.stats)
  const homeVf = computeVenueFactor(home, venue)
  const awayVf = computeVenueFactor(away, venue)

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-5 py-16 sm:py-24">
      {/* Breadcrumb */}
      <div className="text-[10px] sm:text-[11px] text-dim mb-4 sm:mb-6">
        <a href="/matches" className="text-grass-pop hover:underline">赛程</a>
        {' / '}
        {match.groupId && <span>{match.groupId} 组 · </span>}
        <span>{STAGE_LABELS[match.stage]}</span>
        {' / '}
        <span className="text-chalk">{home.nameCn} vs {away.nameCn}</span>
      </div>

      {/* Post-Match Review (only for finished matches) */}
      {isFinished && hasScore && (
        <div className="mb-8">
          <PostMatchReview
            homeTeam={home}
            awayTeam={away}
            venue={venue}
            homeScore={match.homeScore!}
            awayScore={match.awayScore!}
          />
        </div>
      )}

      {/* Scoreboard Hero */}
      <div className="card-elevated p-5 sm:p-8 md:p-12 mb-6 sm:mb-10 text-center">
        <div className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {isLive && (
            <span className="badge badge-live text-[10px] sm:text-[11px] px-3 sm:px-4 py-1 sm:py-1.5">
              <span className="live-dot" /> LIVE {match.homeScore}-{match.awayScore}&apos;
            </span>
          )}
          {isFinished && (
            <span className="badge bg-white/5 text-muted text-[10px] sm:text-[11px] px-3 sm:px-4 py-1 sm:py-1.5 font-semibold">已结束</span>
          )}
          <span className="badge badge-stage text-[10px] sm:text-[11px] px-3 sm:px-4 py-1 sm:py-1.5">
            {STAGE_LABELS[match.stage]}{match.groupId ? ` · ${match.groupId} 组` : ''}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-12">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className="text-4xl sm:text-6xl md:text-7xl">{home.flagUrl}</span>
            <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-chalk">{home.nameCn}</h2>
            <span className="text-[10px] sm:text-xs text-muted font-semibold">FIFA #{home.fifaRank}</span>
          </div>

          <div className="text-center min-w-[80px] sm:min-w-[120px]">
            {hasScore ? (
              <div className={`font-mono text-3xl sm:text-5xl md:text-7xl font-black tracking-[-0.04em] ${isLive ? 'text-grass-pop num-glow' : 'text-chalk'}`}>
                {match.homeScore}<span className="text-muted/30 mx-1">:</span>{match.awayScore}
              </div>
            ) : (
              <div className="text-2xl sm:text-4xl md:text-6xl font-black text-muted/50">VS</div>
            )}
            <div className="text-[10px] sm:text-[11px] text-muted mt-2 sm:mt-3">
              {toBeijingDate(match.date)} · {toBeijingTime(match.date)}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className="text-4xl sm:text-6xl md:text-7xl">{away.flagUrl}</span>
            <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-chalk">{away.nameCn}</h2>
            <span className="text-[10px] sm:text-xs text-muted font-semibold">FIFA #{away.fifaRank}</span>
          </div>
        </div>

        <div className="mt-5 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-muted">
          <span>📍 {venue.name}</span>
          <span className="hidden sm:inline">{venue.city}, {venue.country}</span>
          <span className="sm:hidden">{venue.city}</span>
          <span>{venue.capacity.toLocaleString()} seats</span>
        </div>
      </div>

      {/* User prediction widget */}
      <PredictButton match={match} homeTeam={home} awayTeam={away} />

      {/* ===== SECTION 1: Radar + Prediction ===== */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="card-glass p-4 sm:p-6">
          <div className="kicker kicker-green mb-3 sm:mb-4">TEAM COMPARISON</div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold mb-4 sm:mb-6">战力<span className="text-grass-pop">雷达</span></h3>
          <RadarCompare homeTeam={home} awayTeam={away} />
        </div>
        <div className="card-glass p-4 sm:p-6">
          <div className="kicker kicker-gold mb-3 sm:mb-4">AI PREDICTION</div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold mb-4 sm:mb-6">智能<span className="text-gold">预测</span></h3>
          <PredictionCard homeTeam={home} awayTeam={away} venue={venue} />
        </div>
      </div>

      {/* ===== SECTION 2: Match Outlook ===== */}
      <div className="card-glass p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="kicker kicker-green mb-3 sm:mb-4">MATCH OUTLOOK</div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold mb-4 sm:mb-6">比赛<span className="text-grass-pop">前瞻</span></h3>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">{home.flagUrl}</span>
              <div>
                <div className="font-bold text-xs sm:text-sm text-chalk">{home.nameCn}</div>
                <div className="text-[9px] sm:text-[10px] text-dim">综合评分: <span className="font-mono text-grass-pop font-bold">{Math.round(homeScore)}</span></div>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              {Object.entries(home.stats).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[9px] sm:text-[10px] text-dim w-14 sm:w-16">{STAT_LABELS[key as keyof typeof STAT_LABELS]}</span>
                  <div className="flex-1 progress-bar h-1 sm:h-1.5">
                    <div className="progress-fill progress-fill-green h-1 sm:h-1.5" style={{ width: `${val}%` }} />
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] text-grass-pop font-bold w-5 sm:w-6 text-right">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
              {(Object.entries(home.stats) as [string, number][])
                .filter(([, v]) => v >= 80)
                .map(([k]) => (
                  <span key={k} className="text-[8px] sm:text-[9px] bg-grass-pop/10 text-grass-pop px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">
                    ⬆ {STAT_LABELS[k as keyof typeof STAT_LABELS]}
                  </span>
                ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">{away.flagUrl}</span>
              <div>
                <div className="font-bold text-xs sm:text-sm text-chalk">{away.nameCn}</div>
                <div className="text-[9px] sm:text-[10px] text-dim">综合评分: <span className="font-mono text-gold font-bold">{Math.round(awayScore)}</span></div>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              {Object.entries(away.stats).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[9px] sm:text-[10px] text-dim w-14 sm:w-16">{STAT_LABELS[key as keyof typeof STAT_LABELS]}</span>
                  <div className="flex-1 progress-bar h-1 sm:h-1.5">
                    <div className="progress-fill progress-fill-gold h-1 sm:h-1.5" style={{ width: `${val}%` }} />
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] text-gold font-bold w-5 sm:w-6 text-right">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
              {(Object.entries(away.stats) as [string, number][])
                .filter(([, v]) => v >= 80)
                .map(([k]) => (
                  <span key={k} className="text-[8px] sm:text-[9px] bg-gold/10 text-gold px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">
                    ⬆ {STAT_LABELS[k as keyof typeof STAT_LABELS]}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 3: H2H + Venue ===== */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {h2h ? (
          <div className="card-glass p-4 sm:p-6">
            <div className="kicker kicker-green mb-3 sm:mb-4">HEAD TO HEAD</div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold mb-4 sm:mb-6">历史<span className="text-grass-pop">交锋</span></h3>
            <H2HTimeline h2h={h2h} homeTeam={home} awayTeam={away} />
          </div>
        ) : (
          <div className="card-glass p-4 sm:p-6 flex items-center justify-center text-muted text-xs sm:text-sm min-h-[150px] sm:min-h-[200px]">
            暂无历史交锋数据
          </div>
        )}
        <div className="card-glass p-4 sm:p-6">
          <div className="kicker kicker-gold mb-3 sm:mb-4">VENUE FACTOR</div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold mb-4 sm:mb-6">场馆<span className="text-gold">分析</span></h3>
          <VenueFactor venue={venue} homeTeam={home} awayTeam={away} />
        </div>
      </div>

      {/* ===== SECTION 4: Key Players ===== */}
      <div className="card-glass p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="kicker kicker-green mb-3 sm:mb-4">KEY PLAYERS</div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold mb-4 sm:mb-6">关键<span className="text-grass-pop">球员</span></h3>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-grass-pop mb-2 sm:mb-3">{home.nameCn} 核心</div>
            <div className="space-y-1.5 sm:space-y-2">
              {homePlayers.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-2 sm:gap-3 bg-white/[0.02] rounded-xl p-2.5 sm:p-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-grass-pop/10 flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold text-grass-pop">{p.number}</div>
                  <div className="flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-chalk">{p.name}</div>
                    <div className="text-[8px] sm:text-[9px] text-dim">{p.position} · {p.age}岁</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-gold mb-2 sm:mb-3">{away.nameCn} 核心</div>
            <div className="space-y-1.5 sm:space-y-2">
              {awayPlayers.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-2 sm:gap-3 bg-white/[0.02] rounded-xl p-2.5 sm:p-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/10 flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold text-gold">{p.number}</div>
                  <div className="flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-chalk">{p.name}</div>
                    <div className="text-[8px] sm:text-[9px] text-dim">{p.position} · {p.age}岁</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 5: Tactical Matchup ===== */}
      <div className="card-glass p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="kicker kicker-gold mb-3 sm:mb-4">TACTICAL MATCHUP</div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold mb-4 sm:mb-6">战术<span className="text-gold">对位</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="bg-white/[0.02] rounded-xl p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-dim mb-1.5 sm:mb-2">进攻 vs 防守</div>
            <div className="font-mono text-base sm:text-lg font-black text-grass-pop">{home.stats.attack}</div>
            <div className="text-[9px] sm:text-[10px] text-dim mt-0.5 sm:mt-1">{home.nameCn} 攻击力</div>
            <div className="text-lg sm:text-2xl my-1.5 sm:my-2">⚔️</div>
            <div className="font-mono text-base sm:text-lg font-black text-gold">{away.stats.defense}</div>
            <div className="text-[9px] sm:text-[10px] text-dim mt-0.5 sm:mt-1">{away.nameCn} 防守力</div>
          </div>
          <div className="bg-white/[0.02] rounded-xl p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-dim mb-1.5 sm:mb-2">控球对比</div>
            <div className="font-mono text-base sm:text-lg font-black text-grass-pop">{home.stats.possession}</div>
            <div className="text-[9px] sm:text-[10px] text-dim mt-0.5 sm:mt-1">{home.nameCn}</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, margin: '12px 0', overflow: 'hidden' }}>
              <div style={{ width: `${home.stats.possession}%`, height: '100%', background: '#4ade80', borderRadius: 2 }} />
            </div>
            <div className="font-mono text-base sm:text-lg font-black text-gold">{away.stats.possession}</div>
            <div className="text-[9px] sm:text-[10px] text-dim mt-0.5 sm:mt-1">{away.nameCn}</div>
          </div>
          <div className="bg-white/[0.02] rounded-xl p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-dim mb-1.5 sm:mb-2">防守 vs 进攻</div>
            <div className="font-mono text-base sm:text-lg font-black text-grass-pop">{home.stats.defense}</div>
            <div className="text-[9px] sm:text-[10px] text-dim mt-0.5 sm:mt-1">{home.nameCn} 防守力</div>
            <div className="text-lg sm:text-2xl my-1.5 sm:my-2">🛡️</div>
            <div className="font-mono text-base sm:text-lg font-black text-gold">{away.stats.attack}</div>
            <div className="text-[9px] sm:text-[10px] text-dim mt-0.5 sm:mt-1">{away.nameCn} 攻击力</div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 6: Venue-adjusted comparison ===== */}
      <div className="card-glass p-4 sm:p-6">
        <div className="kicker kicker-green mb-3 sm:mb-4">ADJUSTED POWER</div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold mb-4 sm:mb-6">场馆修正后<span className="text-grass-pop">战力</span></h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-xs mb-1.5 sm:mb-2 gap-0.5">
              <span className="text-chalk font-semibold">{home.nameCn}</span>
              <span className="text-[9px] sm:text-[10px] text-dim">
                基础 {Math.round(homeScore)} × 场馆因子 {homeVf.toFixed(2)} = <span className="font-mono font-bold text-grass-pop">{Math.round(homeScore * homeVf)}</span>
              </span>
            </div>
            <div className="progress-bar h-2.5 sm:h-3">
              <div className="progress-fill progress-fill-green h-2.5 sm:h-3"
                style={{ width: `${(homeScore * homeVf) / (homeScore * homeVf + awayScore * awayVf) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-xs mb-1.5 sm:mb-2 gap-0.5">
              <span className="text-chalk font-semibold">{away.nameCn}</span>
              <span className="text-[9px] sm:text-[10px] text-dim">
                基础 {Math.round(awayScore)} × 场馆因子 {awayVf.toFixed(2)} = <span className="font-mono font-bold text-gold">{Math.round(awayScore * awayVf)}</span>
              </span>
            </div>
            <div className="progress-bar h-2.5 sm:h-3">
              <div className="progress-fill progress-fill-gold h-2.5 sm:h-3"
                style={{ width: `${(awayScore * awayVf) / (homeScore * homeVf + awayScore * awayVf) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== AI REVIEW ===== */}
      <AIReview homeTeam={home} awayTeam={away} venue={venue} h2h={h2h} />

      {/* ===== MONTE CARLO SIMULATION ===== */}
      <MonteCarloSim homeTeam={home} awayTeam={away} venue={venue} />
    </main>
  )
}
