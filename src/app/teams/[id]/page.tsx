import { getTeamById, getPlayersByTeam, getMatchesByTeam, getGroupByTeamId, getAllTeams } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS, STAT_LABELS } from '@/lib/constants'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return getAllTeams().map(t => ({ id: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const team = getTeamById(id)
  if (!team) return { title: '未找到' }
  return { title: `${team.nameCn} · 2026 世界杯` }
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = getTeamById(id)
  if (!team) notFound()

  const players = getPlayersByTeam(team.id)
  const matches = getMatchesByTeam(team.id)
  const group = getGroupByTeamId(team.id)

  const starters = players.slice(0, 11)
  const bench = players.slice(11)

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden mb-12 p-8 md:p-12 min-h-[300px] flex items-end"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 70% 30%, #00d4ff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative z-10">
          <span className="text-6xl mb-4 block">{team.flagUrl}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold">{team.nameCn}</h1>
          <p className="text-xl text-muted mt-1">{team.name}</p>
          <div className="flex gap-4 mt-3 text-sm text-muted">
            <span>FIFA #{team.fifaRank}</span>
            <span>主教练: {team.coach}</span>
            <span>小组 {group?.name}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">球队战力</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.entries(team.stats) as [keyof typeof team.stats, number][]).map(([key, val]) => (
            <div key={key} className="bg-surface rounded-xl p-4 border border-white/5 text-center">
              <div className="text-2xl font-bold text-accent font-mono">{val}</div>
              <div className="text-xs text-muted mt-1">{STAT_LABELS[key]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Squad */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">阵容 ({players.length}人)</h2>
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-accent mb-3">预计首发</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {starters.map(p => (
              <div key={p.id} className="bg-surface rounded-xl p-3 border border-white/5 text-sm">
                <span className="text-accent font-mono text-xs">{p.number}</span>
                <span className="ml-2 font-medium">{p.name}</span>
                <div className="text-xs text-muted mt-1">
                  {p.position} · {p.age}岁 · {p.club}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted mb-3">替补</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {bench.map(p => (
              <div key={p.id} className="bg-surface/50 rounded-xl p-3 border border-white/5 text-sm">
                <span className="text-muted font-mono text-xs">{p.number}</span>
                <span className="ml-2 font-medium">{p.name}</span>
                <div className="text-xs text-muted mt-1">
                  {p.position} · {p.age}岁 · {p.club}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matches */}
      <section>
        <h2 className="text-2xl font-bold mb-6">赛程</h2>
        <div className="space-y-2">
          {matches.map(m => {
            const home = getTeamById(m.homeTeamId)
            const away = getTeamById(m.awayTeamId)
            return (
              <Link
                key={m.id}
                href={`/matches/${m.id}`}
                className="flex items-center gap-4 bg-surface rounded-xl p-4 border border-white/5 hover:border-accent/30 transition-colors"
              >
                <span className="text-xs text-muted w-24">
                  {new Date(m.date).toLocaleDateString('zh-CN')}
                </span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                  {STAGE_LABELS[m.stage]}
                </span>
                <span className="flex-1 text-sm">
                  {home?.nameCn} vs {away?.nameCn}
                </span>
                {m.status === 'finished' && (
                  <span className="font-mono font-bold text-accent">
                    {m.homeScore}-{m.awayScore}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
