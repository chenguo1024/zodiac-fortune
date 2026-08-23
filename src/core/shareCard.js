// 分享卡片：在 canvas 上绘制一张 750x1000 的运势卡片，导出为 PNG
import { periodLabel } from './zodiacCalc.js';

const W = 750;
const H = 1000;

const STARS = [
  [70, 130, 2], [150, 80, 1], [250, 110, 1], [340, 60, 1.5], [430, 100, 1],
  [520, 70, 1.8], [600, 110, 1], [690, 70, 1.5], [710, 210, 1.6], [60, 260, 1],
  [80, 340, 1], [40, 430, 1.2], [720, 420, 1], [700, 580, 1], [650, 700, 1],
  [50, 610, 1], [90, 730, 1], [690, 820, 1], [740, 760, 1],
];

function drawCrescent(ctx, x, y, rOuter, rInner, dx, dy, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, rOuter, 0, Math.PI * 2);
  ctx.arc(x + dx, y + dy, rInner, 0, Math.PI * 2, true);
  ctx.fill('evenodd');
}

function wrapLines(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawStars(ctx, score, cx, cy, size) {
  const gap = size + 10;
  const startX = cx - (gap * 4) / 2;
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i < score ? '#fbbf24' : 'rgba(255,255,255,0.16)';
    ctx.fillText('★', startX + i * gap, cy);
  }
}

function drawColumn(ctx, cx, y, label, valueFn) {
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(241,240,255,0.55)';
  ctx.font = '24px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText(label, cx, y);
  valueFn(cx, y + 46);
}

export function makeShareCard(zodiac, fortune, date) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 背景渐变
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#312781');
    bg.addColorStop(0.5, '#17143f');
    bg.addColorStop(1, '#0e0c2c');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 星空
    for (const [x, y, r] of STARS) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 新月
    drawCrescent(ctx, 640, 150, 82, 72, 56, -40, '#fcd34d');

    // 顶部品牌与周期
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(241,240,255,0.78)';
    ctx.font = '700 30px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText('星语 · 星座运势', 52, 70);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(241,240,255,0.55)';
    ctx.font = '26px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText(periodLabel(fortune.type, date), W - 52, 70);

    // 星座符号与名称
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a78bfa';
    ctx.font = '160px "Segoe UI Symbol","Apple Symbols","PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText(zodiac.symbol, W / 2, 330);
    ctx.fillStyle = '#f1f0ff';
    ctx.font = '700 52px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText(zodiac.name, W / 2, 402);
    ctx.fillStyle = 'rgba(241,240,255,0.55)';
    ctx.font = '26px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText(`${zodiac.monthStart}.${zodiac.dayStart} - ${zodiac.monthEnd}.${zodiac.dayEnd} · ${zodiac.element}象`, W / 2, 446);

    // 分隔线
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 494);
    ctx.lineTo(680, 494);
    ctx.stroke();

    // 星星与评分
    ctx.font = '36px "Segoe UI Symbol","Apple Symbols","PingFang SC",sans-serif';
    drawStars(ctx, fortune.score, W / 2, 556, 36);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c4b5fd';
    ctx.font = '26px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText(`幸运指数 ${fortune.score * 20} 分`, W / 2, 600);

    // 综合运势概括（分行，最多两行）
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '29px "PingFang SC","Microsoft YaHei",sans-serif';
    const lines = wrapLines(ctx, fortune.summary.overall, 600);
    const shown = lines.slice(0, 2);
    (shown.length > 1 && lines.length > 2 ? [...shown.slice(0, 1), shown[1] + '…'] : shown)
      .forEach((line, i) => ctx.fillText(line, W / 2, 654 + i * 50));

    // 幸运元素三列
    const y = 788;
    drawColumn(ctx, W / 2 - 230, y, '幸运数字', (cx, ty) => {
      ctx.fillStyle = '#f1f0ff';
      ctx.font = '700 34px "PingFang SC","Microsoft YaHei",sans-serif';
      ctx.fillText(String(fortune.luckyNumber), cx, ty);
    });
    drawColumn(ctx, W / 2, y, '幸运颜色', (cx, ty) => {
      const colorMap = {
        '红色': '#ef4444', '橙色': '#f97316', '黄色': '#eab308', '绿色': '#22c55e',
        '青色': '#06b6d4', '蓝色': '#3b82f6', '紫色': '#a855f7', '粉色': '#ec4899',
        '白色': '#f8fafc', '金色': '#eab308', '银色': '#cbd5e1', '靛蓝色': '#6366f1',
      };
      ctx.fillStyle = colorMap[fortune.luckyColor] || '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx - 52, ty - 2, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f1f0ff';
      ctx.font = '700 34px "PingFang SC","Microsoft YaHei",sans-serif';
      ctx.fillText(fortune.luckyColor, cx + 10, ty);
    });
    drawColumn(ctx, W / 2 + 230, y, '速配星座', (cx, ty) => {
      ctx.fillStyle = '#f1f0ff';
      ctx.font = '700 34px "PingFang SC","Segoe UI Symbol","Apple Symbols",sans-serif';
      ctx.fillText(`${fortune.compatibleSign.symbol} ${fortune.compatibleSign.name}`, cx, ty);
    });

    // 底部
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(70, 890);
    ctx.lineTo(680, 890);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(241,240,255,0.7)';
    ctx.font = '24px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText('离线可用 · 按日期确定性生成', W / 2, 932);
    ctx.fillStyle = 'rgba(241,240,255,0.45)';
    ctx.font = '22px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText('github.io/zodiac-fortune', W / 2, 972);

    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('分享图生成失败'));
    }, 'image/png');
  });
}
