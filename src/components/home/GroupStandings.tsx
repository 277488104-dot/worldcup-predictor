import { getGroups, getTeamsByGroup } from '@/lib/data'
import { getRankTier } from '@/lib/constants'

export default function GroupStandings() {
  const groups = getGroups() // Show all 12 groups

  return (
    <section className="py-24 px-5 max-w-7xl mx-auto">
      <div className="divider-green mb-24" />

      <div className="flex items-end gap-3 mb-10">
        <div className="w-1 h-7 rounded-full bg-gold" />
        <div>
          <div className="kicker kicker-gold mb-1">STANDINGS</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-chalk">
            小组<span className="text-gold">积分榜</span>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map(group => {
          const teams = getTeamsByGroup(group.id)
          return (
            <div key={group.id} className="card-glass p-5">
              <div className="kicker kicker-green mb-4">GROUP {group.name}</div>
              <div className="space-y-2">
                {teams.map((team, i) => {
                  const tier = getRankTier(team.fifaRank)
                  return (
                    <div key={team.id}
                      className={`flex items-center gap-3 py-2 px-3 rounded-lg text-xs ${i === 0 ? 'bg-grass-pop/5' : ''}`}
                    >
                      <span className="text-base">{team.flagUrl}</span>
                      <span className={`font-bold flex-1 ${i < 2 ? 'text-chalk' : 'text-muted'}`}>{team.nameCn}</span>
                      <span className="font-mono font-bold text-[10px]" style={{ color: tier.color }}>#{team.fifaRank}</span>
                      <span className={`badge badge-rank-${tier.label.toLowerCase()}`}>{tier.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
