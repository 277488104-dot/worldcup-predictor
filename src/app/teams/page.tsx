import { getGroups, getTeamsByGroup } from '@/lib/data'
import TeamCard from '@/components/teams/TeamCard'



export default function TeamsPage() {
  const groups = getGroups()

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-2">球队</h1>
      <p className="text-muted mb-12">48 支参赛队伍 · 12 个小组</p>

      {groups.map(group => (
        <section key={group.id} className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-accent">小组 {group.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getTeamsByGroup(group.id).map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
