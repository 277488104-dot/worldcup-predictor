import HeroBanner from '@/components/home/HeroBanner'
import TodayMatches from '@/components/home/TodayMatches'
import GroupStandings from '@/components/home/GroupStandings'
import LiveTicker from '@/components/shared/LiveTicker'
import LiveScoreBar from '@/components/shared/LiveScoreBar'

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-5 -mt-16 relative z-20 space-y-4">
        <LiveScoreBar />
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
