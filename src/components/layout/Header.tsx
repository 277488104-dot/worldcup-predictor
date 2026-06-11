'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const NAV = [
  { href: '/', label: '首页', icon: '⚽' },
  { href: '/matches', label: '赛程', icon: '📅' },
  { href: '/teams', label: '球队', icon: '🏴' },
  { href: '/venues', label: '场馆', icon: '🏟️' },
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
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-[100] glass-panel">
        <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg no-underline group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4ade80] to-[#22c55e] flex items-center justify-center text-sm text-pitch font-black transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(74,222,128,.3)]">
              ⚽
            </div>
            <span className="font-display text-chalk">
              WC<span className="text-grass-pop">26</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {NAV.map(item => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link href={item.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-[#4ade80]/10 text-grass-pop'
                        : 'text-muted hover:text-chalk hover:bg-white/5'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <Link href="/compare" className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gold bg-gold/5 hover:bg-gold/10 transition-all">
            ⚡ 对比
          </Link>

          <button className="md:hidden p-2 text-muted hover:text-chalk" onClick={() => setOpen(v => !v)} aria-label="菜单">
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            )}
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[99] md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute top-0 right-0 h-full w-72 bg-turf border-l border-white/5 p-6 pt-24" onClick={e => e.stopPropagation()}>
            <ul className="flex flex-col gap-2">
              {NAV.map(item => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link href={item.href}
                      className={`flex items-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                        active ? 'bg-grass-pop/10 text-grass-pop' : 'text-muted hover:text-chalk hover:bg-white/5'
                      }`}
                    >
                      <span>{item.icon}</span> {item.label}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link href="/compare" className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold text-gold bg-gold/5">
                  ⚡ 对比
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
