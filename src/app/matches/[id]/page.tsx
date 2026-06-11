import { getMatchById, getTeamById, getVenueById, getAllMatches, getH2H, getPlayersByTeam } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS, STAT_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import RadarCompare from '@/components/matches/RadarCompare'
import PredictionCard from '@/components/matches/PredictionCard'
import H2HTimeline from '@/components/matches/H2HTimeline'
import VenueFactor from '@/components/matches/VenueFactor'
import { computeTeamScore, computeVenueFactor } from '@/lib/prediction'

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
  const homePlayers = getPlayersByTeam(home.id)
  const awayPlayers = getPlayersByTeam(away.id)

  const isLive = match.status === 'live'
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined

  const homeScore = computeTeamScore(home.stats)
  const awayScore = computeTeamScore(away.stats)
  const homeVf = computeVenueFactor(home, venue)
  const awayVf = computeVenueFactor(away, venue)

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
        <div className="flex justify-center gap-3 mb-6">
          {isLive && (
            <span className="badge badge-live text-[11px] px-4 py-1.5">
              <span className="live-dot" /> LIVE {match.homeScore}-{match.awayScore}&apos;
            </span>
          )}
          {match.status === 'finished' && (
            <span className="badge bg-white/5 text-muted text-[11px] px-4 py-1.5 font-semibold">已结束</span>
          )}
          <span className="badge badge-stage text-[11px] px-4 py-1.5">
            {STAGE_LABELS[match.stage]}{match.groupId ? ` · ${match.groupId} 组` : ''}
          </span>
        </div>

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
              <div className="text-4xl md:text-6xl font-black text-muted/50">VS</div>
            )}
            <div className="text-[11px] text-muted mt-3">
              {toBeijingDate(match.date)} · {toBeijingTime(match.date)}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl md:text-7xl">{away.flagUrl}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-chalk">{away.nameCn}</h2>
            <span className="text-xs text-muted font-semibold">FIFA #{away.fifaRank}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4 text-[11px] text-muted">
          <span>📍 {venue.name}</span>
          <span>{venue.city}, {venue.country}</span>
          <span>{venue.capacity.toLocaleString()} seats</span>
        </div>
      </div>

      {/* ===== SECTION 1: Radar + Prediction ===== */}
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

      {/* ===== SECTION 2: Score comparison bar ===== */}
      <div className="card-glass p-6 mb-8">
        <div className="kicker kicker-green mb-4">MATCH OUTLOOK</div>
        <h3 className="font-display text-xl font-extrabold mb-6">比赛<span className="text-grass-pop">前瞻</span></h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Team 1 strengths */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{home.flagUrl}</span>
              <div>
                <div className="font-bold text-sm text-chalk">{home.nameCn}</div>
                <div className="text-[10px] text-dim">综合评分: <span className="font-mono text-grass-pop font-bold">{Math.round(homeScore)}</span></div>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(home.stats).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[10px] text-dim w-16">{STAT_LABELS[key as keyof typeof STAT_LABELS]}</span>
                  <div className="flex-1 progress-bar h-1.5">
                    <div className="progress-fill progress-fill-green h-1.5" style={{ width: `${val}%` }} />
                  </div>
                  <span className="font-mono text-[10px] text-grass-pop font-bold w-6 text-right">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {(Object.entries(home.stats) as [string, number][])
                .filter(([, v]) => v >= 80)
                .map(([k]) => (
                  <span key={k} className="text-[9px] bg-grass-pop/10 text-grass-pop px-2 py-0.5 rounded-full font-semibold">
                    ⬆ {STAT_LABELS[k as keyof typeof STAT_LABELS]}
                  </span>
                ))}
            </div>
          </div>

          {/* Team 2 strengths */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{away.flagUrl}</span>
              <div>
                <div className="font-bold text-sm text-chalk">{away.nameCn}</div>
                <div className="text-[10px] text-dim">综合评分: <span className="font-mono text-gold font-bold">{Math.round(awayScore)}</span></div>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(away.stats).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[10px] text-dim w-16">{STAT_LABELS[key as keyof typeof STAT_LABELS]}</span>
                  <div className="flex-1 progress-bar h-1.5">
                    <div className="progress-fill progress-fill-gold h-1.5" style={{ width: `${val}%` }} />
                  </div>
                  <span className="font-mono text-[10px] text-gold font-bold w-6 text-right">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {(Object.entries(away.stats) as [string, number][])
                .filter(([, v]) => v >= 80)
                .map(([k]) => (
                  <span key={k} className="text-[9px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-semibold">
                    ⬆ {STAT_LABELS[k as keyof typeof STAT_LABELS]}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 3: H2H + Venue ===== */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
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

      {/* ===== SECTION 4: Key Players ===== */}
      <div className="card-glass p-6 mb-8">
        <div className="kicker kicker-green mb-4">KEY PLAYERS</div>
        <h3 className="font-display text-xl font-extrabold mb-6">关键<span className="text-grass-pop">球员</span></h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-bold text-grass-pop mb-3">{home.nameCn} 核心</div>
            <div className="space-y-2">
              {homePlayers.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-grass-pop/10 flex items-center justify-center font-mono text-xs font-bold text-grass-pop">{p.number}</div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-chalk">{p.name}</div>
                    <div className="text-[9px] text-dim">{p.position} · {p.age}岁</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gold mb-3">{away.nameCn} 核心</div>
            <div className="space-y-2">
              {awayPlayers.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center font-mono text-xs font-bold text-gold">{p.number}</div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-chalk">{p.name}</div>
                    <div className="text-[9px] text-dim">{p.position} · {p.age}岁</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 5: Tactical Matchup ===== */}
      <div className="card-glass p-6 mb-8">
        <div className="kicker kicker-gold mb-4">TACTICAL MATCHUP</div>
        <h3 className="font-display text-xl font-extrabold mb-6">战术<span className="text-gold">对位</span></h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/[0.02] rounded-xl p-4">
            <div className="text-[10px] text-dim mb-2">进攻 vs 防守</div>
            <div className="font-mono text-lg font-black text-grass-pop">{home.stats.attack}</div>
            <div className="text-[10px] text-dim mt-1">{home.nameCn} 攻击力</div>
            <div className="text-2xl my-2">⚔️</div>
            <div className="font-mono text-lg font-black text-gold">{away.stats.defense}</div>
            <div className="text-[10px] text-dim mt-1">{away.nameCn} 防守力</div>
          </div>
          <div className="bg-white/[0.02] rounded-xl p-4">
            <div className="text-[10px] text-dim mb-2">控球对比</div>
            <div className="font-mono text-lg font-black text-grass-pop">{home.stats.possession}</div>
            <div className="text-[10px] text-dim mt-1">{home.nameCn}</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, margin: '12px 0', overflow: 'hidden' }}>
              <div style={{ width: `${home.stats.possession}%`, height: '100%', background: '#4ade80', borderRadius: 2 }} />
            </div>
            <div className="font-mono text-lg font-black text-gold">{away.stats.possession}</div>
            <div className="text-[10px] text-dim mt-1">{away.nameCn}</div>
          </div>
          <div className="bg-white/[0.02] rounded-xl p-4">
            <div className="text-[10px] text-dim mb-2">防守 vs 进攻</div>
            <div className="font-mono text-lg font-black text-grass-pop">{home.stats.defense}</div>
            <div className="text-[10px] text-dim mt-1">{home.nameCn} 防守力</div>
            <div className="text-2xl my-2">🛡️</div>
            <div className="font-mono text-lg font-black text-gold">{away.stats.attack}</div>
            <div className="text-[10px] text-dim mt-1">{away.nameCn} 攻击力</div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 6: Venue-adjusted comparison ===== */}
      <div className="card-glass p-6">
        <div className="kicker kicker-green mb-4">ADJUSTED POWER</div>
        <h3 className="font-display text-xl font-extrabold mb-6">场馆修正后<span className="text-grass-pop">战力</span></h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-chalk font-semibold">{home.nameCn}</span>
              <span className="text-[10px] text-dim">
                基础 {Math.round(homeScore)} × 场馆因子 {homeVf.toFixed(2)} = <span className="font-mono font-bold text-grass-pop">{Math.round(homeScore * homeVf)}</span>
              </span>
            </div>
            <div className="progress-bar h-3">
              <div className="progress-fill progress-fill-green h-3"
                style={{ width: `${(homeScore * homeVf) / (homeScore * homeVf + awayScore * awayVf) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-chalk font-semibold">{away.nameCn}</span>
              <span className="text-[10px] text-dim">
                基础 {Math.round(awayScore)} × 场馆因子 {awayVf.toFixed(2)} = <span className="font-mono font-bold text-gold">{Math.round(awayScore * awayVf)}</span>
              </span>
            </div>
            <div className="progress-bar h-3">
              <div className="progress-fill progress-fill-gold h-3"
                style={{ width: `${(awayScore * awayVf) / (homeScore * homeVf + awayScore * awayVf) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
