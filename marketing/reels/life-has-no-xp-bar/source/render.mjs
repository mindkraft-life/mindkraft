// Renders studio.html frame-by-frame (deterministic, no dropped frames) into an H.264 MP4.
//
//   npm i playwright @fontsource-variable/inter
//   node render.mjs /path/to/ffmpeg out.mp4
//
// Inter is served from the local @fontsource package so the render never depends on
// reaching Google Fonts from a headless browser.
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const FONT = path.join(path.dirname(require.resolve('@fontsource-variable/inter/package.json')), 'files/inter-latin-wght-normal.woff2');
const [FF, OUT] = process.argv.slice(2);

const b = await chromium.launch();
const p = await b.newPage();
await p.route('**/fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css',
  body: "@font-face{font-family:'Inter';font-weight:100 900;font-display:block;src:url(https://fonts.gstatic.com/local/inter.woff2) format('woff2');}" }));
await p.route('**/fonts.gstatic.com/**', r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(FONT) }));
await p.goto('file://' + path.join(here, '..', 'studio.html'));
await p.evaluate(async () => { await document.fonts.load('900 100px Inter'); await document.fonts.ready; });
await p.waitForFunction(() => MK_ICON_CV !== null);

const { fps, duration } = await p.evaluate(() => SCENE.meta);
const N = Math.round(fps * duration);
const ff = spawn(FF, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-profile:v', 'high', '-level', '4.2',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
  '-r', String(fps), '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < N; i++) {
  const url = await p.evaluate(t => { renderFrame(t); return cv.toDataURL('image/png'); }, i / fps);
  if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await b.close();
console.log(`rendered ${N} frames → ${OUT}`);
