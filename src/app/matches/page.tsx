'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getAllMatches } from '@/lib/data'
import MatchCard from '@/components/matches/MatchCard'
import MatchFilter from '@/components/matches/MatchFilter'
import PageTransition from '@/components/layout/PageTransition'

export default function MatchesPage() {
  const [stage, setStage] = useState('all')
  const [date, setDate] = useState('all')
  const titleRef = useRef<HTMLHeadingElement>(null)

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
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: -30, opacity: 0, duration: 0.5 })
    }, titleRef)
    return () => ctx.revert()
  }, [])

  return (
    <PageTransition>
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 ref={titleRef} className="text-4xl font-bold mb-2">赛程</h1>
      <p className="text-muted mb-8">104 场比赛 · 小组赛至决赛</p>

      <MatchFilter
        selectedStage={stage}
        selectedDate={date}
        onStageChange={setStage}
        onDateChange={setDate}
        dates={dates}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((match, i) => (
          <MatchCard key={match.id} match={match} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted text-center py-12">无符合条件的比赛</p>
      )}
    </main>
    </PageTransition>
  )
}
