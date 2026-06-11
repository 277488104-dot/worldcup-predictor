'use client'

import { useState, useEffect } from 'react'

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    setReady(true)
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const items = [
    { v: t.d, l: 'Days' },
    { v: t.h, l: 'Hours' },
    { v: t.m, l: 'Minutes' },
    { v: t.s, l: 'Seconds' },
  ]

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6">
      {items.map((item, i) => (
        <div key={item.l} className="flex items-center gap-4 md:gap-6">
          {i > 0 && (
            <span className="text-2xl md:text-4xl text-white/8 font-thin -mt-8 select-none">:</span>
          )}
          <div className={`flex flex-col items-center gap-3 ${ready ? 'animate-countIn' : 'opacity-0'}`}
            style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
            {/* Number box */}
            <div className="glass-card rounded-2xl px-6 py-5 md:px-9 md:py-7 min-w-[80px] md:min-w-[110px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
              {/* Top shine */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              {/* Number */}
              <span className="font-number text-5xl md:text-7xl font-bold text-accent tracking-[0.02em] tabular-nums"
                style={{ textShadow: '0 0 30px rgba(0,229,255,0.3)' }}>
                {String(item.v).padStart(2, '0')}
              </span>
            </div>
            {/* Label */}
            <span className="text-[10px] md:text-xs text-tertiary tracking-[0.2em] uppercase font-bold">
              {item.l}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
