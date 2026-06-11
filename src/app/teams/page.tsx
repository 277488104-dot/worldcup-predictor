'use client'

import { useState } from 'react'
import { getGroups, getTeamsByGroup } from '@/lib/data'
import TeamCard from '@/components/teams/TeamCard'

const CONFEDERATION_ICONS: Record<string, string> = {
  '全部': '🌍',
  'AFC': '🌏',
  'CAF': '🌍',
  'CONCACAF': '🌎',
  'CONMEBOL': '🌎',
  'OFC': '🌏',
  'UEFA': '🇪🇺',
}

const CONFEDERATIONS = ['全部', 'AFC', 'CAF', 'CONCACAF', 'CONMEBOL', 'OFC', 'UEFA']

export default function TeamsPage() {
  const groups = getGroups()
  const [conf, setConf] = useState('全部')

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      <div className="flex items-end gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-grass-pop" />
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">球队</h1>
      </div>
      <p className="text-sm text-muted mb-8 ml-4">48 支参赛队伍 · 12 个小组</p>

      <div className="flex gap-1.5 flex-wrap mb-10">
        {CONFEDERATIONS.map(c => (
          <button key={c} onClick={() => setConf(c)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              conf === c ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
            }`}
          >
            {CONFEDERATION_ICONS[c]} {c}
          </button>
        ))}
      </div>

      {groups.map(group => {
        const teams = getTeamsByGroup(group.id).filter(t => conf === '全部' || t.confederation === conf)
        if (!teams.length) return null
        return (
          <section key={group.id} className="mb-10">
            <h2 className="kicker kicker-green mb-4">GROUP {group.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {teams.map(team => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
