'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollRefresh() {
  const pathname = usePathname()

  useEffect(() => {
    // Small delay to let the DOM settle after route change
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
