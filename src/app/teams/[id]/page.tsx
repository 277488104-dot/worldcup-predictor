import { getTeamById, getPlayersByTeam, getMatchesByTeam, getGroupByTeamId, getAllTeams } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS, STAT_LABELS } from '@/lib/constants'
import { toBeijingDate } from '@/lib/date'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateStaticParams() { return getAllTeams().map(t => ({ id: t.id })) }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const team = getTeamById(id)
  if (!team) return { title: '未找到' }
  return { title: `${team.nameCn} · WC26` }
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
    <main className="max-w-7xl mx-auto px-5 py-24">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-12 p-8 md:p-12 bg-gradient-to-br from-turf via-grass to-pitch border border-white/5">
        <div className="absolute inset-0 pitch-stripes opacity-20" />
        <div className="relative z-10">
          <span className="text-7xl mb-4 block">{team.flagUrl}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-chalk">{team.nameCn}</h1>
          <p className="text-lg text-dim mt-1">{team.name}</p>
          <div className="flex gap-4 mt-4 text-xs text-muted flex-wrap">
            <span className="font-mono font-bold text-grass-pop">FIFA #{team.fifaRank}</span>
            <span>主教练: {team.coach}</span>
            <span>小组 {group?.name}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-extrabold mb-6">球队<span className="text-grass-pop">战力</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.entries(team.stats) as [keyof typeof team.stats, number][]).map(([key, val]) => (
            <div key={key} className="card-glass p-4 text-center">
              <div className="font-mono text-2xl font-black text-grass-pop">{val}</div>
              <div className="text-[10px] text-dim mt-1">{STAT_LABELS[key]}</div>
              <div className="progress-bar mt-2 h-1.5">
                <div className="progress-fill progress-fill-green" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Squad */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-extrabold mb-6">
          阵容 <span className="text-xs text-muted font-normal">({players.length}人)</span>
        </h2>

        {starters.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-grass-pop mb-3">预计首发</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {starters.map(p => (
                <div key={p.id} className="card-glass p-3 text-sm">
                  <span className="font-mono text-xs text-grass-pop font-bold">{p.number}</span>
                  <span className="ml-2 font-semibold text-chalk">{p.name}</span>
                  <div className="text-[10px] text-dim mt-1">{p.position} · {p.age}岁</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {bench.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted mb-3">替补</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {bench.map(p => (
                <div key={p.id} className="card-glass p-3 text-sm opacity-70">
                  <span className="font-mono text-xs text-muted font-bold">{p.number}</span>
                  <span className="ml-2 font-semibold text-chalk">{p.name}</span>
                  <div className="text-[10px] text-dim mt-1">{p.position} · {p.age}岁</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Matches */}
      <section>
        <h2 className="font-display text-2xl font-extrabold mb-6">赛程</h2>
        <div className="space-y-2">
          {matches.map(m => {
            const home = getTeamById(m.homeTeamId)
            const away = getTeamById(m.awayTeamId)
            return (
              <Link key={m.id} href={`/matches/${m.id}`}
                className="card-glass p-4 flex items-center gap-4 no-underline hover:border-grass-pop/20 transition-all"
              >
                <span className="text-xs text-dim w-24">{toBeijingDate(m.date)}</span>
                <span className="badge badge-stage text-[9px]">{STAGE_LABELS[m.stage]}</span>
                <span className="flex-1 text-sm text-chalk font-semibold">{home?.nameCn} vs {away?.nameCn}</span>
                {m.status === 'finished' && m.homeScore !== undefined && (
                  <span className="font-mono font-bold text-grass-pop">{m.homeScore}-{m.awayScore}</span>
                )}
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
