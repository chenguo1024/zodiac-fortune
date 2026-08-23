// 运势生成：根据「星座 + 周期 + 日期」确定性生成，
// 保证同一天、同一星座、同一周期得到稳定一致的结果
import { ZODIACS, ELEMENT_MATCH } from '../data/zodiac.js';
import { POOLS, LUCKY_COLORS, DETAIL_POOLS, ADVICE, YI, JI } from '../data/fortunePool.js';
import { typeKey } from './zodiacCalc.js';

// FNV-1a 字符串哈希
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 伪随机数生成器（种子固定则序列固定）
function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

// 从数组里不重复地选 n 个
function pickN(rng, arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  }
  return out;
}

// 生成 1-5 星评分（3、4 星居多，低分高分都有，避免每项都 5 星）
function makeScore(rng) {
  const roll = rng();
  if (roll < 0.08) return 2;
  if (roll < 0.42) return 3;
  if (roll < 0.82) return 4;
  return 5;
}

export const DIMENSIONS = [
  { key: 'overall', label: '综合', color: '#a78bfa' },
  { key: 'love', label: '爱情', color: '#f472b6' },
  { key: 'work', label: '事业', color: '#60a5fa' },
  { key: 'wealth', label: '财运', color: '#34d399' },
  { key: 'health', label: '健康', color: '#4ade80' },
];

export function getFortune(signId, type, date = new Date()) {
  const zodiac = ZODIACS.find((z) => z.id === signId) || ZODIACS[0];
  const periodKey = typeKey(type, date);
  const rng = mulberry32(hashStr(`${signId}|${type}|${periodKey}`));

  const fortune = {
    signId: zodiac.id,
    type,
    periodKey,
    score: makeScore(rng),
    luckyNumber: 1 + Math.floor(rng() * 9),
    luckyColor: pick(rng, LUCKY_COLORS),
    advice: pick(rng, ADVICE),
    yi: pickN(rng, YI, 2),
    ji: pickN(rng, JI, 2),
    summary: {},
    detail: {},
  };

  for (const dim of DIMENSIONS) {
    fortune.summary[dim.key] = pick(rng, POOLS[dim.key]);
    fortune.detail[dim.key] = pick(rng, DETAIL_POOLS[dim.key]);
  }

  const candidateElements = ELEMENT_MATCH[zodiac.element];
  let candidates = ZODIACS.filter(
    (z) => z.id !== zodiac.id && candidateElements.includes(z.element)
  );
  if (candidates.length === 0) candidates = ZODIACS.filter((z) => z.id !== zodiac.id);
  fortune.compatibleSign = pick(rng, candidates);

  return fortune;
}
