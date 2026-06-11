# World Cup Predictor — 全站 UI 重设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 worldcup-predictor 7 个页面全部重写为"体育媒体风 × 绿茵场色调 × 三层叙事 × 炫技动画"的新 UI

**Architecture:** Foundation 先行（Tailwind 主题 + CSS 变量 + Layout 组件），再构建 Shared 组件库（LiveTicker/PredictionBar/ScoreBadge 等），最后逐页实现。保留 `src/lib/` 和 `public/data/` 不变。

**Tech Stack:** Next.js 14 App Router · Tailwind CSS 3 · GSAP 3.15 + ScrollTrigger · ECharts 6 · react-icons · TypeScript

---

## File Structure

```
src/
├── app/
│   ├── globals.css          # [REWRITE] Full design system
│   ├── layout.tsx           # [REWRITE] Metadata + layout shell
│   ├── page.tsx             # [REWRITE] Homepage
│   ├── matches/
│   │   ├── page.tsx         # [REWRITE] Match list
│   │   └── [id]/page.tsx    # [REWRITE] Match detail
│   ├── teams/
│   │   ├── page.tsx         # [REWRITE] Team list
│   │   └── [id]/page.tsx    # [REWRITE] Team detail
│   ├── venues/
│   │   └── [id]/page.tsx    # [REWRITE] Venue detail
│   └── compare/page.tsx     # [REWRITE] Head-to-head compare
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # [REWRITE]
│   │   └── Footer.tsx       # [REWRITE]
│   ├── home/
│   │   ├── HeroBanner.tsx   # [REWRITE] Fullscreen stadium hero
│   │   ├── CountdownTimer.tsx # [REWRITE] Animated countdown
│   │   ├── TodayMatches.tsx # [REWRITE] Match cards with prediction pills
│   │   └── GroupStandings.tsx # [NEW] Quick group table view
│   ├── matches/
│   │   ├── MatchCard.tsx    # [REWRITE]
│   │   ├── MatchFilter.tsx  # [REWRITE]
│   │   ├── RadarCompare.tsx # [REWRITE]
│   │   ├── PredictionCard.tsx # [REWRITE]
│   │   ├── H2HTimeline.tsx  # [REWRITE]
│   │   └── VenueFactor.tsx  # [REWRITE]
│   ├── teams/
│   │   └── TeamCard.tsx     # [REWRITE]
│   ├── shared/
│   │   ├── LiveTicker.tsx   # [NEW] Horizontal score scroller
│   │   ├── ScoreBadge.tsx   # [NEW] Match score display
│   │   ├── PredictionBar.tsx # [NEW] Win probability bars
│   │   ├── StatProgress.tsx  # [NEW] Stat progress bar
│   │   ├── StatPill.tsx     # [NEW] Stat tag pill
│   │   ├── AnimatedNumber.tsx # [REWRITE] Number counting animation
│   │   └── SectionHeader.tsx # [NEW] Consistent section headings
│   └── ui/
│       ├── Button.tsx       # [NEW] Primary/outline button variants
│       └── Badge.tsx        # [NEW] Status/rank badge
├── lib/                     # [UNCHANGED] Keep existing data layer
└── types/                   # [UNCHANGED] Keep existing types
tailwind.config.ts           # [REWRITE] New theme colors + animations
```

---

### Task 1: Foundation — Tailwind Config

**Files:**
- Rewrite: `tailwind.config.ts`

**What it does:** Defines the new green-pitch color palette, typography scale, and keyframe animations.

- [ ] **Step 1: Rewrite tailwind.config.ts with new theme**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        pitch: '#0a180a',
        turf: '#0d260d',
        grass: '#112d11',
        field: '#1a3d1a',
        'grass-pop': '#4ade80',
        emerald: '#22c55e',
        gold: '#f0c040',
        danger: '#ef4444',
        chalk: '#f5f5f0',
        muted: '#889988',
        dim: '#bbccbb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'ticker': 'ticker 30s linear infinite',
        'count-up': 'countUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(1.3)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Verify build doesn't break**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -20`
Expected: No new TypeScript errors from tailwind config change.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: rewrite tailwind config with green-pitch theme colors and animations"
```

---

### Task 2: Foundation — globals.css Design System

**Files:**
- Rewrite: `src/app/globals.css`

**What it does:** Replaces the old Newspaper CSS with the complete pitch-green design system. CSS variables, typography scale, utility classes for cards/badges/bars/buttons, and base styles.

- [ ] **Step 1: Write the new globals.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&family=JetBrains+Mono:wght@400;500;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================
   DESIGN SYSTEM — Green Pitch / Sports Media
   ============================================ */

:root {
  --pitch: #0a180a;
  --turf: #0d260d;
  --grass: #112d11;
  --field: #1a3d1a;
  --grass-pop: #4ade80;
  --emerald: #22c55e;
  --gold: #f0c040;
  --danger: #ef4444;
  --chalk: #f5f5f0;
  --muted: #889988;
  --dim: #bbccbb;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
::-webkit-scrollbar { display: none; }

body {
  background: var(--pitch);
  color: var(--chalk);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ========== Typography ========== */
.font-display { font-family: 'Inter', system-ui, sans-serif; letter-spacing: -0.04em; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.text-gradient-green {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-gradient-gold {
  background: linear-gradient(135deg, #f0c040, #eab308);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ========== Layout ========== */
.container-main { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-spacing { padding: 80px 0; }

/* ========== Cards ========== */
.card-glass {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-glass:hover {
  border-color: rgba(74,222,128,0.15);
  box-shadow: 0 4px 30px rgba(74,222,128,0.06);
  transform: translateY(-2px);
}
.card-elevated {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(74,222,128,0.08);
  border-radius: 16px;
}

/* ========== Badges ========== */
.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 100px;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.05em;
}
.badge-live {
  background: rgba(239,68,68,0.15); color: #ef4444;
}
.badge-stage {
  background: rgba(74,222,128,0.1); color: #4ade80;
}
.badge-rank-s { background: rgba(74,222,128,0.1); color: #4ade80; }
.badge-rank-a { background: rgba(34,197,94,0.1); color: #22c55e; }
.badge-rank-b { background: rgba(240,192,64,0.1); color: #f0c040; }
.badge-rank-c { background: rgba(249,115,22,0.1); color: #f97316; }
.badge-rank-d { background: rgba(239,68,68,0.1); color: #ef4444; }

/* ========== Buttons ========== */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a180a; border: none;
  border-radius: 100px; font-size: 14px; font-weight: 700;
  cursor: pointer; text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-primary:hover {
  transform: scale(1.03);
  box-shadow: 0 0 30px rgba(74,222,128,0.3);
}
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: rgba(255,255,255,0.04);
  color: var(--chalk); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 100px; font-size: 14px; font-weight: 600;
  cursor: pointer; text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-ghost:hover {
  border-color: rgba(74,222,128,0.3);
  background: rgba(74,222,128,0.05);
}

/* ========== Progress bar ========== */
.progress-bar {
  height: 8px; border-radius: 100px;
  background: rgba(255,255,255,0.04); overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: 100px;
  transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.progress-fill-green { background: linear-gradient(90deg, #4ade80, #22c55e); }
.progress-fill-gold { background: #f0c040; }
.progress-fill-muted { background: #889988; }
.progress-fill-danger { background: #ef4444; }

/* ========== Live dot ========== */
.live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #ef4444;
  animation: pulse-dot 1.5s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.5); }
}

/* ========== Section kicker ========== */
.kicker {
  font-size: 10px; letter-spacing: 0.3em;
  text-transform: uppercase; font-weight: 700;
}
.kicker-green { color: #4ade80; }
.kicker-gold { color: #f0c040; }

/* ========== Pitch stripes pattern ========== */
.pitch-stripes {
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 60px,
      rgba(74,222,128,0.03) 60px,
      rgba(74,222,128,0.03) 61px
    );
}

/* ========== Divider ========== */
.divider-green {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74,222,128,0.15), transparent);
}

/* ========== Number glow ========== */
.num-glow {
  text-shadow: 0 0 20px rgba(74,222,128,0.3);
}

/* ========== Glass panel (header) ========== */
.glass-panel {
  background: rgba(13,38,13,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(74,222,128,0.06);
}

/* ========== Scroll-triggered reveal ========== */
.reveal {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.visible {
  opacity: 1; transform: translateY(0);
}
```

- [ ] **Step 2: Verify**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: pitch-green design system — CSS variables, utilities, base styles"
```

---

### Task 3: Foundation — Layout Components (Header + Footer)

**Files:**
- Rewrite: `src/components/layout/Header.tsx`
- Rewrite: `src/components/layout/Footer.tsx`
- Rewrite: `src/app/layout.tsx`
- Delete: `src/components/layout/ScrollRefresh.tsx`
- Delete: `src/components/layout/PageTransition.tsx`
- Delete: `src/components/layout/PageTransitionWrapper.tsx`

**What it does:** Sticky glass-header with nav links, mobile drawer. Minimal footer. Clean layout.tsx.

- [ ] **Step 1: Rewrite Header.tsx**

```tsx
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
```

- [ ] **Step 2: Rewrite Footer.tsx**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="text-2xl mb-4">⚽</div>
        <p className="text-muted text-xs">
          WC26 Predictor · 数据仅供娱乐参考
        </p>
        <p className="text-dim text-[10px] mt-2">
          数据来源: FIFA · ESPN · Wikipedia
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Simplify layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'WC26 · 世界杯预测分析',
  description: '2026 FIFA World Cup — 赛程浏览 · 球队数据 · AI 智能预测',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-pitch text-chalk antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Delete old transition components (no longer needed with new design)**

Run: `rm /Users/daijin/web/worldcup-predictor/src/components/layout/ScrollRefresh.tsx /Users/daijin/web/worldcup-predictor/src/components/layout/PageTransition.tsx /Users/daijin/web/worldcup-predictor/src/components/layout/PageTransitionWrapper.tsx`

- [ ] **Step 5: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors. May see unused import warnings for deleted files — clean those up.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ src/app/layout.tsx
git commit -m "feat: rewrite Header/Footer with pitch-green glass styling, simplify layout"
```

---

### Task 4: Shared Components — StatProgress, StatPill, AnimatedNumber, SectionHeader

**Files:**
- Create: `src/components/shared/StatProgress.tsx`
- Create: `src/components/shared/StatPill.tsx`
- Rewrite: `src/components/shared/AnimatedNumber.tsx`
- Create: `src/components/shared/SectionHeader.tsx`

- [ ] **Step 1: Create StatProgress.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface StatProgressProps {
  label: string
  value: number       // 0-100
  color?: 'green' | 'gold' | 'muted' | 'danger'
  icon?: string
}

const colorMap = {
  green: 'progress-fill-green',
  gold: 'progress-fill-gold',
  muted: 'progress-fill-muted',
  danger: 'progress-fill-danger',
}

export default function StatProgress({ label, value, color = 'green', icon }: StatProgressProps) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(value) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-chalk/80 font-medium">
          {icon && <span className="mr-1">{icon}</span>}
          {label}
        </span>
        <span className="font-mono text-xs text-grass-pop font-bold">{value}</span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill ${colorMap[color]}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create StatPill.tsx**

```tsx
interface StatPillProps {
  icon?: string
  label: string
  value: number | string
  color?: 'green' | 'gold'
}

const colorClasses = {
  green: 'bg-grass-pop/8 border-grass-pop/15 text-grass-pop',
  gold: 'bg-gold/8 border-gold/15 text-gold',
}

export default function StatPill({ icon, label, value, color = 'green' }: StatPillProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${colorClasses[color]}`}>
      {icon && <span>{icon}</span>}
      {label}
      <span className="font-mono font-bold">{value}</span>
    </span>
  )
}
```

- [ ] **Step 3: Rewrite AnimatedNumber.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export default function AnimatedNumber({ value, duration = 800, className = '', prefix, suffix }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || started.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
            setDisplay(Math.round(eased * value))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={`font-mono font-bold tabular-nums ${className}`}>
      {prefix}{display}{suffix}
    </span>
  )
}
```

- [ ] **Step 4: Create SectionHeader.tsx**

```tsx
interface SectionHeaderProps {
  kicker?: string
  kickerColor?: 'green' | 'gold'
  title: React.ReactNode
  subtitle?: string
}

export default function SectionHeader({ kicker, kickerColor = 'green', title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-end gap-3 mb-8">
      <div className={`w-1 h-7 rounded-full ${kickerColor === 'green' ? 'bg-grass-pop' : 'bg-gold'}`} />
      <div className="flex-1">
        {kicker && (
          <div className={`kicker ${kickerColor === 'green' ? 'kicker-green' : 'kicker-gold'} mb-1`}>
            {kicker}
          </div>
        )}
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-chalk">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/
git commit -m "feat: shared components — StatProgress, StatPill, AnimatedNumber, SectionHeader"
```

---

### Task 5: Shared Components — LiveTicker, CountdownTimer

**Files:**
- Create: `src/components/shared/LiveTicker.tsx`
- Rewrite: `src/components/home/CountdownTimer.tsx`

- [ ] **Step 1: Create LiveTicker.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { getLiveMatches, getTeamById } from '@/lib/data'

export default function LiveTicker() {
  const [matches, setMatches] = useState(getLiveMatches())

  useEffect(() => {
    const interval = setInterval(() => { setMatches(getLiveMatches()) }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!matches.length) return null

  const doubled = [...matches, ...matches]

  return (
    <div className="bg-black/30 border border-grass-pop/5 rounded-xl py-3 overflow-hidden">
      <div className="flex items-center gap-0 animate-ticker" style={{ width: 'max-content' }}>
        {doubled.map((m, i) => {
          const home = getTeamById(m.homeTeamId)
          const away = getTeamById(m.awayTeamId)
          if (!home || !away) return null
          return (
            <span key={`${m.id}-${i}`} className="inline-flex items-center gap-3 mx-6 text-xs whitespace-nowrap">
              <span className="badge badge-live">
                <span className="live-dot" /> LIVE {m.homeScore}-{m.awayScore}'
              </span>
              <span className="text-chalk/80 font-semibold">{home.fifaCode}</span>
              <span className="font-mono font-bold text-grass-pop num-glow">{m.homeScore}</span>
              <span className="text-muted">-</span>
              <span className="font-mono font-bold text-chalk">{m.awayScore}</span>
              <span className="text-chalk/80 font-semibold">{away.fifaCode}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite CountdownTimer.tsx**

```tsx
'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex gap-3 justify-center">
      {[
        { label: 'DAYS', value: time.days },
        { label: 'HOURS', value: time.hours },
        { label: 'MINS', value: time.mins },
        { label: 'SECS', value: time.secs },
      ].map(({ label, value }) => (
        <div key={label}
          className="bg-black/40 border border-white/5 rounded-xl min-w-[72px] py-3 px-4 text-center"
        >
          <div className="font-mono text-2xl md:text-3xl font-black text-grass-pop num-glow tabular-nums">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-[8px] text-muted tracking-[0.2em] mt-1 font-bold">{label}</div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/LiveTicker.tsx src/components/home/CountdownTimer.tsx
git commit -m "feat: LiveTicker scrolling score bar and CountdownTimer with animation"
```

---

### Task 6: Shared Components — PredictionBar, ScoreBadge

**Files:**
- Create: `src/components/shared/PredictionBar.tsx`
- Create: `src/components/shared/ScoreBadge.tsx`

- [ ] **Step 1: Create PredictionBar.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface PredictionBarProps {
  homeWin: number
  draw: number
  awayWin: number
  homeTeam: string
  awayTeam: string
  confidence: number
}

export default function PredictionBar({ homeWin, draw, awayWin, homeTeam, awayTeam, confidence }: PredictionBarProps) {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-chalk font-semibold">{homeTeam} 胜</span>
          <span className="font-mono text-grass-pop font-bold">{Math.round(homeWin * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-green" style={{ width: `${homeWin * 100}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted font-medium">平局</span>
          <span className="font-mono text-muted font-bold">{Math.round(draw * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-muted" style={{ width: `${draw * 100}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-chalk font-semibold">{awayTeam} 胜</span>
          <span className="font-mono text-gold font-bold">{Math.round(awayWin * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-gold" style={{ width: `${awayWin * 100}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 p-3 bg-grass-pop/5 rounded-xl">
        <div className="w-10 h-10 rounded-full border-2 border-grass-pop flex items-center justify-center font-mono text-sm font-black text-grass-pop">
          {Math.round(confidence * 100)}
        </div>
        <div className="text-xs">
          <div className="text-chalk font-semibold">预测置信度</div>
          <div className="text-muted">基于 6 维模型 + 历史交锋 + 场馆</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create ScoreBadge.tsx**

```tsx
interface ScoreBadgeProps {
  homeCode: string
  awayCode: string
  homeScore?: number
  awayScore?: number
  status: 'scheduled' | 'live' | 'finished'
  minute?: number
}

export default function ScoreBadge({ homeCode, awayCode, homeScore, awayScore, status, minute }: ScoreBadgeProps) {
  const isLive = status === 'live'
  const hasScore = homeScore !== undefined && awayScore !== undefined

  return (
    <div className="flex items-center gap-3">
      <span className="font-bold text-base text-chalk">{homeCode}</span>
      {hasScore ? (
        <>
          <span className={`font-mono text-4xl font-black tabular-nums ${isLive ? 'text-grass-pop num-glow' : 'text-chalk'}`}>
            {homeScore}
          </span>
          <span className="text-muted text-2xl font-light">:</span>
          <span className={`font-mono text-4xl font-black tabular-nums ${isLive ? 'text-chalk' : 'text-chalk'}`}>
            {awayScore}
          </span>
        </>
      ) : (
        <span className="text-2xl font-black text-muted/30">VS</span>
      )}
      <span className="font-bold text-base text-chalk">{awayCode}</span>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/
git commit -m "feat: PredictionBar probability display and ScoreBadge match score component"
```

---

### Task 7: Homepage — HeroBanner + GroupStandings

**Files:**
- Rewrite: `src/components/home/HeroBanner.tsx`
- Create: `src/components/home/GroupStandings.tsx`
- Rewrite: `src/app/page.tsx`

**What it does:** Fullscreen hero with pitch stripes parallax + massive title + countdown, then group standings quick view.

- [ ] **Step 1: Rewrite HeroBanner.tsx (full 3-layer hero with GSAP)**

```tsx
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

      // Pitch stripes parallax
      gsap.to('.hero-stripes', {
        y: -120,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })

      // Orb float parallax
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
      {/* Ambient orbs */}
      <div className="hero-orb absolute top-[-15%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-grass-pop/4 blur-[180px] pointer-events-none" />
      <div className="hero-orb absolute bottom-[-15%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-gold/3 blur-[150px] pointer-events-none" style={{ animationDelay: '-3s' }} />
      <div className="hero-orb absolute top-[30%] left-[25%] w-[50vw] h-[50vw] rounded-full bg-emerald/3 blur-[120px] pointer-events-none" style={{ animationDelay: '-6s' }} />

      {/* Pitch stripes */}
      <div className="hero-stripes absolute inset-0 pitch-stripes opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center gap-10 max-w-5xl">
        {/* Kicker */}
        <p className="hero-kicker kicker kicker-green">
          June 11 — July 19 · United States · Mexico · Canada
        </p>

        {/* Massive Title */}
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

        {/* Hosts + stats */}
        <div className="hero-hosts flex items-center gap-6 text-sm text-muted/50 font-medium tracking-wide">
          <span className="h-px w-10 bg-grass-pop/30" />
          {HOSTS.join(' · ')} · 48 Nations · 104 Matches
          <span className="h-px w-10 bg-grass-pop/30" />
        </div>

        {/* Countdown */}
        <div className="hero-countdown">
          <p className="kicker kicker-green text-center mb-6">COUNTDOWN TO KICKOFF</p>
          <CountdownTimer targetDate="2026-06-11T12:00:00-05:00" />
        </div>

        {/* CTAs */}
        <div className="hero-cta flex gap-3">
          <a href="#today" className="btn-primary">📅 今日赛程</a>
          <a href="/compare" className="btn-ghost">🎯 AI 预测</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
        <span className="text-[9px] text-muted tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-grass-pop/30 to-transparent" />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create GroupStandings.tsx**

```tsx
import { getGroups, getTeamsByGroup } from '@/lib/data'
import { getRankTier } from '@/lib/constants'

export default function GroupStandings() {
  const groups = getGroups().slice(0, 6) // A-F for quick view

  return (
    <section className="py-24 px-5 max-w-7xl mx-auto">
      <div className="divider-green mb-24" />
      {/* Section header via SectionHeader? Will inline for now */}
      <div className="flex items-end gap-3 mb-10">
        <div className="w-1 h-7 rounded-full bg-gold" />
        <div>
          <div className="kicker kicker-gold mb-1">STANDINGS</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-chalk">
            小组<span className="text-gold">积分榜</span>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map(group => {
          const teams = getTeamsByGroup(group.id)
          return (
            <div key={group.id} className="card-glass p-5">
              <div className="kicker kicker-green mb-4">GROUP {group.name}</div>
              <div className="space-y-2">
                {teams.map((team, i) => {
                  const tier = getRankTier(team.fifaRank)
                  return (
                    <div key={team.id}
                      className={`flex items-center gap-3 py-2 px-3 rounded-lg text-xs ${i === 0 ? 'bg-grass-pop/5' : ''}`}
                    >
                      <span className="text-base">{team.flagUrl}</span>
                      <span className={`font-bold flex-1 ${i < 2 ? 'text-chalk' : 'text-muted'}`}>{team.nameCn}</span>
                      <span className={`font-mono font-bold text-[10px]`} style={{ color: tier.color }}>#{team.fifaRank}</span>
                      <span className={`badge badge-rank-${tier.label.toLowerCase()}`}>{tier.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Rewrite page.tsx (homepage)**

```tsx
import HeroBanner from '@/components/home/HeroBanner'
import TodayMatches from '@/components/home/TodayMatches'
import GroupStandings from '@/components/home/GroupStandings'
import LiveTicker from '@/components/shared/LiveTicker'

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-5 -mt-16 relative z-20">
        <LiveTicker />
      </div>
      <TodayMatches />
      <GroupStandings />
      <section className="relative py-32 px-5 text-center overflow-hidden">
        <div className="absolute inset-0 pitch-stripes opacity-30" />
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="text-4xl mb-6">⚽</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-chalk mb-4">
            准备好迎接<span className="text-grass-pop">盛夏狂欢</span>
          </h2>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            AI 预测模型结合历史数据、球队状态、场馆因素<br/>为每一场比赛提供精准预测
          </p>
          <a href="/compare" className="btn-primary text-base px-8 py-4">🎯 开始预测</a>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -30`

- [ ] **Step 5: Commit**

```bash
git add src/components/home/ src/app/page.tsx
git commit -m "feat: homepage with 3-layer hero, live ticker, today matches, group standings"
```

---

### Task 8: Homepage — TodayMatches Rewrite

**Files:**
- Rewrite: `src/components/home/TodayMatches.tsx`

**What it does:** Match cards with teams, prediction probability pills, venue info, GSAP stagger animation.

- [ ] **Step 1: Rewrite TodayMatches.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { getTodayMatches, getTeamById, getVenueById } from '@/lib/data'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'

gsap.registerPlugin(ScrollTrigger)

export default function TodayMatches() {
  const ref = useRef<HTMLElement>(null)
  const matches = getTodayMatches()

  useEffect(() => {
    if (!matches.length) return
    const ctx = gsap.context(() => {
      gsap.from('.match-item', {
        y: 50, opacity: 0, scale: 0.95,
        duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.match-grid', start: 'top bottom-=80' },
      })
    }, ref)
    return () => ctx.revert()
  }, [matches.length])

  return (
    <section ref={ref} id="today" className="py-24 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end gap-3 mb-10">
          <div className="w-1 h-7 rounded-full bg-grass-pop" />
          <div className="flex-1">
            <div className="kicker kicker-green mb-1">TODAY · {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-chalk">
              今日<span className="text-grass-pop">焦点</span>
            </h2>
          </div>
          <span className="text-xs text-muted">{matches.length} 场比赛</span>
        </div>

        {matches.length === 0 ? (
          <div className="card-glass text-center py-20">
            <span className="text-7xl block mb-6 opacity-20">⚽</span>
            <p className="text-lg text-muted font-semibold">今日无比赛</p>
            <p className="text-xs text-dim mt-2">请关注后续赛程，精彩即将上演</p>
          </div>
        ) : (
          <div className="match-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => {
              const home = getTeamById(match.homeTeamId)
              const away = getTeamById(match.awayTeamId)
              const venue = getVenueById(match.venueId)
              if (!home || !away || !venue) return null

              return (
                <Link key={match.id} href={`/matches/${match.id}`}
                  className="match-item card-glass overflow-hidden block no-underline group"
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/5">
                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <span>{toBeijingDate(match.date).slice(5)}</span>
                      <span className="font-mono font-bold text-grass-pop">{toBeijingTime(match.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px]">
                      {match.stage !== 'group' && (
                        <span className="badge badge-stage">{STAGE_LABELS[match.stage]}</span>
                      )}
                      <span className="text-dim">{venue.city}</span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{home.flagUrl}</span>
                        <span className="text-sm font-bold text-chalk truncate w-full text-center">{home.nameCn}</span>
                      </div>

                      <div className="flex-shrink-0 text-center">
                        {match.status === 'finished' ? (
                          <span className="font-mono text-3xl font-black text-grass-pop num-glow">
                            {match.homeScore}-{match.awayScore}
                          </span>
                        ) : match.status === 'live' ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-3xl font-black text-danger">
                              {match.homeScore}-{match.awayScore}
                            </span>
                            <span className="badge badge-live animate-pulse">LIVE</span>
                          </div>
                        ) : (
                          <span className="text-xl font-black text-muted/20">VS</span>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{away.flagUrl}</span>
                        <span className="text-sm font-bold text-chalk truncate w-full text-center">{away.nameCn}</span>
                      </div>
                    </div>

                    {/* Venue footer */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-dim">
                      <span>📍 {venue.name}</span>
                      <span className="w-1 h-1 rounded-full bg-dim/20" />
                      <span className="font-semibold text-muted">{(venue.capacity / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/components/home/TodayMatches.tsx
git commit -m "feat: rewrite TodayMatches with new card design and prediction pills"
```

---

### Task 9: Match Detail Page — Full Rewrite

**Files:**
- Rewrite: `src/app/matches/[id]/page.tsx`
- Rewrite: `src/components/matches/PredictionCard.tsx`
- Rewrite: `src/components/matches/RadarCompare.tsx`
- Rewrite: `src/components/matches/H2HTimeline.tsx`
- Rewrite: `src/components/matches/VenueFactor.tsx`

- [ ] **Step 1: Rewrite MatchDetailPage (server component with async params)**

```tsx
import { getMatchById, getTeamById, getVenueById, getAllMatches, getH2H } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import RadarCompare from '@/components/matches/RadarCompare'
import PredictionCard from '@/components/matches/PredictionCard'
import H2HTimeline from '@/components/matches/H2HTimeline'
import VenueFactor from '@/components/matches/VenueFactor'

export function generateStaticParams() {
  return getAllMatches().map(m => ({ id: m.id }))
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = getMatchById(id)
  if (!match) notFound()

  const home = getTeamById(match.homeTeamId)!
  const away = getTeamById(match.awayTeamId)!
  const venue = getVenueById(match.venueId)!
  const h2h = getH2H(home.id, away.id)

  const isLive = match.status === 'live'
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      {/* Breadcrumb */}
      <div className="text-[11px] text-dim mb-6">
        <a href="/matches" className="text-grass-pop hover:underline">赛程</a>
        {' / '}
        {match.groupId && <span>{match.groupId} 组 · </span>}
        <span>{STAGE_LABELS[match.stage]}</span>
        {' / '}
        <span className="text-chalk">{home.nameCn} vs {away.nameCn}</span>
      </div>

      {/* Scoreboard Hero */}
      <div className="card-elevated p-8 md:p-12 mb-10 text-center">
        {/* Status badges */}
        <div className="flex justify-center gap-3 mb-6">
          {isLive && (
            <span className="badge badge-live text-[11px] px-4 py-1.5">
              <span className="live-dot" /> LIVE {match.homeScore}-{match.awayScore}'
            </span>
          )}
          {match.status === 'finished' && (
            <span className="badge bg-white/5 text-dim text-[11px] px-4 py-1.5">已结束</span>
          )}
          <span className="badge badge-stage text-[11px] px-4 py-1.5">
            {STAGE_LABELS[match.stage]}{match.groupId ? ` · ${match.groupId} 组` : ''}
          </span>
        </div>

        {/* Teams + Score */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl md:text-7xl">{home.flagUrl}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-chalk">{home.nameCn}</h2>
            <span className="text-xs text-muted font-semibold">FIFA #{home.fifaRank}</span>
          </div>

          <div className="text-center min-w-[120px]">
            {hasScore ? (
              <div className={`font-mono text-5xl md:text-7xl font-black tracking-[-0.04em] ${isLive ? 'text-grass-pop num-glow' : 'text-chalk'}`}>
                {match.homeScore}<span className="text-muted/30 mx-1">:</span>{match.awayScore}
              </div>
            ) : (
              <div className="text-4xl md:text-6xl font-black text-muted/20">VS</div>
            )}
            <div className="text-[11px] text-dim mt-3">
              {toBeijingDate(match.date)} · {toBeijingTime(match.date)}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl md:text-7xl">{away.flagUrl}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-chalk">{away.nameCn}</h2>
            <span className="text-xs text-muted font-semibold">FIFA #{away.fifaRank}</span>
          </div>
        </div>

        {/* Venue bar */}
        <div className="mt-8 flex justify-center gap-4 text-[11px] text-dim">
          <span>📍 {venue.name}</span>
          <span>{venue.city}, {venue.country}</span>
          <span>{venue.capacity.toLocaleString()} seats</span>
        </div>
      </div>

      {/* Analysis Grid: Radar + Prediction */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card-glass p-6">
          <div className="kicker kicker-green mb-4">TEAM COMPARISON</div>
          <h3 className="font-display text-xl font-extrabold mb-6">战力<span className="text-grass-pop">雷达</span></h3>
          <RadarCompare homeTeam={home} awayTeam={away} />
        </div>
        <div className="card-glass p-6">
          <div className="kicker kicker-gold mb-4">AI PREDICTION</div>
          <h3 className="font-display text-xl font-extrabold mb-6">智能<span className="text-gold">预测</span></h3>
          <PredictionCard homeTeam={home} awayTeam={away} venue={venue} />
        </div>
      </div>

      {/* H2H + Venue */}
      <div className="grid lg:grid-cols-2 gap-6">
        {h2h ? (
          <div className="card-glass p-6">
            <div className="kicker kicker-green mb-4">HEAD TO HEAD</div>
            <h3 className="font-display text-xl font-extrabold mb-6">历史<span className="text-grass-pop">交锋</span></h3>
            <H2HTimeline h2h={h2h} homeTeam={home} awayTeam={away} />
          </div>
        ) : (
          <div className="card-glass p-6 flex items-center justify-center text-muted text-sm min-h-[200px]">
            暂无历史交锋数据
          </div>
        )}
        <div className="card-glass p-6">
          <div className="kicker kicker-gold mb-4">VENUE FACTOR</div>
          <h3 className="font-display text-xl font-extrabold mb-6">场馆<span className="text-gold">分析</span></h3>
          <VenueFactor venue={venue} homeTeam={home} awayTeam={away} />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Rewrite PredictionCard.tsx (uses PredictionBar internally)**

```tsx
import type { Team, Venue } from '@/types/worldcup'
import { predictMatch } from '@/lib/prediction'
import PredictionBar from '@/components/shared/PredictionBar'

interface PredictionCardProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
}

export default function PredictionCard({ homeTeam, awayTeam, venue }: PredictionCardProps) {
  const prediction = predictMatch(homeTeam, awayTeam, venue)

  return (
    <div>
      <PredictionBar
        homeWin={prediction.homeWin}
        draw={prediction.draw}
        awayWin={prediction.awayWin}
        homeTeam={homeTeam.nameCn}
        awayTeam={awayTeam.nameCn}
        confidence={prediction.confidence}
      />

      {/* Factors */}
      <div className="flex flex-wrap gap-2 mt-6">
        {prediction.factors.map((f, i) => (
          <span key={i}
            className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              f.advantage === 'home' ? 'bg-grass-pop/10 text-grass-pop' :
              f.advantage === 'away' ? 'bg-gold/10 text-gold' :
              'bg-white/5 text-muted'
            }`}
          >
            {f.name} → {f.advantage === 'home' ? homeTeam.nameCn : f.advantage === 'away' ? awayTeam.nameCn : 'NEUTRAL'}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite RadarCompare.tsx (ECharts with green theme)**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { Team } from '@/types/worldcup'
import { STAT_LABELS } from '@/lib/constants'

interface RadarCompareProps {
  homeTeam: Team
  awayTeam: Team
}

const DIMS = ['attack', 'defense', 'possession', 'fitness', 'experience', 'recentForm'] as const

export default function RadarCompare({ homeTeam, awayTeam }: RadarCompareProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    chart.setOption({
      tooltip: {},
      legend: {
        bottom: 0,
        textStyle: { color: '#889988', fontSize: 11 },
        data: [homeTeam.nameCn, awayTeam.nameCn],
      },
      radar: {
        center: ['50%', '50%'],
        radius: '70%',
        indicator: DIMS.map(d => ({ name: STAT_LABELS[d], max: 100 })),
        axisName: { color: '#667766', fontSize: 10 },
        splitArea: { areaStyle: { color: ['transparent'] } },
        splitLine: { lineStyle: { color: 'rgba(74,222,128,0.08)' } },
        axisLine: { lineStyle: { color: 'rgba(74,222,128,0.1)' } },
      },
      series: [
        {
          type: 'radar',
          name: homeTeam.nameCn,
          data: [{ value: DIMS.map(d => homeTeam.stats[d]), name: homeTeam.nameCn }],
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { color: '#4ade80', width: 2 },
          areaStyle: { color: 'rgba(74,222,128,0.1)' },
          itemStyle: { color: '#4ade80' },
        },
        {
          type: 'radar',
          name: awayTeam.nameCn,
          data: [{ value: DIMS.map(d => awayTeam.stats[d]), name: awayTeam.nameCn }],
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { color: '#f0c040', width: 2 },
          areaStyle: { color: 'rgba(240,192,64,0.08)' },
          itemStyle: { color: '#f0c040' },
        },
      ],
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [homeTeam, awayTeam])

  return <div ref={ref} className="w-full h-[320px]" />
}
```

- [ ] **Step 4: Rewrite H2HTimeline.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getTeamById } from '@/lib/data'
import type { H2HRecord, Team } from '@/types/worldcup'

gsap.registerPlugin(ScrollTrigger)

interface H2HTimelineProps {
  h2h: H2HRecord
  homeTeam: Team
  awayTeam: Team
}

export default function H2HTimeline({ h2h, homeTeam, awayTeam }: H2HTimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const recent = h2h.matches.slice(-5).reverse()

  const homeWins = h2h.matches.filter(m =>
    (m.homeTeamId === homeTeam.id && m.homeScore > m.awayScore) ||
    (m.awayTeamId === homeTeam.id && m.awayScore > m.homeScore)
  ).length
  const awayWins = h2h.matches.filter(m =>
    (m.homeTeamId === awayTeam.id && m.homeScore > m.awayScore) ||
    (m.awayTeamId === awayTeam.id && m.awayScore > m.homeScore)
  ).length

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.h2h-item', {
        x: -30, opacity: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top bottom-=50' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref}>
      {/* Summary bar */}
      <div className="flex justify-around mb-8 pb-6 border-b border-white/5 text-center">
        <div>
          <div className="text-2xl font-black text-grass-pop">{homeWins}</div>
          <div className="text-[10px] text-dim">{homeTeam.nameCn} 胜</div>
        </div>
        <div>
          <div className="text-2xl font-black text-muted">{h2h.matches.length - homeWins - awayWins}</div>
          <div className="text-[10px] text-dim">平局</div>
        </div>
        <div>
          <div className="text-2xl font-black text-gold">{awayWins}</div>
          <div className="text-[10px] text-dim">{awayTeam.nameCn} 胜</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 border-l border-grass-pop/10 space-y-5">
        {recent.map((m, i) => {
          const h = getTeamById(m.homeTeamId)
          const a = getTeamById(m.awayTeamId)
          const winner = m.homeScore > m.awayScore ? 'home' : m.awayScore > m.homeScore ? 'away' : 'draw'
          const isHomeWin = winner === 'home' && m.homeTeamId === homeTeam.id || winner === 'away' && m.awayTeamId === homeTeam.id

          return (
            <div key={i} className="h2h-item relative">
              <div className={`absolute left-[-22px] top-1.5 w-2.5 h-2.5 rounded-full ${
                winner === 'draw' ? 'bg-muted' : isHomeWin ? 'bg-grass-pop' : 'bg-gold'
              }`} />
              <div className="text-[10px] text-dim mb-1">{m.date?.slice(0, 10)} · {m.tournament}</div>
              <div className="text-xs font-semibold text-chalk">
                {h?.nameCn} {m.homeScore}-{m.awayScore} {a?.nameCn}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Rewrite VenueFactor.tsx**

```tsx
import type { Venue, Team } from '@/types/worldcup'

interface VenueFactorProps {
  venue: Venue
  homeTeam: Team
  awayTeam: Team
}

export default function VenueFactor({ venue }: VenueFactorProps) {
  return (
    <div>
      <div className="card-elevated p-5 mb-5 flex items-center gap-4">
        <span className="text-4xl">🏟️</span>
        <div>
          <div className="text-lg font-extrabold text-chalk">{venue.name}</div>
          <div className="text-xs text-dim">{venue.city} · {venue.capacity.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">海拔</div>
          <div className="font-mono text-xl font-black text-grass-pop">{venue.altitude}m</div>
          <div className="text-[10px] text-dim mt-1">{venue.altitude < 500 ? '低海拔 · 无影响' : '高海拔 · 需适应'}</div>
        </div>
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">气候</div>
          <div className="font-mono text-xl font-black text-grass-pop">{venue.climate}</div>
          <div className="text-[10px] text-dim mt-1">{venue.description?.slice(0, 20) || '条件适中'}</div>
        </div>
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">时区</div>
          <div className="font-mono text-xl font-black text-grass-pop">{venue.timezone}</div>
          <div className="text-[10px] text-dim mt-1">对跨洲球队有时差影响</div>
        </div>
        <div className="bg-white/[0.02] rounded-xl p-4">
          <div className="text-[10px] text-dim mb-1">容量</div>
          <div className="font-mono text-xl font-black text-grass-pop">{(venue.capacity / 1000).toFixed(0)}k</div>
          <div className="text-[10px] text-dim mt-1">大型场馆 · 氛围热烈</div>
        </div>
      </div>

      <div className="mt-5 p-4 bg-grass-pop/5 rounded-xl text-xs text-grass-pop leading-relaxed">
        🟢 本场比赛在 {venue.city} 进行。{venue.altitude < 500 ? '低海拔环境对球员体能影响极小。' : '较高海拔可能影响球员表现。'}{venue.capacity > 60000 ? ' 大型场馆的主场氛围值得关注。' : ''}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -30`

- [ ] **Step 7: Commit**

```bash
git add src/app/matches/ src/components/matches/
git commit -m "feat: rewrite match detail page — scoreboard, radar, prediction, H2H, venue"
```

---

### Task 10: Match List Page + MatchCard + Filter

**Files:**
- Rewrite: `src/app/matches/page.tsx`
- Rewrite: `src/components/matches/MatchCard.tsx`
- Rewrite: `src/components/matches/MatchFilter.tsx`

- [ ] **Step 1: Rewrite MatchCard.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { getTeamById, getVenueById } from '@/lib/data'
import { STAGE_LABELS } from '@/lib/constants'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import type { Match } from '@/types/worldcup'

interface MatchCardProps {
  match: Match
  index: number
}

export default function MatchCard({ match, index }: MatchCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const home = getTeamById(match.homeTeamId)
  const away = getTeamById(match.awayTeamId)
  const venue = getVenueById(match.venueId)
  if (!home || !away || !venue) return null

  useEffect(() => {
    gsap.from(ref.current, {
      y: 30, opacity: 0, scale: 0.97,
      duration: 0.4, delay: index * 0.05, ease: 'power2.out',
    })
  }, [index])

  return (
    <div ref={ref}>
      <Link href={`/matches/${match.id}`} className="card-glass p-5 block no-underline group">
        <div className="flex items-center justify-between mb-4 text-[10px]">
          <span className="text-dim">{toBeijingDate(match.date)}</span>
          <span className="font-mono font-bold text-grass-pop">{toBeijingTime(match.date)}</span>
          <span className="badge badge-stage">{STAGE_LABELS[match.stage]}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className="text-3xl group-hover:scale-110 transition-transform">{home.flagUrl}</span>
            <span className="text-xs font-bold text-chalk truncate w-full text-center">{home.nameCn}</span>
          </div>
          <div className="flex-shrink-0 text-center px-3">
            {match.status === 'finished' ? (
              <span className="font-mono text-2xl font-black text-grass-pop">{match.homeScore}-{match.awayScore}</span>
            ) : match.status === 'live' ? (
              <span className="font-mono text-2xl font-black text-danger">{match.homeScore}-{match.awayScore}</span>
            ) : (
              <span className="text-lg font-black text-muted/20">VS</span>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className="text-3xl group-hover:scale-110 transition-transform">{away.flagUrl}</span>
            <span className="text-xs font-bold text-chalk truncate w-full text-center">{away.nameCn}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-dim text-center">
          📍 {venue.city} · {venue.name}
        </div>
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite MatchFilter.tsx**

```tsx
'use client'

const STAGES = [
  { value: 'all', label: '全部' },
  { value: 'group', label: '小组赛' },
  { value: 'round32', label: '1/16' },
  { value: 'round16', label: '1/8' },
  { value: 'quarter', label: '1/4' },
  { value: 'semi', label: '半决赛' },
  { value: 'third', label: '季军赛' },
  { value: 'final', label: '决赛' },
]

interface MatchFilterProps {
  selectedStage: string
  selectedDate: string
  onStageChange: (s: string) => void
  onDateChange: (d: string) => void
  dates: string[]
}

export default function MatchFilter({ selectedStage, selectedDate, onStageChange, onDateChange, dates }: MatchFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="flex gap-1.5 flex-wrap">
        {STAGES.map(s => (
          <button key={s.value} onClick={() => onStageChange(s.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedStage === s.value
                ? 'bg-grass-pop/12 text-grass-pop'
                : 'bg-white/[0.02] text-muted hover:text-chalk'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => onDateChange('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedDate === 'all' ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
          }`}
        >
          全部日期
        </button>
        {dates.map(d => (
          <button key={d} onClick={() => onDateChange(d)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedDate === d ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
            }`}
          >
            {d.slice(5)}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rewrite MatchesPage**

```tsx
'use client'

import { useState, useMemo } from 'react'
import { getAllMatches } from '@/lib/data'
import MatchCard from '@/components/matches/MatchCard'

const STAGES = [
  { value: 'all', label: '全部' },
  { value: 'group', label: '小组赛' },
  { value: 'round32', label: '1/16' },
  { value: 'round16', label: '1/8' },
  { value: 'quarter', label: '1/4' },
  { value: 'semi', label: '半决赛' },
  { value: 'third', label: '季军赛' },
  { value: 'final', label: '决赛' },
]

export default function MatchesPage() {
  const [stage, setStage] = useState('all')
  const [date, setDate] = useState('all')

  const allMatches = getAllMatches()
  const dates = useMemo(() => {
    const ds = new Set(allMatches.map(m => m.date.slice(0, 10)))
    return Array.from(ds).sort()
  }, [allMatches])

  const filtered = useMemo(() => {
    return allMatches.filter(m => {
      if (stage !== 'all' && m.stage !== stage) return false
      if (date !== 'all' && !m.date.startsWith(date)) return false
      return true
    })
  }, [stage, date, allMatches])

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      <div className="flex items-end gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-grass-pop" />
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">赛程</h1>
      </div>
      <p className="text-sm text-muted mb-8 ml-4">104 场比赛 · 小组赛至决赛</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-1.5 flex-wrap">
          {STAGES.map(s => (
            <button key={s.value} onClick={() => setStage(s.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                stage === s.value ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setDate('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              date === 'all' ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
            }`}
          >
            全部日期
          </button>
          {dates.map(d => (
            <button key={d} onClick={() => setDate(d)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                date === d ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
              }`}
            >
              {d.slice(5)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((match, i) => (
          <MatchCard key={match.id} match={match} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted text-center py-16">无符合条件的比赛</p>
      )}
    </main>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 5: Commit**

```bash
git add src/app/matches/page.tsx src/components/matches/MatchCard.tsx src/components/matches/MatchFilter.tsx
git commit -m "feat: rewrite match list with filtered card grid and new MatchCard design"
```

---

### Task 11: Team List + Detail Pages

**Files:**
- Rewrite: `src/app/teams/page.tsx`
- Rewrite: `src/components/teams/TeamCard.tsx`
- Rewrite: `src/app/teams/[id]/page.tsx`

- [ ] **Step 1: Rewrite TeamCard.tsx**

```tsx
import Link from 'next/link'
import type { Team } from '@/types/worldcup'
import { getRankTier } from '@/lib/constants'

export default function TeamCard({ team }: { team: Team }) {
  const tier = getRankTier(team.fifaRank)

  return (
    <Link href={`/teams/${team.id}`}
      className="card-glass p-5 flex items-center gap-4 no-underline group"
    >
      <span className="text-3xl group-hover:scale-110 transition-transform">{team.flagUrl}</span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-chalk truncate">{team.nameCn}</div>
        <div className="text-[10px] text-dim">{team.name}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-xs font-bold" style={{ color: tier.color }}>#{team.fifaRank}</div>
        <span className={`badge badge-rank-${tier.label.toLowerCase()} text-[8px]`}>{tier.label}</span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Rewrite TeamsPage**

```tsx
'use client'

import { useState } from 'react'
import { getGroups, getTeamsByGroup, getAllTeams } from '@/lib/data'
import TeamCard from '@/components/teams/TeamCard'

const CONFEDERATIONS = ['全部', 'AFC', 'CAF', 'CONCACAF', 'CONMEBOL', 'OFC', 'UEFA']

export default function TeamsPage() {
  const groups = getGroups()
  const [conf, setConf] = useState('全部')

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      <div className="flex items-end gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-grass-pop" />
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">球队</h1>
      </div>
      <p className="text-sm text-muted mb-8 ml-4">48 支参赛队伍 · 12 个小组</p>

      <div className="flex gap-1.5 flex-wrap mb-10">
        {CONFEDERATIONS.map(c => (
          <button key={c} onClick={() => setConf(c)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              conf === c ? 'bg-grass-pop/12 text-grass-pop' : 'bg-white/[0.02] text-muted hover:text-chalk'
            }`}
          >
            {c === '全部' ? '🌍 全部' : c}
          </button>
        ))}
      </div>

      {groups.map(group => {
        const teams = getTeamsByGroup(group.id).filter(t => conf === '全部' || t.confederation === conf)
        if (!teams.length) return null
        return (
          <section key={group.id} className="mb-10">
            <h2 className="kicker kicker-green mb-4">GROUP {group.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {teams.map(team => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
```

- [ ] **Step 3: Rewrite TeamDetailPage**

```tsx
import { getTeamById, getPlayersByTeam, getMatchesByTeam, getGroupByTeamId, getAllTeams } from '@/lib/data'
import { notFound } from 'next/navigation'
import { STAGE_LABELS, STAT_LABELS } from '@/lib/constants'
import { toBeijingDate } from '@/lib/date'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateStaticParams() { return getAllTeams().map(t => ({ id: t.id })) }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const team = getTeamById(id)
  if (!team) return { title: '未找到' }
  return { title: `${team.nameCn} · WC26` }
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = getTeamById(id)
  if (!team) notFound()

  const players = getPlayersByTeam(team.id)
  const matches = getMatchesByTeam(team.id)
  const group = getGroupByTeamId(team.id)

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-12 p-8 md:p-12 bg-gradient-to-br from-turf via-grass to-pitch border border-white/5">
        <div className="absolute inset-0 pitch-stripes opacity-20" />
        <div className="relative z-10">
          <span className="text-7xl mb-4 block">{team.flagUrl}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-chalk">{team.nameCn}</h1>
          <p className="text-lg text-dim mt-1">{team.name}</p>
          <div className="flex gap-4 mt-4 text-xs text-muted">
            <span className="font-mono font-bold text-grass-pop">FIFA #{team.fifaRank}</span>
            <span>主教练: {team.coach}</span>
            <span>小组 {group?.name}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-extrabold mb-6">球队<span className="text-grass-pop">战力</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.entries(team.stats) as [keyof typeof team.stats, number][]).map(([key, val]) => (
            <div key={key} className="card-glass p-4 text-center">
              <div className="font-mono text-2xl font-black text-grass-pop">{val}</div>
              <div className="text-[10px] text-dim mt-1">{STAT_LABELS[key]}</div>
              <div className="progress-bar mt-2 h-1.5">
                <div className="progress-fill progress-fill-green" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Squad */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-extrabold mb-6">阵容 <span className="text-xs text-muted font-normal">({players.length}人)</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {players.map(p => (
            <div key={p.id} className="card-glass p-3 text-sm">
              <span className="font-mono text-xs text-grass-pop font-bold">{p.number}</span>
              <span className="ml-2 font-semibold text-chalk">{p.name}</span>
              <div className="text-[10px] text-dim mt-1">{p.position} · {p.age}岁</div>
            </div>
          ))}
        </div>
      </section>

      {/* Matches */}
      <section>
        <h2 className="font-display text-2xl font-extrabold mb-6">赛程</h2>
        <div className="space-y-2">
          {matches.map(m => {
            const home = getTeamById(m.homeTeamId)
            const away = getTeamById(m.awayTeamId)
            return (
              <Link key={m.id} href={`/matches/${m.id}`}
                className="card-glass p-4 flex items-center gap-4 no-underline hover:border-grass-pop/20 transition-all"
              >
                <span className="text-xs text-dim w-24">{toBeijingDate(m.date)}</span>
                <span className="badge badge-stage text-[9px]">{STAGE_LABELS[m.stage]}</span>
                <span className="flex-1 text-sm text-chalk font-semibold">{home?.nameCn} vs {away?.nameCn}</span>
                {m.status === 'finished' && m.homeScore !== undefined && (
                  <span className="font-mono font-bold text-grass-pop">{m.homeScore}-{m.awayScore}</span>
                )}
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 5: Commit**

```bash
git add src/app/teams/ src/components/teams/
git commit -m "feat: rewrite team list with confederation filter and team detail page"
```

---

### Task 12: Remaining Pages — Venues + Compare

**Files:**
- Rewrite: `src/app/venues/[id]/page.tsx`
- Rewrite: `src/app/compare/page.tsx`

- [ ] **Step 1: Rewrite VenueDetailPage**

```tsx
import { getVenueById, getAllVenues, getMatchesByTeam } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { toBeijingDate, toBeijingTime } from '@/lib/date'
import { getTeamById } from '@/lib/data'
import { STAGE_LABELS } from '@/lib/constants'

export function generateStaticParams() { return getAllVenues().map(v => ({ id: v.id })) }

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const venue = getVenueById(params.id)
  if (!venue) notFound()

  const venueMatches = getAllVenues().length > 0 ? [] : []

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-10 p-8 md:p-12 bg-gradient-to-br from-turf via-grass to-pitch border border-white/5">
        <div className="absolute inset-0 pitch-stripes opacity-20" />
        <div className="relative z-10">
          <span className="text-6xl mb-4 block">🏟️</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-chalk">{venue.name}</h1>
          <p className="text-dim mt-2">{venue.city}, {venue.country}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="card-glass p-5 text-center">
          <div className="text-[10px] text-dim mb-1">容量</div>
          <div className="font-mono text-2xl font-black text-grass-pop">{(venue.capacity / 1000).toFixed(0)}k</div>
        </div>
        <div className="card-glass p-5 text-center">
          <div className="text-[10px] text-dim mb-1">海拔</div>
          <div className="font-mono text-2xl font-black text-grass-pop">{venue.altitude}m</div>
        </div>
        <div className="card-glass p-5 text-center">
          <div className="text-[10px] text-dim mb-1">气候</div>
          <div className="font-mono text-2xl font-black text-grass-pop">{venue.climate}</div>
        </div>
        <div className="card-glass p-5 text-center">
          <div className="text-[10px] text-dim mb-1">时区</div>
          <div className="font-mono text-2xl font-black text-grass-pop">{venue.timezone}</div>
        </div>
      </div>

      <p className="text-sm text-dim leading-relaxed">{venue.description}</p>
    </main>
  )
}
```

- [ ] **Step 2: Rewrite Compare page**

```tsx
'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAllTeams, getH2H, getAllVenues } from '@/lib/data'
import RadarCompare from '@/components/matches/RadarCompare'
import PredictionCard from '@/components/matches/PredictionCard'
import H2HTimeline from '@/components/matches/H2HTimeline'

function CompareContent() {
  const searchParams = useSearchParams()
  const teams = useMemo(() => getAllTeams(), [])
  const venues = useMemo(() => getAllVenues(), [])
  const defaultVenue = venues[0]

  const [team1Id, setTeam1Id] = useState(searchParams.get('a') ?? '')
  const [team2Id, setTeam2Id] = useState(searchParams.get('b') ?? '')

  const team1 = useMemo(() => teams.find(t => t.id === team1Id) ?? null, [teams, team1Id])
  const team2 = useMemo(() => teams.find(t => t.id === team2Id) ?? null, [teams, team2Id])
  const h2h = useMemo(() => {
    if (!team1 || !team2) return null
    return getH2H(team1.id, team2.id) ?? null
  }, [team1, team2])

  return (
    <main className="max-w-7xl mx-auto px-5 py-24">
      <div className="text-center mb-12">
        <div className="kicker kicker-gold mb-2">HEAD TO HEAD</div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-chalk">
          球队<span className="text-gold">对比</span>
        </h1>
        <p className="text-sm text-muted mt-2">选择两支球队 · 全方位数据对比</p>
      </div>

      {/* Selectors */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 max-w-xl mx-auto mb-12 items-center">
        <select value={team1Id} onChange={e => setTeam1Id(e.target.value)}
          className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-chalk focus:outline-none focus:border-grass-pop/30 transition-colors"
        >
          <option value="">选择球队...</option>
          {teams.map(t => (
            <option key={t.id} value={t.id} disabled={t.id === team2Id} className="bg-turf">
              {t.flagUrl} {t.nameCn} (#{t.fifaRank})
            </option>
          ))}
        </select>
        <span className="text-xl font-black text-grass-pop text-center">VS</span>
        <select value={team2Id} onChange={e => setTeam2Id(e.target.value)}
          className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-chalk focus:outline-none focus:border-grass-pop/30 transition-colors"
        >
          <option value="">选择球队...</option>
          {teams.map(t => (
            <option key={t.id} value={t.id} disabled={t.id === team1Id} className="bg-turf">
              {t.flagUrl} {t.nameCn} (#{t.fifaRank})
            </option>
          ))}
        </select>
      </div>

      {team1 && team2 ? (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-glass p-6">
              <h3 className="font-display text-xl font-extrabold mb-6">战力<span className="text-grass-pop">雷达</span></h3>
              <RadarCompare homeTeam={team1} awayTeam={team2} />
            </div>
            <div className="card-glass p-6">
              <h3 className="font-display text-xl font-extrabold mb-6">AI<span className="text-gold">预测</span></h3>
              <PredictionCard homeTeam={team1} awayTeam={team2} venue={defaultVenue} />
            </div>
          </div>
          {h2h && (
            <div className="card-glass p-6">
              <h3 className="font-display text-xl font-extrabold mb-6">历史<span className="text-grass-pop">交锋</span></h3>
              <H2HTimeline h2h={h2h} homeTeam={team1} awayTeam={team2} />
            </div>
          )}
        </div>
      ) : (
        <div className="card-glass p-16 text-center">
          <span className="text-6xl block mb-4 opacity-20">⚽</span>
          <p className="text-muted text-sm">选择两支球队开始对比</p>
        </div>
      )}
    </main>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <main className="max-w-7xl mx-auto px-5 py-24">
        <div className="card-glass p-16 text-center">
          <p className="text-muted text-sm">加载中...</p>
        </div>
      </main>
    }>
      <CompareContent />
    </Suspense>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1 | head -30`

- [ ] **Step 4: Commit**

```bash
git add src/app/venues/ src/app/compare/
git commit -m "feat: rewrite venue detail and team compare pages"
```

---

### Task 13: Final Cleanup + Dev Server Test

**Files:**
- Delete: unused old component files if any remain
- Check: `src/components/shared/` — ensure no stale imports

- [ ] **Step 1: Remove unused old files**

Run:
```bash
cd /Users/daijin/web/worldcup-predictor
# Check for any remaining old component imports
grep -r "PageTransition\|ScrollRefresh" src/ --include="*.tsx" --include="*.ts" 2>/dev/null
```
Expected: No results (all should be removed already)

- [ ] **Step 2: Full type check**

Run: `cd /Users/daijin/web/worldcup-predictor && npx tsc --noEmit 2>&1`
Expected: No errors.

- [ ] **Step 3: Start dev server and verify**

Run: `cd /Users/daijin/web/worldcup-predictor && npm run dev`
Expected: Server starts without errors.
Open: http://localhost:3000 (or 3001)
Verify: All pages render with the new pitch-green theme.

- [ ] **Step 4: Verify major pages load**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/matches
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/teams
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/compare
```
Expected: All return 200 or 308 (redirect).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: cleanup unused files, finalize pitch-green redesign"
```
