// ============ 06 — LEVEL UP (the app) =====================================
// VO @ 01:28.10 → 01:36.58  "…built an app that does this for you. The app
// offers you points for the efforts you put in. You collect points, you level
// up. Just like a video game."
// Hero moment: four taps fill the XP bar → golden LEVEL UP 7 → 8 and the app's
// reward card pops. The one gold moment of the clip.
const LV = {
  TAPS: [2.5, 3.5, 4.25, 5.0],
  BAR: [0.40, 0.58, 0.67, 0.82, 1.0],
  UP: 5.95, CARD: 6.15, CLAIM: 7.7,
  CARDS: [
    { name: 'Morning run',      xp: '+30 XP', dim: COL.dim.body,  icon: 'pulse' },
    { name: 'Read 20 pages',    xp: '+15 XP', dim: COL.dim.mind,  icon: 'book' },
    { name: 'Deep work · 25m',  xp: '+25 XP', dim: COL.dim.focus, icon: 'target' },
    { name: 'Practice guitar',  xp: '+20 XP', dim: COL.dim.craft, icon: 'music' },
  ],
};

const SCENE = {
  meta: { title: 'Trick 06 — Level Up', w: 1080, h: 1920, fps: 60, duration: 8.48 },

  timeline: [
    { t: 0.0, label: '“built an app” — ⚡ mindkraft wordmark strikes in' },
    { t: 0.75, label: 'Phone rises; the wordmark flies into the app header' },
    { t: 1.35, label: 'Today’s activity cards cascade in' },
    { t: 2.5, label: '“offers you points” — tap: Morning run done, +30 XP flies to the bar' },
    { t: 3.5, label: '“for the efforts you put in” — two more completes (+15, +25)' },
    { t: 5.0, label: '“you collect points” — fourth complete; bar climbs to full' },
    { t: LV.UP, label: '“you level up” — golden LEVEL UP: 7 → 8, sparkle burst' },
    { t: LV.CARD, label: '“just like a video game” — the LEVEL UP! reward card pops' },
    { t: LV.CLAIM, label: 'Claim Reward tapped; hold' },
  ],

  cues: [
    { t: 0.0, s: 'zap' }, { t: 0.02, s: 'logoHit' },
    { t: 0.75, s: 'whooshUp' },
    ...[0, 1, 2, 3].map(i => ({ t: 1.35 + i * 0.1, s: 'cardPop', n: i })),
    ...LV.TAPS.flatMap((tt, i) => [
      { t: tt - 0.04, s: 'tap' }, { t: tt, s: 'coin', n: i }, { t: tt + 0.25, s: 'fillUp', n: i },
    ]),
    { t: 5.25, s: 'riser', dur: LV.UP - 5.25 },
    { t: LV.UP, s: 'levelUp' },
    { t: LV.CARD, s: 'cardIn' },
    { t: LV.CLAIM, s: 'tap' }, { t: LV.CLAIM + 0.03, s: 'claim' },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h;
    const up = t >= LV.UP, upP = prog(t, LV.UP, 1.0);
    sceneBg(c, W, H, upP);
    K.glow(c, 540, 900, 900, COL.gold, 0.14 * Math.sin(Math.PI * clamp(upP * 1.2, 0, 1)));

    // ---- phone ----
    const pw = 740, ph = 1500, px = (W - pw) / 2;
    const rise = E.outCubic(prog(t, 0.72, 0.8));
    const [shx, shy] = K.shake(t, LV.UP, 0.35, 8);
    const py = lerp(H + 60, 236, rise) + Math.sin(t * 1.1) * 6 + shy;
    const bz = pw * 0.035, sw = pw - bz * 2, sh = ph - bz * 2, sx = px + bz + shx, sy = py + bz;
    const pad = sw * 0.07, logoS = sw * 0.058, logoX = sx + pad, logoY = sy + sh * 0.075;

    // XP bar value from the taps
    let pct = LV.BAR[0];
    LV.TAPS.forEach((tt, i) => { if (t >= tt + 0.25) pct = tween(t, tt + 0.25, 0.5, LV.BAR[i], LV.BAR[i + 1], E.outCubic); });
    if (t >= LV.UP + 0.3) pct = tween(t, LV.UP + 0.3, 0.6, 0, 0.06);
    const lvl = up ? 8 : 7;

    if (rise > 0) phone(c, px + shx, py, pw, ph, (c, sx, sy, sw, sh) => {
      // header: wordmark (after it lands) + level
      if (t >= 1.5) mkLogo(c, sx + pad, sy + sh * 0.075, sw * 0.058, 'left');
      c.save();
      const lvlSize = sw * 0.058, lvlScale = up ? lerp(1.5, 1, E.outBack(prog(t, LV.UP, 0.6))) : 1;
      c.translate(sx + sw - pad, sy + sh * 0.078); c.scale(lvlScale, lvlScale);
      c.textAlign = 'right'; c.textBaseline = 'alphabetic';
      c.fillStyle = COL.txt3; c.font = fn(700, sw * 0.026); c.fillText('LVL', 0, -sw * 0.056);
      c.fillStyle = within(t, LV.UP, 0.9) ? COL.gold : COL.txt; c.font = fn(800, lvlSize);
      if (within(t, LV.UP, 0.9)) shadow(c, 'rgba(245,197,99,0.9)', 24);
      c.fillText(String(lvl), 0, 0);
      c.restore();

      // XP bar (flashes gold at the level-up)
      const barX = sx + pad, barY = sy + sh * 0.13, barW = sw - pad * 2, barH = sh * 0.012;
      xpBar(c, barX, barY, barW, barH, pct);
      const gf = prog(t, LV.UP - 0.05, 0.45);
      if (gf > 0 && gf < 1) { c.save(); c.globalAlpha = 1 - gf; rr(c, barX, barY, barW, barH, barH / 2); c.fillStyle = COL.gold; shadow(c, 'rgba(245,197,99,1)', 30); c.fill(); c.restore(); }
      K.text(c, up ? '120 / 2,000 XP' : Math.round(1000 * pct) + ' / 1,000 XP', barX, barY + barH + 34, { w: 600, s: sw * 0.03, col: COL.txt3 });

      K.text(c, 'T O D A Y', sx + pad, sy + sh * 0.215, { w: 700, s: sw * 0.028, col: COL.txt4 });

      const cw = sw - pad * 2, ch = sh * 0.108, gap = sh * 0.024, cx0 = sx + pad, cy0 = sy + sh * 0.245;
      LV.CARDS.forEach((cd, i) => {
        const a = prog(t, 1.35 + i * 0.1, 0.55);
        if (a <= 0) return;
        const cy = cy0 + i * (ch + gap) + lerp(40, 0, E.outBack(a));
        const tt = LV.TAPS[i], done = t >= tt;
        c.save(); c.globalAlpha = clamp(a * 1.6, 0, 1);
        K.activity(c, cx0, cy, cw, ch, { ...cd, done, k: prog(t, tt, 0.3), pulse: prog(t, tt, 0.36), fs: ch * 0.23 });
        c.restore();
        tapRipple(c, cx0 + cw - ch * 0.5, cy + ch / 2, prog(t, tt - 0.14, 0.5));
        const fp = prog(t, tt, 0.7);
        if (fp > 0 && fp < 1) {
          const fy = lerp(cy + ch / 2, barY + 20, E.outCubic(fp));
          K.text(c, cd.xp, cx0 + cw * 0.62, fy, { w: 800, s: sw * 0.06, col: COL.greenXp, align: 'center', alpha: 1 - fp * fp, glow: 'rgba(109,191,126,0.6)' });
        }
      });

      // streak chip row under the cards (static app context)
      const chy = cy0 + 4 * (ch + gap) + 16;
      if (t > 1.8) { c.save(); c.globalAlpha = prog(t, 1.8, 0.4); chip(c, sx + pad, chy, '12 day streak', 'streak', sw * 0.0026); c.restore(); }

      // bottom nav (Today active — the glowing indicator is the only active cue)
      const nvY = sy + sh * 0.905, na = prog(t, 1.4, 0.5);
      if (na > 0) {
        c.save(); c.globalAlpha = na;
        c.fillStyle = '#16171b'; c.fillRect(sx, nvY, sw, sh - (nvY - sy));
        c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(sx, nvY, sw, 1.5);
        ['check', 'users', 'trophy', 'calendar', 'trend'].forEach((ic, i) => {
          const nx = sx + sw * (0.1 + i * 0.2), ny = nvY + sh * 0.036;
          K.icon(c, ic, nx, ny, sw * 0.062, i ? COL.txt4 : COL.blue, { lw: 2.1, glow: i ? null : 'rgba(90,159,212,0.7)' });
          if (!i) indicator(c, nx, ny + sw * 0.058, sw * 0.12, COL.blue);
        });
        c.restore();
      }

      // level-up sparkle from the level number
      if (up) sparkleBurst(c, sx + sw - pad - lvlSize * 0.4, sy + sh * 0.06, prog(t, LV.UP, 0.9), 18, sw * 0.55);

      // scrim for the reward card
      const sc = prog(t, LV.CARD - 0.05, 0.35);
      if (sc > 0) { c.fillStyle = `rgba(8,8,10,${0.62 * sc})`; c.fillRect(sx, sy, sw, sh); }
    });

    // ---- the wordmark: strikes in at center, then flies into the header ----
    if (t < 1.5) {
      const s0 = 104, fly = E.inOutCubic(prog(t, 0.8, 0.7));
      const size = lerp(s0, logoS, fly);
      const tot = size * 1.35 + K.measure(c, 'mindkraft', 800, size);
      const lx = lerp(540 - tot / 2, logoX, fly), ly = lerp(930, logoY, fly);
      const ip = prog(t, -0.12, 0.45);
      c.save(); c.globalAlpha = clamp(ip * 1.5, 0, 1);
      const sc = lerp(0.86, 1, E.outBack(ip));
      c.translate(lx + tot / 2, ly); c.scale(sc, sc); c.translate(-(lx + tot / 2), -ly);
      K.glow(c, lx + tot / 2, ly - size * 0.35, size * 4, COL.blue, 0.22 * (1 - fly));
      mkLogo(c, lx, ly, size, 'left');
      c.restore();
    }
    K.flash(c, W, H, prog(t, 0, 0.35), '#cfe6ff', 0.25);

    // ---- LEVEL UP! reward card (the app's own celebration card) ----
    const cp = prog(t, LV.CARD, 0.5);
    if (cp > 0) {
      const cy = 980;
      K.levelCard(c, 540, cy, 600, cp, { title: 'Level 8 reached', desc: '+1 activity slot unlocked', cta: 'Claim Reward' });
      tapRipple(c, 540, cy - 600 * 0.45 + 600 * 0.9 * 0.78 + 600 * 0.07, prog(t, LV.CLAIM - 0.1, 0.5), COL.gold);
      if (t > LV.CARD + 0.1) sparkleBurst(c, 540, cy - 150, prog(t, LV.CARD + 0.1, 1.1), 22, 420);
    }
    K.flash(c, W, H, prog(t, LV.UP, 0.4), '#fff3d6', 0.3);

    K.vignette(c, W, H, 0.45);
    K.grain(c, W, H, t);
  },
};
