// Generates Block Party's PWA icons using the kit's PNG painter.
// Run: node tools/make-icons.js   (from the game folder)
const fs = require("fs");
const path = require("path");
const { makeCanvas, downsample, encodePNG } = require("../lib/tools/png.js");

// 2x2 of candy blocks with a cleared sparkle row feel
const BLOCKS = [
  { x: -1, y: -1, col: "#ff5c8a" },
  { x: 0,  y: -1, col: "#ffd93b" },
  { x: -1, y: 0,  col: "#3bb4ff" },
  { x: 0,  y: 0,  col: "#43c65a" },
];

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v));
  const r = c((n >> 16) + amt), g = c(((n >> 8) & 255) + amt), b = c((n & 255) + amt);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function drawIcon(size, scale) {
  const SS = 4, big = size * SS;
  const cv = makeCanvas(big);
  cv.fillRect(0, 0, big, big, "#543ba0");
  const cx = big / 2, cy = big / 2;
  const cell = big * scale, gap = cell * 0.08;
  for (const b of BLOCKS) {
    const x = cx + b.x * cell + gap, y = cy + b.y * cell + gap;
    const s = cell - gap * 2;
    cv.fillRect(x, y + s * 0.06, s, s * 0.94, shade(b.col, -55)); // base shadow
    cv.fillRect(x, y, s, s * 0.9, b.col);                        // face
    cv.fillRect(x + s * 0.12, y + s * 0.1, s * 0.7, s * 0.16, shade(b.col, 55)); // gloss
  }
  // sparkle dots
  cv.fillCircle(cx + cell * 1.28, cy - cell * 1.28, big * 0.045, "#ffffff");
  cv.fillCircle(cx - cell * 1.34, cy + cell * 1.3, big * 0.03, "#ffd93b");
  return encodePNG(size, size, downsample(cv.px, big, SS));
}

const out = path.join(__dirname, "..", "icons");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "icon-512.png"), drawIcon(512, 0.36));
fs.writeFileSync(path.join(out, "icon-192.png"), drawIcon(192, 0.36));
fs.writeFileSync(path.join(out, "maskable-512.png"), drawIcon(512, 0.27));
console.log("Block Party icons written");
