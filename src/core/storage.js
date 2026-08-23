// 本地存储：保存用户生日
import { signFromDate } from './zodiacCalc.js';

const KEY = 'star-words-birthday';

export function getBirthday() {
  try {
    return localStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}

export function setBirthday(value) {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    /* 隐私模式等极端情况忽略 */
  }
}

// 根据已保存生日推算本命星座；未设置则返回 null
export function getMySign() {
  const b = getBirthday();
  if (!b) return null;
  const [y, m, d] = b.split('-').map(Number);
  if (!m || !d) return null;
  const date = new Date(y || 2000, m - 1, d);
  return signFromDate(date);
}
