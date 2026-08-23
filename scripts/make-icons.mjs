// 生成 PWA 应用图标（纯像素计算，无需任何外部图片）
// 图标内容：深色渐变星空 + 一弯新月 + 散布的星光
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(dir, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

// 星星位置（相对坐标 + 相对半径）
const STARS = [
  { x: 0.20, y: 0.22, r: 0.055 },
  { x: 0.80, y: 0.18, r: 0.040 },
  { x: 0.88, y: 0.58, r: 0.045 },
  { x: 0.14, y: 0.66, r: 0.035 },
  { x: 0.68, y: 0.85, r: 0.040 },
  { x: 0.38, y: 0.12, r: 0.028 },
];

function draw(size) {
  const png = new PNG({ width: size, height: size });
  const top = [76, 29, 149];      // 深紫
  const bottom = [30, 27, 75];    // 深蓝
  const cx = size * 0.5;
  const cy = size * 0.52;
  const rOut = size * 0.27;
  const rIn = size * 0.235;
  const ix = size * 0.15;
  const iy = -size * 0.12;
  const moon = [252, 211, 77];

  for (let y = 0; y < size; y++) {
    const f = y / (size - 1);
    const base = [
      Math.round(top[0] + (bottom[0] - top[0]) * f),
      Math.round(top[1] + (bottom[1] - top[1]) * f),
      Math.round(top[2] + (bottom[2] - top[2]) * f),
    ];

    for (let x = 0; x < size; x++) {
      let [r, g, b] = base;

      // 新月：在大圆内、小圆（错位）外
      const dOut = Math.hypot(x - cx, y - cy);
      const dIn = Math.hypot(x - (cx + ix), y - (cy + iy));
      if (dOut <= rOut && dIn > rIn) {
        r = moon[0]; g = moon[1]; b = moon[2];
      }

      // 四角星光：|dx|+|dy| 形成的菱形，核心亮 + 周围光晕
      for (const s of STARS) {
        const dist = Math.abs(x - s.x * size) + Math.abs(y - s.y * size);
        const R = s.r * size;
        if (dist < R * 2.4) {
          const core = Math.max(0, 1 - dist / R);
          const glow = Math.max(0, 1 - dist / (R * 2.4));
          const a = Math.max(core, glow * 0.35);
          r += (255 - r) * a;
          g += (255 - g) * a;
          b += (255 - b) * a;
        }
      }

      const i = (size * y + x) << 2;
      png.data[i] = Math.min(255, Math.round(r));
      png.data[i + 1] = Math.min(255, Math.round(g));
      png.data[i + 2] = Math.min(255, Math.round(b));
      png.data[i + 3] = 255;
    }
  }
  return png;
}

const targets = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['icon-maskable-512.png', 512],
];

for (const [name, size] of targets) {
  const png = draw(size);
  fs.writeFileSync(path.join(outDir, name), PNG.sync.write(png));
  console.log(`generated icons/${name} (${size}x${size})`);
}
