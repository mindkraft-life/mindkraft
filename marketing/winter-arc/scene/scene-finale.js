// ════════════════════════════════════════════════════════════════════════
// S13–S14 · THE SHAPE OF YOUR ARC
// S13 63.71 → 67.31  "…step back and look at the shape of your own arc."
//                    — pull back to XP Over Time, Oct 1 → Jan 1, line draws
// S14 67.31 → 69.90  "So what's your winter arc going to look like?"
//                    — back to today: dashed possible arcs (overlay style)
// End 69.90 → 73.50  Mindkraft lockup + call to action
// ════════════════════════════════════════════════════════════════════════
import { W, H, clamp, lerp, prog, E, tw, kf, env, pulse, rnd, rndr, h, css, show, fmt, hiCanvas, clearCanvas } from './engine.js';
import { COL, CHART_LINE, chartCard, drawChart, statTile, brandLockup } from './components.js';

// Oct 1 → Jan 1: 93 days of a winter arc that compounds.
const DAYS = 92;
function winterData() {
  const pts = []; let v = 0;
  for (let d = 0; d <= DAYS; d++) {
    const skip = [5, 14, 26, 47, 69].includes(d);
    const daily = skip ? 0 : Math.round((38 + 70 * Math.pow(d / DAYS, 1.35)) * rndr(d * 1.9 + 3, 0.85, 1.15));
    v += daily; pts.push({ x: d, v });
  }
  return pts;
}
const dateLabel = (d) => { const dt = new Date(2026, 9, 1 + d); return `${dt.getMonth() + 1}/${dt.getDate()}`; };

export function sceneFinale(C, fx) {
  const out = [];
  const el = h('div', 'scene');
  const data = winterData();
  const total = data[data.length - 1].v;
  const cardWrap = h('div', 'abs', '', 'left:36px;top:62px;width:360px;transform-origin:50% 40%;');
  const card = chartCard({ ch: 196, range: 'All' });
  cardWrap.appendChild(card.el); el.appendChild(cardWrap);
  const cv = hiCanvas(W, H, 'abs'); el.appendChild(cv);
  const lvl = h('div', 'abs', `<div class="level-badge"><span class="level-label">Level</span><div class="level-display"><svg class="level-svg" width="64" height="50" overflow="visible" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="30%" stop-color="var(--color-text-primary)"/><stop offset="100%" stop-color="var(--color-progress)"/></linearGradient></defs><text class="level-svg-text level-svg-fill" x="32" y="42" text-anchor="middle" style="fill:url(#finGrad)">31</text><text class="level-svg-text level-svg-trace mk-ftr" x="32" y="42" text-anchor="middle">31</text></svg></div></div>`, 'width:80px;margin-left:-40px;');
  el.appendChild(lvl);
  const trace = lvl.querySelector('.mk-ftr');
  const stats = [statTile('green', 'bolt', '0', 'Total XP Earned'), statTile('blue', 'check', '0', 'Total Completions'), statTile('coral', 'fire', '0', 'Highest Streak')];
  const statWrap = h('div', 'abs an-stat-row', '', 'left:36px;top:410px;width:360px;display:flex;gap:8px;transform-origin:50% 0;transform:scale(0.84);');
  stats.forEach(s => { css(s.el, { flex: '1', margin: '0', minWidth: '0' }); statWrap.appendChild(s.el); });
  el.appendChild(statWrap);
  const sparks = hiCanvas(W, H, 'abs'); el.appendChild(sparks);
  const q = h('div', 'kt', '?', 'font-size:120px;font-weight:900;color:rgba(255,255,255,0.06);left:0;width:432px;text-align:center;top:120px;');
  el.appendChild(q);
  // End card
  const end = h('div', 'abs', '', 'left:0;top:0;width:432px;height:768px;');
  const brand = brandLockup({ chips: true });
  css(brand.el, { left: '0px', top: '150px' }); end.appendChild(brand.el);
  const cta = h('div', 'kt kt-ice', 'Start your winter arc', 'font-size:34px;font-weight:900;letter-spacing:-0.035em;left:0;width:432px;text-align:center;top:470px;');
  const url = h('div', 'kicker', 'mindkraft.life', 'left:0;width:432px;text-align:center;top:520px;font-size:13px;letter-spacing:0.28em;color:rgba(255,255,255,0.6)');
  end.appendChild(cta); end.appendChild(url); el.appendChild(end);
  let RECT = null;
  // The three possible arcs (overlay series): steady, late bloomer, all in.
  const futures = [
    { color: CHART_LINE[1], f: (u) => 0.55 * u },
    { color: CHART_LINE[2], f: (u) => 0.9 * Math.pow(u, 2.1) },
    { color: CHART_LINE[4], f: (u) => 1.0 * (1 - Math.pow(1 - u, 1.6)) * 0.95 },
  ];

  out.push({
    t0: C.stepBack - 0.1, t1: 99, el,
    update(t) {
      if (!RECT) { const b = card.box.getBoundingClientRect(), s = el.getBoundingClientRect(); RECT = { x: b.left - s.left + 52, y: b.top - s.top + 18, w: b.width - 72, h: b.height - 52 }; }
      // camera: arrive from far away (we "step back" into this view)
      const back = E.outQuart(prog(t, C.stepBack + 0.06, 1.05));
      const drift = prog(t, C.stepBack, 6);
      const sc = lerp(1.45, 1, back) * (1 + 0.035 * drift);
      const question = E.inOutCubic(prog(t, C.soWhats, 0.7));
      const endIn = E.inOutCubic(prog(t, C.endCard - 0.15, 0.7));
      const tilt = lerp(16, 0, back) + 1.2 * Math.sin((t - C.stepBack) * 0.8);
      const T3 = `perspective(1300px) rotateX(${tilt.toFixed(2)}deg) scale(${(sc * lerp(1, 0.9, endIn)).toFixed(4)}) translateY(${(-30 * endIn).toFixed(1)}px)`;
      css(cardWrap, { opacity: (clamp(back * 1.6, 0, 1) * (1 - endIn)).toFixed(3), transform: T3 });
      css(cv, { opacity: (clamp(back * 1.6, 0, 1) * (1 - endIn)).toFixed(3), transformOrigin: '216px 120px', transform: T3 });
      css(cardWrap, { transformOrigin: '180px 58px' });
      // the line draws: Oct 7 → Jan 1
      const draw = E.inOutSine(prog(t, C.look - 0.35, C.ownArc2 + 0.25 - (C.look - 0.35)));
      const upto = DAYS * draw;
      const shapeGlow = env(t, C.shape - 0.1, C.soWhats + 0.4, 0.4, 0.4);
      const fade = lerp(1, 0.22, question);
      const view = { x0: 0, x1: DAYS, v0: 0, v1: total * 1.08 };
      const series = [{ pts: data, color: COL.blue, fill: 'rgba(74,124,158,0.35)', width: 2.5 + 0.8 * shapeGlow, glow: 0.7 + 1.1 * shapeGlow, upto, head: draw > 0 && draw < 1 ? 0.9 : 0.9 * (1 - question), alpha: fade }];
      // S14: today again — a single point and the dashed possibilities
      const fut = [];
      if (question > 0) {
        futures.forEach((F, i) => {
          const p = E.inOutCubic(prog(t, C.winter3 - 0.1 + i * 0.22, 1.1));
          const pts = []; for (let d = 0; d <= DAYS; d += 2) pts.push({ x: d, v: total * F.f(d / DAYS) });
          fut.push({ pts, color: F.color, dashed: true, width: 2, upto: DAYS * p, head: p > 0 && p < 1 ? 0.45 : 0, headColor: F.color, alpha: 1 - prog(t, C.endCard - 0.2, 0.4) });
        });
      }
      const m = drawChart(cv, [...series, ...fut], view, {
        rect: RECT, gridAlpha: 1,
        xLabels: [0, 18, 36, 55, 73, DAYS].map(d => [d, dateLabel(d)]),
      });
      // start dot for "today"
      if (question > 0) {
        const [X, Y] = [m.px(0), m.py(0)];
        const ctx = cv.ctx, a = E.outBack(prog(t, C.soWhats + 0.4, 0.4)) * (1 - prog(t, C.endCard - 0.2, 0.4));
        ctx.save(); ctx.globalAlpha = clamp(a, 0, 1); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(90,159,212,0.9)'; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(X, Y, 5 * a, 0, 6.283); ctx.fill(); ctx.restore();
      }
      // level badge rides the head; gold trace when the arc completes
      const head = data[Math.min(DAYS, Math.floor(upto))];
      const [hx, hy] = [m.px(Math.min(upto, DAYS)), m.py(head ? lerp(head.v, (data[Math.min(DAYS, Math.floor(upto) + 1)] || head).v, upto - Math.floor(upto)) : 0)];
      const lv = Math.round(14 + 17 * draw);
      lvl.querySelectorAll('text').forEach(n => { if (n.textContent !== String(lv)) n.textContent = String(lv); });
      const lvA = env(t, C.look - 0.2, C.soWhats + 0.3, 0.3, 0.35) * (1 - endIn);
      // map chart point through the canvas transform (scale about origin)
      const o = [216, 120];
      const sx = o[0] + (hx - o[0]) * sc * lerp(1, 0.9, endIn), sy = o[1] + (hy - o[1]) * sc * lerp(1, 0.9, endIn) - 30 * endIn;
      css(lvl, { left: sx.toFixed(1) + 'px', top: (sy - 74).toFixed(1) + 'px', opacity: lvA.toFixed(3), transform: `scale(${(0.72 + 0.12 * pulse(t, C.ownArc2 + 0.2, 4)).toFixed(3)})` });
      const tp = prog(t, C.ownArc2 + 0.15, 1.8);
      const off = tp < 0.6 ? lerp(600, 0, E.inOutSine(tp / 0.6)) : lerp(0, -600, E.inSine((tp - 0.6) / 0.4));
      css(trace, { strokeDashoffset: off.toFixed(1), opacity: (tp <= 0 || tp >= 1 ? 0 : Math.min(1, tp * 12, (1 - tp) * 6)).toFixed(3) });
      // gold sparkle as the arc completes (milestone)
      clearCanvas(sparks);
      const sp = prog(t, C.ownArc2 + 0.22, 1.2);
      if (sp > 0 && sp < 1) {
        const ctx = sparks.ctx;
        for (let j = 0; j < 26; j++) {
          const a = (j / 26) * 6.283 + rnd(j + 40) * 0.25, d = lerp(4, rndr(j + 9, 40, 95), E.outCubic(sp));
          ctx.fillStyle = `rgba(245,197,99,${(1 - sp).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(sx + Math.cos(a) * d, sy + Math.sin(a) * d + 16 * sp * sp, lerp(2.4, 0.5, sp), 0, 6.283); ctx.fill();
        }
      }
      // stat tiles cascade, count up, then step aside for the question
      stats.forEach((s, i) => {
        const a = E.outBack(prog(t, C.ownArc2 + 0.1 + i * 0.12, 0.5));
        const leave = E.inCubic(prog(t, C.soWhats - 0.05 + i * 0.05, 0.4));
        css(s.el, { opacity: (clamp(a * 1.6, 0, 1) * (1 - leave)).toFixed(3), transform: `translateY(${(lerp(26, 0, a) + 30 * leave).toFixed(1)}px)` });
        const c = E.outCubic(prog(t, C.ownArc2 + 0.1 + i * 0.12, 0.9));
        s.set(i === 0 ? fmt(total * c) : i === 1 ? fmt(236 * c) : fmt(52 * c));
      });
      css(q, { opacity: (0.9 * env(t, C.goingTo - 0.2, C.endCard + 0.1, 0.5, 0.3)).toFixed(3), transform: `scale(${lerp(0.9, 1.05, prog(t, C.goingTo - 0.2, 1.4)).toFixed(3)})` });
      // end card
      show(end, endIn > 0);
      if (endIn > 0) {
        const b = E.outCubic(prog(t, C.endCard, 0.8));
        css(brand.el, { opacity: b.toFixed(3), transform: `translateY(${lerp(30, 0, b).toFixed(1)}px) scale(${lerp(0.94, 1.12, b).toFixed(4)})` });
        css(brand.ring, { transform: `scale(${E.outBack(prog(t, C.endCard, 0.5)).toFixed(4)})` });
        css(brand.pulse, { transform: `scale(${(1 + 0.18 * Math.sin((t - C.endCard) * 2.2)).toFixed(4)})`, opacity: (0.6 + 0.4 * Math.sin((t - C.endCard) * 2.2)).toFixed(3) });
        css(brand.icon, { transform: `translateY(${(-4 * Math.sin((t - C.endCard) * 2.1)).toFixed(2)}px)` });
        brand.chips.forEach((c, i) => { const a = E.outBack(prog(t, C.endCard + 0.5 + i * 0.1, 0.45)); css(c, { opacity: clamp(a * 1.5, 0, 1).toFixed(3), transform: `translateY(${lerp(10, 0, a).toFixed(1)}px)` }); });
        const ct = E.outCubic(prog(t, C.endCard + 0.9, 0.6));
        css(cta, { opacity: ct.toFixed(3), transform: `translateY(${lerp(14, 0, ct).toFixed(1)}px)`, filter: `blur(${((1 - ct) * 6).toFixed(2)}px)` });
        const u = E.outCubic(prog(t, C.endCard + 1.25, 0.6));
        css(url, { opacity: u.toFixed(3), letterSpacing: lerp(0.5, 0.28, u).toFixed(3) + 'em' });
      }
    },
  });
  return out;
}
