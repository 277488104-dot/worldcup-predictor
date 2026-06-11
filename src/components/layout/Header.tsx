'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
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
        <ul className="flex gap-1">
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
      </nav>
    </header>
  )
}
