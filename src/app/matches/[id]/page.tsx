import { getMatchById, getTeamById, getVenueById, getAllMatches, getH2H } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return getAllMatches().map(m => ({ id: m.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const match = getMatchById(params.id)
  if (!match) return { title: '未找到' }
  const home = getTeamById(match.homeTeamId)!
  const away = getTeamById(match.awayTeamId)!
  return { title: `${home.nameCn} vs ${away.nameCn} · 2026 世界杯` }
}

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id)
  if (!match) notFound()

  const home = getTeamById(match.homeTeamId)!
  const away = getTeamById(match.awayTeamId)!
  const venue = getVenueById(match.venueId)!
  const h2h = getH2H(home.id, away.id)

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Match header */}
      <div className="bg-surface rounded-3xl p-8 md:p-12 mb-12 border border-white/5 text-center">
        <div className="text-sm text-muted mb-2">
          {new Date(match.date).toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
          {' · '}
          {new Date(match.date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-xs mb-4">
          <span className={`px-3 py-1 rounded-full text-xs ${match.stage === 'group' ? 'bg-accent/10 text-accent' : 'bg-knockout/10 text-knockout'}`}>
            {STAGE_LABELS[match.stage]}{match.groupId ? ` · ${match.groupId} 组` : ''}
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl md:text-7xl">{home.flagUrl}</span>
            <h2 className="text-lg md:text-2xl font-bold">{home.nameCn}</h2>
            <span className="text-xs text-muted">FIFA #{home.fifaRank}</span>
          </div>

          <div className="text-center">
            {match.status === 'finished' ? (
              <div className="text-4xl md:text-6xl font-extrabold text-accent font-mono">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="text-3xl md:text-5xl font-bold text-muted">VS</div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl md:text-7xl">{away.flagUrl}</span>
            <h2 className="text-lg md:text-2xl font-bold">{away.nameCn}</h2>
            <span className="text-xs text-muted">FIFA #{away.fifaRank}</span>
          </div>
        </div>

        <div className="mt-6 text-sm text-muted">
           📍 {venue.name} · {venue.city}, {venue.country} · {venue.capacity.toLocaleString()} 座
        </div>
      </div>

      {/* Analysis grid — using placeholder divs until analysis components are built */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-2xl p-6 border border-white/5 min-h-[300px] flex items-center justify-center text-muted">
          <p>球队对比雷达图 (即将实现)</p>
        </div>
        <div className="bg-surface rounded-2xl p-6 border border-white/5 min-h-[300px] flex items-center justify-center text-muted">
          <p>智能预测 (即将实现)</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        {h2h ? (
          <div className="bg-surface rounded-2xl p-6 border border-white/5 min-h-[200px] flex items-center justify-center text-muted">
            <p>历史交锋 (即将实现)</p>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl p-6 border border-white/5 min-h-[200px] flex items-center justify-center text-muted">
            <p>暂无历史交锋数据</p>
          </div>
        )}
        <div className="bg-surface rounded-2xl p-6 border border-white/5 min-h-[200px] flex items-center justify-center text-muted">
          <p>场地影响 (即将实现)</p>
        </div>
      </div>
    </main>
  )
}
