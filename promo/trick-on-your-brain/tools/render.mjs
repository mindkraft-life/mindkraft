// Render each Motion Studio frame-by-frame (deterministic: SCENE.draw is pure in t)
// and encode to a silent H.264 MP4, plus a cues JSON the audio script reads.
// Usage: node tools/render.mjs [clipPrefix...] [--stills=0.5,2.1] [--cues]
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FFMPEG = process.env.FFMPEG || execFileSync('python3', ['-c', 'import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())']).toString().trim();

const args = process.argv.slice(2);
const stillsArg = args.find(a => a.startsWith('--stills='));
const stills = stillsArg ? stillsArg.slice(9).split(',').map(Number) : null;
const only = args.filter(a => !a.startsWith('--'));
const studios = fs.readdirSync(path.join(root, 'studios')).filter(f => f.endsWith('-studio.html')).sort()
  .filter(f => !only.length || only.some(o => f.startsWith(o)));
const work = path.join(root, 'build');
fs.mkdirSync(work, { recursive: true });

const browser = await chromium.launch();
await Promise.all(studios.map(async f => {
  const name = f.replace(/-studio\.html$/, '');
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  // Inter is installed locally; don't wait on the Google Fonts request.
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  page.on('pageerror', e => console.error(name, 'pageerror', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error(name, m.text()); });
  await page.goto('file://' + path.join(root, 'studios', f));
  await page.evaluate(() => document.fonts.ready);
  const info = await page.evaluate(() => ({ meta: SCENE.meta, timeline: SCENE.timeline, cues: SCENE.cues || [] }));
  const grab = t => page.evaluate(t => { renderFrame(t); return cv.toDataURL('image/png'); }, t)
    .then(u => Buffer.from(u.slice(u.indexOf(',') + 1), 'base64'));

  if (stills) {
    for (const t of stills) fs.writeFileSync(path.join(work, `${name}@${t.toFixed(2)}.png`), await grab(t));
    console.log(name, 'stills', stills.join(', '));
    return page.close();
  }

  fs.writeFileSync(path.join(work, `${name}.cues.json`), JSON.stringify(info, null, 1));
  if (args.includes('--cues')) return page.close();
  const { fps, duration } = info.meta;
  const n = Math.round(duration * fps);
  const out = path.join(work, `${name}.video.mp4`);
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-x264-params', 'aq-mode=3',
    '-pix_fmt', 'yuv420p', '-r', String(fps), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', code => code ? rej(new Error(name + ' ffmpeg ' + code)) : res()));
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await grab(i / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await done;
  console.log(name, `${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await page.close();
}));
await browser.close();
