# 2026 世界杯预测网站 — 全站 UI 重设计

## 概述

对 worldcup-predictor Next.js 项目进行全站 UI 重设计。7 个页面全部重写，保留现有数据层和业务逻辑，用全新的绿茵场主题 + 体育媒体风格 + 炫技动画重建前端。

## 设计方向

**体育媒体风（ESPN/The Athletic）× 绿茵场色调 × 三层叙事结构**

- 底色：深绿 Pitch (#0a180a)，模拟站在球场中央的沉浸感
- 强调色：草绿 Grass (#4ade80 / #22c55e)，金色 Ball Gold (#f0c040)
- 文字：粉笔白 Chalk (#f5f5f0)，灰色 muted/dim (#889988 / #bbccbb)
- 红色仅用于 LIVE 标签

### 视觉记忆点（三层叙事）

1. **顶部 Hero** — 全屏大图/渐变背景 + 超大标题 (900 weight, 0.85 line-height) + 倒计时 + 主办国
2. **中部仪表盘** — 实时比分跑马灯、今日比赛卡片、小组积分榜快览、AI 预测概率
3. **底部球场** — 球场条纹纹理视差、CTA 区域

### 人格策略

- **首页（球迷）**：大字报式标题、激情澎湃的排版、动态数据
- **比赛/球队详情页（专家）**：冷静的数据呈现、雷达图、概率条、结构化表格

## 配色系统

```css
:root {
  /* 背景层级 */
  --pitch: #0a180a;       /* 根背景 */
  --turf: #0d260d;        /* 主背景 */
  --grass: #112d11;       /* 卡片 */
  --field: #1a3d1a;       /* 悬浮态 */
  
  /* 强调色 */
  --grass-pop: #4ade80;   /* 主强调 */
  --emerald: #22c55e;     /* 深强调 */
  --gold: #f0c040;        /* 高亮/CTA */
  --danger: #ef4444;      /* LIVE 标签 */
  
  /* 文字 */
  --chalk: #f5f5f0;       /* 主文字 */
  --muted: #889988;       /* 次级文字 */
  --dim: #bbccbb;         /* 辅助文字 */
}
```

## 排版系统

| 层级 | 字体 | 字重 | 字号 | 用途 |
|------|------|------|------|------|
| Hero | Inter | 900 | 7xl-10xl (80-120px) | 首页大标题 |
| Section | Inter | 800 | 3xl-5xl (30-48px) | 区块标题 |
| Mono | JetBrains Mono | 700 | 2xl-3xl | 比分/统计数据 |
| Kicker | Inter | 700 | 10px | 标签/分类 |
| Body | Inter | 500 | 15px | 正文 |

## 标志性组件

1. **ScoreBadge** — 比分展示（球队缩写 + 等宽数字 + LIVE 脉冲标签 + 分钟）
2. **PredictionBar** — 胜平负概率条（渐变填充 + 百分比 + team label）
3. **StatPill** — 统计标签（图标 + 名称 + 数值，圆角药片）
4. **LiveTicker** — 实时比分跑马灯（横向滚动 + LIVE 脉冲 + 多场比赛）
5. **CountdownBlock** — 倒计时数字块（等宽字体 + 深色边框卡片）
6. **MatchCard** — 比赛卡片（球队旗帜 + VS/比分 + 时间/场馆 + 预测概率）
7. **GroupTable** — 小组积分榜迷你表（排名 + 国旗 + 积分）
8. **TeamCard** — 球队卡片（国旗 + 名称 + 排名 + 等级徽章）
9. **StatProgress** — 统计进度条（标签 + 数值 + 渐变填充）

## 动画清单

### 首页
- Hero 文字分段飞入 (stagger 0.15s)
- 球场条纹背景视差 (ScrollTrigger scrub)
- 倒计时数字跳动 (AnimatedNumber)
- 比分跑马灯无限横向滚动
- 比赛卡片入场 (ScrollTrigger stagger 0.1s)
- 背景光晕缓慢浮动
- 滚动指示器渐隐
- CTA hover scale + glow

### 比赛详情页
- LIVE 标签 CSS pulse
- ECharts 雷达图入场绘制
- 概率条宽度动画（0 → 目标值）
- H2H 时间线逐条出现
- 场馆数据 hover 3D tilt

### 全局
- 页面过渡 fade + slideUp
- Header 滚动方向检测显示/隐藏
- 卡片 hover translateY + border glow
- 数字滚动组件 (AnimatedNumber)
- 光标跟踪卡片微光效果

## 页面范围（全部 7 页）

1. **首页** `/` — Hero + LiveTicker + TodayMatches + GroupStandings
2. **赛程列表** `/matches` — 筛选器 + MatchCard 网格
3. **比赛详情** `/matches/[id]` — Scoreboard + Radar + Prediction + H2H + Venue
4. **球队列表** `/teams` — 洲际标签 + Group 卡片
5. **球队详情** `/teams/[id]` — Hero + Stats + Squad + Matches
6. **场馆详情** `/venues/[id]` — Venue info + 地图 + 气候
7. **球队对比** `/compare` — 选择器 + Radar + Prediction + H2H

## 实施策略

**Foundation → 首页 → 比赛详情 → 剩余页面**

1. **Foundation**（tailwind.config.ts + globals.css + layout + shared components）
2. **首页**（page.tsx + 所有 home 组件 + GSAP 动画）
3. **比赛详情页**（match/[id]/page.tsx + PredictionCard/RadarCompare/H2HTimeline/VenueFactor）
4. **球队页 + 场馆页 + 对比页**

## 技术约束

- Next.js 14 + App Router
- Tailwind CSS 3（利用 theme.extend 定义新颜色和动画）
- GSAP 3.15（已安装）+ ScrollTrigger
- ECharts 6（已安装）用于雷达图
- react-icons（已安装）
- 保留现有数据层 `src/lib/data.ts` 不变
- 保留现有 JSON 数据结构不变
- 页面人格切换通过 CSS 类和组件风格实现，不需要状态管理
