'use client'

import { useState, useMemo, useEffect } from 'react'
import { getAllMatches } from '@/lib/data'
import MatchCard from '@/components/matches/MatchCard'
import { MatchCardSkeleton } from '@/components/shared/Skeletons'

const STAGES = [
  { value: 'all', label: '全部' },
  { value: 'group', label: '小组赛' },
  { value: 'round32', label: '1/16' },
  { value: 'round16', label: '1/8' },
  { value: 'quarter', label: '1/4' },
  { value: 'semi', label: '半决赛' },
  { value: 'third', label: '季军赛' },
  { value: 'final', label: '决赛' },
]

export default function MatchesPage() {
  const [stage, setStage] = useState('all')
  const [date, setDate] = useState('all')
  const [loading, setLoading] = useState(true)

  const allMatches = getAllMatches()
  const dates = useMemo(() => {
    const ds = new Set(allMatches.map(m => m.date.slice(0, 10)))
    return Array.from(ds).sort()
  }, [allMatches])

  const filtered = useMemo(() => {
    return allMatches.filter(m => {
      if (stage !== 'all' && m.stage !== stage) return false
      if (date !== 'all' && !m.date.startsWith(date)) return false
      return true
    })
  }, [stage, date, allMatches])

  useEffect(() => {
    const t = requestAnimationFrame(() => setLoading(false))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      <div className="flex items-end gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-grass-pop" />
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">赛程</h1>
      </div>
      <p className="text-sm text-muted mb-8 ml-4">104 场比赛 · 小组赛至决赛</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-1.5 flex-wrap">
          {STAGES.map(s => (
            <button key={s.value} onClick={() => setStage(s.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                stage === s.value ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setDate('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              date === 'all' ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
            }`}
          >
            全部日期
          </button>
          {dates.map(d => (
            <button key={d} onClick={() => setDate(d)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                date === d ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
              }`}
            >
              {d.slice(5)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((match, i) => (
            <MatchCard key={match.id} match={match} index={i} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-muted text-center py-16">无符合条件的比赛</p>
      )}
    </main>
  )
}
