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

  const inAnim = useCallback(() => {
    ctxRef.current?.add(() => gsap.to(cardRef.current, { y: -6, scale: 1.02, duration: .3, ease: 'power2.out' }))
  }, [])
  const outAnim = useCallback(() => {
    ctxRef.current?.add(() => gsap.to(cardRef.current, { y: 0, scale: 1, duration: .3, ease: 'power2.out' }))
  }, [])

  return (
    <Link href={`/venues/${venue.id}`} className="block"
      onMouseEnter={inAnim} onMouseLeave={outAnim}>
      <div ref={cardRef} className="card overflow-hidden">
        {/* Header image placeholder */}
        <div className="h-36 bg-gradient-to-br from-bg-elevated via-bg-card to-bg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-stars opacity-30" />
          <span className="text-5xl opacity-20 relative z-10">🏟️</span>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-card to-transparent" />
        </div>
        <div className="p-4">
          <h4 className="font-bold text-sm text-text-primary">{venue.name}</h4>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted">
            <span>{venue.city}, {venue.country}</span>
            <span className="w-1 h-1 rounded-full bg-muted/30" />
            <span className="font-semibold text-text-secondary">{(venue.capacity / 1000).toFixed(0)}k 座</span>
          </div>
          {venue.altitude > 500 && (
            <div className="mt-2 text-[10px] text-accent/70 bg-accent/5 px-2 py-0.5 rounded-full inline-block">
              🏔️ 海拔 {venue.altitude}m
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
