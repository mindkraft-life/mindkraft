// ============ 02 — FOUR YEARS =============================================
// VO @ 00:12.14 → 00:15.98  "A college degree, you have to study four years
// before you graduate."
// Hero moment: a day counter grinds from Day 1 to Day 1,460 before the
// reward's lock finally opens.
const Q = (() => {
  const T0 = 0.75, TD = 2.45, KX = 3.2;                 // counting window + curve steepness
  const frac = u => (Math.exp(KX * u) - 1) / (Math.exp(KX) - 1);
  const inv = f => Math.log(1 + (Math.exp(KX) - 1) * f) / KX;
  const days = t => 1 + 1459 * frac(prog(t, T0, TD));
  const yearAt = y => T0 + TD * inv((y * 365 - 1) / 1459);  // time the counter crosses year y
  return { T0, TD, days, yearAt, UNLOCK: T0 + TD + 0.04 };
})();

const SCENE = {
  meta: { title: 'Trick 02 — Four Years', w: 1080, h: 1920, fps: 60, duration: 3.84 },

  timeline: [
    { t: 0.0, label: 'Quest card lands: “College Degree”, Day 1, reward locked' },
    { t: Q.T0, label: '“you have to study” — the day counter starts grinding, slow then faster' },
    { t: Q.yearAt(1), label: 'Year 1 stamps in' },
    { t: Q.yearAt(4), label: 'Year 4 — Day 1,460' },
    { t: Q.UNLOCK, label: '“graduate” — the lock finally opens (small, late reward)' },
  ],

  cues: [
    { t: 0.0, s: 'popIn' },
    { t: Q.T0, s: 'accelTicks', dur: Q.TD },
    ...[1, 2, 3, 4].map(y => ({ t: Q.yearAt(y), s: 'stamp', n: y })),
    { t: Q.UNLOCK, s: 'unlock' },
    { t: Q.UNLOCK + 0.06, s: 'chimeSmall' },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h, D = this.meta.duration;
    sceneBg(c, W, H, 0);
    const z = lerp(1.04, 1.1, E.inOut(t / D));
    c.save(); c.translate(W / 2, 880); c.scale(z, z); c.translate(-W / 2, -880);

    const inP = prog(t, -0.18, 0.55);
    const x = 80, w = 920, h = 690, y = 590 + lerp(80, 0, E.outBack(inP));
    K.glow(c, 540, y + h / 2, 700, COL.blue, 0.10);
    c.save(); c.globalAlpha = clamp(inP * 1.5, 0, 1);

    K.text(c, 'QUEST', x + 8, y - 52, { w: 800, s: 30, col: COL.txt4, track: 9 });
    card(c, x, y, w, h, { r: 36, dim: COL.dim.focus });

    // title row: cap tile + name + reward tile
    const ts = 104;
    rr(c, x + 56, y + 56, ts, ts, 30); c.fillStyle = K.hexA(COL.blue, 0.16); c.fill();
    K.icon(c, 'cap', x + 56 + ts / 2, y + 56 + ts / 2, 58, COL.blue, { lw: 2 });
    K.text(c, 'College Degree', x + 56 + ts + 32, y + 90, { w: 700, s: 50 });
    K.text(c, 'Study  →  Graduate', x + 56 + ts + 32, y + 138, { w: 500, s: 30, col: COL.txt3 });

    // reward tile (top-right): locked until the very end
    const unl = prog(t, Q.UNLOCK, 0.5), open = t >= Q.UNLOCK;
    const rx = x + w - 56 - ts / 2, ry = y + 56 + ts / 2;
    rr(c, rx - ts / 2, ry - ts / 2, ts, ts, 30); c.fillStyle = open ? K.hexA(COL.gold, 0.16) : 'rgba(255,255,255,0.04)'; c.fill();
    K.icon(c, 'gift', rx, ry, 56, open ? COL.gold : K.hexA(COL.gold, 0.45), { lw: 1.9, glow: open ? 'rgba(245,197,99,0.8)' : null, blur: 26 * (1 - unl * 0.5) });
    const lp = 1 + 0.35 * Math.sin(Math.PI * unl);
    c.save(); c.translate(rx + ts / 2 - 8, ry + ts / 2 - 8); c.scale(lp, lp);
    c.beginPath(); c.arc(0, 0, 26, 0, K.TAU); c.fillStyle = open ? COL.green : '#30333a'; c.fill();
    K.icon(c, open ? 'unlock' : 'lock', 0, -1, 26, open ? '#0c1f12' : COL.txt2, { lw: 2.6 });
    c.restore();
    K.burst(c, rx, ry, prog(t, Q.UNLOCK, 0.7), 12, 130, COL.green, 3, 6);

    // the grind: day counter
    const d = Q.days(t);
    const dayTxt = 'Day ' + K.fmtN(Math.floor(d));
    const bump = [1, 2, 3, 4].reduce((a, yy) => a + 0.06 * Math.sin(Math.PI * prog(t, Q.yearAt(yy), 0.18)), 0);
    c.save(); c.translate(540, y + 330); c.scale(1 + bump, 1 + bump);
    K.text(c, dayTxt, 0, 0, { w: 800, s: 150, align: 'center', col: t >= Q.yearAt(4) ? COL.txt : COL.txt });
    c.restore();
    K.text(c, 'of 1,460', 540, y + 430, { w: 600, s: 32, col: COL.txt3, align: 'center' });

    // four year segments
    const sx = x + 60, sw = w - 120, gap = 16, segW = (sw - gap * 3) / 4, segY = y + 505, segH = 26;
    for (let i = 0; i < 4; i++) {
      const fx = sx + i * (segW + gap);
      const f = clamp(d / 365 - i, 0, 1);
      rr(c, fx, segY, segW, segH, segH / 2); c.fillStyle = COL.track; c.fill();
      if (f > 0.01) {
        rr(c, fx, segY, segW * f, segH, segH / 2);
        const g = c.createLinearGradient(fx, 0, fx + segW, 0); g.addColorStop(0, COL.blueDk); g.addColorStop(1, COL.blue);
        c.fillStyle = g; shadow(c, 'rgba(90,159,212,0.55)', 16); c.fill(); noShadow(c);
      }
      const hit = prog(t, Q.yearAt(i + 1), 0.5);
      if (hit > 0 && hit < 1) { c.save(); c.globalAlpha = 1 - hit; rr(c, fx - 4, segY - 4, segW + 8, segH + 8, segH); c.strokeStyle = '#fff'; c.lineWidth = 3; c.stroke(); c.restore(); }
      K.text(c, 'YEAR ' + (i + 1), fx + segW / 2, segY + 70, { w: 700, s: 24, col: f >= 1 ? COL.txt : COL.txt4, align: 'center', track: 4 });
    }

    // footer: reward status
    const fy = y + h - 58;
    K.text(c, open ? 'Reward unlocked' : 'Reward: locked until graduation', 540, fy, { w: 600, s: 30, col: open ? COL.green : COL.txt3, align: 'center' });
    c.restore();

    c.restore();
    K.vignette(c, W, H, 0.5);
    K.grain(c, W, H, t);
  },
};
