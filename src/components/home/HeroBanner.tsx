'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CountdownTimer from '@/components/home/CountdownTimer'

export default function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15 }
      )
      gsap.fromTo('.hero-sub',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power3.out' }
      )
      gsap.fromTo('.hero-timer',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-bg px-4 py-20"
    >
      {/* Radial dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-3xl">
        <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          2026{' '}
          <span className="text-accent">世界杯</span>
        </h1>

        <p className="hero-sub text-muted text-lg md:text-xl max-w-xl">
          48 支球队 · 16 个场馆 · 104 场比赛 · 智能预测分析
        </p>

        <p className="hero-sub text-sm text-muted/60">
          美国 · 加拿大 · 墨西哥 联合主办
        </p>

        <div className="hero-timer mt-8">
          <CountdownTimer targetDate="2026-06-11T12:00:00-05:00" />
        </div>
      </div>
    </section>
  )
}
