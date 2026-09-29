// ============ 01 — THE GAP ================================================
// VO @ 00:03.66 → 00:08.94  "…difficult things is because effort is almost
// always separated from reward."
// Hero moment: effort happens now, the reward recedes to "4 years away".
const SCENE = {
  meta: { title: 'Trick 01 — The Gap', w: 1080, h: 1920, fps: 60, duration: 5.28 },

  timeline: [
    { t: 0.0,  label: 'Effort card + a distant, locked reward compose; a dotted track links them' },
    { t: 0.55, label: 'Four taps of effort — each one pays back “+0”' },
    { t: 2.4,  label: 'The track stretches; the reward recedes: 1 week → 3 months → 1 year → 2 years' },
    { t: 3.76, label: '“separated from reward” — the chip slams to 4 YEARS AWAY' },
    { t: 4.4,  label: 'Hold on the gap' },
  ],

  // Sound events (read by tools/audio.py — same times as the motion)
  cues: [
    { t: 0.0,  s: 'swellIn' },
    { t: 0.55, s: 'tapDull' }, { t: 1.05, s: 'tapDull' }, { t: 1.55, s: 'tapDull' }, { t: 2.05, s: 'tapDull' },
    { t: 2.4,  s: 'stretch', dur: 1.36 },
    { t: 2.75, s: 'tick' }, { t: 3.1, s: 'tick' }, { t: 3.45, s: 'tick' },
    { t: 3.76, s: 'slam' },
    { t: 3.82, s: 'farBell' },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h, D = this.meta.duration;
    sceneBg(c, W, H, 0);

    const z = lerp(1.17, 1.22, t / D);                      // slow push-in
    c.save();
    c.translate(W / 2, 900); c.scale(z, z); c.translate(-W / 2, -880);
    const [sx, sy] = K.shake(t, 3.76, 0.35, 9);
    c.translate(sx, sy);

    // ---- layout ----
    const cardW = 800, cardH = 168, cardX = (W - cardW) / 2;
    const inP = prog(t, -0.2, 0.62);                       // already moving at frame 0
    const cardY = 1150 + lerp(70, 0, E.outBack(inP));
    const st = E.inOutCubic(prog(t, 2.4, 1.36));            // stretch 0..1
    const rS = lerp(1, 0.58, st);                           // reward shrinks into the distance
    const rY = lerp(590, 330, st);
    const rIn = prog(t, -0.15, 0.7);
    const bs = 250;
    const trackTop = rY + (bs / 2 + 34) * rS, trackBot = cardY - 30;

    K.glow(c, 540, rY, 460 * rS, COL.gold, 0.09 * rIn);
    K.glow(c, 540, cardY + cardH / 2, 560, COL.blue, 0.11);

    // ---- dotted track (dots stream upward while it stretches) ----
    const drawP = E.outCubic(prog(t, -0.05, 0.7));
    const top = lerp(trackBot, trackTop, drawP);
    c.save();
    c.lineCap = 'round'; c.lineWidth = 7; c.strokeStyle = 'rgba(255,255,255,0.17)';
    c.setLineDash([0.1, 28]); c.lineDashOffset = -st * 560;
    c.beginPath(); c.moveTo(540, trackBot); c.lineTo(540, top); c.stroke();
    c.restore();

    // ---- the sliver of progress effort buys ----
    const taps = [0.55, 1.05, 1.55, 2.05];
    let fill = 0; taps.forEach(tt => fill += tween(t, tt + 0.05, 0.35, 0, 17));
    if (fill > 0.5) {
      c.save(); c.lineCap = 'round'; c.lineWidth = 9; c.strokeStyle = COL.blue;
      shadow(c, 'rgba(90,159,212,0.85)', 18);
      c.beginPath(); c.moveTo(540, trackBot); c.lineTo(540, trackBot - fill); c.stroke();
      c.restore();
    }

    // ---- the reward: locked gift, far away ----
    const lockPop = 1 + 0.28 * Math.sin(Math.PI * prog(t, 3.76, 0.42));
    c.save();
    c.globalAlpha = rIn * lerp(1, 0.78, st);
    c.translate(540, rY);
    const rs = rS * lerp(0.82, 1, E.outBack(rIn));
    c.scale(rs, rs);
    card(c, -bs / 2, -bs / 2, bs, bs, { r: 44 });
    K.glow(c, 0, -4, 150, COL.gold, 0.12);
    K.icon(c, 'gift', 0, -6, 118, K.hexA(COL.gold, 0.78), { lw: 1.7, glow: 'rgba(245,197,99,0.35)', blur: 22 });
    c.save(); c.translate(bs / 2 - 30, bs / 2 - 30); c.scale(lockPop, lockPop);
    c.beginPath(); c.arc(0, 0, 46, 0, K.TAU); c.fillStyle = '#2d3037';
    shadow(c, 'rgba(0,0,0,0.5)', 18, 4); c.fill(); noShadow(c);
    K.icon(c, 'lock', 0, -1, 42, COL.txt, { lw: 2.3 });
    c.restore();
    c.restore();
    K.text(c, 'REWARD', 540, rY - (bs / 2 + 52) * rS, { w: 800, s: 30, col: K.hexA(COL.gold, 0.9), align: 'center', track: 9, alpha: rIn });

    // ---- the effort card ----
    let pulse = 0; taps.forEach(tt => { const p = prog(t, tt, 0.36); if (p > 0 && p < 1) pulse = p; });
    c.save(); c.globalAlpha = clamp(inP * 1.6, 0, 1);
    K.activity(c, cardX, cardY, cardW, cardH, { name: 'Study session', xp: 'no reward yet', dim: COL.dim.focus, icon: 'book', pulse });
    c.restore();
    K.text(c, 'EFFORT', 540, cardY + cardH + 66, { w: 800, s: 30, col: COL.blue, align: 'center', track: 9, alpha: inP });

    taps.forEach(tt => {
      tapRipple(c, cardX + cardW * 0.6, cardY + cardH / 2, prog(t, tt - 0.12, 0.5));
      const p = prog(t, tt, 0.85);
      if (p > 0 && p < 1) K.text(c, '+0', cardX + cardW * 0.6, cardY - 20 - E.outCubic(p) * 120,
        { w: 800, s: 50, col: COL.txt3, align: 'center', alpha: 1 - p * p });
    });

    // ---- distance chip (sits on the track, covers the dots behind it) ----
    const chipIn = prog(t, 0.3, 0.45);
    if (chipIn > 0) {
      const steps = [[2.75, '3 months away'], [3.1, '1 year away'], [3.45, '2 years away'], [3.76, '4 years away']];
      let label = '1 week away';
      steps.forEach(([ct, l]) => { if (t >= ct) label = l; });
      const hot = t >= 3.76;
      let s = hot ? lerp(1.5, 1.14, E.outBack(prog(t, 3.76, 0.5))) : lerp(0.7, 1, E.outBack(chipIn));
      steps.slice(0, 3).forEach(([ct]) => s += 0.09 * Math.sin(Math.PI * prog(t, ct, 0.2)));
      const midY = (trackTop + trackBot) / 2 - 40;
      const size = 32, tw = K.measure(c, label, 700, size), pw = tw + 112, ph = 70;
      c.save(); c.globalAlpha = chipIn; c.translate(540, midY); c.scale(s, s);
      shadow(c, 'rgba(0,0,0,0.55)', 26, 6);
      rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.fillStyle = hot ? '#3a3018' : COL.card; c.fill(); noShadow(c);
      if (hot) { rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.lineWidth = 2; c.strokeStyle = K.hexA(COL.amber, 0.55); c.stroke(); }
      K.icon(c, 'clock', -pw / 2 + 44, 0, 32, hot ? COL.amber : COL.txt2, { lw: 2.2 });
      K.text(c, label, -pw / 2 + 76, 1, { w: 700, s: size, col: hot ? COL.amber : COL.txt2 });
      c.restore();
      if (hot) K.glow(c, 540, midY, 300, COL.amber, 0.16 * (1 - prog(t, 3.76, 0.9)));
    }

    c.restore();
    K.vignette(c, W, H, 0.5);
    K.grain(c, W, H, t);
  },
};
