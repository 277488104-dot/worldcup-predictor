'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CountdownTimer from '@/components/home/CountdownTimer'

gsap.registerPlugin(ScrollTrigger)

const HOSTS = ['🇺🇸 美国', '🇲🇽 墨西哥', '🇨🇦 加拿大']

export default function HeroBanner() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-kicker', { y: 30, opacity: 0, duration: 0.7 }, '+=0.3')
      tl.from('.hero-title-line', { y: 60, opacity: 0, duration: 0.9, stagger: 0.15 }, '-=0.3')
      tl.from('.hero-hosts', { y: 20, opacity: 0, duration: 0.6 }, '-=0.2')
      tl.from('.hero-countdown', { y: 30, opacity: 0, scale: 0.95, duration: 0.7 }, '-=0.2')
      tl.from('.hero-cta', { y: 20, opacity: 0, duration: 0.6 }, '-=0.2')

      gsap.to('.hero-stripes', {
        y: -120,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })

      gsap.to('.hero-orb', {
        y: -60, scale: 1.1,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.4 },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 py-28">
      <div className="hero-orb absolute top-[-15%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-grass-pop/4 blur-[180px] pointer-events-none" />
      <div className="hero-orb absolute bottom-[-15%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-gold/3 blur-[150px] pointer-events-none" style={{ animationDelay: '-3s' }} />
      <div className="hero-orb absolute top-[30%] left-[25%] w-[50vw] h-[50vw] rounded-full bg-emerald/3 blur-[120px] pointer-events-none" style={{ animationDelay: '-6s' }} />

      <div className="hero-stripes absolute inset-0 pitch-stripes opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center gap-10 max-w-5xl">
        <p className="hero-kicker kicker kicker-green">
          June 11 — July 19 · United States · Mexico · Canada
        </p>

        <h1>
          <span className="hero-title-line block font-display text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-[-0.04em] leading-[0.82] text-chalk">
            THE
          </span>
          <span className="hero-title-line block font-display text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-[-0.04em] leading-[0.82] text-gradient-green">
            BEAUTIFUL
          </span>
          <span className="hero-title-line block font-display text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-[-0.04em] leading-[0.82] text-chalk">
            GAME
          </span>
        </h1>

        <div className="hero-hosts flex items-center gap-6 text-sm text-muted/50 font-medium tracking-wide">
          <span className="h-px w-10 bg-grass-pop/30" />
          {HOSTS.join(' · ')} · 48 Nations · 104 Matches
          <span className="h-px w-10 bg-grass-pop/30" />
        </div>

        <div className="hero-countdown">
          <p className="kicker kicker-green text-center mb-6">COUNTDOWN TO KICKOFF</p>
          <CountdownTimer targetDate="2026-06-11T12:00:00-05:00" />
        </div>

        <div className="hero-cta flex gap-3">
          <a href="#today" className="btn-primary">📅 今日赛程</a>
          <a href="/compare" className="btn-ghost">🎯 AI 预测</a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
        <span className="text-[9px] text-muted tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-grass-pop/30 to-transparent" />
      </div>
    </section>
  )
}
