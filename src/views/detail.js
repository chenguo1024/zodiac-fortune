// 详情页：星座大图 + 日/周/月/年切换 + 五维度运势
import { getFortune, DIMENSIONS } from '../core/fortune.js';
import { periodLabel } from '../core/zodiacCalc.js';
import { findBySignId, starsHTML, ICONS, DIM_ICONS, escapeHtml } from '../ui.js';

const TABS = [
  { key: 'daily', label: '日运' },
  { key: 'weekly', label: '周运' },
  { key: 'monthly', label: '月运' },
  { key: 'yearly', label: '年运' },
];

export function renderDetail(app, match) {
  const id = Number(match[1]);
  const zodiac = findBySignId(id);
  if (!zodiac) { location.hash = '#/'; return; }

  let tab = (new URLSearchParams(match[2] || '').get('tab')) || '';
  if (!TABS.some((t) => t.key === tab)) tab = 'daily';

  const date = new Date();
  const fortune = getFortune(zodiac.id, tab, date);

  app.innerHTML = `
  <div class="page">
    <header class="detail-header">
      <a class="round-btn" href="#/" aria-label="返回">${ICONS.back}</a>
      <div class="detail-title">
        <span class="detail-symbol">${zodiac.symbol}</span>
        <div>
          <div class="detail-name">${zodiac.name}</div>
          <div class="detail-sub">${zodiac.monthStart}.${zodiac.monthStart === zodiac.monthStart ? zodiac.dayStart : ''} - ${zodiac.monthEnd}.${zodiac.dayEnd} · ${zodiac.element}象</div>
        </div>
      </div>
    </header>

    <div class="seg">
      ${TABS.map((t) => `<a class="${tab === t.key ? 'on' : ''}" href="#/sign/${zodiac.id}?tab=${t.key}">${t.label}</a>`).join('')}
    </div>

    <div class="score-hero card">
      <div>
        <div class="score-label">幸运指数</div>
        <div class="score-stars">${starsHTML(fortune.score)}</div>
      </div>
      <div class="score-num">${fortune.score * 20}<i>分</i></div>
    </div>

    <div class="dim-list">
      ${DIMENSIONS.map((d) => `
        <div class="card dim-card">
          <div class="dim-icon" style="color:${d.color}">${DIM_ICONS[d.key]}</div>
          <div class="dim-body">
            <div class="dim-label" style="color:${d.color}">${d.label}运势</div>
            <p class="dim-text">${escapeHtml(fortune[d.key])}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="card lucky-bar">
      <div class="lucky-item">
        <div class="lucky-label">幸运数字</div>
        <div class="lucky-value">${fortune.luckyNumber}</div>
      </div>
      <div class="lucky-item">
        <div class="lucky-label">幸运颜色</div>
        <div class="lucky-value color-dot-wrap"><span class="color-dot" style="background:${colorHex(fortune.luckyColor)}"></span>${fortune.luckyColor}</div>
      </div>
      <div class="lucky-item">
        <div class="lucky-label">速配星座</div>
        <div class="lucky-value">${fortune.compatibleSign.symbol} ${fortune.compatibleSign.name}</div>
      </div>
    </div>

    <div class="tip">以上运势由本地算法按「星座 + 日期」确定性生成，离线可用。</div>
  </div>
  ${tabbar('home')}`;
}
