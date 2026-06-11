import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MyPredictions from '@/components/shared/MyPredictions'

export const metadata: Metadata = {
  title: 'WC26 · 世界杯预测分析',
  description: '2026 FIFA World Cup — 赛程浏览 · 球队数据 · AI 智能预测',
  openGraph: {
    title: 'WC26 · 世界杯 AI 预测',
    description: 'AI 预测 48 队 104 场比赛 · 战力雷达 · 比分预测 · 赛后复盘',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-pitch text-chalk antialiased">
        <Header />
        <main>{children}</main>
        <MyPredictions />
        <Footer />
      </body>
    </html>
  )
}
