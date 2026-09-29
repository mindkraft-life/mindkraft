// ============ 04 — DOPAMINE FEED ==========================================
// VO @ 00:56.49 → 01:05.85  "10 minute deliveries, social media algorithms,
// everything is trying to give you rewards as quickly as possible. It's all
// about the dopamine hits."
// Hero moment: notifications accelerate into a flood, the DOPAMINE meter
// redlines — then the whole feed tape-stops into grey (hand-off to "slow and boring").
const DF = (() => {
  const T = [0.0, 0.5, 1.1, 1.5, 1.9, 2.3, 2.62];
  let t = 2.95, iv = 0.3;
  while (t < 7.12) { T.push(+t.toFixed(3)); t += iv; iv = Math.max(0.075, iv * 0.9); }
  t = 7.12;
  while (t < 8.66) { T.push(+t.toFixed(3)); t += 0.055; }
  const POOL = [
    { icon: 'bag',      col: COL.amber, title: 'Order on the way',       sub: 'Arriving in 10 min' },
    { icon: 'bag',      col: COL.amber, title: 'Rider is 2 min away',    sub: 'Get ready at the door' },
    { icon: 'heart',    col: COL.red,   title: '248 new likes',          sub: 'Your post is blowing up', fill: true },
    { icon: 'userPlus', col: COL.blue,  title: 'New follower',           sub: '…and 12 others' },
    { icon: 'play',     col: COL.red,   title: 'Up next in 3…',          sub: 'Autoplay is on', fill: true },
    { icon: 'chat',     col: COL.blue,  title: '3 new messages',         sub: 'Tap to reply' },
    { icon: 'tag',      col: COL.amber, title: 'Flash sale · 90% off',   sub: 'Ends in 09:59' },
    { icon: 'trend',    col: COL.blue,  title: 'Trending now',           sub: 'You won’t believe #4' },
    { icon: 'heart',    col: COL.red,   title: '1,204 likes',            sub: 'Your video is trending', fill: true },
    { icon: 'star',     col: COL.amber, title: 'You earned a badge',     sub: 'Keep scrolling!' },
    { icon: 'bell',     col: COL.blue,  title: 'Someone mentioned you',  sub: 'Just now' },
    { icon: 'bag',      col: COL.amber, title: 'Still in your cart',     sub: 'Selling fast' },
    { icon: 'play',     col: COL.red,   title: 'Because you watched…',   sub: '12 new picks', fill: true },
  ];
  const item = i => i < 7 ? POOL[i] : POOL[Math.floor(K.hash(i, 4) * POOL.length)];
  return { T, item, FLOOD: 7.12, COLLAPSE: 8.7 };
})();

const SCENE = {
  meta: { title: 'Trick 04 — Dopamine Feed', w: 1080, h: 1920, fps: 60, duration: 9.36 },

  timeline: [
    { t: 0.0, label: '“10 minute deliveries” — delivery pings land; DOPAMINE meter wakes up' },
    { t: 1.04, label: '“social media algorithms” — likes, follows, autoplay' },
    { t: 2.8, label: '“everything… as quickly as possible” — pings accelerate' },
    { t: DF.FLOOD, label: '“dopamine hits” — flood; meter redlines at MAX' },
    { t: DF.COLLAPSE, label: 'Tape-stop: the feed freezes, glitches and drains to grey' },
  ],

  cues: [
    ...DF.T.map((t, i) => ({ t, s: 'notif', n: i, kind: DF.item(i).icon })),
    { t: 2.8, s: 'riser', dur: DF.FLOOD - 2.8 },
    { t: DF.FLOOD, s: 'drop' },
    { t: DF.COLLAPSE, s: 'tapeStop', dur: 0.56 },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h;
    const u = prog(t, DF.COLLAPSE, 0.6);
    const tt = t < DF.COLLAPSE ? t : DF.COLLAPSE + 0.22 * (1 - Math.pow(1 - u, 3));   // time slows to a stop
    const flood = prog(tt, DF.FLOOD, 1.2);
    sceneBg(c, W, H, 0);
    K.glow(c, 540, 300, 900, COL.red, 0.05 + 0.20 * flood + 0.05 * Math.sin(tt * 18) * flood);

    // sustained shake that grows through the flood
    const f = Math.floor(tt * 60), amp = 7 * flood;
    c.save();
    c.translate((K.hash(f, 3) - 0.5) * 2 * amp, (K.hash(f, 5) - 0.5) * 2 * amp + 90 * E.inQuad(u));

    // ---- the notification stack (newest on top, pushes the rest down) ----
    const x = 80, w = 920, h = 150, step = 168, y0 = 520;
    const n = DF.T.length;
    for (let i = n - 1; i >= 0; i--) {
      const Ti = DF.T[i];
      if (tt < Ti) continue;
      let y = y0;
      for (let j = i + 1; j < n && DF.T[j] <= tt; j++) y += E.outCubic(prog(tt, DF.T[j], 0.2)) * step;
      if (y > H + 40) continue;
      const e = prog(tt, Ti, 0.26);
      y += lerp(-130, 0, E.outBack(e));
      c.save(); c.globalAlpha = clamp(e * 2.2, 0, 1) * clamp(1 - (y - 1350) / 700, 0.25, 1);
      const it = DF.item(i);
      K.notif(c, x, y, w, h, { icon: it.icon, col: it.col, title: it.title, sub: it.sub, time: 'now', fillIcon: it.fill });
      c.restore();
    }

    // ---- DOPAMINE meter ----
    let d = 0.1 + 0.45 * prog(tt, 0, DF.FLOOD);
    for (const Ti of DF.T) if (Ti <= tt) d += 0.1 * Math.exp(-(tt - Ti) * 4);
    d = clamp(d, 0, 1) * (1 - E.outCubic(u));
    const maxed = d >= 0.999;
    c.save();
    shadow(c, 'rgba(0,0,0,0.6)', 30, 8);
    rr(c, 60, 250, 960, 190, 36); c.fillStyle = '#17181c'; c.fill(); noShadow(c);
    c.restore();
    K.text(c, 'DOPAMINE', 110, 310, { w: 800, s: 30, col: COL.txt3, track: 9 });
    K.text(c, maxed ? 'MAX' : Math.round(d * 100) + '%', 970, 312, { w: 800, s: 48, align: 'right', col: maxed ? COL.red : d > 0.7 ? COL.amber : COL.txt, glow: maxed ? 'rgba(194,106,122,0.9)' : null });
    const bx = 110, by = 370, bw = 860, bh = 28;
    rr(c, bx, by, bw, bh, bh / 2); c.fillStyle = COL.track; c.fill();
    if (d > 0.01) {
      rr(c, bx, by, bw * d, bh, bh / 2);
      const g = c.createLinearGradient(bx, 0, bx + bw, 0);
      g.addColorStop(0, COL.amber); g.addColorStop(0.75, COL.coral); g.addColorStop(1, COL.red);
      c.fillStyle = g; shadow(c, maxed ? 'rgba(194,106,122,1)' : 'rgba(251,146,60,0.6)', maxed ? 34 : 18); c.fill(); noShadow(c);
    }
    c.restore();

    // ---- tape-stop collapse: glitch slices, desaturate, darken ----
    if (u > 0) {
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
      for (let k = 0; k < 7; k++) {
        const bh2 = 30 + K.hash(k, 11) * 120, by2 = K.hash(k + Math.floor(u * 6), 13) * (H - bh2);
        const dx = (K.hash(k, 17) - 0.5) * 160 * Math.sin(Math.PI * u);
        c.drawImage(c.canvas, 0, by2, W, bh2, dx, by2, W, bh2);
      }
      c.globalCompositeOperation = 'saturation'; c.globalAlpha = clamp(u * 1.6, 0, 1);
      c.fillStyle = '#808080'; c.fillRect(0, 0, W, H);
      c.globalCompositeOperation = 'source-over'; c.globalAlpha = E.inQuad(u) * 0.8;
      c.fillStyle = '#0b0b0c'; c.fillRect(0, 0, W, H);
      c.restore();
    }
    K.vignette(c, W, H, 0.55);
    K.grain(c, W, H, t);
  },
};
