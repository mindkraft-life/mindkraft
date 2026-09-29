// ============ 08 — MOMENTUM COMPOUNDS =====================================
// VO @ 02:17.22 → 02:25.38  "That one hobby you wanted to build, that side
// project you're putting off, bring in everything and the momentum just
// continues to compound."
// Hero moment: dimensions join one by one, then the spider chart pulses outward
// on the beat — level 8 → 13, gold on the last one.
const MO = {
  DIMS: [
    { name: 'Health',       icon: 'pulse',  col: COL.dim.body,   at: -1,  base: 0.45 },
    { name: 'Guitar',       icon: 'music',  col: COL.dim.craft,  at: 0.2, base: 0.3 },
    { name: 'Side project', icon: 'code',   col: COL.dim.focus,  at: 1.8, base: 0.3 },
    { name: 'Mind',         icon: 'book',   col: COL.dim.mind,   at: 3.8, base: 0.26 },
    { name: 'Social',       icon: 'users',  col: COL.dim.social, at: 4.2, base: 0.26 },
    { name: 'Wealth',       icon: 'dollar', col: COL.blueDk,     at: 4.6, base: 0.26 },
  ],
  PULSES: [5.8, 6.2, 6.6, 7.0, 7.4],
};

const SCENE = {
  meta: { title: 'Trick 08 — Momentum Compounds', w: 1080, h: 1920, fps: 60, duration: 8.16 },

  timeline: [
    { t: 0.0, label: 'Dimensions view: only Health is active on the spider chart' },
    { t: 0.2, label: '“that one hobby” — Guitar joins; its axis lights' },
    { t: 1.8, label: '“that side project” — Side project joins' },
    { t: 3.8, label: '“bring in everything” — Mind, Social, Wealth join on the beat' },
    { t: 5.8, label: '“momentum… compound” — the chart pulses outward on every beat, levels 8 → 13' },
    { t: 7.4, label: 'Final pulse: golden LVL 13; hold' },
  ],

  cues: [
    { t: 0.0, s: 'popIn' },
    ...MO.DIMS.slice(1).map((d, i) => ({ t: d.at, s: 'join', n: i })),
    { t: 5.0, s: 'riser', dur: 0.8 },
    ...MO.PULSES.map((t, i) => ({ t, s: 'pulse', n: i })),
    { t: 7.4, s: 'levelUp' },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h;
    const P = MO.PULSES, final = prog(t, P[4], 1);
    const nPulse = P.filter(p => t >= p).length;
    sceneBg(c, W, H, final * 0.6);

    // values per axis
    const vals = MO.DIMS.map(d => {
      const j = d.at < 0 ? 1 : E.outBack(prog(t, d.at, 0.45));
      let v = lerp(0.06, d.base, j) + 0.05 * E.inOut(prog(t, 5.0, 0.8)) * (d.at < t ? 1 : 0);
      P.forEach(p => v += 0.1 * E.outBack(prog(t, p, 0.3)));
      return clamp(v, 0, 1.05);
    });

    // ---- header: level + XP bar ----
    const lvl = 8 + nPulse, gold = t >= P[4];
    K.text(c, 'DIMENSIONS', 90, 300, { w: 800, s: 30, col: COL.txt4, track: 9 });
    const pop = P.reduce((a, p) => a + 0.35 * Math.sin(Math.PI * prog(t, p, 0.3)), 0);
    c.save(); c.translate(990, 316); c.scale(1 + pop, 1 + pop);
    K.text(c, 'LVL', -118, -4, { w: 700, s: 26, col: COL.txt3, align: 'right' });
    K.text(c, String(lvl), 0, 0, { w: 800, s: 76, align: 'right', col: gold && final < 0.9 ? COL.gold : COL.txt, glow: gold && final < 0.9 ? 'rgba(245,197,99,0.9)' : null });
    c.restore();
    if (gold) sparkleBurst(c, 950, 300, prog(t, P[4], 0.9), 18, 360);
    let pct = t < P[0] ? lerp(0.35, 1, E.inQuad(prog(t, 3.8, 2.0))) : 0;
    P.forEach((p, i) => { if (t >= p) pct = i < 4 ? tween(t, p, 0.36, 0, 1, E.inQuad) : tween(t, p, 0.7, 0, 0.3); });
    xpBar(c, 90, 368, 900, 16, pct);

    // ---- spider chart ----
    const cx = 540, cy = 720, R = 250, n = MO.DIMS.length;
    const ang = i => -Math.PI / 2 + i * K.TAU / n;
    const poly = (r, f) => { c.beginPath(); for (let i = 0; i < n; i++) { const rr_ = typeof r === 'number' ? r : r[i]; const px = cx + Math.cos(ang(i)) * rr_, py = cy + Math.sin(ang(i)) * rr_; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); f(); };
    K.glow(c, cx, cy, 520, COL.blue, 0.10 + 0.08 * final);
    c.save(); c.strokeStyle = 'rgba(255,255,255,0.07)'; c.lineWidth = 2;
    [0.33, 0.66, 1].forEach(k => poly(R * k, () => c.stroke()));
    for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ang(i)) * R, cy + Math.sin(ang(i)) * R); c.stroke(); }
    c.restore();
    // pulse waves
    P.forEach(p => {
      const wv = prog(t, p, 0.6);
      if (wv > 0 && wv < 1) { c.save(); c.globalAlpha = (1 - wv) * 0.8; c.strokeStyle = COL.blue; c.lineWidth = 4; shadow(c, COL.blue, 16); poly(vals.map(v => R * v * lerp(1, 1.5, E.outCubic(wv))), () => c.stroke()); c.restore(); }
    });
    const rv = vals.map(v => R * v);
    c.save(); c.fillStyle = K.hexA(COL.blue, 0.2 + 0.1 * final); poly(rv, () => c.fill());
    c.lineWidth = 5; c.lineJoin = 'round'; c.strokeStyle = gold && final < 0.7 ? COL.gold : COL.blue; shadow(c, gold && final < 0.7 ? 'rgba(245,197,99,0.9)' : 'rgba(90,159,212,0.9)', 22);
    poly(rv, () => c.stroke()); c.restore();
    MO.DIMS.forEach((d, i) => {
      const on = d.at < t, px = cx + Math.cos(ang(i)) * rv[i], py = cy + Math.sin(ang(i)) * rv[i];
      c.save(); c.beginPath(); c.arc(px, py, 9, 0, K.TAU); c.fillStyle = on ? d.col : '#3a3d44'; if (on) shadow(c, d.col, 14); c.fill(); c.restore();
      const lx = cx + Math.cos(ang(i)) * (R + 58), ly = cy + Math.sin(ang(i)) * (R + 58);
      const jp = d.at < 0 ? 1 : prog(t, d.at, 0.4);
      c.save(); c.beginPath(); c.arc(lx, ly, 36, 0, K.TAU); c.fillStyle = on ? K.hexA(d.col, 0.18) : 'rgba(255,255,255,0.04)'; c.fill(); c.restore();
      K.icon(c, d.icon, lx, ly, 34 * (1 + 0.3 * Math.sin(Math.PI * jp) * (d.at > 0 ? 1 : 0)), on ? d.col : COL.txt4, { lw: 2.2 });
    });

    // ---- dimension cards (2 × 3) ----
    const cw = 440, ch = 118, gx = 20, gy = 20, x0 = 90, y0 = 1090;
    MO.DIMS.forEach((d, i) => {
      const a = d.at < 0 ? 1 : prog(t, d.at, 0.45);
      if (a <= 0) return;
      const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy) + lerp(50, 0, E.outBack(a));
      const dl = 1 + (i === 0 ? 3 : 0) + nPulse;
      c.save(); c.globalAlpha = clamp(a * 1.6, 0, 1);
      K.activity(c, x, y, cw, ch, {
        name: d.name, xp: 'Lv ' + dl, dim: d.col, icon: d.icon, fs: 30,
        pulse: P.reduce((m, p) => Math.max(m, prog(t, p + i * 0.03, 0.3) % 1), 0),
        right: (c, rx, ry) => K.ring(c, rx, ry, 24, vals[i], d.col, 6),
      });
      c.restore();
    });

    K.vignette(c, W, H, 0.5);
    K.grain(c, W, H, t);
  },
};
