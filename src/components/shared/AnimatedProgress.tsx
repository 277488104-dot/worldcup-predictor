'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AnimatedProgress({ value, color }: { value: number; color: string }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(barRef.current, {
        width: '0%', duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: barRef.current, start: 'top 90%' },
      })
    }, barRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="h-2.5 bg-surface-light rounded-full overflow-hidden">
      <div ref={barRef} className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  )
}
