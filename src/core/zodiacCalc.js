// 星座推算与日期工具
import { ZODIACS } from '../data/zodiac.js';

const pad2 = (n) => String(n).padStart(2, '0');

// 每个星座的起始日：[月, 日, 星座id]，按时间顺序排列
const STARTS = [
  [1, 20, 2], [2, 19, 3], [3, 21, 4], [4, 20, 5], [5, 21, 6], [6, 22, 7],
  [7, 23, 8], [8, 23, 9], [9, 23, 10], [10, 24, 11], [11, 23, 12], [12, 22, 1],
];

const before = (a, b) => (a[0] - b[0]) || (a[1] - b[1]);

// 根据月、日推算星座；返回 ZODIACS 中的对象
export function signFromMonthDay(month, day) {
  const date = [month, day];
  let id = 1; // 在 1 月 20 日之前，属于上一年 12 月 22 日开始的摩羯座
  for (const [m, d, signId] of STARTS) {
    if (before(date, [m, d]) < 0) break;
    id = signId;
  }
  return ZODIACS[id - 1];
}

export function signFromDate(date) {
  return signFromMonthDay(date.getMonth() + 1, date.getDate());
}

// 各周期对应的日期键
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function weekInfo(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const year = t.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil((((t - yearStart) / 86400000) + 1) / 7);
  return { year, week };
}
export const weekKey = (d) => {
  const { year, week } = weekInfo(d);
  return `${year}-W${pad2(week)}`;
};
export const monthKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
export const yearKey = (d) => String(d.getFullYear());

export function typeKey(type, d) {
  switch (type) {
    case 'weekly': return weekKey(d);
    case 'monthly': return monthKey(d);
    case 'yearly': return yearKey(d);
    default: return todayKey(d);
  }
}

// 各周期的中文展示标签
export function periodLabel(type, d = new Date()) {
  switch (type) {
    case 'weekly': {
      const { year, week } = weekInfo(d);
      return `${year} 年第 ${week} 周`;
    }
    case 'monthly': return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
    case 'yearly': return `${d.getFullYear()} 年`;
    default: {
      const today = new Date();
      const isToday = todayKey(d) === todayKey(today);
      const label = `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
      return isToday ? `${label} · 今天` : `${label} · 星期${WEEK[d.getDay()]}`;
    }
  }
}
