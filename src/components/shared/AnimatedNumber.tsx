'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prev.current !== value && containerRef.current) {
        gsap.fromTo(containerRef.current,
          { textContent: prev.current, duration: 0 },
          { textContent: value, duration: 0.4, snap: { textContent: 1 }, ease: 'power2.out' }
        )
      }
    }, containerRef)

    prev.current = value
    return () => ctx.revert()
  }, [value])

  return <span ref={containerRef} className={className}>{value}</span>
}
