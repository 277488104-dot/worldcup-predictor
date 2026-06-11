'use client'

import { STAGE_LABELS } from '@/lib/constants'

interface Props {
  selectedStage: string
  selectedDate: string
  onStageChange: (stage: string) => void
  onDateChange: (date: string) => void
  dates: string[]
}

export default function MatchFilter({ selectedStage, selectedDate, onStageChange, onDateChange, dates }: Props) {
  const stages = Object.entries(STAGE_LABELS)

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onStageChange('all')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedStage === 'all' ? 'bg-accent text-bg' : 'bg-surface text-muted hover:text-white'
        }`}
      >
        全部
      </button>
      {stages.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onStageChange(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStage === key ? 'bg-accent text-bg' : 'bg-surface text-muted hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
      <select
        value={selectedDate}
        onChange={e => onDateChange(e.target.value)}
        className="ml-auto bg-surface text-sm rounded-lg px-4 py-2 border border-white/10 text-muted"
      >
        <option value="all">全部日期</option>
        {dates.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  )
}
