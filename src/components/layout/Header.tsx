'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const NAV = [
  { href: '/', label: '首页', emoji: '⚽' },
  { href: '/matches', label: '赛程', emoji: '📅' },
  { href: '/teams', label: '球队', emoji: '🏴' },
  { href: '/venues', label: '场馆', emoji: '🏟️' },
]

export default function Header() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out' })
    }, headerRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <header ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100] glass-panel rounded-none border-x-0 border-t-0 mx-0"
      >
        <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg tracking-tight no-underline group">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-base transition-all group-hover:bg-accent/20 group-hover:scale-110 group-hover:shadow-glow">
              ⚽
            </div>
            <span className="font-display">
              <span className="text-primary">WC</span>
              <span className="text-gradient">26</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV.map(item => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link href={item.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-accent/10 text-accent shadow-glow'
                        : 'text-secondary hover:text-primary hover:bg-hover'
                    }`}
                  >
                    <span className="text-sm">{item.emoji}</span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
            onClick={() => setOpen(v => !v)} aria-label="菜单">
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            )}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[99] md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute top-0 right-0 h-full w-72 bg-deep border-l border-subtle p-6 pt-24 shadow-lg" onClick={e => e.stopPropagation()}>
            <ul className="flex flex-col gap-2">
              {NAV.map(item => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link href={item.href}
                      className={`flex items-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                        active ? 'bg-accent/10 text-accent' : 'text-secondary hover:text-primary hover:bg-hover'
                      }`}
                    >
                      <span>{item.emoji}</span> {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
