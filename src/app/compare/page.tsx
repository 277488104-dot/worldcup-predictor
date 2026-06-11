'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAllTeams, getH2H, getAllVenues } from '@/lib/data'
import RadarCompare from '@/components/matches/RadarCompare'
import PredictionCard from '@/components/matches/PredictionCard'
import H2HTimeline from '@/components/matches/H2HTimeline'

function CompareContent() {
  const searchParams = useSearchParams()
  const teams = useMemo(() => getAllTeams(), [])
  const venues = useMemo(() => getAllVenues(), [])
  const defaultVenue = venues[0]

  const [team1Id, setTeam1Id] = useState(searchParams.get('a') ?? '')
  const [team2Id, setTeam2Id] = useState(searchParams.get('b') ?? '')

  const team1 = useMemo(() => teams.find(t => t.id === team1Id) ?? null, [teams, team1Id])
  const team2 = useMemo(() => teams.find(t => t.id === team2Id) ?? null, [teams, team2Id])
  const h2h = useMemo(() => {
    if (!team1 || !team2) return null
    return getH2H(team1.id, team2.id) ?? null
  }, [team1, team2])

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      <div className="text-center mb-12">
        <div className="kicker kicker-gold mb-2">HEAD TO HEAD</div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">
          球队<span className="text-gold">对比</span>
        </h1>
        <p className="text-sm text-muted mt-2">选择两支球队 · 全方位数据对比</p>
      </div>

      {/* Selectors */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 max-w-xl mx-auto mb-12 items-center">
        <select value={team1Id} onChange={e => setTeam1Id(e.target.value)}
          className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-chalk focus:outline-none focus:border-grass-pop/30 transition-colors"
        >
          <option value="">选择球队...</option>
          {teams.map(t => (
            <option key={t.id} value={t.id} disabled={t.id === team2Id} className="bg-turf">
              {t.flagUrl} {t.nameCn} (#{t.fifaRank})
            </option>
          ))}
        </select>
        <span className="text-xl font-black text-grass-pop text-center">VS</span>
        <select value={team2Id} onChange={e => setTeam2Id(e.target.value)}
          className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-chalk focus:outline-none focus:border-grass-pop/30 transition-colors"
        >
          <option value="">选择球队...</option>
          {teams.map(t => (
            <option key={t.id} value={t.id} disabled={t.id === team1Id} className="bg-turf">
              {t.flagUrl} {t.nameCn} (#{t.fifaRank})
            </option>
          ))}
        </select>
      </div>

      {team1 && team2 ? (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-glass p-6">
              <h3 className="font-display text-xl font-extrabold mb-6">战力<span className="text-grass-pop">雷达</span></h3>
              <RadarCompare homeTeam={team1} awayTeam={team2} />
            </div>
            <div className="card-glass p-6">
              <h3 className="font-display text-xl font-extrabold mb-6">AI<span className="text-gold">预测</span></h3>
              <PredictionCard homeTeam={team1} awayTeam={team2} venue={defaultVenue} />
            </div>
          </div>
          {h2h && (
            <div className="card-glass p-6">
              <h3 className="font-display text-xl font-extrabold mb-6">历史<span className="text-grass-pop">交锋</span></h3>
              <H2HTimeline h2h={h2h} homeTeam={team1} awayTeam={team2} />
            </div>
          )}
        </div>
      ) : (
        <div className="card-glass p-16 text-center">
          <span className="text-6xl block mb-4 opacity-20">⚽</span>
          <p className="text-muted text-sm">选择两支球队开始对比</p>
        </div>
      )}
    </main>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <main className="max-w-7xl mx-auto px-5 py-24">
        <div className="card-glass p-16 text-center">
          <p className="text-muted text-sm">加载中...</p>
        </div>
      </main>
    }>
      <CompareContent />
    </Suspense>
  )
}
