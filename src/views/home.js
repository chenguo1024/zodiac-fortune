// 首页：今天的日期、我的本命星座卡、搜索框 + 12 星座宫格
import { ZODIACS } from '../data/zodiac.js';
import { getFortune } from '../core/fortune.js';
import { todayKey, periodLabel } from '../core/zodiacCalc.js';
import { getMySign } from '../core/storage.js';
import { starsHTML, escapeHtml, tabbar } from '../ui.js';

let query = '';

export function renderHome(app) {
  const date = new Date();
  const key = todayKey(date);
  const mySign = getMySign();
  const q = query.trim().toLowerCase();
  const signs = ZODIACS.filter((z) =>
    !q ||
    z.name.includes(q) ||
    z.pinyin.includes(q) ||
    z.en.toLowerCase().includes(q)
  );

  app.innerHTML = `
  <div class="page">
    <header class="home-header">
      <div>
        <div class="brand">星语<span class="brand-sub">Zodiac</span></div>
        <div class="date-cn">${periodLabel('daily', date)}</div>
      </div>
    </header>

    ${mySign ? `
      <a class="card my-card" href="#/sign/${mySign.id}">
        <span class="my-symbol">${mySign.symbol}</span>
        <div class="my-info">
          <div class="my-title">我的星座 · ${mySign.name}</div>
          <div class="my-sub">点击查看今日运势</div>
        </div>
        ${starsHTML(getFortune(mySign.id, 'daily', date).score)}
        <span class="chev">›</span>
      </a>` : `
      <a class="card my-card muted" href="#/profile">
        <span class="my-symbol">✦</span>
        <div class="my-info">
          <div class="my-title">设置生日，查看专属运势</div>
          <div class="my-sub">点击设置你的本命星座</div>
        </div>
        <span class="chev">›</span>
      </a>`}

    <div class="search-row">
      ${query ? `<a class="clear-query" href="#/">×</a>` : ''}
      <input id="zf-search" class="search" type="search" placeholder="搜索星座（名称 / 拼音 / 英文）" value="${escapeHtml(query)}" />
    </div>

    <div class="grid">
      ${signs.map((z, idx) => {
        const f = getFortune(z.id, 'daily', date);
        return `
        <a class="card sign-cell" style="--i:${idx}" href="#/sign/${z.id}">
          <div class="sign-symbol">${z.symbol}</div>
          <div class="sign-name">${z.name}</div>
          <div class="sign-range">${z.monthStart}.${z.dayStart} - ${z.monthEnd}.${z.dayEnd}</div>
          ${starsHTML(f.score)}
        </a>`;
      }).join('')}
    </div>
    ${signs.length === 0 ? '<div class="empty">没有匹配的星座，换个关键词试试</div>' : ''}
  </div>
  ${tabbar('home')}`;

  const input = document.getElementById('zf-search');
  if (input) {
    input.addEventListener('input', (e) => {
      query = e.target.value;
      renderHome(app);
      const el = document.getElementById('zf-search');
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }
}
