/**
 * Converts a UTC ISO date string to Beijing time display.
 * Beijing = UTC+8
 */

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function toBeijingDate(isoStr: string): string {
  const d = new Date(isoStr)
  // Add 8 hours to get Beijing time
  const bj = new Date(d.getTime() + 8 * 3600000)
  return `${bj.getUTCFullYear()}/${pad(bj.getUTCMonth() + 1)}/${pad(bj.getUTCDate())}`
}

export function toBeijingTime(isoStr: string): string {
  const d = new Date(isoStr)
  const bj = new Date(d.getTime() + 8 * 3600000)
  return `${pad(bj.getUTCHours())}:${pad(bj.getUTCMinutes())}`
}

export function toBeijingDateTime(isoStr: string): string {
  return `${toBeijingDate(isoStr)} ${toBeijingTime(isoStr)}`
}

export function toBeijingWeekday(isoStr: string): string {
  const d = new Date(isoStr)
  const bj = new Date(d.getTime() + 8 * 3600000)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[bj.getUTCDay()]
}

export function toBeijingFullDate(isoStr: string): string {
  const d = new Date(isoStr)
  const bj = new Date(d.getTime() + 8 * 3600000)
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${weekdays[bj.getUTCDay()]} ${bj.getUTCFullYear()}年${bj.getUTCMonth() + 1}月${bj.getUTCDate()}日`
}
