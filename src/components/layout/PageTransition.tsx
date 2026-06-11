'use client'

import { useRef, useEffect, ReactNode } from 'react'
import gsap from 'gsap'

export default function PageTransition({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(wrapRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power2.out',
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="min-h-screen pt-16">
      {children}
    </div>
  )
}
