# 星语 · 星座运势 PWA

一个离线可用的星座运势查询应用。使用 Vite + 原生 JavaScript 构建，支持 iPhone 上添加到主屏幕，接近原生 App 的体验。

## 功能

- 12 星座宫格首页：星座符号、名称、日期区间与当日星级
- 根据生日自动推算本命星座
- 日运 / 周运 / 月运 / 年运切换
- 五维度运势：综合、爱情、事业、财运、健康
- 幸运元素：幸运数字、幸运颜色、速配星座
- 搜索星座（名称 / 拼音 / 英文）
- 离线可用（Service Worker 缓存 + 纯内置数据，无任何 API 依赖）

## 快速开始

```bash
npm install     # 安装依赖
npm run icons   # 生成应用图标（PNG）
npm run dev     # 本地开发：http://localhost:5173
npm run build   # 生产构建到 dist/
```

## 部署到线上（iPhone 用 Safari 打开）

推荐免费托管：[Vercel](https://vercel.com) / [Netlify](https://netlify.com) / [GitHub Pages](https://pages.github.com)。

用 GitHub Pages 时，直接把这个仓库 push 上去，在 Pages 设置里选择 `dist` 目录即可。因项目使用相对路径，放在子目录也能正常访问。

## 在 iPhone 上安装

1. 用 Safari 打开部署后的网址
2. 点击底部中间的「分享」按钮
3. 选择「添加到主屏幕」
4. 主屏幕上会出现「星语」图标，点击即可全屏运行

## 目录结构

```
├── index.html
├── vite.config.js
├── package.json
├── scripts/make-icons.mjs        # 用像素算法生成 SVG 风格图标
├── public/
│   ├── manifest.webmanifest       # PWA 清单
│   ├── sw.js                      # Service Worker 离线缓存
│   └── icons/                     # 应用图标（构建后生成）
└── src/
    ├── main.js                    # 入口
    ├── app.js                     # hash 路由
    ├── style.css                  # 深色星空主题
    ├── ui.js                      # 图标 / 星星 / 工具
    ├── data/
    │   ├── zodiac.js              # 12 星座基础数据
    │   └── fortunePool.js         # 运势文案池
    ├── core/
    │   ├── zodiacCalc.js          # 日期 → 星座推算
    │   ├── fortune.js             # 确定性运势生成器
    │   └── storage.js             # 本地存储
    └── views/
        ├── home.js                # 首页
        ├── detail.js             # 详情页
        └── profile.js           # 我的页面
```
