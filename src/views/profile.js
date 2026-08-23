// 我的页面：自定义生日选择器 + 本命星座实时预览 + 安装说明
import { signFromMonthDay } from '../core/zodiacCalc.js';
import { getBirthday, setBirthday } from '../core/storage.js';
import { tabbar } from '../ui.js';

const CURRENT_YEAR = new Date().getFullYear();
const pad2 = (n) => String(n).padStart(2, '0');

const daysInMonth = (y, m) => new Date(y, m, 0).getDate();

function optionTag(value, label, selected) {
  return `<option value="${value}"${selected ? ' selected' : ''}>${label}</option>`;
}

export function renderProfile(app) {
  const saved = getBirthday();
  const parts = saved ? saved.split('-').map(Number) : [];
  let y = parts[0] || 2000;
  let m = parts[1] || 1;
  let d = parts[2] || 1;
  if (m < 1 || m > 12) m = 1;
  if (d < 1 || d > daysInMonth(y, m)) d = daysInMonth(y, m);

  const sign = signFromMonthDay(m, d);

  const fill = (yVal, mVal, dVal) => {
    const sm = document.getElementById('b-month');
    const sd = document.getElementById('b-day');
    if (sm) sm.value = String(mVal);
    if (sd) {
      sd.innerHTML = '';
      for (let i = 1; i <= daysInMonth(yVal, mVal); i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = String(i) + ' 日';
        sd.appendChild(opt);
      }
      sd.value = String(Math.min(dVal, daysInMonth(yVal, mVal)));
    }
    const s = signFromMonthDay(Number(sm.value), Number(sd.value));
    const pv = document.getElementById('birthday-preview');
    if (pv) pv.innerHTML = `
      <span class="my-symbol big">${s.symbol}</span>
      <div>
        <div class="my-title">${s.name}</div>
        <div class="my-sub">${s.monthStart}.${s.dayStart} - ${s.monthEnd}.${s.dayEnd} · ${s.element}象</div>
      </div>`;
  };

  app.innerHTML = `
  <div class="page">
    <header class="home-header">
      <div class="brand">我的<span class="brand-sub">Profile</span></div>
    </header>

    <div class="card birthday-card">
      <h3 class="card-title">本命星座</h3>

      <div id="birthday-preview" class="birthday-preview">
        <span class="my-symbol big">${sign.symbol}</span>
        <div>
          <div class="my-title">${sign.name}</div>
          <div class="my-sub">${sign.monthStart}.${sign.dayStart} - ${sign.monthEnd}.${sign.dayEnd} · ${sign.element}象</div>
        </div>
      </div>

      <div class="birthday-picker">
        <div class="picker-col">
          <span class="picker-label">年</span>
          <select id="b-year">
            ${Array.from({ length: CURRENT_YEAR - 1950 + 1 }, (_, i) => optionTag(1950 + i, `${1950 + i} 年`, (1950 + i) === y)).reverse().join('')}
          </select>
        </div>
        <div class="picker-col">
          <span class="picker-label">月</span>
          <select id="b-month">
            ${Array.from({ length: 12 }, (_, i) => optionTag(i + 1, `${i + 1} 月`, (i + 1) === m)).join('')}
          </select>
        </div>
        <div class="picker-col">
          <span class="picker-label">日</span>
          <select id="b-day"></select>
        </div>
      </div>

      <div class="birthday-hint">
        ${saved ? `已保存：${y} 年 ${m} 月 ${d} 日` : '选择后点击保存，即可在首页查看本命星座运气'}
      </div>

      <button id="b-save" class="btn">${saved ? '更新生日' : '保存生日'}</button>
      ${saved ? '<button id="b-clear" class="btn-text">清除生日</button>' : ''}
    </div>

    <div class="card info-card">
      <h3 class="card-title">关于星语</h3>
      <p>一款离线可用的星座运势 PWA。所有运势文案内置于应用，按「星座 + 周期 + 日期」确定性生成：同一天、同一星座、同一周期内容稳定不变，无需联网、无广告、无账号。</p>
    </div>

    <div class="card info-card">
      <h3 class="card-title">安装到主屏幕（iPhone）</h3>
      <p>用 Safari 打开本站 → 点击右上角分享 → 添加到主屏幕，即可像原生 App 一样全屏运行。</p>
    </div>
  </div>
  ${tabbar('profile')}`;

  // 填充“日”下拉，并在年月变化时刷新可选项与星座预览
  fill(y, m, d);

  document.getElementById('b-year').addEventListener('change', (e) => {
    y = Number(e.target.value);
    m = Number(document.getElementById('b-month').value);
    d = Number(document.getElementById('b-day').value);
    fill(y, m, Math.min(d, 31));
  });

  document.getElementById('b-month').addEventListener('change', (e) => {
    m = Number(e.target.value);
    y = Number(document.getElementById('b-year').value);
    d = Number(document.getElementById('b-day').value);
    fill(y, m, Math.min(d, 31));
  });

  document.getElementById('b-day').addEventListener('change', (e) => {
    d = Number(e.target.value);
    const s = signFromMonthDay(Number(document.getElementById('b-month').value), d);
    document.getElementById('birthday-preview').innerHTML = `
      <span class="my-symbol big">${s.symbol}</span>
      <div>
        <div class="my-title">${s.name}</div>
        <div class="my-sub">${s.monthStart}.${s.dayStart} - ${s.monthEnd}.${s.dayEnd} · ${s.element}象</div>
      </div>`;
  });

  document.getElementById('b-save').addEventListener('click', () => {
    y = Number(document.getElementById('b-year').value);
    m = Number(document.getElementById('b-month').value);
    d = Number(document.getElementById('b-day').value);
    setBirthday(`${y}-${pad2(m)}-${pad2(d)}`);
    renderProfile(app);
  });

  const clearBtn = document.getElementById('b-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      setBirthday('');
      renderProfile(app);
    });
  }
}
