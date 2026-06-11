'use client'

import { useEffect, useRef, useState } from 'react'

interface StatProgressProps {
  label: string
  value: number
  color?: 'green' | 'gold' | 'muted' | 'danger'
  icon?: string
}

const colorMap = {
  green: 'progress-fill-green',
  gold: 'progress-fill-gold',
  muted: 'progress-fill-muted',
  danger: 'progress-fill-danger',
}

export default function StatProgress({ label, value, color = 'green', icon }: StatProgressProps) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(value) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-chalk/80 font-medium">
          {icon && <span className="mr-1">{icon}</span>}
          {label}
        </span>
        <span className="font-mono text-xs text-grass-pop font-bold">{value}</span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill ${colorMap[color]}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
