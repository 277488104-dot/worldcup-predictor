'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value && ref.current) {
      gsap.fromTo(ref.current,
        { textContent: prev.current, duration: 0 },
        { textContent: value, duration: 0.4, snap: { textContent: 1 }, ease: 'power2.out' }
      )
    }
    prev.current = value
  }, [value])

  return <span ref={ref} className={className}>{value}</span>
}
