// ════════════════════════════════════════════════════════════════════════
// S2–S6 · THE ARC
// S2  7.20 → 12.48  "In storytelling, an arc is the journey that changes a
//                    character from within."         — the arc draws itself
// S3 12.48 → 16.96  "…the character never sees their own arc."
//                                                    — camera dives to the
//                                                      character, fog closes
// S4 16.96 → 22.71  "one day at a time, one scene at once, moving from one
//                    data point to another."         — day by day, dot by dot
// S5 22.71 → 28.95  "Only the audience sees the arc … over a long period of
//                    time."                          — pull back: XP Over Time
// S6 28.95 → 35.10  "…be both the character and the audience."
// Tabs 31.0 → 47.2  Character | Audience — the indicator primitive
// ════════════════════════════════════════════════════════════════════════
import { W, H, clamp, lerp, prog, E, tw, kf, env, pulse, rnd, rndr, noise1, h, css, show, fmt, hiCanvas, clearCanvas } from './engine.js';
import { COL, activityCard, chartCard, drawChart, tabPair, ripple, floatXP, burst } from './components.js';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// The character: the app's avatar button with a level readout above it.
function token() {
  const el = h('div', 'mk-token', `
    <div class="mk-lvlwrap"><div class="level-badge"><span class="level-label">Level</span>
      <div class="level-display"><svg class="level-svg" width="80" height="50" overflow="visible" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="tokGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="30%" stop-color="var(--color-text-primary)"/><stop offset="100%" stop-color="var(--color-progress)"/></linearGradient></defs>
        <text class="level-svg-text level-svg-fill mk-n" x="40" y="42" text-anchor="middle" style="fill:url(#tokGrad)">1</text>
        <text class="level-svg-text level-svg-trace mk-tr" x="40" y="42" text-anchor="middle">1</text></svg></div></div></div>
    <button class="profile-avatar-btn mk-av"><i class="ph-fill ph-user" style="font-size:20px;color:var(--color-text-secondary)"></i></button>
    <i class="ph-bold ph-eye-slash mk-eye" style="position:absolute;left:30px;top:-34px;font-size:22px;color:rgba(255,255,255,0.55)"></i>`);
  const r = { el, n: el.querySelector('.mk-n'), tr: el.querySelector('.mk-tr'), av: el.querySelector('.mk-av'), lvl: el.querySelector('.mk-lvlwrap'), eye: el.querySelector('.mk-eye') };
  r.setLevel = (L) => { const s = String(L); if (r.n.textContent !== s) { r.n.textContent = s; r.tr.textContent = s; } };
  r.setTrace = (p) => {
    const off = p < 0.6 ? lerp(600, 0, E.inOutSine(p / 0.6)) : lerp(0, -600, E.inSine((p - 0.6) / 0.4));
    css(r.tr, { strokeDashoffset: off.toFixed(1), opacity: (p <= 0 || p >= 1 ? 0 : Math.min(1, p * 12, (1 - p) * 6)).toFixed(3) });
  };
  return r;
}

// One year of a real-looking habit history: inconsistent at first, then the
// streak multipliers and more habits compound. Cumulative XP bends upward.
function yearData() {
  const pts = []; let v = 0;
  for (let d = 0; d < 365; d++) {
    const ramp = 1 / (1 + Math.exp(-(d - 215) / 48));
    const skip = rnd(d * 1.37 + 500) < 0.42 * (1 - d / 330);
    const daily = skip ? 0 : Math.round((22 + 158 * ramp) * rndr(d * 2.11 + 7, 0.72, 1.22));
    v += daily; pts.push({ x: d, v });
  }
  return pts;
}

export function sceneArc(C, fx) {
  const out = [];

  // ═══ S2 + S3: the conceptual arc ═══════════════════════════════════════
  {
    const el = h('div', 'scene');
    const giant = h('div', 'kt', 'ARC', 'left:0;width:432px;text-align:center;top:178px;font-size:172px;font-weight:900;letter-spacing:-0.05em;color:transparent;-webkit-text-stroke:1.2px rgba(255,255,255,0.07);');
    el.appendChild(giant);
    const cv = hiCanvas(W, H, 'abs'); el.appendChild(cv);
    const kick = h('div', 'kicker', 'In storytelling', 'left:0;width:432px;text-align:center;top:118px;');
    el.appendChild(kick);
    const tok = token(); el.appendChild(tok.el);
    const fog = h('div', 'layer'); el.appendChild(fog);
    const P0 = [64, 470], C1 = [236, 472], C2 = [334, 372], P1 = [378, 140];
    const B = (s) => { const u = 1 - s; return [0, 1].map(i => u * u * u * P0[i] + 3 * u * u * s * C1[i] + 3 * u * s * s * C2[i] + s * s * s * P1[i]); };
    const Bd = (s) => { const u = 1 - s; return [0, 1].map(i => 3 * u * u * (C1[i] - P0[i]) + 6 * u * s * (C2[i] - C1[i]) + 3 * s * s * (P1[i] - C2[i])); };
    const endAng = Math.atan2(Bd(1)[1], Bd(1)[0]);
    const T = [216, 372];
    out.push({
      t0: C.storytelling, t1: C.theyLive + 0.45, el,
      update(t) {
        const ctx = cv.ctx; clearCanvas(cv);
        const draw = E.inOutSine(prog(t, C.anArc + 0.1, C.within - C.anArc - 0.15));
        // camera: still → dive to the character and roll the arc flat
        const dv = E.inOutCubic(prog(t, C.butTake, 1.85));
        const push = 1 + 0.04 * prog(t, C.storytelling, 5);
        const s = lerp(push, 3.6, dv), rot = lerp(0, -endAng * 0.92, dv);
        const head = B(draw);
        const F = [lerp(216, P1[0], dv), lerp(330, P1[1], dv)], Tt = [lerp(216, T[0], dv), lerp(330, T[1], dv)];
        const toS = ([x, y]) => { const X = (x - F[0]) * s, Y = (y - F[1]) * s, c = Math.cos(rot), n = Math.sin(rot); return [Tt[0] + X * c - Y * n, Tt[1] + X * n + Y * c]; };
        ctx.save();
        ctx.translate(Tt[0], Tt[1]); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-F[0], -F[1]);
        const k = 1 / s;
        // faint chart grid
        const ga = env(t, C.anArc - 0.3, C.theyLive + 0.5, 0.8, 0.4) * 0.9;
        ctx.strokeStyle = `rgba(255,255,255,${0.05 * ga})`; ctx.lineWidth = k;
        for (let i = 0; i <= 4; i++) { const y = 140 + i * 82.5; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(400, y); ctx.stroke(); }
        if (draw > 0) {
          const N = 90, pts = []; for (let i = 0; i <= N; i++) pts.push(B(draw * i / N));
          const g = ctx.createLinearGradient(0, 140, 0, 470); g.addColorStop(0, 'rgba(74,124,158,0.35)'); g.addColorStop(1, 'rgba(74,124,158,0)');
          ctx.beginPath(); ctx.moveTo(pts[0][0], 470); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[N][0], 470); ctx.closePath(); ctx.fillStyle = g; ctx.globalAlpha = 1 - 0.7 * dv; ctx.fill(); ctx.globalAlpha = 1;
          const path = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); pts.forEach(p => ctx.lineTo(p[0], p[1])); };
          ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = COL.blue;
          path(); ctx.lineWidth = 12 * k; ctx.globalAlpha = 0.14; ctx.stroke();
          path(); ctx.lineWidth = 6 * k; ctx.globalAlpha = 0.3; ctx.stroke();
          path(); ctx.lineWidth = 3 * k; ctx.globalAlpha = 1; ctx.stroke();
        }
        ctx.restore();
        // the dot from the hook glides to the start of the arc
        const arrive = E.inOutCubic(prog(t, C.storytelling, 1.1));
        const start = [lerp(216, P0[0], arrive), lerp(300, P0[1], arrive)];
        const pos = draw > 0 ? toS(head) : start;
        // token
        const tin = E.outBack(prog(t, C.anArc - 0.3, 0.5));
        css(tok.el, { transform: `translate(${pos[0].toFixed(2)}px, ${pos[1].toFixed(2)}px)` });
        css(tok.av, { transform: `scale(${lerp(0.3, 1, tin).toFixed(3)})`, opacity: clamp(tin * 2, 0, 1).toFixed(3), boxShadow: `0 0 ${lerp(0, 26, env(t, C.within - 0.1, C.butTake + 1.5, 0.4, 0.8)).toFixed(1)}px rgba(90,159,212,0.75), inset 0 0 ${lerp(0, 18, env(t, C.within - 0.1, C.butTake + 1.5, 0.4, 0.8)).toFixed(1)}px rgba(90,159,212,0.6)` });
        css(tok.lvl, { opacity: (clamp(tin * 2, 0, 1)).toFixed(3), transform: `scale(${lerp(0.6, 1, tin).toFixed(3)})` });
        tok.setLevel(1 + Math.floor(13 * Math.pow(draw, 1.2) + 1e-6));
        tok.setTrace(prog(t, C.within - 0.15, 1.6));
        css(tok.eye, { opacity: (env(t, C.neverSees - 0.1, C.theyLive + 0.3, 0.3, 0.4) * 0.9).toFixed(3), transform: `translateY(${lerp(6, 0, E.outCubic(prog(t, C.neverSees - 0.1, 0.4)))}px)` });
        // dot (before the token takes over)
        const dotA = 1 - prog(t, C.anArc - 0.3, 0.3);
        if (dotA > 0) { ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(90,159,212,0.9)'; ctx.shadowBlur = 18; ctx.globalAlpha = dotA; ctx.beginPath(); ctx.arc(start[0], start[1], 6, 0, 6.283); ctx.fill(); ctx.restore(); }
        const ga2 = env(t, C.arcWord - 0.05, C.butTake + 0.4, 0.6, 0.5);
        css(giant, { opacity: ga2.toFixed(3), transform: `translateY(${lerp(20, -10, prog(t, C.arcWord, 4.5)).toFixed(1)}px) scale(${lerp(0.94, 1.04, prog(t, C.arcWord, 4.5)).toFixed(4)})`, letterSpacing: lerp(0.05, -0.05, E.outCubic(prog(t, C.arcWord - 0.05, 1.2))).toFixed(3) + 'em' });
        css(kick, { opacity: (env(t, C.storytelling + 0.1, C.butTake + 0.2, 0.35, 0.3)).toFixed(3), transform: `translateY(${lerp(8, 0, E.outCubic(prog(t, C.storytelling + 0.1, 0.4)))}px)`, letterSpacing: lerp(0.4, 0.22, E.outCubic(prog(t, C.storytelling, 0.8))).toFixed(3) + 'em' });
        // fog: the character's view narrows
        const f = E.inOutSine(prog(t, C.theCharacter, 2.0));
        const fadeOut = 1 - prog(t, C.theyLive + 0.1, 0.3);
        const R = lerp(700, 120, f);
        css(fog, { background: `radial-gradient(circle at ${pos[0].toFixed(1)}px ${pos[1].toFixed(1)}px, rgba(14,15,18,0) ${(R * 0.35).toFixed(0)}px, rgba(14,15,18,${(0.94 * f).toFixed(3)}) ${R.toFixed(0)}px)`, opacity: fadeOut.toFixed(3) });
        css(cv, { opacity: fadeOut.toFixed(3) });
        css(tok.el, { opacity: fadeOut.toFixed(3) });
      },
    });
  }

  // ═══ S4 + S5 + S6: the chart world ═════════════════════════════════════
  {
    const el = h('div', 'scene');
    const year = yearData();
    const LAST = 364;                       // index of "today"
    const beats = [C.day1, C.day2, C.day3, C.day4];
    const firstShown = LAST - 4;            // S4 reveals the last four days
    // Chart card (S5/S6) and the full-frame chart canvas drawn into its box
    const grp = h('div', 'abs', '', 'left:0;top:0;width:432px;height:768px;');
    const cardWrap = h('div', 'abs', '', 'left:36px;top:140px;width:360px;transform-origin:50% 0;');
    const card = chartCard({ ch: 204, range: '1M' });
    cardWrap.appendChild(card.el); grp.appendChild(cardWrap);
    const cv = hiCanvas(W, H, 'abs'); grp.appendChild(cv);
    el.appendChild(grp);
    // Day card (S4) + date kicker
    const day = activityCard({ name: 'Morning run', xp: 25, streak: 12, dim: 'sage' });
    css(day.el, { left: '40px', top: '176px', transformOrigin: '50% 50%' }); el.appendChild(day.el);
    const date = h('div', 'kicker', '', 'left:0;width:432px;text-align:center;top:138px;color:rgba(255,255,255,0.5)'); el.appendChild(date);
    const rip = ripple(); el.appendChild(rip);
    const fxc = hiCanvas(W, H, 'abs'); el.appendChild(fxc);
    const flt = floatXP('+25 XP'); el.appendChild(flt);
    const tok = token(); el.appendChild(tok.el); tok.setLevel(14); css(tok.eye, { display: 'none' });
    const fog = h('div', 'layer'); el.appendChild(fog);
    // S6: the character's card
    const mine = activityCard({ name: 'Write 500 words', xp: 40, streak: 21, dim: 'amber' });
    css(mine.el, { left: '40px', top: '150px' }); el.appendChild(mine.el);

    let RECT = null, ringC = null;
    const measure = () => {
      const b = card.box.getBoundingClientRect(), s = el.getBoundingClientRect();
      const bx = b.left - s.left, by = b.top - s.top;
      RECT = { x: bx + 52, y: by + 18, w: b.width - 72, h: b.height - 52 };
      const r = day.ringWrap.getBoundingClientRect();
      ringC = [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2];
    };
    // Range windows (days back from today) and the y-window that fits them
    const RANGES = { '1M': 30, '3M': 91, '6M': 182, '1Y': 364 };
    const winFor = (days) => { const x0 = LAST - days, a = year[x0].v, b = year[LAST].v; return { x0, x1: LAST, v0: Math.max(0, a - (b - a) * 0.04), v1: b + (b - a) * 0.06 }; };
    const rangeKeys = [[C.longPeriod - 1, '1M'], [C.r3m, '3M'], [C.r6m, '6M'], [C.r1y, '1Y']];
    const dateOf = (d) => new Date(2025, 9, 17 + d);     // day 364 = Fri, Oct 16 2026
    const xLabel = (d) => { const dt = dateOf(d); return `${dt.getMonth() + 1}/${dt.getDate()}`; };

    out.push({
      t0: C.theyLive - 0.05, t1: C.beingCharacter + 0.35, el,
      update(t) {
        if (!RECT) measure();
        // ── which day are we on (S4) ───────────────────────────────────
        let k = 0; beats.forEach((b, i) => { if (t >= b) k = i + 1; });
        // revealed data: points up to firstShown + k, with the newest drawing in
        const lastB = k > 0 ? beats[k - 1] : -9;
        const grow = E.outCubic(prog(t, lastB + 0.12, 0.3));
        const upto = k === 0 ? firstShown : firstShown + k - 1 + grow;
        // ── data window (S5 range steps) ───────────────────────────────
        let wa = winFor(30), wb = wa, wu = 1;
        for (let i = 1; i < rangeKeys.length; i++) if (t >= rangeKeys[i][0]) { wa = winFor(RANGES[rangeKeys[i - 1][1]]); wb = winFor(RANGES[rangeKeys[i][1]]); wu = E.outCubic(prog(t, rangeKeys[i][0], 0.24)); }
        const view = { x0: lerp(wa.x0, wb.x0, wu), x1: LAST, v0: lerp(wa.v0, wb.v0, wu), v1: lerp(wa.v1, wb.v1, wu) };
        let active = '1M'; rangeKeys.forEach(([tt, key]) => { if (t >= tt) active = key; });
        card.setRange(active);
        // ── camera ────────────────────────────────────────────────────
        const px = (x) => RECT.x + (x - view.x0) / (view.x1 - view.x0) * RECT.w;
        const py = (v) => RECT.y + RECT.h - (v - view.v0) / (view.v1 - view.v0) * RECT.h;
        const focusIdx = (i) => { const p = year[i]; return [px(p.x), py(p.v)]; };
        // pan from point to point: after each beat, glide to the new point
        const pan = k === 0 ? 0 : E.inOutCubic(prog(t, lastB + 0.18, 0.5));
        const fi0 = firstShown + Math.max(0, k - 1), fi1 = firstShown + k;
        const Fa = focusIdx(Math.min(fi0, LAST)), Fb = focusIdx(Math.min(fi1, LAST));
        const Fz = [lerp(Fa[0], Fb[0], k === 0 ? 0 : pan), lerp(Fa[1], Fb[1], k === 0 ? 0 : pan)];
        const slope = Math.atan2(focusIdx(LAST)[1] - focusIdx(LAST - 3)[1], focusIdx(LAST)[0] - focusIdx(LAST - 3)[0]);
        // S5 pull-back, then a push toward "the end of the journey"
        const pb = E.inOutQuart(prog(t, C.onlyAudience - 0.05, 1.55));
        const toEnd = env(t, C.thatToo, C.longPeriod + 0.2, 0.9, 0.35, E.inOutCubic, E.inOutCubic);
        const S4s = 11.5;
        const sZoom = lerp(S4s, 1, pb);
        const center = [RECT.x + RECT.w / 2, RECT.y + RECT.h / 2];
        const endPt = focusIdx(LAST);
        const F = [lerp(Fz[0], center[0], pb), lerp(Fz[1], center[1], pb)];
        const T = [lerp(216, center[0], pb), lerp(372, center[1], pb)];
        const rot = lerp(-slope * 0.8, 0, pb);
        // S6: the whole card moves down and shrinks
        const s6 = E.inOutCubic(prog(t, C.soFor, 0.7));
        const s6s = lerp(1, 0.84, s6), s6y = lerp(0, 168, s6);
        // whip out to the left at the end of S6
        const whip = E.inExpo(prog(t, C.beingCharacter - 0.32, 0.36));
        const whipX = 520 * whip;
        const swayY = 5 * env(t, C.character - 0.05, C.audience - 0.05, 0.3, 0.25) - 5 * env(t, C.audience - 0.05, C.beingCharacter, 0.3, 0.2);
        const swayX = 3 * env(t, C.soFor, C.beingCharacter, 0.8, 0.4) * Math.sin((t - C.soFor) * 0.9);
        css(el, { transform: `translateX(${whipX.toFixed(1)}px) perspective(1200px) rotateY(${swayY.toFixed(2)}deg) rotateX(${swayX.toFixed(2)}deg)`, filter: whip > 0.02 ? `blur(${(whip * 10).toFixed(2)}px)` : '' });
        // ── draw ──────────────────────────────────────────────────────
        const sweep = prog(t, C.seesArc - 0.25, 0.9);
        const glow = 0.6 + 0.9 * Math.sin(Math.PI * sweep) + 0.5 * toEnd;
        const showDots = view.x1 - view.x0 <= 40;
        const camS6 = { s: sZoom, rot, F, T };
        drawChart(cv, [{
          pts: year, color: COL.blue, fill: `rgba(74,124,158,${(0.35 * E.inCubic(pb)).toFixed(3)})`, width: 2.5, glow, upto,
          dots: true, dotR: 3.5, dotScale: (p) => showDots || p.x > LAST - 5 ? (p.x > firstShown ? E.outBack(prog(t, beats[p.x - firstShown - 1] + 0.12, 0.3)) : 1) * lerp(1, 0.6, pb) * (showDots ? 1 : clamp((p.x - (LAST - 5)) / 3, 0, 1) * (1 - pb)) : 0,
          head: lerp(0.7, 0.55, pb) + 0.5 * toEnd + 0.4 * env(t, C.seesArc - 0.2, C.seesArc + 0.8, 0.2, 0.6),
        }], view, {
          rect: RECT, cam: camS6, gridAlpha: E.inOutCubic(prog(t, C.onlyAudience + 0.6, 0.8)),
          xLabels: [0, 0.2, 0.4, 0.6, 0.8, 1].map((u, i) => { const d = Math.round(lerp(view.x0, view.x1, u)); return [d, xLabel(d)]; }),
        });
        // light sweep along the line as the audience "sees the arc"
        // card chrome fades in around the chart once we are far enough out
        const chrome = E.outCubic(prog(t, C.onlyAudience + 0.75, 0.6));
        css(cardWrap, { opacity: chrome.toFixed(3), transform: `scale(${lerp(1.06, 1, chrome).toFixed(4)})` });
        // S6 dims/brightens the chart for "audience"
        const audFocus = env(t, C.audience - 0.05, C.beingCharacter, 0.25, 0.25);
        const chrFocus = env(t, C.character - 0.05, C.audience - 0.05, 0.25, 0.2);
        const bothF = env(t, C.both - 0.05, C.character, 0.2, 0.25);
        const chartDim = lerp(1, 0.38, chrFocus);
        css(cv, { opacity: chartDim.toFixed(3) });
        // group camera: push toward the end of the journey, then S6's move down
        const ez = 1 + 0.085 * toEnd, ex = endPt[0] - 90, ey = endPt[1] + 40;
        css(grp, { transformOrigin: '0 0', transform: `translateY(${s6y.toFixed(1)}px) translate(216px,150px) scale(${s6s.toFixed(4)}) translate(-216px,-150px) translate(${ex}px,${ey}px) scale(${ez.toFixed(4)}) translate(${-ex}px,${-ey}px)` });
        css(card.el, { opacity: chartDim.toFixed(3), boxShadow: (audFocus + bothF) > 0.01 ? `0 0 0 1px rgba(90,159,212,${(0.5 * Math.max(audFocus, bothF)).toFixed(3)}), 0 0 28px rgba(90,159,212,${(0.35 * Math.max(audFocus, bothF)).toFixed(3)})` : '' });

        // ── S4 day card ───────────────────────────────────────────────
        const s4on = t < C.onlyAudience + 0.5;
        show(day.el, s4on); show(date, s4on); show(rip, s4on); show(flt, s4on); show(fxc, s4on);
        // fog keeps the view narrow until the pull-back
        const fogA = (1 - E.inOutCubic(prog(t, C.onlyAudience, 1.1))) * lerp(1, 0.85, E.outCubic(prog(t, C.theyLive, 0.6)));
        css(fog, { background: fogA > 0.002 ? `radial-gradient(ellipse 78% 52% at 50% 40%, rgba(14,15,18,0) 38%, rgba(14,15,18,${(0.88 * fogA).toFixed(3)}) 100%)` : 'none' });
        if (s4on) {
          clearCanvas(fxc);
          // which card is on screen: card i is live from (beat i-1 + 0.55) to (beat i + 0.55)
          let ci = 0; beats.forEach((b, i) => { if (t >= b + 0.55) ci = i + 1; });
          ci = Math.min(ci, 3);
          const b = beats[ci];
          const enter = ci === 0 ? E.outCubic(prog(t, C.theyLive, 0.5)) : E.outCubic(prog(t, beats[ci - 1] + 0.55, 0.38));
          const leave = ci === 3 ? E.inCubic(prog(t, C.onlyAudience - 0.05, 0.35)) : 0;
          const done = E.outCubic(prog(t, b, 0.22));
          day.setDone(done);
          day.setStreak(12 + ci + (t >= b + 0.08 ? 1 : 0));
          const dd = dateOf(LAST - 3 + ci);
          date.textContent = `${DOW[dd.getDay()]} · ${MON[dd.getMonth()].toUpperCase()} ${dd.getDate()}`;
          const pop = Math.sin(clamp((t - b) / 0.3, 0, 1) * Math.PI) * 0.035;
          css(day.el, { opacity: (enter * (1 - leave)).toFixed(3), transform: `translateX(${(lerp(150, 0, enter) - 40 * leave).toFixed(1)}px) translateY(${(-30 * leave).toFixed(1)}px) scale(${(1 + pop).toFixed(4)})` });
          css(date, { opacity: (enter * (1 - leave)).toFixed(3), transform: `translateX(${lerp(60, 0, enter).toFixed(1)}px)` });
          // ripple + float
          const rp = prog(t, b - 0.06, 0.45);
          css(rip, { left: ringC[0] + 'px', top: ringC[1] + 'px', opacity: (rp > 0 && rp < 1 ? 1 - rp : 0).toFixed(3), transform: `scale(${lerp(1, 7, E.outCubic(rp)).toFixed(3)})` });
          const fp = prog(t, b + 0.05, 0.75);
          flt.textContent = '+25 XP';
          css(flt, { left: (ringC[0] - 26) + 'px', top: (ringC[1] - 26 - 44 * E.outCubic(fp)).toFixed(1) + 'px', opacity: (fp > 0 && fp < 1 ? Math.min(1, fp * 6, (1 - fp) * 3) : 0).toFixed(3) });
          // completion sparkle + light sweep across the card
          const bp = prog(t, b + 0.02, 0.6);
          burst(fxc.ctx, ringC[0] + (lerp(150, 0, enter) - 40 * leave), ringC[1] - 30 * leave, bp, 40 + ci);
          day.setSheen(prog(t, b + 0.05, 0.55));
          // day labels under the revealed points (the character's narrow view)
          const lc = fxc.ctx; lc.font = '600 9px Inter, sans-serif'; lc.textAlign = 'center';
          for (let d = firstShown - 3; d <= firstShown + k; d++) {
            if (d > LAST) break;
            const P = toScreenOf(cv, year[d], view, RECT, camS6);
            const dt = dateOf(d);
            const a = (1 - pb) * (d > firstShown ? clamp(prog(t, beats[d - firstShown - 1] + 0.12, 0.3) * 1.5, 0, 1) : 1);
            lc.globalAlpha = a * 0.55; lc.fillStyle = '#b0b0b0';
            lc.fillText(`${DOW[dt.getDay()]} ${dt.getMonth() + 1}/${dt.getDate()}`, P[0], P[1] + 24);
          }
          lc.globalAlpha = 1;
        }

        // ── the character token hops point to point ────────────────────
        const tokOn = t < C.onlyAudience + 0.9;
        show(tok.el, tokOn);
        if (tokOn) {
          const hop = k === 0 ? 1 : E.inOutCubic(prog(t, lastB + 0.15, 0.42));
          const pA = camS6 && toScreenOf(cv, year[Math.min(fi0, LAST)], view, RECT, camS6), pB = toScreenOf(cv, year[Math.min(fi1, LAST)], view, RECT, camS6);
          const P = k === 0 ? toScreenOf(cv, year[firstShown], view, RECT, camS6) : [lerp(pA[0], pB[0], hop), lerp(pA[1], pB[1], hop) - 34 * Math.sin(Math.PI * hop)];
          const gone = E.inCubic(prog(t, C.onlyAudience + 0.1, 0.6));
          const tin = E.outCubic(prog(t, C.theyLive - 0.05, 0.4));
          css(tok.el, { transform: `translate(${P[0].toFixed(2)}px, ${(P[1] - 26).toFixed(2)}px) scale(${lerp(0.7, 0.2, gone).toFixed(3)})`, opacity: (tin * (1 - gone)).toFixed(3) });
          css(tok.lvl, { opacity: '0' });
        }

        // ── S6: the character's card ──────────────────────────────────
        const m6 = E.outBack(prog(t, C.soFor + 0.25, 0.6));
        const s6on = t >= C.soFor;
        show(mine.el, s6on);
        if (s6on) {
          const cF = env(t, C.character - 0.05, C.audience - 0.05, 0.25, 0.2);
          const aF = env(t, C.audience - 0.05, C.beingCharacter + 1, 0.25, 0.25);
          mine.setDone(0);
          css(mine.el, { opacity: (clamp(m6 * 1.5, 0, 1) * lerp(1, 0.38, aF)).toFixed(3), transform: `translateY(${lerp(-40, 0, m6).toFixed(1)}px) scale(${(1 + 0.04 * cF).toFixed(4)})` });
          css(mine.item, { boxShadow: (cF + bothFocus(t, C)) > 0.01 ? `0 0 0 1px rgba(90,159,212,${(0.55 * Math.max(cF, bothFocus(t, C))).toFixed(3)}), 0 0 28px rgba(90,159,212,${(0.35 * Math.max(cF, bothFocus(t, C))).toFixed(3)}), 0 1px 0 rgba(255,255,255,0.075) inset, 0 4px 12px rgba(0,0,0,0.34)` : '' });
        }
      },
    });

    function toScreenOf(cv, p, view, R, cam) {
      const X0 = R.x + (p.x - view.x0) / (view.x1 - view.x0) * R.w, Y0 = R.y + R.h - (p.v - view.v0) / (view.v1 - view.v0) * R.h;
      let X = (X0 - cam.F[0]) * cam.s, Y = (Y0 - cam.F[1]) * cam.s; const c = Math.cos(cam.rot), s = Math.sin(cam.rot);
      return [cam.T[0] + X * c - Y * s, cam.T[1] + X * s + Y * c];
    }
  }

  // ═══ Character | Audience tabs (31.0 → 47.2) ════════════════════════════
  {
    const el = h('div', 'scene');
    const tabs = tabPair('Character', 'Audience');
    css(tabs.el, { left: '0px', top: '0px' });
    el.appendChild(tabs.el);
    let geo = null;
    const stops = [
      [C.needToBe, null], [C.both, 'both'], [C.character, 0], [C.audience, 1], [C.beingCharacter, 0], [C.beingAudience, 1],
    ];
    out.push({
      t0: C.needToBe - 0.1, t1: C.memory + 0.6, el,
      update(t) {
        if (!geo) {
          const w = tabs.el.offsetWidth; css(tabs.el, { left: ((W - w) / 2) + 'px' });
          geo = tabs.tabs.map(b => ({ x: b.offsetLeft, w: b.offsetWidth }));
        }
        const appear = E.outCubic(prog(t, C.needToBe - 0.1, 0.45));
        const leave = E.inCubic(prog(t, C.memory, 0.5));
        const y = kf(t, [[0, 86], [C.beingCharacter - 0.1, 86], [C.beingCharacter + 0.4, 60]]);
        css(tabs.el, { top: y.toFixed(1) + 'px', opacity: (appear * (1 - leave)).toFixed(3), transform: `translateY(${lerp(-14, 0, appear) - 20 * leave}px)` });
        // indicator target for each stop
        const tgt = (s) => s === 'both' ? { x: geo[0].x + 10, w: geo[1].x + geo[1].w - geo[0].x - 20, a: 1 } : s == null ? { x: geo[0].x + geo[0].w / 2, w: 0, a: 0 } : { x: geo[s].x + geo[s].w * 0.16, w: geo[s].w * 0.68, a: 1 };
        let i = 0; stops.forEach(([tt], j) => { if (t >= tt) i = j; });
        const A = tgt(stops[Math.max(0, i - 1)][1]), Bt = tgt(stops[i][1]);
        const u = i === 0 ? 1 : E.outBack(prog(t, stops[i][0], 0.32));
        const x = lerp(A.x, Bt.x, u), w = Math.max(0, lerp(A.w, Bt.w, u)), a = lerp(A.a, Bt.a, clamp(u, 0, 1));
        css(tabs.ind, { transform: `translateX(${x.toFixed(2)}px)`, width: w.toFixed(2) + 'px', opacity: a.toFixed(3) });
        const cur = stops[i][1];
        tabs.tabs.forEach((b, j) => {
          const on = cur === 'both' || cur === j;
          css(b, { color: on ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', textShadow: on ? '0 0 16px rgba(90,159,212,0.45)' : 'none' });
        });
      },
    });
  }
  return out;
}

function bothFocus(t, C) { return env(t, C.both - 0.05, C.character, 0.2, 0.25); }
