// ============ 09 — END CARD ===============================================
// VO @ 02:37.99 → 02:40.19  "Link for the app is in the bio, I'll see you soon."
// Runs ~1.8s past the last word so the video can end on it.
// Hero moment: the wordmark strikes in, the tagline echoes the title, and a
// "Link in bio" pill points up.
const SCENE = {
  meta: { title: 'Trick 09 — End Card', w: 1080, h: 1920, fps: 60, duration: 4.0 },

  timeline: [
    { t: 0.0, label: '⚡ mindkraft wordmark strikes in with a flash' },
    { t: 0.15, label: 'Glowing indicator underline draws beneath it' },
    { t: 0.55, label: 'Tagline: “Play a little trick on your brain.”' },
    { t: 1.0, label: '“Link… in the bio” — Link in bio pill pops, arrow nudges up' },
    { t: 2.2, label: '“see you soon” — hold and breathe to the end' },
  ],

  cues: [
    { t: 0.0, s: 'zap' }, { t: 0.02, s: 'logoHit' },
    { t: 0.15, s: 'shimmer' },
    { t: 1.0, s: 'chipPop' },
    { t: 1.45, s: 'nudge' }, { t: 2.25, s: 'nudge' },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h, D = this.meta.duration;
    sceneBg(c, W, H, prog(t, 0, 1.2));
    const breathe = 0.5 + 0.5 * Math.sin(t * 2.2);
    K.glow(c, 540, 820, 700, COL.blue, 0.16 + 0.05 * breathe);
    const z = lerp(1, 1.035, E.inOut(t / D));
    c.save(); c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);

    // wordmark
    const ip = prog(t, -0.1, 0.5), s = lerp(0.8, 1, E.outBack(ip));
    c.save(); c.globalAlpha = clamp(ip * 1.6, 0, 1);
    c.translate(540, 800); c.scale(s, s);
    mkLogo(c, 0, 0, 124, 'center');
    c.restore();
    // indicator primitive: the glowing underline
    const ul = E.outCubic(prog(t, 0.15, 0.6));
    if (ul > 0) indicator(c, 540, 850, 560 * ul, COL.blue);

    // tagline
    const tp = prog(t, 0.55, 0.5);
    K.text(c, 'Play a little trick on your brain.', 540, 950 + lerp(24, 0, E.outCubic(tp)), { w: 600, s: 44, col: COL.txt2, align: 'center', alpha: tp });

    // Link in bio pill + arrow
    const lp = prog(t, 1.0, 0.45);
    if (lp > 0) {
      const ls = lerp(0.6, 1, E.outBack(lp)), lbl = 'Link in bio', tw = K.measure(c, lbl, 700, 40);
      const pw = tw + 150, ph = 96, py = 1140;
      c.save(); c.globalAlpha = clamp(lp * 2, 0, 1); c.translate(540, py); c.scale(ls, ls);
      shadow(c, 'rgba(90,159,212,0.45)', 40);
      rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.fillStyle = COL.blueDk; c.fill(); noShadow(c);
      K.icon(c, 'link', -pw / 2 + 58, 0, 38, '#fff', { lw: 2.4 });
      K.text(c, lbl, -pw / 2 + 98, 2, { w: 700, s: 40 });
      c.restore();
      const nudge = [1.45, 2.25, 3.05].reduce((a, n) => a + Math.sin(Math.PI * prog(t, n, 0.4)), 0);
      K.icon(c, 'arrowUp', 540, py - 108 - 18 * nudge, 44, COL.blue, { lw: 2.6, alpha: clamp(lp * 2, 0, 1), glow: 'rgba(90,159,212,0.8)' });
    }
    c.restore();

    K.flash(c, W, H, prog(t, 0, 0.4), '#cfe6ff', 0.3);
    K.vignette(c, W, H, 0.5);
    K.grain(c, W, H, t);
  },
};
