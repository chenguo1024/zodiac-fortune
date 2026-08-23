// 极简 hash 路由
import { renderHome } from './views/home.js';
import { renderDetail } from './views/detail.js';
import { renderProfile } from './views/profile.js';

const ROUTES = [
  { re: /^#\/sign\/(\d+)(?:\?(.*))?$/, view: renderDetail },
  { re: /^#\/profile$/, view: renderProfile },
];

export function renderRoute(app) {
  const hash = location.hash || '#/';
  for (const { re, view } of ROUTES) {
    const m = hash.match(re);
    if (m) return view(app, m);
  }
  return renderHome(app);
}

export function initApp() {
  const app = document.getElementById('app');
  const route = () => {
    renderRoute(app);
    window.scrollTo(0, 0);
  };
  window.addEventListener('hashchange', route);
  route();
}
