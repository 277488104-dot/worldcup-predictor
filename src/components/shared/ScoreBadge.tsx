interface ScoreBadgeProps {
  homeCode: string
  awayCode: string
  homeScore?: number
  awayScore?: number
  status: 'scheduled' | 'live' | 'finished'
  minute?: number
}

export default function ScoreBadge({ homeCode, awayCode, homeScore, awayScore, status }: ScoreBadgeProps) {
  const isLive = status === 'live'
  const hasScore = homeScore !== undefined && awayScore !== undefined

  return (
    <div className="flex items-center gap-3">
      <span className="font-bold text-base text-chalk">{homeCode}</span>
      {hasScore ? (
        <>
          <span className={`font-mono text-4xl font-black tabular-nums ${isLive ? 'text-grass-pop num-glow' : 'text-chalk'}`}>
            {homeScore}
          </span>
          <span className="text-muted text-2xl font-light">:</span>
          <span className={`font-mono text-4xl font-black tabular-nums ${isLive ? 'text-chalk' : 'text-chalk'}`}>
            {awayScore}
          </span>
        </>
      ) : (
        <span className="text-2xl font-black text-muted/30">VS</span>
      )}
      <span className="font-bold text-base text-chalk">{awayCode}</span>
    </div>
  )
}
