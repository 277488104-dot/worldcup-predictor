import Link from 'next/link'
import type { Team } from '@/types/worldcup'
import { getRankTier } from '@/lib/constants'

export default function TeamCard({ team }: { team: Team }) {
  const tier = getRankTier(team.fifaRank)

  return (
    <Link href={`/teams/${team.id}`}
      className="card-glass p-5 flex items-center gap-4 no-underline group"
    >
      <span className="text-3xl group-hover:scale-110 transition-transform">{team.flagUrl}</span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-chalk truncate">{team.nameCn}</div>
        <div className="text-[10px] text-dim">{team.name}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-xs font-bold" style={{ color: tier.color }}>#{team.fifaRank}</div>
        <span className={`badge badge-rank-${tier.label.toLowerCase()} text-[8px]`}>{tier.label}</span>
      </div>
    </Link>
  )
}
