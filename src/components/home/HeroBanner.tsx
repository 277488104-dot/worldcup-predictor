'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CountdownTimer from '@/components/home/CountdownTimer'

gsap.registerPlugin(ScrollTrigger)

const HOSTS = [
  { flag: '🇺🇸', name: 'United States', cn: '美国' },
  { flag: '🇲🇽', name: 'Mexico', cn: '墨西哥' },
  { flag: '🇨🇦', name: 'Canada', cn: '加拿大' },
]

export default function HeroBanner() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-reveal', {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.15,
      }, '+=0.2')

      tl.from('.hero-flag', {
        y: 30, opacity: 0, scale: 0.7, duration: 0.6, stagger: 0.1,
      }, '-=0.3')

      tl.from('.hero-cta', {
        y: 20, opacity: 0, duration: 0.7,
      }, '-=0.2')

      // Parallax scroll effect on background orbs
      gsap.to('.hero-orb', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 py-28"
      style={{ background: 'var(--bg-deep)' }}
    >
      {/* Ambient glow orbs */}
      <div className="hero-orb absolute top-[-10%] left-[-15%] w-[70vw] h-[70vw] rounded-full bg-accent/8 blur-[150px] animate-floatSlow pointer-events-none" />
      <div className="hero-orb absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple/6 blur-[120px] animate-floatSlow pointer-events-none" style={{ animationDelay: '-4s' }} />
      <div className="hero-orb absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-passion/4 blur-[100px] animate-floatSlow pointer-events-none" style={{ animationDelay: '-2s' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-12 max-w-6xl">

        {/* ===== Top: Host Flags Row ===== */}
        <div className="flex items-center gap-8 md:gap-16">
          {HOSTS.map(h => (
            <div key={h.cn} className="hero-flag flex flex-col items-center gap-2">
              <span className="flag-premium text-4xl md:text-5xl">{h.flag}</span>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-secondary tracking-[0.2em] uppercase font-semibold">{h.name}</span>
                <span className="text-[9px] text-tertiary">{h.cn}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Middle: Massive Title ===== */}
        <div>
          <p className="hero-reveal text-xs md:text-sm text-tertiary tracking-[0.3em] uppercase font-semibold mb-8">
            The Biggest Stage in Football
          </p>

          <h1 className="hero-reveal">
            <span className="block font-display text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-[-0.04em] leading-[0.85] text-primary">
              WORLD
              <br />
              <span className="text-gradient">CUP 26</span>
            </span>
          </h1>

          <div className="hero-reveal flex items-center justify-center gap-4 mt-8">
            <div className="accent-line" />
            <p className="text-sm md:text-base text-secondary font-medium tracking-wide">
              48 Nations · 16 Venues · 104 Matches · 1 Dream
            </p>
            <div className="accent-line" style={{ transform: 'rotate(180deg)' }} />
          </div>
        </div>

        {/* ===== Bottom: Countdown CTA ===== */}
        <div className="hero-cta text-center">
          <p className="text-[11px] text-tertiary tracking-[0.25em] uppercase font-semibold mb-8">
            Countdown to Kickoff
          </p>

          <CountdownTimer targetDate="2026-06-11T12:00:00-05:00" />

          {/* Quick actions */}
          <div className="flex items-center gap-3 mt-10">
            <a href="#today"
              className="glass-card rounded-full px-6 py-3 text-sm font-semibold text-secondary hover:text-primary no-underline inline-flex items-center gap-2 transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              今日赛程
            </a>
            <a href="#predict"
              className="glass-card rounded-full px-6 py-3 text-sm font-semibold text-accent no-underline inline-flex items-center gap-2 transition-all duration-300 hover:bg-accent/10">
              🎯 开始预测
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[9px] text-tertiary tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
