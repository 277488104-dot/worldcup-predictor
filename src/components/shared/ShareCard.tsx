'use client'

import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'

interface ShareCardProps {
  homeTeam: string
  awayTeam: string
  homeFlag: string
  awayFlag: string
  homeScore: number
  awayScore: number
  homeWin: number
  draw: number
  awayWin: number
  confidence: number
  matchDate: string
  matchTime: string
  stage: string
  onClose: () => void
}

export default function ShareCard(props: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleDownload = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0a180a',
      scale: 2,
    })
    const link = document.createElement('a')
    link.download = `wc26-${props.homeTeam}-vs-${props.awayTeam}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={props.onClose}>
      <div className="max-w-md w-full space-y-4" onClick={e => e.stopPropagation()}>

        {/* The share card */}
        <div ref={cardRef} className="bg-[#0a180a] border-2 border-grass-pop/20 rounded-2xl p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted mb-2">
              <span>🔮</span>
              <span>WC26 AI PREDICTION</span>
            </div>
            <div className="text-[10px] text-dim">
              {props.matchDate} · {props.matchTime} · {props.stage}
            </div>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl">{props.homeFlag}</span>
              <span className="text-sm font-extrabold text-chalk">{props.homeTeam}</span>
            </div>
            <div className="text-center">
              <div className="font-mono text-4xl font-black text-grass-pop num-glow">
                {props.homeScore}
              </div>
              <div className="text-muted text-sm my-1">预测</div>
              <div className="font-mono text-4xl font-black text-gold">
                {props.awayScore}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl">{props.awayFlag}</span>
              <span className="text-sm font-extrabold text-chalk">{props.awayTeam}</span>
            </div>
          </div>

          {/* Win probabilities */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-chalk font-bold w-16 text-right">{props.homeTeam.slice(0, 4)}</span>
              <div className="flex-1 progress-bar h-2">
                <div className="progress-fill progress-fill-green h-2" style={{ width: `${props.homeWin * 100}%` }} />
              </div>
              <span className="font-mono text-grass-pop font-bold w-10">{Math.round(props.homeWin * 100)}%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-muted font-bold w-16 text-right">平局</span>
              <div className="flex-1 progress-bar h-2">
                <div className="progress-fill progress-fill-muted h-2" style={{ width: `${props.draw * 100}%` }} />
              </div>
              <span className="font-mono text-muted font-bold w-10">{Math.round(props.draw * 100)}%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-chalk font-bold w-16 text-right">{props.awayTeam.slice(0, 4)}</span>
              <div className="flex-1 progress-bar h-2">
                <div className="progress-fill progress-fill-gold h-2" style={{ width: `${props.awayWin * 100}%` }} />
              </div>
              <span className="font-mono text-gold font-bold w-10">{Math.round(props.awayWin * 100)}%</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-grass-pop to-emerald flex items-center justify-center text-[8px] text-pitch font-black">W</div>
              <span className="text-[9px] text-dim">WC26 Predictor</span>
            </div>
            <div className="text-[9px] text-muted">
              置信度 {Math.round(props.confidence * 100)}%
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={handleDownload}
            className="flex-1 px-4 py-3 rounded-xl bg-grass-pop text-pitch text-sm font-bold hover:opacity-90 transition-opacity">
            📸 保存图片
          </button>
          <button onClick={handleCopyLink}
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-chalk text-sm font-bold hover:bg-white/15 transition-opacity">
            {copied ? '✅ 已复制' : '🔗 复制链接'}
          </button>
          <button onClick={props.onClose}
            className="px-4 py-3 rounded-xl bg-white/5 text-muted text-sm hover:text-chalk">
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
