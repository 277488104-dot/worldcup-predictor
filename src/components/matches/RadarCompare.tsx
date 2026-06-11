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
