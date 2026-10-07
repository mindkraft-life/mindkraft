// Renders the scene frame by frame. Every frame is a pure function of t
// (window.renderFrame), so N pages can render disjoint ranges in parallel and
// the result is identical to a single pass.
//
//   node tools/render.mjs video  --out out/silent.mp4 [--fps 30] [--from 0] [--to END] [--workers 4]
//   node tools/render.mjs stills --out out/stills --at 1.2,3.4,5.6
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { serve, SCENE_URL } from './server.mjs';

const args = process.argv.slice(2);
const mode = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const PORT = 8840 + Math.floor(Math.random() * 100);
const server = await serve(PORT);
const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--font-render-hinting=none'] });

async function openPage() {
  const page = await browser.newPage({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5 });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('CONSOLE', m.text()); });
  await page.goto(SCENE_URL(PORT), { waitUntil: 'load' });
  await page.evaluate(() => window.sceneReady);
  return page;
}

async function frame(page, t) {
  await page.evaluate(t => window.renderFrame(t), t);
  return page.screenshot({ type: 'png', animations: 'disabled', caret: 'hide' });
}

if (mode === 'stills') {
  const out = opt('out', 'out/stills'); fs.mkdirSync(out, { recursive: true });
  const page = await openPage();
  for (const s of opt('at', '0').split(',')) {
    const t = parseFloat(s);
    fs.writeFileSync(path.join(out, `t${t.toFixed(2).padStart(6, '0')}.png`), await frame(page, t));
  }
} else if (mode === 'video') {
  const fps = +opt('fps', 30);
  const page0 = await openPage();
  const dur = await page0.evaluate(() => window.SCENE_DURATION);
  const from = +opt('from', 0), to = +opt('to', dur);
  const workers = +opt('workers', 4);
  const out = opt('out', 'out/silent.mp4');
  const tmp = out + '.parts'; fs.mkdirSync(tmp, { recursive: true });
  const f0 = Math.round(from * fps), f1 = Math.round(to * fps);
  const per = Math.ceil((f1 - f0) / workers);
  const t0 = Date.now(); let done = 0;
  const jobs = [];
  for (let w = 0; w < workers; w++) {
    const a = f0 + w * per, b = Math.min(f1, a + per);
    if (a >= b) continue;
    jobs.push((async () => {
      const page = w === 0 ? page0 : await openPage();
      const seg = path.join(tmp, `seg${String(w).padStart(2, '0')}.mp4`);
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '10', '-pix_fmt', 'yuv420p', '-r', String(fps), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let f = a; f < b; f++) {
        const buf = await frame(page, f / fps);
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        if (++done % 60 === 0) {
          const el = (Date.now() - t0) / 1000;
          process.stderr.write(`  ${done}/${f1 - f0} frames  ${(done / el).toFixed(1)} fps  eta ${((f1 - f0 - done) / (done / el)).toFixed(0)}s\n`);
        }
      }
      ff.stdin.end();
      await new Promise(r => ff.on('close', r));
      return seg;
    })());
  }
  const segs = (await Promise.all(jobs)).sort();
  fs.writeFileSync(path.join(tmp, 'list.txt'), segs.map(s => `file '${path.resolve(s)}'`).join('\n'));
  await new Promise(r => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', out], { stdio: 'inherit' }).on('close', r));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`rendered ${f1 - f0} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s → ${out}`);
}
await browser.close(); server.close();
