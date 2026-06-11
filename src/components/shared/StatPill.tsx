interface StatPillProps {
  icon?: string
  label: string
  value: number | string
  color?: 'green' | 'gold'
}

const colorClasses = {
  green: 'bg-grass-pop/8 border-grass-pop/15 text-grass-pop',
  gold: 'bg-gold/8 border-gold/15 text-gold',
}

export default function StatPill({ icon, label, value, color = 'green' }: StatPillProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${colorClasses[color]}`}>
      {icon && <span>{icon}</span>}
      {label}
      <span className="font-mono font-bold">{value}</span>
    </span>
  )
}
