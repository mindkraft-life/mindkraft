// ════════════════════════════════════════════════════════════════════════
// Engine — everything here is a pure function of its inputs. The scene is
// rendered frame by frame by a headless browser, so nothing may depend on
// wall-clock time, accumulated state or Math.random(): frame N must look the
// same whether it is rendered first, last, or by a different worker.
// ════════════════════════════════════════════════════════════════════════

export const W = 432, H = 768;          // CSS px; rendered at 2.5× → 1080×1920

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, u) => a + (b - a) * u;
export const prog = (t, t0, d) => d <= 0 ? (t >= t0 ? 1 : 0) : clamp((t - t0) / d, 0, 1);
export const within = (t, a, b) => t >= a && t < b;
export const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };

export const E = {
  linear: x => x,
  inQuad: x => x * x,
  outQuad: x => 1 - (1 - x) * (1 - x),
  inOutQuad: x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
  inCubic: x => x * x * x,
  outCubic: x => 1 - Math.pow(1 - x, 3),
  inOutCubic: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  outQuart: x => 1 - Math.pow(1 - x, 4),
  inOutQuart: x => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
  outQuint: x => 1 - Math.pow(1 - x, 5),
  inOutQuint: x => x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2,
  inExpo: x => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
  outExpo: x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
  inOutExpo: x => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
  outSine: x => Math.sin(x * Math.PI / 2),
  inSine: x => 1 - Math.cos(x * Math.PI / 2),
  outBack: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outBackSoft: x => { const c1 = 0.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  inBack: x => { const c1 = 1.70158, c3 = c1 + 1; return c3 * x * x * x - c1 * x * x; },
  outElastic: x => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
};

/** Eased value from→to across [t0, t0+d], held outside the window. */
export const tw = (t, t0, d, a, b, ease = E.outCubic) => lerp(a, b, ease(prog(t, t0, d)));

/**
 * Keyframe track: keys = [[time, value, easeIntoThisKey?], ...] sorted by time.
 * Values may be numbers or arrays of numbers (interpolated element-wise).
 */
export function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1];
      const u = (e || E.inOutCubic)(prog(t, t0, t1 - t0));
      return Array.isArray(v0) ? v0.map((x, j) => lerp(x, v1[j], u)) : lerp(v0, v1, u);
    }
  }
  return keys[keys.length - 1][1];
}

/** 0→1→0 envelope: rises over `a`, holds, falls over `b`. */
export const env = (t, t0, t1, a = 0.3, b = 0.3, ea = E.outCubic, eb = E.inCubic) =>
  t < t0 || t > t1 ? 0 : Math.min(ea(prog(t, t0, a)), 1 - eb(prog(t, t1 - b, b)));

/** A one-shot decaying pulse after time t0 (0 before). */
export const pulse = (t, t0, decay = 6) => t < t0 ? 0 : Math.exp(-(t - t0) * decay);

/** Deterministic hash noise in [0,1). */
export const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453123; return s - Math.floor(s); };
export const rndr = (i, a, b) => lerp(a, b, rnd(i));

/** Smooth 1D value noise, deterministic. */
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(rnd(i + seed * 1000), rnd(i + 1 + seed * 1000), u) * 2 - 1;
}

// ── DOM helpers ───────────────────────────────────────────────────────────
export function h(tag, cls, html, style) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html != null) el.innerHTML = html;
  if (style) el.style.cssText = style;
  return el;
}

/** Cheap style setter that skips writes when the value has not changed. */
export function css(el, props) {
  const c = el.__c || (el.__c = {});
  for (const k in props) {
    const v = props[k];
    if (c[k] !== v) { c[k] = v; if (k.startsWith('--')) el.style.setProperty(k, v); else el.style[k] = v; }
  }
}

export function show(el, on) { css(el, { display: on ? '' : 'none' }); return on; }

export const fmt = (n) => Math.round(n).toLocaleString('en-US');

/** A canvas sized for the 2.5× render, drawing in CSS-pixel coordinates. */
export function hiCanvas(w, h, cls) {
  const c = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  c.style.width = w + 'px'; c.style.height = h + 'px';
  if (cls) c.className = cls;
  const ctx = c.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.ctx = ctx; c.cw = w; c.ch = h;
  return c;
}

export function clearCanvas(c) {
  c.ctx.save(); c.ctx.setTransform(1, 0, 0, 1, 0, 0); c.ctx.clearRect(0, 0, c.width, c.height); c.ctx.restore();
}

/**
 * Layout position of `el` relative to `root` (an offsetParent ancestor),
 * ignoring CSS transforms — safe to call while things are mid-animation.
 */
export function layoutPos(el, root) {
  let x = 0, y = 0, e = el;
  while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
  return [x, y];
}
export function layoutCenter(el, root) {
  const [x, y] = layoutPos(el, root);
  return [x + el.offsetWidth / 2, y + el.offsetHeight / 2];
}
