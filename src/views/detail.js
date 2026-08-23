// 详情页：星座大图 + 日/周/月/年切换 + 五维度运势（可展开）+ 宜忌 + 开运建议
import { getFortune, DIMENSIONS } from '../core/fortune.js';
import { findBySignId, starsHTML, ICONS, DIM_ICONS, escapeHtml, colorHex, tabbar } from '../ui.js';
import { makeShareCard } from '../core/shareCard.js';

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
          <div class="detail-sub">${zodiac.monthStart}.${zodiac.dayStart} - ${zodiac.monthEnd}.${zodiac.dayEnd} · ${zodiac.element}象</div>
        </div>
      </div>
      <button id="zf-share" class="round-btn share-btn" aria-label="分享运势卡片" style="margin-left:auto">${ICONS.share}</button>
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
      ${DIMENSIONS.map((d, i) => `
        <div class="card dim-card ${i === 0 ? 'open' : ''}" style="--i:${i}">
          <button type="button" class="dim-main">
            <span class="dim-icon" style="color:${d.color}">${DIM_ICONS[d.key]}</span>
            <span class="dim-body">
              <span class="dim-label" style="color:${d.color}">${d.label}运势</span>
              <span class="dim-text">${escapeHtml(fortune.summary[d.key])}</span>
            </span>
            <span class="dim-chev" style="color:${d.color}"></span>
          </button>
          <div class="dim-detail">
            <div class="dim-detail-inner">
              <p>${escapeHtml(fortune.detail[d.key])}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="card advice-card">
      <div class="advice-icon">${ICONS.sparkle}</div>
      <div>
        <div class="card-title" style="margin-bottom:6px">开运建议</div>
        <p>${escapeHtml(fortune.advice)}</p>
      </div>
    </div>

    <div class="card yj-card">
      <div class="yj-row">
        <span class="yj-tag yi">宜</span>
        <div class="chips">${fortune.yi.map((c) => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</div>
      </div>
      <div class="yj-row">
        <span class="yj-tag ji">忌</span>
        <div class="chips">${fortune.ji.map((c) => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</div>
      </div>
    </div>

    <div class="card lucky-bar">
      <div class="lucky-item">
        <div class="lucky-label">幸运数字</div>
        <div class="lucky-value">${fortune.luckyNumber}</div>
      </div>
      <div class="lucky-item">
        <div class="lucky-label">幸运颜色</div>
        <div class="lucky-value"><span class="color-dot" style="background:${colorHex(fortune.luckyColor)}"></span>${fortune.luckyColor}</div>
      </div>
      <div class="lucky-item">
        <div class="lucky-label">速配星座</div>
        <div class="lucky-value">${fortune.compatibleSign.symbol} ${fortune.compatibleSign.name}</div>
      </div>
    </div>

    <div class="tip">点击卡片展开详细解读 · 以上运势由本地算法按「星座 + 日期」确定性生成，离线可用。</div>
  </div>
  ${tabbar('home')}`;

  app.querySelectorAll('.dim-main').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.dim-card').classList.toggle('open');
    });
  });

  const shareBtn = document.getElementById('zf-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      try {
        const blob = await makeShareCard(zodiac, fortune, date);
        openShareModal(app, blob, zodiac, fortune);
      } catch (e) {
        /* 生成失败静默处理 */
      }
    });
  }
}

function openShareModal(app, blob, zodiac, fortune) {
  const url = URL.createObjectURL(blob);
  const name = `${zodiac.name}运势.png`;
  const file = new File([blob], name, { type: 'image/png' });

  app.insertAdjacentHTML('beforeend', `
    <div class="share-overlay" id="zf-overlay">
      <div class="share-sheet">
        <button class="share-close" id="zf-close" aria-label="关闭">×</button>
        <img id="zf-share-img" src="${url}" alt="运势分享卡片" />
        <div class="share-actions">
          <button id="zf-share-sys" class="btn">系统分享</button>
          <a id="zf-download" class="btn ghost" download="${name}" href="${url}">保存图片</a>
        </div>
        <div class="share-tip">也可以长按图片直接保存到相册</div>
      </div>
    </div>`);

  const overlay = document.getElementById('zf-overlay');
  const close = () => overlay && overlay.remove();
  document.getElementById('zf-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const sys = document.getElementById('zf-share-sys');
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    sys.addEventListener('click', async () => {
      try {
        await navigator.share({ files: [file], title: `${zodiac.name}运势`, text: fortune.summary.overall });
      } catch (err) {
        /* 用户取消或其他原因忽略 */
      }
    });
  } else {
    sys.style.display = 'none';
  }
}
