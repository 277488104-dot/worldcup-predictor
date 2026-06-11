import type { Team, Venue } from '@/types/worldcup'
import { predictMatch, predictScores, computeTeamScore, computeVenueFactor } from '@/lib/prediction'
import PredictionBar from '@/components/shared/PredictionBar'
import ScorePredictions from '@/components/shared/ScorePredictions'

interface PredictionCardProps {
  homeTeam: Team
  awayTeam: Team
  venue: Venue
}

export default function PredictionCard({ homeTeam, awayTeam, venue }: PredictionCardProps) {
  const prediction = predictMatch(homeTeam, awayTeam, venue)
  const scores = predictScores(homeTeam, awayTeam, venue)

  const homeBaseScore = computeTeamScore(homeTeam.stats)
  const awayBaseScore = computeTeamScore(awayTeam.stats)
  const homeVf = computeVenueFactor(homeTeam, venue)
  const awayVf = computeVenueFactor(awayTeam, venue)
  const homeAdj = Math.round(homeBaseScore * homeVf)
  const awayAdj = Math.round(awayBaseScore * awayVf)

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

      <div className="mt-6">
        <ScorePredictions scores={scores} />
      </div>

      {/* ===== COMPREHENSIVE FACTOR BREAKDOWN ===== */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="kicker kicker-green mb-4">FACTOR ANALYSIS</div>
        <div className="space-y-3">
          {prediction.factors.map((f, i) => (
            <div key={i} className="bg-white/[0.02] rounded-xl p-3">
              {/* Factor header */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  f.advantage === 'home' ? 'bg-grass-pop/15 text-grass-pop' :
                  f.advantage === 'away' ? 'bg-gold/15 text-gold' :
                  'bg-white/5 text-muted'
                }`}>
                  {f.advantage === 'home' ? `${homeTeam.nameCn} 占优` :
                   f.advantage === 'away' ? `${awayTeam.nameCn} 占优` :
                   '双方均衡'}
                </span>
                <span className="text-xs text-chalk/90 font-semibold">{f.name}</span>
                {/* Weight dots */}
                <div className="flex ml-auto gap-px">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className={`w-1.5 h-1.5 rounded-full ${
                      j < Math.round(f.weight * 5)
                        ? f.advantage === 'home' ? 'bg-grass-pop' : f.advantage === 'away' ? 'bg-gold' : 'bg-muted'
                        : 'bg-white/[0.04]'
                    }`} />
                  ))}
                </div>
              </div>
              {/* Factor explanation */}
              <div className="text-[10px] text-dim leading-relaxed ml-[2px]">
                {f.name === 'FIFA 排名' && (
                  f.advantage === 'home'
                    ? `${homeTeam.nameCn} FIFA 排名 #${homeTeam.fifaRank}，远高于 ${awayTeam.nameCn} 的 #${awayTeam.fifaRank}。排名差距 ${Math.abs(homeTeam.fifaRank - awayTeam.fifaRank)} 位表明整体实力存在明显差距，这是预测的重要基础。`
                    : f.advantage === 'away'
                    ? `${awayTeam.nameCn} FIFA 排名 #${awayTeam.fifaRank}，远高于 ${homeTeam.nameCn} 的 #${homeTeam.fifaRank}。排名差距 ${Math.abs(homeTeam.fifaRank - awayTeam.fifaRank)} 位表明整体实力存在明显差距，这是预测的重要基础。`
                    : `两队 FIFA 排名接近（#${homeTeam.fifaRank} vs #${awayTeam.fifaRank}），仅差 ${Math.abs(homeTeam.fifaRank - awayTeam.fifaRank)} 位，排名因素不足以形成明显倾斜。`
                )}
                {f.name === '近期状态' && (
                  f.advantage === 'home'
                    ? `${homeTeam.nameCn} 近期状态评分 ${homeTeam.stats.recentForm}，高于 ${awayTeam.nameCn} 的 ${awayTeam.stats.recentForm}。状态好的球队在关键时刻更能把握机会，反击和定位球转化率更高。`
                    : f.advantage === 'away'
                    ? `${awayTeam.nameCn} 近期状态评分 ${awayTeam.stats.recentForm}，高于 ${homeTeam.nameCn} 的 ${homeTeam.stats.recentForm}。状态好的球队在关键时刻更能把握机会，反击和定位球转化率更高。`
                    : `两队近期状态评分相同（${homeTeam.stats.recentForm}），近期比赛表现旗鼓相当，状态因素不构成任何一方的优势。`
                )}
                {f.name === '场地适应' && (
                  f.advantage === 'home'
                    ? `${homeTeam.nameCn} 场地适应修正后得分 ${homeAdj}（基础 ${Math.round(homeBaseScore)} × 因子 ${homeVf.toFixed(2)}），高于 ${awayTeam.nameCn} 的 ${awayAdj}。${homeTeam.confederation === 'CONCACAF' ? '身为中北美球队有主场之利。' : ''}`
                    : f.advantage === 'away'
                    ? `${awayTeam.nameCn} 场地适应修正后得分 ${awayAdj}（基础 ${Math.round(awayBaseScore)} × 因子 ${awayVf.toFixed(2)}），高于 ${homeTeam.nameCn} 的 ${homeAdj}。${awayTeam.confederation === 'CONCACAF' ? '身为中北美球队有主场之利。' : ''}`
                    : `两队场地适应得分接近，${venue.name} (${venue.altitude}m) 的环境对双方影响相当。`
                )}
                {f.name === '攻击 vs 防守' && (
                  f.advantage === 'home'
                    ? `${homeTeam.nameCn} 攻击力 ${homeTeam.stats.attack} 面对 ${awayTeam.nameCn} 防守力 ${awayTeam.stats.defense}，攻击端有明显穿透力。${homeTeam.nameCn} 的锋线有能力撕破对方防线创造进球。`
                    : f.advantage === 'away'
                    ? `${awayTeam.nameCn} 攻击力 ${awayTeam.stats.attack} 面对 ${homeTeam.nameCn} 防守力 ${homeTeam.stats.defense}，攻击端有明显穿透力。${awayTeam.nameCn} 的锋线有能力撕破对方防线创造进球。`
                    : `攻击方与防守方实力对等（${homeTeam.stats.attack} vs ${awayTeam.stats.defense}），攻防制衡明显。`
                )}
                {f.name === '防守 vs 攻击' && (
                  f.advantage === 'home'
                    ? `${homeTeam.nameCn} 防守力 ${homeTeam.stats.defense} 能有效遏制 ${awayTeam.nameCn} 攻击力 ${awayTeam.stats.attack}，后防线稳固将限制对方得分机会。`
                    : f.advantage === 'away'
                    ? `${awayTeam.nameCn} 防守力 ${awayTeam.stats.defense} 能有效遏制 ${homeTeam.nameCn} 攻击力 ${homeTeam.stats.attack}，后防线稳固将限制对方得分机会。`
                    : `防守与进攻力量对等（${homeTeam.stats.defense} vs ${awayTeam.stats.attack}），双方各有制约。`
                )}
                {f.name === '控球能力' && (
                  f.advantage === 'home'
                    ? `${homeTeam.nameCn} 控球 ${homeTeam.stats.possession}，高于 ${awayTeam.nameCn} 的 ${awayTeam.stats.possession}。控球优势意味着更多进攻机会和节奏掌控权。`
                    : f.advantage === 'away'
                    ? `${awayTeam.nameCn} 控球 ${awayTeam.stats.possession}，高于 ${homeTeam.nameCn} 的 ${homeTeam.stats.possession}。控球优势意味着更多进攻机会和节奏掌控权。`
                    : `两队控球能力接近（${homeTeam.stats.possession} vs ${awayTeam.stats.possession}），中场争夺将非常激烈。`
                )}
                {f.name === '体能储备' && (
                  f.advantage === 'home'
                    ? `${homeTeam.nameCn} 体能评分 ${homeTeam.stats.fitness}，优于 ${awayTeam.nameCn} 的 ${awayTeam.stats.fitness}。比赛末段体能优势可能成为决定因素。`
                    : f.advantage === 'away'
                    ? `${awayTeam.nameCn} 体能评分 ${awayTeam.stats.fitness}，优于 ${homeTeam.nameCn} 的 ${homeTeam.stats.fitness}。比赛末段体能优势可能成为决定因素。`
                    : `两队体能储备相当（${homeTeam.stats.fitness} vs ${awayTeam.stats.fitness}），高强度对抗下不会有明显差距。`
                )}
                {f.name === '大赛经验' && (
                  f.advantage === 'home'
                    ? `${homeTeam.nameCn} 大赛经验评分 ${homeTeam.stats.experience}，领先 ${awayTeam.nameCn} 的 ${awayTeam.stats.experience}。丰富的大赛经验有助于在关键时刻保持冷静和战术执行力。`
                    : f.advantage === 'away'
                    ? `${awayTeam.nameCn} 大赛经验评分 ${awayTeam.stats.experience}，领先 ${homeTeam.nameCn} 的 ${homeTeam.stats.experience}。丰富的大赛经验有助于在关键时刻保持冷静和战术执行力。`
                    : `两队大赛经验相当（${homeTeam.stats.experience} vs ${awayTeam.stats.experience}），在高压局面下都能保持稳定。`
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== COMPREHENSIVE CONCLUSION ===== */}
      <div className="mt-6 p-5 rounded-xl border border-grass-pop/15 bg-grass-pop/[0.04]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <div className="kicker kicker-green">AI ANALYSIS CONCLUSION</div>
        </div>
        <h4 className="font-display text-base font-extrabold text-chalk mb-4">
          综合<span className="text-grass-pop">推理</span>过程
        </h4>

        <div className="space-y-4 text-xs leading-relaxed">
          {/* How we got here */}
          <div className="text-chalk/85">
            <span className="font-bold text-chalk">▸ 计算方法：</span>
            使用加权评分模型，对 6 项核心指标（进攻 {WEIGHTS_STR}）进行加权求和，得出基础战力评分。
            {homeTeam.nameCn} 基础 {Math.round(homeBaseScore)} 分，{awayTeam.nameCn} 基础 {Math.round(awayBaseScore)} 分。
          </div>

          <div className="text-chalk/85">
            <span className="font-bold text-chalk">▸ 场馆修正：</span>
            {venue.name}（海拔 {venue.altitude}m）的场地特征经模型计算，
            {homeTeam.nameCn} 场地因子为 {homeVf.toFixed(2)}（修正后 {homeAdj} 分），
            {awayTeam.nameCn} 场地因子为 {awayVf.toFixed(2)}（修正后 {awayAdj} 分）。
            {venue.altitude >= 1500 ? `高海拔 (${venue.altitude}m) 对不适应高原的球队构成额外挑战。` : '低海拔条件下两支球队均能正常发挥。'}
            {homeTeam.confederation === 'CONCACAF' && awayTeam.confederation !== 'CONCACAF'
              ? ` 此外，${homeTeam.nameCn} 作为 CONCACAF 球队，享有区域主场优势加成。`
              : awayTeam.confederation === 'CONCACAF' && homeTeam.confederation !== 'CONCACAF'
              ? ` 此外，${awayTeam.nameCn} 作为 CONCACAF 球队，享有区域主场优势加成。`
              : ''}
          </div>

          <div className="text-chalk/85">
            <span className="font-bold text-chalk">▸ 概率推导：</span>
            修正后战力比值 {homeAdj}:{awayAdj} 转化为胜率。
            主场胜率 {Math.round(prediction.homeWin * 100)}%，平局保留 25%，客场胜率 {Math.round(prediction.awayWin * 100)}%。
            置信度 {Math.round(prediction.confidence * 100)}% 来源于排名差距（{Math.abs(homeTeam.fifaRank - awayTeam.fifaRank)} 位）与基础分差（{Math.abs(Math.round(homeBaseScore - awayBaseScore))} 分）。
          </div>

          {/* Who has how many advantages */}
          <div className="text-chalk/85">
            <span className="font-bold text-chalk">▸ 优势方向：</span>
            {(() => {
              const homeAdv = prediction.factors.filter(f => f.advantage === 'home').length
              const awayAdv = prediction.factors.filter(f => f.advantage === 'away').length
              const neutral = prediction.factors.filter(f => f.advantage === 'neutral').length
              if (homeAdv > awayAdv) {
                return `${homeTeam.nameCn} 在 ${homeAdv} 个因素上占优，${awayTeam.nameCn} 在 ${awayAdv} 个因素上占优，${neutral} 个因素双方均衡。总体而言 ${homeTeam.nameCn} 掌握更多主动。`
              } else if (awayAdv > homeAdv) {
                return `${awayTeam.nameCn} 在 ${awayAdv} 个因素上占优，${homeTeam.nameCn} 在 ${homeAdv} 个因素上占优，${neutral} 个因素双方均衡。总体而言 ${awayTeam.nameCn} 掌握更多主动。`
              } else {
                return `双方各在 ${homeAdv} 个因素上占优，${neutral} 个因素均衡。这场对决几乎没有先手优势。`
              }
            })()}
          </div>
        </div>

        {/* Final verdict */}
        <div className="mt-5 p-4 rounded-xl bg-black/30 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🏆</span>
            <span className="text-sm font-extrabold text-chalk">最终预测</span>
          </div>
          <p className="text-xs text-chalk/80 leading-relaxed">
            {prediction.homeWin > prediction.awayWin
              ? `综合 8 项因素分析，${homeTeam.nameCn} 以 ${Math.round(prediction.homeWin * 100)}% 的胜率被看好。最可能的比分是 ${scores[0].homeScore}-${scores[0].awayScore}（概率 ${Math.round(scores[0].probability * 100)}%）。模型的核心依据是 ${homeTeam.nameCn} 在 ${
                  prediction.factors.filter(f => f.advantage === 'home').map(f => f.name).slice(0, 2).join('、')
                } 等关键维度上的优势。${
                  Math.abs(homeTeam.fifaRank - awayTeam.fifaRank) < 10 ? '不过两队排名接近，实际比赛走势取决于临场发挥，预测仅供参考。' : ''
                }`
              : prediction.awayWin > prediction.homeWin
              ? `综合 8 项因素分析，${awayTeam.nameCn} 以 ${Math.round(prediction.awayWin * 100)}% 的胜率被看好。最可能的比分是 ${scores[0].homeScore}-${scores[0].awayScore}（概率 ${Math.round(scores[0].probability * 100)}%）。模型的核心依据是 ${awayTeam.nameCn} 在 ${
                  prediction.factors.filter(f => f.advantage === 'away').map(f => f.name).slice(0, 2).join('、')
                } 等关键维度上的优势。${
                  Math.abs(homeTeam.fifaRank - awayTeam.fifaRank) < 10 ? '不过两队排名接近，实际比赛走势取决于临场发挥，预测仅供参考。' : ''
                }`
              : `综合 8 项因素分析，两队实力极为均衡。预测胜率接近，最可能出现 ${scores[0].homeScore}-${scores[0].awayScore} 的平局或小比分胜负（概率 ${Math.round(scores[0].probability * 100)}%）。${
                  venue.altitude > 1500 ? `${venue.name} 的高海拔环境将增加不确定性。` : ''
                }这场比赛注定胶着，建议关注临场阵容和战术调整。`
            }
          </p>
        </div>
      </div>
    </div>
  )
}

// Small const for display (not exported)
const WEIGHTS_STR = '进攻 20%、防守 20%、控球 15%、体能 10%、经验 15%、近期状态 20%'
