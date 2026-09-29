// ============ 07 — HABIT STREAK ===========================================
// VO @ 01:58.66 → 02:04.74  "…was very hard for you to start, now feels like a
// habit that you are slowly building."
// Hero moment: Day 1 is a struggle (a hold ring that slips back twice); then the
// camera pulls out and the month fills itself in — a 30-day streak.
const HS = (() => {
  const KEYS = [[0, 0], [0.55, 0.45], [0.78, 0.3], [1.25, 0.8], [1.45, 0.62], [1.95, 1]];
  const ss = u => u * u * (3 - 2 * u);
  const ring = t => {
    if (t >= KEYS[KEYS.length - 1][0]) return 1;
    for (let i = 1; i < KEYS.length; i++) if (t < KEYS[i][0]) {
      const [t0, v0] = KEYS[i - 1], [t1, v1] = KEYS[i];
      return lerp(v0, v1, ss((t - t0) / (t1 - t0)));
    }
    return 0;
  };
  const T = [1.95];                      // day 1 completes when the ring closes
  let t = 2.5, iv = 0.18;
  for (let d = 2; d <= 30; d++) { T.push(+t.toFixed(3)); t += iv; iv = Math.max(0.075, iv * 0.9); }
  return { KEYS, ring, T, DONE1: 1.95, LAST: T[29] };
})();

const SCENE = {
  meta: { title: 'Trick 07 — Habit Streak', w: 1080, h: 1920, fps: 60, duration: 6.08 },

  timeline: [
    { t: 0.0, label: '“very hard for you to start” — close on Day 1; the hold ring strains and slips back twice' },
    { t: HS.DONE1, label: 'Day 1 finally completes — streak 1' },
    { t: 2.05, label: '“now feels like a habit” — camera pulls out to the whole month' },
    { t: 2.5, label: 'Days fill themselves in, accelerating; streak counts up' },
    { t: HS.LAST, label: '“slowly building” — Day 30: 30-day streak, flame burst' },
  ],

  cues: [
    { t: 0.0, s: 'strain', keys: HS.KEYS },
    { t: 0.0, s: 'heartbeat', dur: 1.9 },
    { t: 0.78, s: 'slip' }, { t: 1.45, s: 'slip' },
    { t: HS.DONE1, s: 'dayOne' },
    { t: 2.05, s: 'whooshOut' },
    ...HS.T.slice(1).map((t, i) => ({ t, s: 'dayNote', n: i + 1 })),
    { t: HS.LAST + 0.02, s: 'flame' },
    { t: HS.LAST + 0.02, s: 'streakHit' },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h;
    sceneBg(c, W, H, prog(t, HS.LAST, 1) * 0.5);

    // grid geometry (world space)
    const cs = 104, gap = 16, gx = (W - (7 * cs + 6 * gap)) / 2, gy = 760;
    const cell = d => [gx + ((d - 1) % 7) * (cs + gap), gy + Math.floor((d - 1) / 7) * (cs + gap)];
    const [c1x, c1y] = cell(1);

    // camera: tight on Day 1, then pull out to the month
    const out = E.inOutCubic(prog(t, 2.05, 0.95));
    const S = lerp(2.4, 1, out) + 0.03 * Math.sin(Math.PI * prog(t, HS.LAST, 0.6));
    const fx = lerp(c1x + cs / 2, 540, out), fy = lerp(c1y + cs / 2, 930, out);
    const slipSh = K.shake(t, 0.78, 0.2, 6)[0] + K.shake(t, 1.45, 0.2, 6)[0];
    c.save(); c.translate(W / 2 + slipSh, 930); c.scale(S, S); c.translate(-fx, -fy);

    K.glow(c, 540, 930, 700, COL.coral, 0.03 + 0.12 * prog(t, HS.LAST, 0.8));
    K.glow(c, c1x + cs / 2, c1y + cs / 2, 260, COL.green, 0.16 * HS.ring(t));

    // header: the habit + streak chip
    const done = HS.T.filter(x => x <= t).length;
    c.save(); c.globalAlpha = E.inQuad(out);
    K.activity(c, 90, 440, 900, 150, {
      name: 'Morning run', xp: '+30 XP', dim: COL.dim.body, icon: 'pulse', done: false,
      right: () => {},
    });
    c.restore();
    const hot = prog(t, HS.LAST, 0.5), bump = HS.T.reduce((a, x) => a + 0.1 * Math.sin(Math.PI * prog(t, x, 0.16)), 0);
    const lbl = done ? done + ' day streak' : 'No streak yet';
    const tw = K.measure(c, lbl, 800, 30), pw = tw + 100, ph = 62, pcx = 990 - 40 - pw / 2, pcy = 515;
    c.save(); c.globalAlpha = E.inQuad(out); c.translate(pcx, pcy); const ps = 1 + Math.min(0.12, bump) + 0.2 * Math.sin(Math.PI * hot); c.scale(ps, ps);
    rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.fillStyle = done ? COL.coralBg : 'rgba(255,255,255,0.05)';
    if (hot > 0) shadow(c, 'rgba(251,146,60,0.8)', 30 * Math.sin(Math.PI * clamp(hot * 1.3, 0, 1)) + 6); c.fill(); noShadow(c);
    K.icon(c, 'flame', -pw / 2 + 40, -1, 32, done ? COL.coral : COL.txt4, { lw: 2.2, fill: hot > 0, fillCol: K.hexA(COL.coral, 0.35) });
    K.text(c, lbl, -pw / 2 + 68, 1, { w: 800, s: 30, col: done ? COL.coral : COL.txt4 });
    c.restore();
    K.burst(c, pcx, pcy, prog(t, HS.LAST + 0.02, 0.9), 20, 240, COL.coral, 9, 7);

    // weekday header
    'MTWTFSS'.split('').forEach((ch, i) => K.text(c, ch, gx + i * (cs + gap) + cs / 2, gy - 44, { w: 700, s: 24, col: COL.txt4, align: 'center' }));

    // the month
    for (let d = 1; d <= 30; d++) {
      const [x, y] = cell(d), Td = HS.T[d - 1], on = t >= Td, p = prog(t, Td, 0.35);
      rr(c, x, y, cs, cs, 22); c.fillStyle = 'rgba(255,255,255,0.045)'; c.fill();
      if (on) {
        const s = lerp(0.55, 1, E.outBack(p));
        c.save(); c.translate(x + cs / 2, y + cs / 2); c.scale(s, s);
        rr(c, -cs / 2, -cs / 2, cs, cs, 22);
        const a = 0.55 + 0.4 * (d / 30);
        c.fillStyle = K.hexA(COL.green, a); shadow(c, 'rgba(74,222,128,0.55)', 18 * (1 - p) + 6); c.fill(); noShadow(c);
        K.icon(c, 'check', 0, 0, 44, '#0c1f12', { lw: 3.2 });
        c.restore();
      } else {
        K.text(c, String(d), x + cs / 2, y + cs / 2 + 1, { w: 600, s: 30, col: d === 1 ? COL.txt2 : COL.txt4, align: 'center' });
      }
    }

    // Day 1 hold ring (the struggle)
    const r = HS.ring(t), fade = 1 - prog(t, HS.DONE1 + 0.1, 0.4);
    if (fade > 0) {
      c.save(); c.globalAlpha = fade;
      K.ring(c, c1x + cs / 2, c1y + cs / 2, cs * 0.72, r, r >= 1 ? COL.green : COL.blue, 7);
      const hl = r >= 1 ? 'Day 1 done' : 'Hold to complete', hw = K.measure(c, hl, 700, 17) + 36, hy = c1y + cs + 52;
      rr(c, c1x + cs / 2 - hw / 2, hy - 17, hw, 34, 17); c.fillStyle = COL.card; shadow(c, 'rgba(0,0,0,0.6)', 14, 3); c.fill(); noShadow(c);
      K.text(c, hl, c1x + cs / 2, hy + 1, { w: 700, s: 17, col: r >= 1 ? COL.green : COL.txt2, align: 'center' });
      c.restore();
    }
    K.burst(c, c1x + cs / 2, c1y + cs / 2, prog(t, HS.DONE1, 0.7), 14, 120, COL.green, 2, 4);

    c.restore();
    K.vignette(c, W, H, 0.5);
    K.grain(c, W, H, t);
  },
};
