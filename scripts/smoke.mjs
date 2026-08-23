// 冒烟测试：在 Node + jsdom 里真实执行渲染、路由与交互，验证无 runtime 错误
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

const fail = (msg) => { console.error('FAIL: ' + msg); process.exit(1); };

const dom = new JSDOM('<div id="app"></div>', { url: 'http://localhost/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
globalThis.location = dom.window.location;
globalThis.window.scrollTo = () => {};
globalThis.window.addEventListener = dom.window.addEventListener.bind(dom.window);

const server = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'silent',
});

try {
  const { initApp } = await server.ssrLoadModule('/src/app.js');
  initApp();
  const app = document.getElementById('app');
  const nav = (hash) => {
    location.hash = hash;
    dom.window.dispatchEvent(new dom.window.Event('hashchange'));
    return app.innerHTML;
  };
  const badValue = (splitter) => app.innerHTML.split(splitter).some((s) => s.includes('undefined') || s.includes('NaN'));

  let html = app.innerHTML;
  if (!html.includes('白羊座') || !html.includes('摩羯座')) fail('首页 12 宫格未渲染完整');
  if (badValue('</a>')) fail('首页出现 undefined/NaN');

  html = nav('#/sign/4');
  ['幸运指数', '开运建议', '宜', '忌', '幸运数字'].forEach((k) => {
    if (!html.includes(k)) fail('详情页缺少区块: ' + k);
  });
  if (badValue('</div>')) fail('详情页出现 undefined/NaN');

  // 展开/收起交互
  const firstDim = app.querySelector('.dim-card');
  const wasOpen = firstDim.classList.contains('open');
  firstDim.querySelector('.dim-main').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  if (firstDim.classList.contains('open') === wasOpen) fail('展开交互未生效');
  firstDim.querySelector('.dim-main').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

  // tab 切换
  html = nav('#/sign/4?tab=weekly');
  if (!html.includes('周运')) fail('周运切换未生效');
  html = nav('#/sign/12?tab=yearly');
  if (!html.includes('年运')) fail('年运切换未生效');

  // 我的页面与生日交互
  localStorage.clear();
  nav('#/profile');
  if (!app.querySelector('#b-year') || !app.querySelector('#b-month') || !app.querySelector('#b-day')) fail('生日选择器未渲染');

  document.getElementById('b-month').value = '3';
  document.getElementById('b-month').dispatchEvent(new dom.window.Event('change'));
  document.getElementById('b-day').value = '21';
  document.getElementById('b-day').dispatchEvent(new dom.window.Event('change'));
  document.getElementById('b-save').dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  if (localStorage.getItem('star-words-birthday') !== '2000-03-21') fail('生日保存失败: ' + localStorage.getItem('star-words-birthday'));
  if (!document.getElementById('birthday-preview').innerHTML.includes('白羊座')) fail('生日预览/星座推算错误');

  // 无效路由回退首页
  html = nav('#/nonsense');
  if (!html.includes('白羊座')) fail('无效路由未回退首页');

  console.log('PASS: 首页 / 详情页 / 展开交互 / 日周月年切换 / 生日选择与保存 / 回退路由 均正常');
  process.exit(0);
} catch (e) {
  console.error('FAIL: ' + (e && e.stack ? e.stack : e));
  process.exit(1);
} finally {
  await server.close();
}
