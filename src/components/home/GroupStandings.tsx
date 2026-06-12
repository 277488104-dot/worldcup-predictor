import { getGroups } from '@/lib/data'
import standingsData from '@/../public/data/standings.json'

interface StandingRow {
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  position: number | null
  advanced: boolean | null
}

const standings = standingsData as Record<string, StandingRow[]>

export default function GroupStandings() {
  const groups = getGroups()
  const hasData = Object.keys(standings).length > 0

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
          const rows = standings[group.name] || []
          return (
            <div key={group.id} className="card-glass p-5">
              <div className="kicker kicker-green mb-4">GROUP {group.name}</div>

              {hasData && rows.length > 0 ? (
                /* Live standings table */
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[9px] text-muted border-b border-white/5">
                      <th className="text-left py-1.5 font-medium">球队</th>
                      <th className="text-center px-1 py-1.5 font-medium">赛</th>
                      <th className="text-center px-1 py-1.5 font-medium">胜</th>
                      <th className="text-center px-1 py-1.5 font-medium">平</th>
                      <th className="text-center px-1 py-1.5 font-medium">负</th>
                      <th className="text-center px-1 py-1.5 font-medium">进/失</th>
                      <th className="text-center px-1 py-1.5 font-medium">净</th>
                      <th className="text-right py-1.5 font-medium text-grass-pop">分</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => {
                      const isTop2 = i < 2
                      const gd = row.goalDifference
                      return (
                        <tr key={row.team} className={`border-b border-white/[0.02] ${isTop2 ? 'text-chalk' : 'text-muted'}`}>
                          <td className="py-2 font-semibold">
                            <span className={`inline-block w-1 h-2.5 rounded-full mr-1.5 align-middle ${
                              isTop2 ? 'bg-grass-pop' : ''
                            }`} />
                            {row.team}
                          </td>
                          <td className="text-center text-dim">{row.played}</td>
                          <td className="text-center">{row.won}</td>
                          <td className="text-center text-dim">{row.drawn}</td>
                          <td className="text-center">{row.lost}</td>
                          <td className="text-center text-[9px] font-mono">
                            <span className="text-grass-pop">{row.goalsFor}</span>
                            <span className="text-muted">/</span>
                            <span className="text-gold">{row.goalsAgainst}</span>
                          </td>
                          <td className={`text-center font-mono font-bold ${gd > 0 ? 'text-grass-pop' : gd < 0 ? 'text-danger' : 'text-dim'}`}>
                            {gd > 0 ? '+' : ''}{gd}
                          </td>
                          <td className="text-right font-mono font-black text-grass-pop">{row.points}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : (
                /* Fallback: just list teams */
                <div className="space-y-2">
                  {group.teamIds.map((_tid, i) => (
                    <div key={_tid} className="flex items-center gap-2 py-1.5 px-2 text-xs text-muted">
                      <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[9px]">{i + 1}</span>
                      <span>—</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
