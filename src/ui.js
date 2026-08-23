// 通用 UI 工具：星级、图标（SVG）、底部标签栏、HTML 转义
import { ZODIACS } from './data/zodiac.js';

export function starsHTML(score) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += i <= score ? '<i class="on">★</i>' : '<i>★</i>';
  }
  return `<span class="stars">${s}</span>`;
}

export function findBySignId(id) {
  return ZODIACS.find((z) => z.id === id);
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

const svg = (paths, viewBox = '0 0 24 24') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const ICONS = {
  home: svg('M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z'),
  user: svg('M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 1-6 6v2M16 7a4 4 0 0 0-7-2.9'),
  heart: svg('M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'),
  briefcase: svg('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
  sparkle: svg('M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z'),
  coin: svg('<circle cx="12" cy="12" r="9"/><path d="M9 8l3 4 3-4M12 12v4.5M9.7 10.5h4.6M9.7 15h4.6M9.7 12.8h4.6"/>'),
  leaf: svg('M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'),
  back: svg('<path d="M15 18l-6-6 6-6"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>'),
  share: svg('<path d="M21 15v6H3v-6M12 15V3M8 7l4-4 4 4"/>'),
  download: svg('<path d="M21 15v4H3v-4M7 12l5 5 5-5M12 17V3"/>'),
};

export const DIM_ICONS = {
  overall: ICONS.sparkle,
  love: ICONS.heart,
  work: ICONS.briefcase,
  wealth: ICONS.coin,
  health: ICONS.leaf,
};

export function colorHex(name) {
  const map = {
    '红色': '#ef4444', '橙色': '#f97316', '黄色': '#eab308', '绿色': '#22c55e',
    '青色': '#06b6d4', '蓝色': '#3b82f6', '紫色': '#a855f7', '粉色': '#ec4899',
    '白色': '#f8fafc', '金色': '#eab308', '银色': '#cbd5e1', '靛蓝色': '#6366f1',
  };
  return map[name] || '#f8fafc';
}

export function tabbar(active) {
  return `
  <nav class="tabbar">
    <a class="tab ${active === 'home' ? 'on' : ''}" href="#/">${ICONS.home}<span>运势</span></a>
    <a class="tab ${active === 'profile' ? 'on' : ''}" href="#/profile">${ICONS.user}<span>我的</span></a>
  </nav>`;
}
