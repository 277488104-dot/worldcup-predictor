'use client'

import { useState, useEffect } from 'react'
import AnimatedNumber from '@/components/shared/AnimatedNumber'

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="flex gap-4 md:gap-8">
      {[
        { label: '天', value: remaining.days },
        { label: '时', value: remaining.hours },
        { label: '分', value: remaining.minutes },
        { label: '秒', value: remaining.seconds },
      ].map(item => (
        <div key={item.label} className="text-center">
          <div className="bg-surface/80 backdrop-blur rounded-xl px-4 py-3 min-w-[80px] border border-white/10">
            <AnimatedNumber value={item.value} className="text-3xl md:text-5xl font-bold text-accent font-mono" />
          </div>
          <div className="text-xs text-muted mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
