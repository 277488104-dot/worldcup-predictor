'use client'

import PageTransition from './PageTransition'

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
