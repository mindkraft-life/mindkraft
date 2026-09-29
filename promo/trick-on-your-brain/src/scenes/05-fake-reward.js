// ============ 05 — FAKE REWARD ============================================
// VO @ 01:18.74 → 01:23.94  "What if every time you put in some effort you
// got a fake reward?"
// Hero moment: a callback to clip 01's last frame — then the gap collapses.
// The reward rushes down to the effort, one tap unlocks it: +25 XP, instantly.
const SCENE = {
  meta: { title: 'Trick 05 — Fake Reward', w: 1080, h: 1920, fps: 60, duration: 5.2 },

  timeline: [
    { t: 0.0, label: 'Callback: clip 01’s end state — reward 4 years away' },
    { t: 0.55, label: '“What if every time…” — the reward rushes down; chip counts 2 years → instant' },
    { t: 1.95, label: 'Reward springs into place right above the effort' },
    { t: 2.08, label: '“effort” — tap: card completes, lock flies off, gift opens' },
    { t: 2.2, label: '+25 XP pops out (green) — reward, instantly' },
    { t: 3.3, label: '“fake reward” — glint across +25 XP; hold' },
  ],

  cues: [
    { t: 0.0, s: 'padHold' },
    { t: 0.55, s: 'suck', dur: 1.4 },
    { t: 0.85, s: 'tickUp', n: 0 }, { t: 1.1, s: 'tickUp', n: 1 }, { t: 1.35, s: 'tickUp', n: 2 }, { t: 1.6, s: 'tickUp', n: 3 },
    { t: 1.85, s: 'instant' },
    { t: 1.95, s: 'spring' },
    { t: 2.08, s: 'tap' },
    { t: 2.12, s: 'unlock' },
    { t: 2.2, s: 'coin', n: 0 },
    { t: 2.24, s: 'xpChime' },
    { t: 3.3, s: 'glint' },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h;
    sceneBg(c, W, H, prog(t, 2.1, 1.2) * 0.5);

    const cm = E.inOutCubic(prog(t, 0.5, 1.6));
    const z = lerp(1.22, 1.3, cm), pivot = lerp(880, 960, cm);
    c.save(); c.translate(W / 2, pivot + 20); c.scale(z, z); c.translate(-W / 2, -pivot);   // = clip 01's end framing at t=0

    const cardW = 800, cardH = 168, cardX = (W - cardW) / 2, cardY = 1150;
    const bs = 250;
    // reward: from far (y 330, scale .58) down to just above the card, with a spring
    const rp = E.outBack(prog(t, 0.55, 1.4), 1.25);
    const rY = lerp(330, 900, rp), rS = lerp(0.58, 1, clamp(rp, 0, 1.05));
    const open = t >= 2.12, op = prog(t, 2.12, 0.6);
    const trackTop = rY + (bs / 2 + 34) * rS, trackBot = cardY - 30;

    K.glow(c, 540, rY, 460 * rS, COL.gold, 0.09 + 0.14 * op);
    K.glow(c, 540, cardY + cardH / 2, 560, COL.blue, 0.11);
    K.glow(c, 540, (rY + cardY) / 2, 520, COL.green, 0.14 * op);

    // dotted track (shortens as they meet)
    if (trackBot - trackTop > 8) {
      c.save(); c.lineCap = 'round'; c.lineWidth = 7; c.strokeStyle = 'rgba(255,255,255,0.17)';
      c.setLineDash([0.1, 28]); c.lineDashOffset = t * 260;
      c.beginPath(); c.moveTo(540, trackBot); c.lineTo(540, trackTop); c.stroke(); c.restore();
    }

    // clip 01's sliver of effort progress, until the reward arrives
    const sl = 1 - prog(t, 1.9, 0.3);
    if (sl > 0) {
      c.save(); c.globalAlpha = sl; c.lineCap = 'round'; c.lineWidth = 9; c.strokeStyle = COL.blue;
      shadow(c, 'rgba(90,159,212,0.85)', 18);
      c.beginPath(); c.moveTo(540, trackBot); c.lineTo(540, Math.max(trackTop, trackBot - 68)); c.stroke(); c.restore();
    }

    // reward badge
    c.save(); c.globalAlpha = lerp(0.78, 1, clamp(rp, 0, 1));
    c.translate(540, rY);
    const gp = 1 + 0.12 * Math.sin(Math.PI * prog(t, 2.14, 0.35));
    c.scale(rS * gp, rS * gp);
    card(c, -bs / 2, -bs / 2, bs, bs, { r: 44 });
    K.glow(c, 0, -4, 160, COL.gold, 0.12 + 0.2 * op);
    K.icon(c, 'gift', 0, -6, 118, open ? COL.gold : K.hexA(COL.gold, 0.78), { lw: 1.7, glow: `rgba(245,197,99,${0.35 + 0.5 * op})`, blur: 22 + 20 * op });
    // lock badge: flies off once unlocked
    const fly = E.inQuad(prog(t, 2.16, 0.45));
    if (fly < 1) {
      c.save(); c.translate(bs / 2 - 30 + fly * 160, bs / 2 - 30 - fly * 120); c.rotate(fly * 1.4);
      c.globalAlpha *= 1 - fly;
      const lp = 1 + 0.3 * Math.sin(Math.PI * prog(t, 2.1, 0.2));
      c.scale(lp, lp);
      c.beginPath(); c.arc(0, 0, 46, 0, K.TAU); c.fillStyle = open ? COL.green : '#2d3037';
      shadow(c, 'rgba(0,0,0,0.5)', 18, 4); c.fill(); noShadow(c);
      K.icon(c, open ? 'unlock' : 'lock', 0, -1, 42, open ? '#0c1f12' : COL.txt, { lw: 2.3 });
      c.restore();
    }
    c.restore();
    K.text(c, 'REWARD', 540, rY - (bs / 2 + 52) * rS, { w: 800, s: 30, col: K.hexA(COL.gold, 0.9), align: 'center', track: 9, alpha: 1 - prog(t, 2.1, 0.15) });

    // effort card: tap → complete
    const done = t >= 2.1;
    K.activity(c, cardX, cardY, cardW, cardH, {
      name: 'Study session', xp: done ? '+25 XP' : 'no reward yet', dim: COL.dim.focus, icon: 'book',
      done, k: prog(t, 2.1, 0.3), pulse: prog(t, 2.1, 0.36),
    });
    K.text(c, 'EFFORT', 540, cardY + cardH + 66, { w: 800, s: 30, col: COL.blue, align: 'center', track: 9 });
    tapRipple(c, cardX + cardW - cardH * 0.5, cardY + cardH / 2, prog(t, 1.98, 0.5));

    // distance chip counting down to "Instant" (sits between them)
    const steps = [[0.85, '1 year away'], [1.1, '1 month away'], [1.35, '1 week away'], [1.6, '1 day away'], [1.85, 'Instant']];
    let label = '2 years away'; steps.forEach(([ct, l]) => { if (t >= ct) label = l; });
    if (t < 0.55) label = '4 years away';
    const inst = t >= 1.85, hot = t < 0.55;
    let s = hot ? 1.14 : inst ? lerp(1.35, 1.1, E.outBack(prog(t, 1.85, 0.4))) : 1;
    steps.forEach(([ct]) => s += 0.08 * Math.sin(Math.PI * prog(t, ct, 0.18)));
    const chipFade = 1 - prog(t, 2.18, 0.3);
    if (chipFade > 0) {
      const midY = (trackTop + trackBot) / 2 - (inst ? 0 : 40 * (1 - rp));
      const size = 32, tw = K.measure(c, label, 700, size), pw = tw + 112, ph = 70;
      const fg = inst ? COL.green : hot ? COL.amber : COL.txt2;
      c.save(); c.globalAlpha = chipFade; c.translate(540, midY); c.scale(s, s);
      shadow(c, 'rgba(0,0,0,0.55)', 26, 6);
      rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.fillStyle = inst ? '#1d3325' : hot ? '#3a3018' : COL.card; c.fill(); noShadow(c);
      if (hot || inst) { rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.lineWidth = 2; c.strokeStyle = K.hexA(fg, 0.55); c.stroke(); }
      K.icon(c, inst ? 'zap' : 'clock', -pw / 2 + 44, 0, 32, fg, { lw: 2.2, fill: inst });
      K.text(c, label, -pw / 2 + 76, 1, { w: 700, s: size, col: fg });
      c.restore();
    }

    // +25 XP bursts out of the gift
    K.burst(c, 540, rY, prog(t, 2.16, 0.8), 18, 260, COL.green, 5, 8);
    const xp = prog(t, 2.2, 0.55);
    if (xp > 0) {
      const xy = rY - lerp(0, 250, E.outBack(xp));
      const xs = lerp(0.4, 1, E.outBack(xp));
      c.save(); c.translate(540, xy); c.scale(xs, xs);
      K.text(c, '+25 XP', 0, 0, { w: 800, s: 120, col: COL.greenXp, align: 'center', glow: 'rgba(109,191,126,0.7)', blur: 30, alpha: clamp(xp * 2, 0, 1) });
      // glint on "fake reward"
      const gl = prog(t, 3.3, 0.55);
      if (gl > 0 && gl < 1) {
        const gx = lerp(-320, 320, gl), g = c.createLinearGradient(gx - 90, -60, gx + 90, 60);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        K.text(c, '+25 XP', 0, 0, { w: 800, s: 120, col: g, align: 'center' });
      }
      c.restore();
    }

    c.restore();
    K.vignette(c, W, H, 0.5);
    K.grain(c, W, H, t);
  },
};
