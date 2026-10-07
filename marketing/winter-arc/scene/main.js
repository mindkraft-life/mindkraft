// ════════════════════════════════════════════════════════════════════════
// Main — builds the layer stack, the snow, frost and captions, and exposes
//   window.renderFrame(t)   draw the frame at t seconds (pure in t)
//   window.SCENE_DURATION   total length in seconds
//   window.sceneReady       resolves once fonts + data are loaded
// ════════════════════════════════════════════════════════════════════════
import { W, H, clamp, lerp, prog, E, kf, env, pulse, rnd, rndr, noise1, h, css, hiCanvas, clearCanvas } from './engine.js';
import { buildScenes } from './scenes.js';

const stage = document.getElementById('stage');

async function load() {
  const [words, cueFile, phrases] = await Promise.all([
    fetch('../data/words.json').then(r => r.json()),
    fetch('../data/cues.json').then(r => r.json()),
    fetch('../data/captions.json').then(r => r.json()),
  ]);
  // Make sure every font the frames use is decoded before frame 0.
  const probe = h('div', '', `<span style="font:300 10px Inter">a</span><span style="font:900 10px Inter">a</span><i class="ph-bold ph-brain"></i><i class="ph-fill ph-lightning"></i>`, 'position:absolute;opacity:0;left:-99px');
  document.body.appendChild(probe);
  await document.fonts.load('900 20px Inter'); await document.fonts.load('400 20px Inter');
  await document.fonts.load('20px Phosphor-Bold'); await document.fonts.load('20px Phosphor-Fill');
  await document.fonts.ready;
  return { words, phrases, C: cueFile.cues, duration: cueFile.duration };
}

window.sceneReady = load().then(({ words, phrases, C, duration }) => {
  window.SCENE_DURATION = duration;

  // ── Layer stack ────────────────────────────────────────────────────────
  const aurora = hiCanvas(W, H, 'layer'); aurora.id = 'aurora'; stage.appendChild(aurora);
  const snowBack = hiCanvas(W, H, 'layer'); stage.appendChild(snowBack);
  const glow = h('div', 'layer', '', ''); glow.id = 'glow'; stage.appendChild(glow);
  const world = h('div', 'layer'); world.style.pointerEvents = 'none'; stage.appendChild(world);
  const snowFront = hiCanvas(W, H, 'layer'); stage.appendChild(snowFront);
  const vignette = h('div', 'layer'); vignette.id = 'vignette'; stage.appendChild(vignette);
  const frost = hiCanvas(W, H, 'layer'); frost.id = 'frost'; stage.appendChild(frost);
  const flash = h('div', 'layer'); flash.id = 'flash'; stage.appendChild(flash);
  const capLayer = h('div', 'layer'); capLayer.id = 'captions'; stage.appendChild(capLayer);
  const tc = h('div', ''); tc.id = 'tc'; stage.appendChild(tc);
  if (location.hash.includes('tc')) tc.style.display = 'block';

  const fx = { frost, flash, glow, world, stage };
  const scenes = buildScenes(world, C, fx);
  const captions = buildCaptions(capLayer, words, phrases, C);
  const snow = buildSnow(C);

  window.renderFrame = (t) => {
    // Camera shake from impacts — summed decaying noise, pure in t.
    const hits = [[C.winterArc, 3.5, 7], [C.fail, 9, 6], [C.quit, 2.5, 8], [C.mindkraft, 6, 5], [C.stepBack, 5, 5], [C.arrives, 2.5, 7]];
    let sx = 0, sy = 0, sr = 0;
    hits.forEach(([t0, a, k], i) => { const p = pulse(t, t0, k) * a; if (p > 0.01) { sx += p * noise1(t * 38, i * 3 + 1); sy += p * noise1(t * 41, i * 3 + 2); sr += p * 0.08 * noise1(t * 30, i * 3 + 3); } });
    // A slow continuous float (never static, never jumps) plus a zoom
    // punch on every big hit.
    const punch = 0.035 * pulse(t, C.winterArc, 5) + 0.05 * pulse(t, C.fail, 5) + 0.04 * pulse(t, C.mindkraft, 4) + 0.035 * pulse(t, C.stepBack, 4) + 0.02 * pulse(t, C.year, 6) + 0.02 * pulse(t, C.onlyAudience, 4);
    const fs = 1.012 + 0.012 * Math.sin(t * 2 * Math.PI / 13) + punch;
    const fr = 0.35 * Math.sin(t * 2 * Math.PI / 17 + 0.6);
    const fx_ = 3.2 * Math.sin(t * 2 * Math.PI / 11 + 1.3), fy = 3.8 * Math.sin(t * 2 * Math.PI / 9.5);
    css(world, { transformOrigin: '216px 330px', transform: `translate(${(sx + fx_).toFixed(2)}px, ${(sy + fy).toFixed(2)}px) rotate(${(sr + fr).toFixed(3)}deg) scale(${fs.toFixed(4)})` });

    // One flash controller for every impact: [time, rgb, peak, decay, radial]
    const FL = [[C.winterArc, '200,228,250', 0.16, 6, 0], [C.fail, '194,106,122', 0.30, 5, 1], [C.quit, '194,106,122', 0.12, 6, 1], [C.mindkraft, '205,232,255', 0.38, 4.5, 0], [C.year, '245,197,99', 0.14, 5, 1], [C.stepBack, '220,236,250', 0.2, 5, 0], [C.endCard, '205,232,255', 0.1, 3, 0]];
    let flashBg = 'none';
    for (const [t0, rgb, pk, k, radial] of FL) {
      const a = pulse(t, t0, k) * pk * clamp((t - t0 + 0.02) / 0.02, 0, 1);
      if (a > 0.004) { flashBg = radial ? `radial-gradient(ellipse 75% 60% at 50% 45%, rgba(${rgb},0) 35%, rgba(${rgb},${a.toFixed(3)}) 100%)` : `radial-gradient(ellipse 90% 70% at 50% 40%, rgba(${rgb},${a.toFixed(3)}) 0%, rgba(${rgb},${(a * 0.4).toFixed(3)}) 100%)`; break; }
    }
    css(flash, { background: flashBg });

    // Background glows drift slowly; energy swells at the musical peaks.
    const energy = Math.max(env(t, C.onlyAudience - 0.2, C.soFor, 0.6, 1.2) * 0.6, env(t, C.mindkraft - 0.1, C.here + 0.5, 0.2, 1) * 1, env(t, C.stepBack, C.soWhats + 1, 0.4, 1.5) * 0.9, env(t, C.endCard, 99, 1.2, 0.1) * 0.7);
    css(stage, { '--gax': (18 + 6 * Math.sin(t * 0.13)).toFixed(2) + '%', '--gay': (18 + 5 * Math.cos(t * 0.11)).toFixed(2) + '%', '--gbx': (82 - 5 * Math.sin(t * 0.09)).toFixed(2) + '%', '--gby': (82 - 6 * Math.cos(t * 0.12)).toFixed(2) + '%' });
    css(glow, { background: `radial-gradient(ellipse 80% 45% at 50% 42%, rgba(90,159,212,${(0.10 * energy).toFixed(3)}) 0%, transparent 70%)` });

    scenes.forEach(s => {
      const on = t >= s.t0 && t < s.t1;
      if (s.el) css(s.el, { display: on ? '' : 'none' });
      if (on) s.update(t);
    });
    drawAurora(aurora, t, energy);
    snow(snowBack, snowFront, t);
    captions(t);
    tc.textContent = t.toFixed(2);
  };
  window.renderFrame(0);
  return true;
});

// ── Aurora ────────────────────────────────────────────────────────────────
// Soft winter-night ribbons in the brand blues, drifting high in the frame.
// Their brightness follows the music's energy curve.
function drawAurora(cv, t, energy) {
  clearCanvas(cv);
  const ctx = cv.ctx;
  const bands = [
    { y: 120, amp: 26, k: 0.011, w: 0.23, ph: 0.0, h: 120, c: '90,159,212' },
    { y: 70, amp: 34, k: 0.008, w: -0.17, ph: 2.1, h: 150, c: '63,138,135' },
    { y: 170, amp: 22, k: 0.014, w: 0.12, ph: 4.0, h: 90, c: '122,93,158' },
  ];
  const base = 0.05 + 0.13 * energy;
  ctx.save();
  ctx.filter = 'blur(14px)';
  bands.forEach((b, i) => {
    const a = base * (0.75 + 0.25 * Math.sin(t * 0.4 + i * 2));
    const g = ctx.createLinearGradient(0, b.y - b.h, 0, b.y + b.h * 0.4);
    g.addColorStop(0, `rgba(${b.c},0)`); g.addColorStop(0.65, `rgba(${b.c},${a.toFixed(3)})`); g.addColorStop(1, `rgba(${b.c},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let x = -20; x <= W + 20; x += 8) {
      const y = b.y + b.amp * Math.sin(x * b.k + t * b.w + b.ph) + 10 * Math.sin(x * b.k * 2.3 - t * b.w * 1.7);
      if (x === -20) ctx.moveTo(x, y - b.h); else ctx.lineTo(x, y - b.h);
    }
    for (let x = W + 20; x >= -20; x -= 8) {
      const y = b.y + b.amp * Math.sin(x * b.k + t * b.w + b.ph) + 10 * Math.sin(x * b.k * 2.3 - t * b.w * 1.7);
      ctx.lineTo(x, y + b.h * 0.25);
    }
    ctx.closePath(); ctx.fill();
  });
  ctx.restore();
}

// ── Snow ──────────────────────────────────────────────────────────────────
// Deterministic: each flake's position is a closed-form function of a warped
// "snow time" that runs faster in the time-lapse and bursts at the logo.
function buildSnow(C) {
  const N = 170;
  const flakes = Array.from({ length: N }, (_, i) => {
    const depth = rnd(i * 3.1 + 0.2);                 // 0 far … 1 near
    return {
      x0: rnd(i * 7.3 + 1) * (W + 60) - 30, y0: rnd(i * 5.9 + 2) * (H + 40),
      v: lerp(9, 46, depth) * rndr(i + 9, 0.8, 1.2), r: lerp(0.5, 2.6, depth * depth) * rndr(i + 4, 0.8, 1.25),
      a: lerp(0.18, 0.62, depth), amp: lerp(4, 18, depth), f: rndr(i + 11, 0.25, 0.7), ph: rnd(i + 13) * 6.28, depth,
    };
  });
  // Snow-time: integral of a speed multiplier sampled at 100 Hz from constants.
  const speed = (t) => 1 + 2.2 * env(t, C.byTheTime - 0.1, C.stepBack + 0.2, 0.3, 0.4) + 1.2 * env(t, C.winterArc - 0.05, C.andYours + 0.3, 0.05, 0.6) + 0.8 * env(t, C.onlyAudience, C.seesArc + 0.8, 0.3, 0.8);
  const ST = new Float32Array(100 * 80 + 2); for (let i = 1; i < ST.length; i++) ST[i] = ST[i - 1] + speed((i - 1) / 100) / 100;
  const snowTime = (t) => { const x = clamp(t * 100, 0, ST.length - 2), i = Math.floor(x); return lerp(ST[i], ST[i + 1], x - i); };
  // Overall density per section (0..1)
  const dens = (t) => clamp(0.55 + 0.45 * env(t, C.winterArc - 0.1, C.understand, 0.1, 0.8) - 0.35 * env(t, C.storytelling + 0.2, C.onlyAudience, 1, 0.6) + 0.35 * env(t, C.memory, C.mindkraft + 1, 1.5, 0.8) + 0.3 * env(t, C.endCard - 0.5, 99, 1.5, 0.1), 0.15, 1);
  return (back, front, t) => {
    clearCanvas(back); clearCanvas(front);
    const st = snowTime(t), d = dens(t);
    const burst = E.outExpo(prog(t, C.mindkraft, 1.6)) * (t >= C.mindkraft ? 1 : 0);
    const wind = 14 * Math.sin(t * 0.21) + 10 * Math.sin(t * 0.083 + 1);
    flakes.forEach((f, i) => {
      if (rnd(i + 77) > d) return;
      let y = ((f.y0 + f.v * st) % (H + 40)) - 20;
      let x = f.x0 + Math.sin(st * f.f + f.ph) * f.amp + wind * (0.4 + f.depth);
      if (burst > 0) { const dx = x - W / 2, dy = y - H * 0.4, L = Math.hypot(dx, dy) + 1; const push = burst * 140 * (0.5 + f.depth); x += dx / L * push; y += dy / L * push; }
      x = ((x % (W + 60)) + W + 60) % (W + 60) - 30;
      const c = f.depth > 0.72 ? front.ctx : back.ctx;
      const r = f.r;
      c.globalAlpha = f.a * (f.depth > 0.9 ? 0.7 : 1);
      if (f.depth > 0.85) { const g = c.createRadialGradient(x, y, 0, x, y, r * 2.2); g.addColorStop(0, 'rgba(235,245,255,0.9)'); g.addColorStop(1, 'rgba(235,245,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 2.2, 0, 6.283); c.fill(); }
      else { c.fillStyle = 'rgb(225,238,250)'; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); }
    });
    back.ctx.globalAlpha = 1; front.ctx.globalAlpha = 1;
  };
}

// ── Captions ──────────────────────────────────────────────────────────────
// Word-by-word, chunked into short phrases; the spoken word carries the app's
// glowing underline indicator. Key ideas tinted with the brand gradient.
const KEY = new Set(['arc', 'winter', 'character', 'audience', 'record', 'shape', 'meaningful', 'purposeful']);
const NEG = new Set(['fail', 'quit']);
function buildCaptions(layer, words, phrases, C) {
  const norm = s => s.toLowerCase().replace(/[^a-z']/g, '');
  // Phrasing is hand-authored (data/captions.json); timing comes from the
  // word onsets. Display text is the phrase's own spelling.
  let wi = 0;
  const cues = phrases.map(p => {
    const toks = p.split(' ');
    const ws = toks.map(tk => Object.assign({}, words[wi++], { w: tk }));
    return { words: ws };
  });
  // "showed up" stays together and both words are key
  cues.forEach((c, k) => {
    c.t0 = c.words[0].t - 0.06;
    const next = cues[k + 1];
    const last = c.words[c.words.length - 1];
    c.t1 = next ? Math.min(next.words[0].t - 0.08, last.end + 0.55) : last.end + 0.6;
    c.el = h('div', 'cap');
    c.spans = c.words.map((w, j) => {
      const n = norm(w.w);
      let cls = 'cw';
      if (NEG.has(n)) cls += ' neg';
      else if (n === 'mindkraft') cls += ' brand';
      else if (KEY.has(n) || (n === 'showed') || (n === 'up' && j > 0 && norm(c.words[j - 1].w) === 'showed')) cls += ' key';
      const s = h('span', cls); s.textContent = w.w; c.el.appendChild(s); return s;
    });
    c.ind = h('div', 'cap-ind'); c.el.appendChild(c.ind);
    css(c.el, { display: 'none' });
    layer.appendChild(c.el);
  });
  // measure once (static layout)
  cues.forEach(c => { c.el.style.display = ''; c.pos = c.spans.map(s => ({ x: s.offsetLeft, y: s.offsetTop, w: s.offsetWidth, h: s.offsetHeight })); c.el.style.display = 'none'; c.el.__c = {}; });

  const baseY = 498;
  return (t) => {
    const yOff = kf(t, [[0, 0], [C.endCard - 0.3, 0], [C.endCard, 40]]);
    cues.forEach(c => {
      const on = t >= c.t0 && t < c.t1 && t < C.endCard + 0.2;
      css(c.el, { display: on ? '' : 'none' });
      if (!on) return;
      const out = 1 - prog(t, c.t1 - 0.08, 0.08);
      css(c.el, { top: (baseY + yOff) + 'px', opacity: out.toFixed(3) });
      let active = -1;
      c.words.forEach((w, j) => {
        const p = prog(t, w.t - 0.05, 0.16);
        const pop = E.outBack(p);
        css(c.spans[j], { opacity: clamp(p * 1.6, 0, 1).toFixed(3), transform: `translateY(${lerp(10, 0, pop).toFixed(2)}px) scale(${lerp(0.82, 1, pop).toFixed(3)})` });
        if (t >= w.t - 0.03) active = j;
      });
      // indicator glides between word positions
      if (active >= 0) {
        const w = c.words[active], P = c.pos[active];
        const prevP = c.pos[Math.max(0, active - 1)];
        const u = active === 0 ? 1 : E.outCubic(prog(t, w.t - 0.03, 0.12));
        const x = lerp(prevP.x, P.x, u), y = lerp(prevP.y, P.y, u), wd = lerp(prevP.w, P.w, u);
        const speaking = t < w.end + 0.25 || active < c.words.length - 1;
        css(c.ind, { transform: `translate(${(x + wd * 0.1).toFixed(1)}px, ${(y + P.h - 1).toFixed(1)}px)`, width: (wd * 0.8).toFixed(1) + 'px', opacity: (speaking ? 1 : 0.35).toFixed(2) });
      } else css(c.ind, { opacity: '0' });
    });
  };
}
