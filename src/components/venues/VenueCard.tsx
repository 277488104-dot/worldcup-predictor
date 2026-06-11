'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import type { Venue } from '@/types/worldcup'

export default function VenueCard({ venue }: { venue: Venue }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    ctxRef.current = gsap.context(() => {}, cardRef)
    return () => ctxRef.current?.revert()
  }, [])

  const animateIn = useCallback(() => {
    ctxRef.current?.add(() => {
      gsap.to(cardRef.current, { y: -8, scale: 1.02, duration: 0.3, ease: 'power2.out' })
    })
  }, [])

  const animateOut = useCallback(() => {
    ctxRef.current?.add(() => {
      gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
    })
  }, [])

  const capacityStr = (venue.capacity / 1000).toFixed(0) + 'k'

  return (
    <Link href={`/venues/${venue.id}`} aria-label={`${venue.name} - ${venue.city}, ${capacityStr} capacity`}>
      <div ref={cardRef} className="bg-surface rounded-2xl border border-white/5 overflow-hidden group"
        onMouseEnter={animateIn}
        onMouseLeave={animateOut}>
        <div className="h-40 bg-gradient-to-br from-surface-light to-surface flex items-center justify-center">
          <span className="text-4xl opacity-30">🏟️</span>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-sm">{venue.name}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted">
            <span>{venue.city}</span>
            <span>·</span>
            <span>{capacityStr} 座</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
