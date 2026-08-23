// 星座基础数据
// symbol 后追加 U+FE0E 强制以「文本」而非「emoji」样式渲染

export const ZODIACS = [
  { id: 1,  name: '摩羯座', symbol: '♑\uFE0E', en: 'Capricorn',   pinyin: 'mojie',       element: '土', monthStart: 12, dayStart: 22, monthEnd: 1, dayEnd: 19 },
  { id: 2,  name: '水瓶座', symbol: '♒\uFE0E', en: 'Aquarius',   pinyin: 'shuiping',    element: '风', monthStart: 1,  dayStart: 20, monthEnd: 2, dayEnd: 18 },
  { id: 3,  name: '双鱼座', symbol: '♓\uFE0E', en: 'Pisces',     pinyin: 'shuangyu',    element: '水', monthStart: 2,  dayStart: 19, monthEnd: 3, dayEnd: 20 },
  { id: 4,  name: '白羊座', symbol: '♈\uFE0E', en: 'Aries',      pinyin: 'baiyang',     element: '火', monthStart: 3,  dayStart: 21, monthEnd: 4, dayEnd: 19 },
  { id: 5,  name: '金牛座', symbol: '♉\uFE0E', en: 'Taurus',     pinyin: 'jinniu',      element: '土', monthStart: 4,  dayStart: 20, monthEnd: 5, dayEnd: 20 },
  { id: 6,  name: '双子座', symbol: '♊\uFE0E', en: 'Gemini',     pinyin: 'shuangzi',    element: '风', monthStart: 5,  dayStart: 21, monthEnd: 6, dayEnd: 21 },
  { id: 7,  name: '巨蟹座', symbol: '♋\uFE0E', en: 'Cancer',     pinyin: 'juxie',       element: '水', monthStart: 6,  dayStart: 22, monthEnd: 7, dayEnd: 22 },
  { id: 8,  name: '狮子座', symbol: '♌\uFE0E', en: 'Leo',        pinyin: 'shizi',       element: '火', monthStart: 7,  dayStart: 23, monthEnd: 8, dayEnd: 22 },
  { id: 9,  name: '处女座', symbol: '♍\uFE0E', en: 'Virgo',      pinyin: 'chunv',       element: '土', monthStart: 8,  dayStart: 23, monthEnd: 9, dayEnd: 22 },
  { id: 10, name: '天秤座', symbol: '♎\uFE0E', en: 'Libra',      pinyin: 'tiancheng',   element: '风', monthStart: 9,  dayStart: 23, monthEnd: 10, dayEnd: 23 },
  { id: 11, name: '天蝎座', symbol: '♏\uFE0E', en: 'Scorpio',    pinyin: 'tianxie',     element: '水', monthStart: 10, dayStart: 24, monthEnd: 11, dayEnd: 22 },
  { id: 12, name: '射手座', symbol: '♐\uFE0E', en: 'Sagittarius', pinyin: 'sheshou',    element: '火', monthStart: 11, dayStart: 23, monthEnd: 12, dayEnd: 21 },
];

// 元素相性：同元素或互补元素组合更和谐
export const ELEMENT_MATCH = {
  '火': ['火', '风'],
  '风': ['风', '火'],
  '水': ['水', '土'],
  '土': ['土', '水'],
};
