'use client'

import { useState } from 'react'
import { getGroups, getTeamsByGroup } from '@/lib/data'
import TeamCard from '@/components/teams/TeamCard'

const CONFEDERATION_ICONS: Record<string, string> = {
  '全部': '🌍', 'AFC': '🌏', 'CAF': '🌍',
  'CONCACAF': '🌎', 'CONMEBOL': '🌎', 'OFC': '🌏', 'UEFA': '🇪🇺',
}
const CONFEDERATIONS = ['全部', 'AFC', 'CAF', 'CONCACAF', 'CONMEBOL', 'OFC', 'UEFA']

export default function TeamsPage() {
  const groups = getGroups()
  const [conf, setConf] = useState('全部')
  const [search, setSearch] = useState('')

  const visibleGroups = groups.map(group => {
    let teams = getTeamsByGroup(group.id)
      .filter(t => conf === '全部' || t.confederation === conf)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      teams = teams.filter(t =>
        t.nameCn.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.fifaCode.toLowerCase().includes(q) ||
        String(t.fifaRank).includes(q) ||
        group.name.toLowerCase().includes(q)
      )
    }
    return { ...group, teams }
  }).filter(g => g.teams.length > 0)

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      <div className="flex items-end gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-grass-pop" />
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">球队</h1>
      </div>
      <p className="text-sm text-muted mb-6 ml-4">48 支参赛队伍 · 12 个小组</p>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">🔍</span>
          <input
            type="text"
            placeholder="搜索球队名称、编号、小组..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0d220d] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-chalk placeholder:text-muted focus:outline-none focus:border-grass-pop/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-chalk text-sm px-1"
            >✕</button>
          )}
        </div>
        {search && (
          <p className="text-[10px] text-muted mt-2">
            找到 {visibleGroups.reduce((s, g) => s + g.teams.length, 0)} 支队伍
          </p>
        )}
      </div>

      {/* Confederation filters */}
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

      {visibleGroups.map(group => (
        <section key={group.id} className="mb-10">
          <h2 className="kicker kicker-green mb-4">GROUP {group.name}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {group.teams.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </section>
      ))}

      {visibleGroups.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl block mb-4 opacity-20">🔍</span>
          <p className="text-muted text-sm">没有找到匹配的球队</p>
          <button
            onClick={() => { setSearch(''); setConf('全部') }}
            className="text-grass-pop text-xs mt-2 hover:underline"
          >
            清除筛选
          </button>
        </div>
      )}
    </main>
  )
}
