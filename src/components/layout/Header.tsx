'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const NAV = [
  { href: '/', label: '首页' },
  { href: '/matches', label: '赛程' },
  { href: '/teams', label: '球队' },
  { href: '/venues', label: '场馆' },
]

export default function Header() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: -80, opacity: 0, duration: 0.6, ease: 'power3.out' })
    }, headerRef)
    return () => ctx.revert()
  }, [])

  return (
    <header ref={headerRef} className="fixed top-0 z-50 w-full bg-bg/90 backdrop-blur-md border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-accent">⚽</span>{' '}
          <span className="text-white">2026</span>
          <span className="text-muted">·世界杯</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-1">
          {NAV.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:text-white hover:bg-surface'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted hover:text-white transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="菜单"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>

        {/* Mobile drawer overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />
            {/* Panel */}
            <div
              className="absolute top-0 right-0 h-full w-64 bg-bg border-l border-white/10 p-6 pt-20"
              onClick={e => e.stopPropagation()}
            >
              <ul className="flex flex-col gap-2">
                {NAV.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-accent/10 text-accent'
                          : 'text-muted hover:text-white hover:bg-surface'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
