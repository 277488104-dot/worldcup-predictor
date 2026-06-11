import type { Team, Venue } from '@/types/worldcup'
import { predictMatch, predictScores, computeTeamScore } from '@/lib/prediction'

interface PostMatchReviewProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  homeScore: number
  awayScore: number
}

export default function PostMatchReview({ homeTeam, awayTeam, venue, homeScore, awayScore }: PostMatchReviewProps) {
  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const scores = predictScores(homeTeam, awayTeam, venue)
  const homeBase = computeTeamScore(homeTeam.stats)
  const awayBase = computeTeamScore(awayTeam.stats)

  const realWinner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw'
  const predictedWinner = prediction.homeWin > prediction.awayWin ? 'home' : prediction.awayWin > prediction.homeWin ? 'away' : 'draw'

  const predictionCorrect = realWinner === predictedWinner
  const predictedScore = scores[0]
  const scoreDiffCorrect = Math.abs(
    (homeScore - awayScore) - (predictedScore.homeScore - predictedScore.awayScore)
  )
  const scoreAccurate = scoreDiffCorrect <= 1

  return (
    <div className="rounded-2xl border-2 border-gold/30 bg-gold/[0.03] p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-xl">
          {predictionCorrect && scoreAccurate ? '🎯' : predictionCorrect ? '✅' : '❌'}
        </div>
        <div>
          <div className="kicker kicker-gold">POST-MATCH REVIEW</div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-chalk">
            赛后<span className="text-gold">复盘</span>
          </h3>
        </div>
      </div>

      {/* Result comparison */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-6 mb-5">
        {/* AI Prediction */}
        <div className={`rounded-xl p-3 sm:p-4 text-center bg-[#0d220d] border ${
          predictionCorrect ? 'border-grass-pop/20' : 'border-gold/20'
        }`}>
          <div className="text-[9px] sm:text-[10px] text-dim mb-2">🤖 AI 预测</div>
          <div className="font-mono text-lg sm:text-2xl font-black text-grass-pop">
            {predictedScore.homeScore}-{predictedScore.awayScore}
          </div>
          <div className="text-[9px] sm:text-[10px] text-dim mt-2">
            {homeTeam.nameCn} 胜率 {Math.round(prediction.homeWin * 100)}% ·
            平局 {Math.round(prediction.draw * 100)}% ·
            {awayTeam.nameCn} 胜率 {Math.round(prediction.awayWin * 100)}%
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-[10px] text-dim">VS</span>
          <span className={`text-lg sm:text-2xl font-black ${
            predictionCorrect ? 'text-grass-pop' : 'text-gold'
          }`}>
            {predictionCorrect ? '✓' : '✗'}
          </span>
        </div>

        {/* Real Result */}
        <div className={`rounded-xl p-3 sm:p-4 text-center border ${
          realWinner === predictedWinner ? 'bg-grass-pop/5 border-grass-pop/30' : 'bg-gold/5 border-gold/20'
        }`}>
          <div className="text-[9px] sm:text-[10px] text-dim mb-2">⚡ 实际比分</div>
          <div className="font-mono text-lg sm:text-2xl font-black text-chalk">
            {homeScore}-{awayScore}
          </div>
          <div className="text-[9px] sm:text-[10px] text-dim mt-2">
            {realWinner === 'home' ? `${homeTeam.nameCn} 获胜` :
             realWinner === 'away' ? `${awayTeam.nameCn} 获胜` : '平局'}
          </div>
        </div>
      </div>

      {/* Accuracy assessment */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="bg-[#0d220d] rounded-xl p-3 sm:p-4 text-center border border-white/10">
          <div className="text-[9px] sm:text-[10px] text-dim mb-1">胜方预测</div>
          <div className={`text-xs sm:text-sm font-extrabold ${predictionCorrect ? 'text-grass-pop' : 'text-gold'}`}>
            {predictionCorrect ? '准确 ✓' : '错误 ✗'}
          </div>
          <div className="text-[9px] text-dim mt-1">
            {predictedWinner === 'home' ? `预测 ${homeTeam.nameCn} 胜` :
             predictedWinner === 'away' ? `预测 ${awayTeam.nameCn} 胜` : '预测平局'}
          </div>
        </div>
        <div className="bg-[#0d220d] rounded-xl p-3 sm:p-4 text-center border border-white/10">
          <div className="text-[9px] sm:text-[10px] text-dim mb-1">比分偏差</div>
          <div className={`text-xs sm:text-sm font-extrabold ${scoreAccurate ? 'text-grass-pop' : 'text-gold'}`}>
            {scoreAccurate ? '准确 ✓' : `差 ${scoreDiffCorrect} 球`}
          </div>
          <div className="text-[9px] text-dim mt-1">
            预测 {predictedScore.homeScore}-{predictedScore.awayScore} ·
            实际 {homeScore}-{awayScore}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-black/20 rounded-xl p-3 sm:p-4 text-xs leading-relaxed">
        <div className="font-bold text-gold mb-2">📋 复盘总结</div>
        <p className="text-chalk/70">
          {predictionCorrect && scoreAccurate
            ? `🎯 AI 完美预测！不仅猜中了胜负，连比分 ${predictedScore.homeScore}-${predictedScore.awayScore} 都精准命中。${
                homeBase > awayBase
                  ? `${homeTeam.nameCn} 的高综合战力（${Math.round(homeBase)} vs ${Math.round(awayBase)}）是决定性因素。`
                  : awayBase > homeBase
                  ? `${awayTeam.nameCn} 的高综合战力（${Math.round(awayBase)} vs ${Math.round(homeBase)}）是决定性因素。`
                  : ''
              } 模型对这场比赛的数据把握非常到位。`
            : predictionCorrect
            ? `✅ AI 方向判断正确——预测了 ${predictedWinner === 'home' ? `${homeTeam.nameCn} 获胜` : predictedWinner === 'away' ? `${awayTeam.nameCn} 获胜` : '平局'}。但比分有偏差，预测 ${predictedScore.homeScore}-${predictedScore.awayScore}，实际 ${homeScore}-${awayScore}（差 ${scoreDiffCorrect} 球）。足球的魅力就在于无法完全预测！`
            : `❌ AI 预测 ${predictedWinner === 'home' ? `${homeTeam.nameCn} 胜` : predictedWinner === 'away' ? `${awayTeam.nameCn} 胜` : '平局'}，但实际${realWinner === 'home' ? `${homeTeam.nameCn} 获胜` : realWinner === 'away' ? `${awayTeam.nameCn} 获胜` : '平局'}。${
                Math.abs(homeBase - awayBase) < 10
                  ? '两队实力原本就接近，冷门并不意外。'
                  : venue.altitude > 1500
                  ? `${venue.name} 的高海拔（${venue.altitude}m）可能超出模型预估。`
                  : '足球比赛充满变数，这正是它的魅力。'
              } 模型还有优化空间！`
          }
        </p>
      </div>
    </div>
  )
}
