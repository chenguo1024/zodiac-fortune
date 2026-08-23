// 我的页面：设置生日、查看本命星座、安装与说明
import { signFromDate, todayKey } from '../core/zodiacCalc.js';
import { getBirthday, setBirthday } from '../core/storage.js';
import { tabbar, ICONS } from '../ui.js';

export function renderProfile(app) {
  const b = getBirthday();
  const date = new Date();
  let signInfo = '';
  if (b) {
    const [y, m, d] = b.split('-').map(Number);
    if (m && d) {
      const sign = signFromDate(new Date(y || 2000, m - 1, d));
      signInfo = `
        <div class="profile-result">
          <span class="my-symbol big">${sign.symbol}</span>
          <div>
            <div class="my-title">你的本命星座</div>
            <div class="my-sub">${sign.monthStart}.${sign.dayStart} - ${sign.monthEnd}.${sign.dayEnd} · ${sign.element}象星座</div>
          </div>
        </div>
        <a class="btn" href="#/sign/${sign.id}">查看今日运势</a>`;
    }
  }

  app.innerHTML = `
  <div class="page">
    <header class="home-header">
      <div class="brand">我的<span class="brand-sub">Profile</span></div>
    </header>

    <div class="card profile-card">
      <h3 class="card-title">本命星座设置</h3>
      <label class="field-label" for="zf-birthday">出生日期（月份与日期决定星座）</label>
      <input id="zf-birthday" class="search" type="date"
             value="${b}"
             min="1900-01-01" max="${todayKey(date)}" />
      <div class="hint">年份不影响星座结果，也可直接挑选任意一天</div>
      ${signInfo}
    </div>

    <div class="card info-card">
      <h3 class="card-title">关于星语</h3>
      <p>一款离线可用的星座运势 PWA。所有运势文案内置于应用，按「星座 + 周期 + 日期」确定性生成：同一天同一星座的结果稳定不变，无需联网、无广告、无任何账号。</p>
    </div>

    <div class="card info-card">
      <h3 class="card-title">安装到主屏幕（iPhone）</h3>
      <p>用 Safari 打开本站 → 点击分享按钮 → 添加到主屏幕，即可像原生 App 一样全屏运行。</p>
    </div>
  </div>
  ${tabbar('profile')}`;

  const input = document.getElementById('zf-birthday');
  if (input) {
    input.addEventListener('change', (e) => {
      setBirthday(e.target.value);
      renderProfile(app);
    });
  }
}
