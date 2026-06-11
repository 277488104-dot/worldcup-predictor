'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CountdownTimer from '@/components/home/CountdownTimer'

export default function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      gsap.fromTo('.hero-sub',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power3.out' }
      )
      gsap.fromTo('.hero-timer',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, delay: 0.6, ease: 'back.out(1.4)' }
      )
      gsap.fromTo('.hero-flag',
        { opacity: 0, scale: 0.5, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.6, stagger: 0.15, delay: 0.8, ease: 'back.out(1.5)' }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef}
      className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-bg px-4 py-24"
    >
      {/* Layered backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1d3a] to-bg animate-gradient" />
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(0,212,255,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.2) 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, rgba(240,192,64,0.1) 0%, transparent 70%)',
        }}
      />
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06] bg-stadium" />

      {/* Floating accent orbs */}
      <div className="absolute top-1/4 left-[10%] w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-[8%] w-80 h-80 bg-knockout/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-[60%] left-[40%] w-48 h-48 bg-cta/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-5s' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-4xl">
        {/* Host flags row */}
        <div className="hero-flag flex items-center gap-4 md:gap-6 mb-2">
          {[
            { flag: '🇺🇸', label: '美国' },
            { flag: '🇨🇦', label: '加拿大' },
            { flag: '🇲🇽', label: '墨西哥' },
          ].map((h) => (
            <div key={h.label} className="flex flex-col items-center gap-1 opacity-60">
              <span className="text-4xl md:text-5xl">{h.flag}</span>
              <span className="text-[10px] text-muted tracking-wider uppercase">{h.label}</span>
            </div>
          ))}
        </div>

        {/* Main title */}
        <h1 className="hero-title">
          <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white">
            FIFA WORLD CUP
          </span>
          <span className="block text-3xl md:text-5xl lg:text-6xl font-extrabold mt-3">
            <span className="text-accent text-glow">2026</span>
          </span>
        </h1>

        <p className="hero-sub text-muted text-lg md:text-xl max-w-xl leading-relaxed">
          48 支球队 · 16 个场馆 · 104 场比赛<br />
          <span className="text-accent/80 font-semibold">智能预测 · 深度分析</span>
        </p>

        {/* Countdown */}
        <div className="hero-timer mt-4">
          <p className="text-xs text-muted/50 mb-4 tracking-widest uppercase">距离开幕</p>
          <CountdownTimer targetDate="2026-06-11T12:00:00-05:00" />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30">
          <div className="w-5 h-8 border border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
