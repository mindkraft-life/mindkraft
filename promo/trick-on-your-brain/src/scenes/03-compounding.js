// ============ 03 — COMPOUNDING ============================================
// VO @ 00:33.13 → 00:41.29  "If you're not born with it, then you have to
// systematically, with discipline, invest for years before compounding starts
// to kick in."
// Hero moment: yearly bars are almost all deposits (blue) for years — then the
// growth (green) takes over and the chart rockets.
const CP = (() => {
  const YRS = 30, DEP = 2400, R = 0.1;
  const total = y => DEP * ((Math.pow(1 + R, y) - 1) / R);
  const at = y => y <= 12 ? 1.28 + (y - 1) * 0.353      // steady: one deposit per beat
               : y <= 22 ? 5.52 + (y - 13) * 0.17       // years blur by
               : 7.28 + (y - 23) * 0.05;                // kick-in: the rest rockets in
  return { YRS, DEP, total, at, KICK: 7.28 };
})();

const SCENE = {
  meta: { title: 'Trick 03 — Compounding', w: 1080, h: 1920, fps: 60, duration: 8.16 },

  timeline: [
    { t: 0.0, label: 'Portfolio card composes at $0' },
    { t: 1.28, label: '“systematically, with discipline” — one +$2,400 deposit per beat' },
    { t: 5.52, label: '“for years before compounding” — years blur by, chart zooms out' },
    { t: CP.KICK, label: '“kick in” — growth (green) takes over, the chart rockets' },
    { t: 7.7, label: 'COMPOUNDING chip lands; hold' },
  ],

  cues: [
    { t: 0.0, s: 'popIn' },
    ...Array.from({ length: 22 }, (_, i) => ({ t: CP.at(i + 1), s: 'deposit', n: i })),
    { t: 5.52, s: 'riser', dur: 1.76 },
    { t: CP.KICK, s: 'impact' },
    { t: CP.KICK, s: 'rocket', dur: 0.45 },
    { t: 7.7, s: 'chipPop' },
  ],

  draw(c, t) {
    const W = this.meta.w, H = this.meta.h;
    const kick = prog(t, CP.KICK, 0.5);
    sceneBg(c, W, H, kick * 0.5);
    const [shx, shy] = K.shake(t, CP.KICK, 0.4, 10);
    c.save(); c.translate(shx, shy);

    const inP = prog(t, -0.18, 0.55);
    const x = 70, w = 940, y = 470 + lerp(80, 0, E.outBack(inP)), h = 900;
    K.glow(c, 540, y + h * 0.6, 720, COL.green, 0.04 + 0.12 * kick);
    K.glow(c, 540, y + h * 0.4, 700, COL.blue, 0.10);
    c.save(); c.globalAlpha = clamp(inP * 1.5, 0, 1);
    card(c, x, y, w, h, { r: 36 });

    // ---- header: kicker, value counter, plan ----
    let shown = 0, contrib = 0;
    for (let yr = 1; yr <= CP.YRS; yr++) {
      const p = prog(t, CP.at(yr), 0.22);
      if (p <= 0) break;
      shown = yr - 1 + p;
    }
    const whole = Math.floor(shown), part = shown - whole;
    const val = whole > 0 ? lerp(CP.total(whole), CP.total(whole + 1), part) : CP.total(1) * part;
    contrib = CP.DEP * shown;
    K.text(c, 'PORTFOLIO', x + 60, y + 78, { w: 800, s: 28, col: COL.txt4, track: 8 });
    const vs = 1 + 0.08 * Math.sin(Math.PI * kick);
    c.save(); c.translate(x + 60, y + 178); c.scale(vs, vs);
    K.text(c, '$' + K.fmtN(val), 0, 0, { w: 800, s: 112, col: t >= CP.KICK ? COL.green : COL.txt, glow: t >= CP.KICK ? 'rgba(74,222,128,0.45)' : null });
    c.restore();
    K.text(c, '$200 / month  ·  year ' + Math.max(1, Math.ceil(shown)), x + 62, y + 262, { w: 600, s: 30, col: COL.txt3 });

    // ---- chart ----
    const cx0 = x + 60, cx1 = x + w - 60, cy1 = y + h - 110, cy0 = y + 340;
    const cw = cx1 - cx0, ch = cy1 - cy0;
    // axes zoom out as years accumulate
    const ymax = t < 5.52 ? 60000 : t < CP.KICK ? tween(t, 5.52, 1.7, 60000, 175000, E.inOut) : tween(t, CP.KICK, 0.55, 175000, 420000, E.outCubic);
    const nSlots = t < 5.52 ? 12 : t < CP.KICK ? tween(t, 5.52, 1.7, 12, 22, E.inOut) : tween(t, CP.KICK, 0.4, 22, 30, E.outCubic);
    // gridlines
    c.save(); c.strokeStyle = 'rgba(255,255,255,0.05)'; c.lineWidth = 2;
    for (let i = 1; i <= 3; i++) { const gy = cy1 - ch * i / 4; c.beginPath(); c.moveTo(cx0, gy); c.lineTo(cx1, gy); c.stroke(); }
    c.restore();
    const slot = cw / nSlots, bw = slot * 0.64;
    const tops = [];
    for (let yr = 1; yr <= CP.YRS; yr++) {
      const p = prog(t, CP.at(yr), 0.28);
      if (p <= 0) break;
      const e = E.outBack(p);
      const bx = cx0 + (yr - 0.5) * slot - bw / 2;
      const tot = CP.total(yr), dep = CP.DEP * yr;
      const hT = Math.min(ch * 1.25, (tot / ymax) * ch) * e, hD = Math.min(hT, (dep / ymax) * ch * e);
      // deposits (blue) at the base, growth (green) stacked on top
      rr(c, bx, cy1 - hD, bw, hD, Math.min(8, bw / 3)); c.fillStyle = COL.blueDk; c.fill();
      if (hT - hD > 1) {
        rr(c, bx, cy1 - hT, bw, hT - hD + 4, Math.min(8, bw / 3));
        c.fillStyle = COL.green; if (t >= CP.KICK) shadow(c, 'rgba(74,222,128,0.5)', 14); c.fill(); noShadow(c);
      }
      tops.push([bx + bw / 2, cy1 - hT]);
      // +$2,400 floaters for the steady years
      if (yr <= 12) {
        const fp = prog(t, CP.at(yr), 0.34);
        if (fp > 0 && fp < 1) K.text(c, '+$2,400', bx + bw / 2, cy1 - hT - 30 - E.outCubic(fp) * 60, { w: 800, s: 30, col: COL.blue, align: 'center', alpha: 1 - fp });
      }
    }
    // growth curve over the tops once compounding kicks in
    if (kick > 0 && tops.length > 1) {
      c.save(); c.globalAlpha = kick; c.lineWidth = 6; c.lineJoin = 'round'; c.lineCap = 'round';
      c.strokeStyle = COL.green; shadow(c, 'rgba(74,222,128,0.9)', 22);
      c.beginPath(); tops.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke();
      c.restore();
    }
    // baseline + legend
    c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(cx0, cy1, cw, 2);
    const ly = cy1 + 58;
    rr(c, cx0, ly - 12, 24, 24, 6); c.fillStyle = COL.blueDk; c.fill();
    K.text(c, 'What you put in', cx0 + 38, ly, { w: 600, s: 28, col: COL.txt2 });
    rr(c, cx0 + 330, ly - 12, 24, 24, 6); c.fillStyle = COL.green; c.fill();
    K.text(c, 'Growth', cx0 + 368, ly, { w: 600, s: 28, col: COL.txt2 });
    c.restore();

    // ---- COMPOUNDING chip ----
    const cp = prog(t, 7.7, 0.45);
    if (cp > 0) {
      const s = lerp(0.6, 1, E.outBack(cp)), lbl = 'COMPOUNDING', tw = K.measure(c, lbl, 800, 30, 6);
      const pw = tw + 110, ph = 70, px = x + w - 60 - pw / 2, py = y + 80;
      c.save(); c.globalAlpha = clamp(cp * 2, 0, 1); c.translate(px, py); c.scale(s, s);
      rr(c, -pw / 2, -ph / 2, pw, ph, ph / 2); c.fillStyle = 'rgba(74,222,128,0.14)'; c.fill();
      K.icon(c, 'trend', -pw / 2 + 46, 0, 32, COL.green, { lw: 2.4 });
      K.text(c, lbl, -pw / 2 + 78, 1, { w: 800, s: 30, col: COL.green, track: 6 });
      c.restore();
    }
    K.flash(c, W, H, prog(t, CP.KICK, 0.4), '#bff5d0', 0.22);

    c.restore();
    K.vignette(c, W, H, 0.5);
    K.grain(c, W, H, t);
  },
};
