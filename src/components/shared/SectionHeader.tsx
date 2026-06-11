interface SectionHeaderProps {
  kicker?: string
  kickerColor?: 'green' | 'gold'
  title: React.ReactNode
  subtitle?: string
}

export default function SectionHeader({ kicker, kickerColor = 'green', title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-end gap-3 mb-8">
      <div className={`w-1 h-7 rounded-full ${kickerColor === 'green' ? 'bg-grass-pop' : 'bg-gold'}`} />
      <div className="flex-1">
        {kicker && (
          <div className={`kicker ${kickerColor === 'green' ? 'kicker-green' : 'kicker-gold'} mb-1`}>
            {kicker}
          </div>
        )}
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-chalk">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
