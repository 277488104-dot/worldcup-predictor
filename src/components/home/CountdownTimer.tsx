'use client'

import { useState, useEffect } from 'react'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  const items = [
    { label: '天', value: remaining.days },
    { label: '时', value: remaining.hours },
    { label: '分', value: remaining.minutes },
    { label: '秒', value: remaining.seconds },
  ]

  return (
    <div className="flex gap-3 md:gap-5">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3 md:gap-5">
          {i > 0 && <span className="text-2xl md:text-4xl text-muted/20 font-light mt-[-20px]">:</span>}
          <div className="text-center">
            <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl px-5 py-4 md:px-7 md:py-5 min-w-[72px] md:min-w-[100px] border border-white/10 overflow-hidden animate-pulse-glow">
              {/* Shine line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className={`text-4xl md:text-6xl font-black font-mono text-accent tracking-[0.05em] transition-all duration-300 ${mounted ? 'text-glow' : 'text-muted/30'}`}>
                {pad(item.value)}
              </span>
            </div>
            <span className="text-[10px] md:text-xs text-muted/50 mt-2 block tracking-widest uppercase">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
