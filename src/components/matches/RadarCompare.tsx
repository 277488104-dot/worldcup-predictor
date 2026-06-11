'use client'

import { useRef, useEffect } from 'react'
import * as echarts from 'echarts'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STAT_LABELS } from '@/lib/constants'
import type { Team } from '@/types/worldcup'

gsap.registerPlugin(ScrollTrigger)

const DIMENSIONS = ['attack', 'defense', 'possession', 'fitness', 'experience', 'recentForm'] as const

export default function RadarCompare({ homeTeam, awayTeam }: { homeTeam: Team; awayTeam: Team }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !sectionRef.current) return

    const chart = echarts.init(chartRef.current)

    chart.setOption({
      tooltip: {},
      legend: {
        data: [homeTeam.nameCn, awayTeam.nameCn],
        bottom: 0,
        textStyle: { color: '#8892b0', fontSize: 12 },
      },
      radar: {
        center: ['50%', '45%'],
        radius: '65%',
        indicator: DIMENSIONS.map(k => ({
          name: STAT_LABELS[k],
          max: 100,
        })),
        axisName: { color: '#8892b0', fontSize: 11 },
        splitArea: {
          areaStyle: { color: ['rgba(0,212,255,0.02)', 'rgba(0,212,255,0.04)'] },
        },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      },
      series: [{
        type: 'radar',
        data: [
          {
            value: DIMENSIONS.map(k => homeTeam.stats[k]),
            name: homeTeam.nameCn,
            areaStyle: { color: 'rgba(0,212,255,0.2)' },
            lineStyle: { color: '#00d4ff', width: 2 },
            itemStyle: { color: '#00d4ff' },
          },
          {
            value: DIMENSIONS.map(k => awayTeam.stats[k]),
            name: awayTeam.nameCn,
            areaStyle: { color: 'rgba(255,107,53,0.2)' },
            lineStyle: { color: '#ff6b35', width: 2 },
            itemStyle: { color: '#ff6b35' },
          },
        ],
      }],
    })

    // GSAP entrance with gsap.context for proper cleanup
    const ctx = gsap.context(() => {
      gsap.from(chartRef.current, { opacity: 0, scale: 0.95, duration: 0.6, delay: 0.3,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
    }, sectionRef)

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      ctx.revert()
      chart.dispose()
    }
  }, [homeTeam, awayTeam])

  return (
    <section ref={sectionRef} className="bg-surface rounded-2xl p-6 border border-white/5">
      <h3 className="text-lg font-bold mb-2">球队对比</h3>
      <div ref={chartRef} style={{ height: 350 }} />
    </section>
  )
}
