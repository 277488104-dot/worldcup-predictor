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
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-2">球队对比</h1>
      <p className="text-muted mb-10">选择两支球队进行全方位数据对比</p>

      {/* Team selectors */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div>
          <label className="block text-sm text-muted mb-2">主场球队</label>
          <select
            value={team1Id}
            onChange={e => setTeam1Id(e.target.value)}
            className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors"
          >
            <option value="">选择球队...</option>
            {teams.map(t => (
              <option key={t.id} value={t.id} disabled={t.id === team2Id}>
                {t.flagUrl} {t.nameCn} (#{t.fifaRank})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-2">客场球队</label>
          <select
            value={team2Id}
            onChange={e => setTeam2Id(e.target.value)}
            className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors"
          >
            <option value="">选择球队...</option>
            {teams.map(t => (
              <option key={t.id} value={t.id} disabled={t.id === team1Id}>
                {t.flagUrl} {t.nameCn} (#{t.fifaRank})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {team1 && team2 ? (
        <div className="space-y-8">
          {/* Radar + Prediction */}
          <div className="grid lg:grid-cols-2 gap-8">
            <RadarCompare homeTeam={team1} awayTeam={team2} />
            <PredictionCard homeTeam={team1} awayTeam={team2} venue={defaultVenue} />
          </div>

          {/* H2H timeline */}
          {h2h && (
            <H2HTimeline h2h={h2h} homeTeam={team1} awayTeam={team2} />
          )}
        </div>
      ) : (
        <div className="bg-surface rounded-3xl border border-white/5 p-16 text-center">
          <span className="text-6xl block mb-4 opacity-30">⚽</span>
          <p className="text-muted text-sm">选择两支球队开始对比</p>
        </div>
      )}
    </main>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-surface rounded-3xl border border-white/5 p-16 text-center">
          <p className="text-muted text-sm">加载中...</p>
        </div>
      </main>
    }>
      <CompareContent />
    </Suspense>
  )
}
