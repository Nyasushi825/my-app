// PWA用のアイコンを sharp で生成するスクリプト。
// 元になる SVG（ブランド色の箱＝📦のモチーフ）からPNGを書き出す。
// 実行: node scripts/generate-icons.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const OUT = "public";

// 角丸の背景 + シンプルな「箱」アイコン。size に応じてスケールする。
function svg(size, { maskable = false } = {}) {
  // maskable は周囲に余白（セーフゾーン）を多めに取る
  const pad = maskable ? size * 0.18 : size * 0.1;
  const radius = maskable ? size * 0.5 : size * 0.22;
  const s = size - pad * 2;
  const x = pad;
  const y = pad;
  // 箱の座標（中央寄せ）
  const bw = s * 0.62;
  const bh = s * 0.5;
  const bx = x + (s - bw) / 2;
  const by = y + (s - bh) / 2 + s * 0.04;
  const lid = bh * 0.32;
  const stroke = Math.max(2, s * 0.035);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#4338ca"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" fill="url(#g)"/>
  <g fill="none" stroke="#ffffff" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round">
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${s * 0.04}"/>
    <line x1="${bx}" y1="${by + lid}" x2="${bx + bw}" y2="${by + lid}"/>
    <line x1="${bx + bw / 2}" y1="${by + lid}" x2="${bx + bw / 2}" y2="${by + bh}"/>
  </g>
</svg>`;
}

async function png(name, size, opts) {
  const buf = Buffer.from(svg(size, opts));
  await sharp(buf).png().toFile(`${OUT}/${name}`);
  console.log("wrote", name);
}

await mkdir(OUT, { recursive: true });
await writeFile(`${OUT}/icon.svg`, svg(512));
await png("icon-192.png", 192);
await png("icon-512.png", 512);
await png("icon-maskable-512.png", 512, { maskable: true });
await png("apple-touch-icon.png", 180);
console.log("done");
