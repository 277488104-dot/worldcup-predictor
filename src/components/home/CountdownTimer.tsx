'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex gap-3 justify-center">
      {[
        { label: 'DAYS', value: time.days },
        { label: 'HOURS', value: time.hours },
        { label: 'MINS', value: time.mins },
        { label: 'SECS', value: time.secs },
      ].map(({ label, value }) => (
        <div key={label}
          className="bg-black/40 border border-white/5 rounded-xl min-w-[72px] py-3 px-4 text-center"
        >
          <div className="font-mono text-2xl md:text-3xl font-black text-grass-pop num-glow tabular-nums">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-[8px] text-muted tracking-[0.2em] mt-1 font-bold">{label}</div>
        </div>
      ))}
    </div>
  )
}
