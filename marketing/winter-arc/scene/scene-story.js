// ════════════════════════════════════════════════════════════════════════
// S7–S12 · LIVING IT AND RECORDING IT
// S7  34.95 → 43.19  Being the character: define it yourself (editor), not a
//                    template from Instagram
// S8  43.19 → 46.95  Being the audience: the Activity History record
// S9  46.95 → 54.91  Memory frosts over: we keep the quits, lose the wins
// S10 54.91 → 57.23  This is where Mindkraft can help — the frost shatters
// S11 57.23 → 61.47  Define your arc and log each time you live up to it
// S12 61.47 → 63.71  By the time the New Year arrives — time-lapse, level up
// ════════════════════════════════════════════════════════════════════════
import { W, H, clamp, lerp, prog, E, tw, kf, env, pulse, rnd, rndr, noise1, h, css, show, fmt, hiCanvas, clearCanvas, layoutPos, layoutCenter } from './engine.js';
import { COL, activityCard, groupHeader, stickyHeader, msgToast, floatXP, levelUpCard, brandLockup, calendarCard, historyCard, historyDateHeader, historyRow, activityEditor, ripple, burst } from './components.js';

const MISSED = [6, 15, 27];          // the days "we quit" in October

export function sceneStory(C, fx) {
  const out = [];

  // ═══ S7 · Being the character ══════════════════════════════════════════
  {
    const el = h('div', 'scene');
    const ed = activityEditor();
    const edWrap = h('div', 'abs', '', 'left:30px;top:104px;width:372px;transform-origin:50% 0;');
    edWrap.appendChild(ed.el); el.appendChild(edWrap);
    css(ed.el, { left: '0px', top: '0px' });
    // the press ripple sits inside the Save button, centred on it
    const saveFx = h('div', 'mk-ringfx', '<div class="mk-ripple"></div>'); css(ed.save, { position: 'relative', overflow: 'visible' }); ed.save.appendChild(saveFx);
    const rip = saveFx.firstChild;
    const mine = activityCard({ name: 'Read 10 pages', xp: 25, streak: 0, dim: 'purple' });
    css(mine.el, { left: '40px', top: '170px' }); el.appendChild(mine.el);
    const tplK = h('div', 'kicker', 'Someone else’s template', 'left:0;width:432px;text-align:center;top:262px;color:rgba(251,191,36,0.75)'); el.appendChild(tplK);
    const tpl = ['Wake up at 5 AM', 'Cold plunge', 'No sugar · 75 days'].map((n, i) => {
      const c = activityCard({ name: n, xp: [30, 25, 40][i], streak: 0 });
      css(c.el, { left: '40px', top: (288 + i * 66) + 'px' });
      css(c.item, { outline: '1px dashed rgba(255,255,255,0.16)', outlineOffset: '-1px' });
      el.appendChild(c.el); return c;
    });
    const TEXT = 'Read 10 pages';
    out.push({
      t0: C.beingCharacter - 0.2, t1: C.beingAudience + 0.4, el,
      update(t) {
        // whip in from the left, whip out to the left
        const win = E.outExpo(prog(t, C.beingCharacter - 0.06, 0.5));
        const wout = E.inExpo(prog(t, C.beingAudience - 0.3, 0.34));
        const X = lerp(-480, 0, win) - 520 * wout;
        const blur = (1 - win) * 9 + wout * 10;
        css(el, { transform: `translateX(${X.toFixed(1)}px)`, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '' });
        // typing
        const tp = prog(t, C.something - 0.24, 0.82);
        const n = Math.floor(TEXT.length * tp + 1e-6);
        const typed = TEXT.slice(0, n);
        if (ed.typed.textContent !== typed) ed.typed.textContent = typed;
        show(ed.ph, n === 0);
        const typing = tp > 0 && tp < 1;
        const blink = typing || (Math.floor(t * 2.2) % 2 === 0);
        css(ed.caret, { opacity: (t < C.save && blink ? 1 : 0).toString() });
        // own definition: the name field lights up
        const own = env(t, C.ownDefinition - 0.1, C.save + 0.1, 0.25, 0.2);
        const focusName = Math.max(own, env(t, C.something - 0.35, C.everyDay - 0.1, 0.2, 0.2));
        css(ed.input, { borderColor: `rgba(90,159,212,${(0.12 + 0.88 * focusName).toFixed(3)})`, background: `rgba(90,159,212,${(0.06 * focusName).toFixed(3)})`, boxShadow: own > 0.01 ? `0 0 ${(20 * own).toFixed(1)}px rgba(90,159,212,${(0.4 * own).toFixed(3)})` : 'none' });
        css(ed.typed, own > 0.5 ? { color: 'transparent', background: 'linear-gradient(135deg,#fff 20%,#5a9fd4)', WebkitBackgroundClip: 'text', backgroundClip: 'text' } : { color: '', background: '', WebkitBackgroundClip: '', backgroundClip: '' });
        // every day → Daily
        const daily = t >= C.everyDay + 0.12;
        const fd = daily ? 'Daily' : 'Select…'; if (ed.freq.textContent !== fd) ed.freq.textContent = fd;
        const fsel = env(t, C.everyDay - 0.05, C.bePurposeful, 0.15, 0.3);
        css(ed.freq, { color: daily ? 'var(--color-text-primary)' : 'var(--color-placeholder)' });
        css(ed.select, { borderColor: `rgba(90,159,212,${(0.1 + 0.9 * fsel).toFixed(3)})`, background: `rgba(90,159,212,${(0.06 * fsel).toFixed(3)})`, transform: `scale(${(1 + 0.03 * Math.sin(Math.PI * prog(t, C.everyDay + 0.1, 0.25))).toFixed(4)})` });
        // purposeful → Medium habit · 25 XP
        const picked = t >= C.purposeful;
        ed.chips.forEach((c, i) => { const on = picked && i === 1; if (c.classList.contains('active') !== on) c.classList.toggle('active', on); });
        css(ed.chips[1], { transform: `scale(${(1 + 0.07 * Math.sin(Math.PI * prog(t, C.purposeful, 0.28))).toFixed(4)})` });
        // save
        const press = Math.sin(Math.PI * prog(t, C.save - 0.05, 0.22));
        css(ed.save, { transform: `scale(${(1 - 0.06 * press).toFixed(4)})`, boxShadow: press > 0 ? `0 0 ${(24 * press).toFixed(1)}px rgba(90,159,212,0.6)` : '' });
        const rp = prog(t, C.save - 0.04, 0.45);
        css(rip, { opacity: (rp > 0 && rp < 1 ? 1 - rp : 0).toFixed(3), transform: `scale(${lerp(1, 9, E.outCubic(rp)).toFixed(3)})` });
        // the editor collapses into the new card
        const col = E.inOutCubic(prog(t, C.save + 0.12, 0.38));
        const edIn = E.outCubic(prog(t, C.beingCharacter + 0.05, 0.45));
        const swing = lerp(28, 0, E.outCubic(prog(t, C.beingCharacter - 0.06, 0.8)));
        const drift = Math.sin((t - C.beingCharacter) * 0.9) * 1.6;
        css(edWrap, { opacity: (edIn * (1 - col)).toFixed(3), transform: `perspective(1100px) rotateY(${(swing + drift).toFixed(2)}deg) rotateX(${(2 * Math.sin((t - C.beingCharacter) * 0.7)).toFixed(2)}deg) translateY(${lerp(40, 0, edIn) + lerp(0, 40, col)}px) scale(${(0.9 * lerp(1, 0.55, col)).toFixed(4)})` });
        const cIn = E.outBack(prog(t, C.save + 0.32, 0.5));
        const cOn = t >= C.save + 0.3;
        show(mine.el, cOn);
        if (cOn) {
          const glow = env(t, C.instagram2 - 0.1, C.beingAudience, 0.2, 0.6) + 0.6 * pulse(t, C.save + 0.4, 3);
          const pop = Math.sin(clamp((t - C.instagram2) / 0.4, 0, 1) * Math.PI) * 0.04;
          css(mine.el, { opacity: clamp(cIn * 2, 0, 1).toFixed(3), transform: `translateY(${lerp(30, 0, cIn).toFixed(1)}px) scale(${(lerp(0.9, 1, cIn) + pop).toFixed(4)})` });
          css(mine.item, { boxShadow: `0 0 0 1px rgba(90,159,212,${(0.55 * clamp(glow, 0, 1)).toFixed(3)}), 0 0 30px rgba(90,159,212,${(0.38 * clamp(glow, 0, 1)).toFixed(3)}), 0 1px 0 rgba(255,255,255,0.075) inset, 0 4px 12px rgba(0,0,0,0.34)` });
          mine.setStreak(0);
          mine.setSheen(prog(t, C.save + 0.45, 0.6));
        }
        // templates slide in, then get flicked away
        const kOn = env(t, C.template - 0.15, C.instagram2 + 0.35, 0.25, 0.25);
        css(tplK, { opacity: kOn.toFixed(3), transform: `translateY(${lerp(6, 0, kOn).toFixed(1)}px)` });
        tpl.forEach((c, i) => {
          const a = E.outCubic(prog(t, C.notLiving + 0.05 + i * 0.12, 0.45));
          const fl = prog(t, C.instagram2 - 0.02 + i * 0.07, 0.5);
          const on = a > 0;
          show(c.el, on && fl < 1);
          if (!on) return;
          const flE = E.inCubic(fl);
          css(c.el, { opacity: (a * 0.62 * (1 - flE)).toFixed(3), filter: `grayscale(0.85) blur(${(3 * flE).toFixed(2)}px)`, transform: `translateX(${(lerp(260, 0, a) + 520 * flE).toFixed(1)}px) rotate(${(14 * flE * (i % 2 ? -1 : 1)).toFixed(2)}deg)` });
        });
      },
    });
  }

  // ═══ S8 · Being the audience — the record ══════════════════════════════
  {
    const el = h('div', 'scene');
    const hc = historyCard();
    css(hc.el, { left: '36px', top: '108px', height: '384px' });
    el.appendChild(hc.el);
    // A long record: newest first. The first rows land on the beat; then the
    // list rolls back through weeks of entries — "your own journey".
    const ACTS = [['Read 10 pages', 25], ['Walk 30 minutes', 20], ['Call family', 15], ['Journal', 10]];
    const days = [];
    for (let d = 0; d < 24; d++) {
      const dt = new Date(2026, 9, 31 - d);
      const items = ACTS.filter((a, j) => rnd(d * 5.3 + j) > 0.12 || j === 0);
      days.push({ label: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }), items });
    }
    const rows = [];
    let y = 0;
    days.forEach((d, di) => {
      const hdr = historyDateHeader(d.label, d.items.reduce((n, a) => n + a[1], 0));
      hc.list.appendChild(hdr); rows.push({ el: hdr, y, hdr: true, di }); y += 38;
      d.items.forEach(([n, xp], j) => {
        const r = historyRow(xp, n, ['06:42 AM', '07:15 AM', '09:30 PM', '10:05 PM'][j % 4]);
        hc.list.appendChild(r); rows.push({ el: r, y, di }); y += 40;
      });
    });
    rows.forEach(r => css(r.el, { position: 'absolute', left: '0', right: '0', top: r.y + 'px' }));
    css(hc.list, { height: '300px', overflow: 'hidden' });
    const inner = h('div', 'abs', '', 'left:0;right:0;top:0;'); rows.forEach(r => inner.appendChild(r.el)); hc.list.appendChild(inner);
    const rowBeats = [C.means, C.means + 0.32, C.means + 0.62, C.record - 0.1, C.record + 0.2];
    out.push({
      t0: C.beingAudience - 0.1, t1: C.memory + 0.7, el,
      update(t) {
        const win = E.outExpo(prog(t, C.beingAudience - 0.04, 0.5));
        const wout = E.inOutCubic(prog(t, C.memory - 0.05, 0.6));
        const ry = lerp(-24, -5, E.outCubic(prog(t, C.beingAudience - 0.04, 0.9))) + 2 * Math.sin((t - C.beingAudience) * 0.8);
        css(el, { transform: `translateX(${lerp(480, 0, win).toFixed(1)}px) translateY(${(40 * wout).toFixed(1)}px) perspective(1200px) rotateY(${ry.toFixed(2)}deg) rotateX(${(5 + 2 * Math.sin((t - C.beingAudience) * 0.6)).toFixed(2)}deg) scale(${lerp(1, 0.94, wout).toFixed(4)})`, opacity: (1 - wout).toFixed(3), filter: win < 0.98 ? `blur(${((1 - win) * 9).toFixed(2)}px)` : '' });
        // the first entries drop in one by one, pushing the list down
        let shown = 0; rowBeats.forEach(b => { if (t >= b) shown++; });
        const lastBeat = shown > 0 ? rowBeats[shown - 1] : 0;
        const ins = shown > 0 ? E.outBack(prog(t, lastBeat, 0.3)) : 1;
        const hidden = rowBeats.length - shown;             // rows not yet inserted at top (rows 1..5 incl. header)
        const roll = E.inOutCubic(prog(t, C.journey - 0.65, 1.5));
        const scrollY = (hidden > 0 ? (rows[hidden].y - lerp(40, 0, ins)) : 0) + roll * (rows[rows.length - 8].y);
        css(inner, { transform: `translateY(${(-scrollY).toFixed(1)}px)`, filter: roll > 0 && roll < 1 ? `blur(${(Math.sin(Math.PI * roll) * 2.5).toFixed(2)}px)` : '' });
        rows.forEach((r, i) => {
          const fresh = i >= 1 && i < rowBeats.length && hidden <= i;
          const a = i < hidden ? 0 : 1;
          css(r.el, { opacity: a.toString(), background: fresh && i === hidden && ins < 1 ? `rgba(90,159,212,${(0.12 * (1 - ins)).toFixed(3)})` : '' });
        });
      },
    });
  }

  // ═══ S9 + S10 · Memory frosts over → Mindkraft ═════════════════════════
  {
    const el = h('div', 'scene');
    const cal = calendarCard();
    const calWrap = h('div', 'abs', '', 'left:0;top:0;width:432px;height:768px;transform-origin:216px 290px;');
    css(cal.el, { left: '36px', top: '128px' });
    calWrap.appendChild(cal.el); el.appendChild(calWrap);
    cal.setMonth(2026, 9);
    const frost = hiCanvas(W, H, 'abs'); el.appendChild(frost);
    // The missed days, drawn above the frost. They live in a layer that copies
    // the calendar's transform exactly (but not its blur), and the calendar's
    // own cells for those days are hidden — so each date exists exactly once.
    const roseWrap = h('div', 'abs', '', 'left:0;top:0;width:432px;height:768px;transform-origin:216px 290px;');
    el.appendChild(roseWrap);
    const roses = MISSED.map(d => { const c = h('div', 'calendar-day mk-rose', `<span>${d}</span>`, 'position:absolute;'); roseWrap.appendChild(c); return c; });
    const brand = brandLockup();
    css(brand.el, { left: '0px', top: '190px' }); el.appendChild(brand.el);
    const shock = h('div', 'abs', '', 'width:100px;height:100px;margin:-50px 0 0 -50px;border-radius:50%;border:2px solid rgba(90,159,212,0.9);box-shadow:0 0 30px rgba(90,159,212,0.7), inset 0 0 20px rgba(90,159,212,0.4);');
    el.appendChild(shock);
    let geo = null;
    // Frost: an organic frosted-glass border (soft blobs hugging the edges),
    // small dendritic crystals growing inward, and a fine grain of ice.
    const edgePt = (i) => { const side = i % 4, u = rnd(i * 3.3 + 1); return side === 0 ? [u * W, 0] : side === 1 ? [W, u * H] : side === 2 ? [u * W, H] : [0, u * H]; };
    const blobs = Array.from({ length: 46 }, (_, i) => { const [x, y] = edgePt(i + 300); return { x, y, r: rndr(i + 31, 50, 140), a: rndr(i + 37, 0.06, 0.15) * (y > H - 1 ? 0.55 : 1), d: rnd(i + 41) * 0.4 }; });
    const crystals = Array.from({ length: 64 }, (_, i) => {
      const side = i % 4, [x, y] = edgePt(i);
      const ang = [Math.PI / 2, Math.PI, -Math.PI / 2, 0][side] + rndr(i + 5, -0.9, 0.9);
      return { x, y, ang, len: rndr(i + 9, 22, 74), delay: rnd(i + 21) * 0.5, w: rndr(i + 2, 0.45, 0.9) };
    });
    const grains = Array.from({ length: 260 }, (_, i) => { const e = rnd(i + 900); const [ex, ey] = edgePt(i + 600); const ix = rnd(i * 1.7 + 3) * W, iy = rnd(i * 2.3 + 5) * H; const k = e * e; return { x: lerp(ix, ex, k * 0.7), y: lerp(iy, ey, k * 0.7), r: rndr(i + 7, 0.3, 1.1), a: rndr(i + 8, 0.08, 0.3) }; });
    function dendrite(ctx, L, depth, w) {
      ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L, 0); ctx.stroke();
      if (depth <= 0 || L < 6) return;
      for (let b = 1; b <= 3; b++) {
        const p = b / 4 * L, bl = (L - p) * 0.55;
        [1, -1].forEach(sg => { ctx.save(); ctx.translate(p, 0); ctx.rotate(sg * Math.PI / 3); dendrite(ctx, bl, depth - 1, w * 0.7); ctx.restore(); });
      }
    }
    // blue days in random fade order
    const order = []; for (let d = 1; d <= 31; d++) if (!MISSED.includes(d)) order.push(d);
    order.sort((a, b) => rnd(a * 7.7) - rnd(b * 7.7));
    out.push({
      t0: C.memory - 0.1, t1: C.here + 0.35, el,
      update(t) {
        if (!geo) {
          geo = {};
          for (let d = 1; d <= 31; d++) { const c = cal.map[d]; const [x, y] = layoutPos(c, calWrap); geo[d] = { x, y, w: c.offsetWidth, h: c.offsetHeight }; }
          roses.forEach((c, i) => { const g = geo[MISSED[i]]; css(c, { left: g.x + 'px', top: g.y + 'px', width: g.w + 'px', height: g.h + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0' }); });
        }
        const inA = E.outCubic(prog(t, C.memory - 0.1, 0.55));
        const fr = E.inOutSine(prog(t, C.memory + 0.2, 2.3));                        // frost amount
        const shatter = prog(t, C.mindkraft, 0.9);
        const frostA = fr * (1 - E.outCubic(shatter));
        const push = E.inOutSine(prog(t, C.memory, 7.5));
        // days: blue except the missed ones; "forgetting" fades the blue away
        for (let d = 1; d <= 31; d++) {
          if (MISSED.includes(d)) { cal.paint(d, { a: 0, dim: 0 }); continue; }
          const oi = order.indexOf(d);
          const fade = E.inCubic(prog(t, C.forgetting - 0.1 + oi * 0.055, 0.35));
          cal.paint(d, { a: 1 - fade, dim: 1 - 0.85 * fade });
        }
        const forget = prog(t, C.forgetting - 0.1, 2.2);
        const calHide = E.inCubic(prog(t, C.thisIsWhere - 0.1, 0.5));
        const calS = lerp(0.94, 1, inA) * lerp(1, 1.1, push);
        css(calWrap, { opacity: (inA * lerp(1, 0.35, forget) * (1 - calHide)).toFixed(3), transform: `scale(${calS.toFixed(4)})`, filter: `blur(${(fr * 2.6).toFixed(2)}px) saturate(${(1 - 0.5 * fr).toFixed(3)}) brightness(${(1 - 0.25 * fr).toFixed(3)})` });
        css(roseWrap, { transform: `scale(${calS.toFixed(4)})` });
        // the quits stay sharp, and come forward
        const remember = E.outBack(prog(t, C.onlyRemember + 0.2, 0.5));
        const quitHit = pulse(t, C.quit, 5);
        const converge = E.inOutCubic(prog(t, C.thisIsWhere, 0.75));
        roses.forEach((c, i) => {
          const g = geo[MISSED[i]];
          const sc = lerp(1, 1.14, remember) * (1 + 0.15 * quitHit) * lerp(1, 0.2, converge);
          const cx = g.x + g.w / 2, cy = g.y + g.h / 2;
          // converge toward screen point (216, 270), expressed in the scaled layer
          const tx = 216 + (216 - 216) / calS, ty = 290 + (270 - 290) / calS;
          const dx = lerp(0, tx - cx, converge), dy = lerp(0, ty - cy, converge);
          const rose = clamp(remember, 0, 1);
          const op = inA * (1 - prog(t, C.mindkraft - 0.1, 0.15));
          css(c, { opacity: op.toFixed(3), transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${sc.toFixed(3)})`, boxShadow: `0 0 0 ${(1.5 * rose).toFixed(2)}px rgba(194,106,122,${rose.toFixed(3)}), 0 0 ${(14 + 18 * quitHit).toFixed(1)}px rgba(194,106,122,${(0.55 * rose).toFixed(3)})`, background: rose > 0 ? `rgba(194,106,122,${(0.14 * rose).toFixed(3)})` : '', color: rose > 0.3 ? '#f0b3bf' : '', filter: rose < 1 ? `blur(${(fr * 2.6 * (1 - rose)).toFixed(2)}px) saturate(${(1 - 0.5 * fr * (1 - rose)).toFixed(3)})` : '' });
        });
        // frost canvas: crystals + edge haze, and the puffs of forgotten days
        clearCanvas(frost);
        const ctx = frost.ctx;
        if (frostA > 0.005) {
          const sh = E.outCubic(shatter);
          blobs.forEach(o => {
            const g = clamp((fr - o.d) / (1 - o.d), 0, 1); if (g <= 0) return;
            const x = o.x + (o.x - W / 2) * 0.6 * sh, y = o.y + (o.y - H / 2) * 0.6 * sh, r = o.r * E.outCubic(g);
            const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
            gr.addColorStop(0, `rgba(214,234,250,${(o.a * frostA).toFixed(3)})`); gr.addColorStop(1, 'rgba(214,234,250,0)');
            ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
          });
          ctx.lineCap = 'round';
          ctx.strokeStyle = `rgba(232,244,255,${(0.42 * frostA).toFixed(3)})`;
          crystals.forEach((c, i) => {
            const g = clamp((fr - c.delay) / (1 - c.delay), 0, 1); if (g <= 0) return;
            ctx.save(); ctx.translate(c.x + (c.x - W / 2) * 0.7 * sh, c.y + (c.y - H / 2) * 0.7 * sh); ctx.rotate(c.ang + sh * (rnd(i) - 0.5) * 2);
            dendrite(ctx, c.len * E.outCubic(g), 2, c.w);
            ctx.restore();
          });
          grains.forEach(o => { ctx.fillStyle = `rgba(235,246,255,${(o.a * frostA).toFixed(3)})`; ctx.beginPath(); ctx.arc(o.x + (o.x - W / 2) * 0.5 * sh, o.y + (o.y - H / 2) * 0.5 * sh, o.r, 0, 6.283); ctx.fill(); });
        }
        // puffs: each forgotten day dissolves into drifting flakes
        if (t >= C.forgetting - 0.1 && t < C.thisIsWhere + 0.8) {
          order.forEach((d, oi) => {
            const t0 = C.forgetting - 0.1 + oi * 0.055;
            const p = prog(t, t0, 1.1);
            if (p <= 0 || p >= 1) return;
            const g = geo[d]; const cx = g.x + g.w / 2, cy = g.y + g.h / 2;
            for (let j = 0; j < 6; j++) {
              const a = rnd(d * 11 + j) * 6.283, sp = rndr(d * 13 + j, 18, 60);
              const x = cx + Math.cos(a) * sp * E.outCubic(p), y = cy + Math.sin(a) * sp * E.outCubic(p) - 30 * p;
              ctx.fillStyle = `rgba(150,195,235,${(0.75 * (1 - p)).toFixed(3)})`;
              ctx.beginPath(); ctx.arc(x, y, rndr(d + j, 0.8, 2), 0, 6.283); ctx.fill();
            }
          });
        }
        // light gathers, then the logo lands
        const gather = E.inCubic(prog(t, C.thisIsWhere, C.mindkraft - C.thisIsWhere));
        if (gather > 0 && t < C.mindkraft + 0.4) {
          const r = lerp(20, 140, gather);
          const g = ctx.createRadialGradient(216, 270, 0, 216, 270, r);
          g.addColorStop(0, `rgba(190,225,255,${(0.9 * gather * (1 - prog(t, C.mindkraft, 0.4))).toFixed(3)})`); g.addColorStop(1, 'rgba(90,159,212,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(216, 270, r, 0, 6.283); ctx.fill();
        }
        const bOn = t >= C.mindkraft - 0.02;
        show(brand.el, bOn); show(shock, bOn);
        if (bOn) {
          const a = prog(t, C.mindkraft - 0.02, 0.6);
          const exit = E.inOutCubic(prog(t, C.here - 0.35, 0.6));
          css(brand.el, { opacity: (1 - exit).toFixed(3), transform: `translateY(${(-60 * exit).toFixed(1)}px) scale(${(lerp(1.35, 1.2, E.outCubic(a)) * lerp(1, 0.8, exit)).toFixed(4)})` });
          css(brand.ring, { transform: `scale(${E.outBack(prog(t, C.mindkraft - 0.02, 0.45)).toFixed(4)})` });
          css(brand.pulse, { transform: `scale(${(1 + 0.18 * Math.sin((t - C.mindkraft) * 2.2)).toFixed(4)})`, opacity: (0.6 + 0.4 * Math.sin((t - C.mindkraft) * 2.2)).toFixed(3) });
          css(brand.icon, { transform: `translateY(${(-4 * Math.sin((t - C.mindkraft) * 2.1)).toFixed(2)}px)` });
          const nm = E.outCubic(prog(t, C.mindkraft + 0.08, 0.5));
          css(brand.name, { opacity: nm.toFixed(3), letterSpacing: lerp(6, -1.5, nm).toFixed(2) + 'px', filter: `blur(${((1 - nm) * 6).toFixed(2)}px)` });
          const tg = E.outCubic(prog(t, C.canHelp - 0.1, 0.45));
          css(brand.tag, { opacity: tg.toFixed(3), transform: `translateY(${lerp(8, 0, tg).toFixed(1)}px)` });
          const sp = prog(t, C.mindkraft, 0.8);
          css(shock, { left: '216px', top: '238px', opacity: (sp > 0 && sp < 1 ? (1 - sp) * 0.9 : 0).toFixed(3), transform: `scale(${lerp(0.6, 6, E.outCubic(sp)).toFixed(3)})` });
        }
      },
    });
  }

  // ═══ S11 + S12 · Define your arc, log it, and the New Year ═════════════
  {
    const el = h('div', 'scene');
    const hdr = stickyHeader({ level: 14, xp: 120, toNext: 110, pct: 120 / 230, initial: 'A' });
    el.appendChild(hdr.el);
    const grp = groupHeader('Winter Arc', 'snowflake', 3);
    const grpWrap = h('div', 'abs', '', 'left:40px;top:150px;width:352px;'); grpWrap.appendChild(grp); el.appendChild(grpWrap);
    // the arc, broken down into simple actions done every day
    const defs = [['Read 10 pages', 25, 20, 'purple'], ['Walk 30 minutes', 20, 16, 'sage'], ['Call family', 15, 9, 'rose']];
    const cards = defs.map(([n, xp, st, dim], i) => { const c = activityCard({ name: n, xp, streak: st, dim }); css(c.el, { left: '40px', top: (196 + i * 70) + 'px', transformOrigin: '50% 0' }); el.appendChild(c.el); return c; });
    const flts = defs.map(d => { const f = floatXP(`+${d[1]} XP`); el.appendChild(f); return f; });
    const toast = msgToast('21-day streak on Read 10 pages — +20 Grit', 'fire', 'var(--chip-streak-fg)');
    css(toast.el, { left: '36px', top: '98px' }); el.appendChild(toast.el);
    // New Year calendar
    const cal = calendarCard();
    const calWrap = h('div', 'abs', '', 'left:0;top:0;width:432px;height:768px;transform-origin:216px 300px;');
    css(cal.el, { left: '36px', top: '120px' }); calWrap.appendChild(cal.el); el.appendChild(calWrap);
    const sparks = hiCanvas(W, H, 'abs'); el.appendChild(sparks);
    const lvc = levelUpCard(31); css(lvc.el, { left: '66px', top: '210px' }); el.appendChild(lvc.el);
    let geo = null;
    const logs = [C.log1, C.log2, C.log3];
    const months = [[C.byTheTime - 0.05, 2026, 9], [C.byTheTime + 0.3, 2026, 10], [C.byTheTime + 0.56, 2026, 11], [C.year - 0.04, 2027, 0]];
    out.push({
      t0: C.here - 0.45, t1: C.stepBack + 0.75, el,
      update(t) {
        if (!geo) {
          geo = cards.map(c => layoutCenter(c.ringWrap, el));
          const bc = hdr.bar.parentElement, [bx, by] = layoutPos(bc, el); geo.bar = [bx, by + bc.offsetHeight / 2, bc.offsetWidth];
          geo.jan1 = null;
        }
        // header drops in
        const hIn = E.outCubic(prog(t, C.here - 0.4, 0.55));
        const stepOut = E.inCubic(prog(t, C.stepBack - 0.08, 0.34));
        // XP model: 120/230 at Level 14, each log flies to the bar
        const arrive = logs.map(b => E.inOutCubic(prog(t, b + 0.12, 0.42)));
        const xpNow = 120 + defs[0][1] * arrive[0] + defs[1][1] * arrive[1] + defs[2][1] * arrive[2];
        // New Year roll: levels 14 → 31
        const roll = E.inOutSine(prog(t, C.byTheTime + 0.05, C.year - C.byTheTime));
        const lvF = 14 + (31 - 14) * roll;
        let level = 14, pct = xpNow / 230, xpShown = xpNow, toNext = 230 - xpNow;
        if (roll > 0) {
          level = Math.floor(lvF + 1e-6);
          const need = Math.round(8.5 * (2 * level - 1));
          const fr = roll >= 1 ? 0.12 : lvF - level;
          pct = level === 14 ? lerp(xpNow / 230, 1, fr) : fr;
          xpShown = Math.round(need * pct); toNext = need - xpShown;
        }
        const lvPop = pulse(t, C.year + 0.02, 6);
        hdr.set({ level, xp: xpShown, toNext, pct, trace: prog(t, C.year + 0.05, 1.6), pop: lvPop });
        css(hdr.el, { opacity: (hIn * (1 - stepOut)).toFixed(3), transform: `translateY(${lerp(-80, 0, hIn).toFixed(1)}px)` });

        // "define your arc": the Winter Arc group arrives and glows on "arc"
        const gIn = E.outCubic(prog(t, C.define - 0.3, 0.45));
        const away = E.inCubic(prog(t, C.byTheTime - 0.25, 0.4));
        const gGlow = env(t, C.define + 0.45, C.breakDown + 0.4, 0.25, 0.4);
        css(grpWrap, { opacity: (gIn * (1 - away)).toFixed(3), transform: `translateY(${(lerp(16, 0, gIn) + 40 * away).toFixed(1)}px) scale(${(1 + 0.05 * gGlow).toFixed(4)})`, transformOrigin: '20% 50%', textShadow: gGlow > 0.01 ? `0 0 ${(18 * gGlow).toFixed(1)}px rgba(90,159,212,${(0.8 * gGlow).toFixed(3)})` : '' });
        cards.forEach((c, i) => {
          // "break it down into simple actions": each card unfolds out of the group
          const a = prog(t, C.breakDown + i * 0.32, 0.55);
          const b = logs[i];
          const done = E.outCubic(prog(t, b, 0.22));
          c.setDone(done);
          c.setStreak(defs[i][2] + (t >= b + 0.08 ? 1 : 0));
          // "you do every day": the streak chips light up in turn
          const ev = Math.sin(clamp((t - (C.everyDay2 - 0.2 + i * 0.16)) / 0.35, 0, 1) * Math.PI);
          css(c.streak, { transform: `scale(${(1 + 0.3 * ev).toFixed(3)})`, boxShadow: ev > 0.01 ? `0 0 ${(12 * ev).toFixed(1)}px rgba(251,146,60,${(0.7 * ev).toFixed(3)})` : '' });
          const pop = Math.sin(clamp((t - b) / 0.32, 0, 1) * Math.PI) * 0.04;
          const ax = E.inCubic(prog(t, C.byTheTime - 0.25 + i * 0.05, 0.4));
          const unfold = E.outBack(a);
          css(c.el, { opacity: (E.outCubic(a) * (1 - ax)).toFixed(3), transform: `translateY(${(lerp(-46 - i * 70, 0, unfold) + 50 * ax).toFixed(1)}px) scale(${(lerp(0.86, 1, E.outCubic(a)) + pop).toFixed(4)})` });
          // "show up each day": tap ripple + sparkle on the ring, light sweep on the card
          c.setRipple(prog(t, b - 0.06, 0.45));
          c.setBurst(prog(t, b + 0.02, 0.6), 80 + i);
          c.setSheen(prog(t, b + 0.05, 0.55));
          // +XP flies from the ring up into the header bar
          const fp = prog(t, b + 0.04, 0.55);
          const fe = E.inOutCubic(fp);
          const tx = geo.bar[0] + geo.bar[2] * clamp(xpNow / 230, 0, 1) - 20, ty = geo.bar[1] - 8;
          const x = lerp(geo[i][0] - 30, tx, fe), y = lerp(geo[i][1] - 22, ty, fe) - 40 * Math.sin(Math.PI * fe);
          css(flts[i], { left: x.toFixed(1) + 'px', top: y.toFixed(1) + 'px', opacity: (fp > 0 && fp < 1 ? Math.min(1, fp * 8, (1 - fp) * 4) : 0).toFixed(3), transform: `scale(${lerp(1.1, 0.7, fe).toFixed(3)})` });
        });
        // the bar glows as XP lands
        const land = Math.max(...logs.map(b => pulse(t, b + 0.54, 6)));
        css(hdr.bar, { boxShadow: land > 0.01 ? `0 0 ${(14 * land).toFixed(1)}px rgba(90,159,212,${(0.9 * land).toFixed(3)})` : '' });
        // streak toast confirms "live up to it"
        const tIn = E.outBack(prog(t, C.liveUp - 0.05, 0.4)), tOut = E.inCubic(prog(t, C.byTheTime - 0.2, 0.3));
        show(toast.el, t >= C.liveUp - 0.05 && tOut < 1);
        css(toast.el, { opacity: (clamp(tIn * 2, 0, 1) * (1 - tOut)).toFixed(3), transform: `translateY(${(lerp(-14, 0, tIn) - 12 * tOut).toFixed(1)}px) scale(${lerp(0.94, 1, tIn).toFixed(3)})` });

        // New Year: months fly by on the calendar
        const cOn = t >= C.byTheTime - 0.2;
        show(calWrap, cOn); show(lvc.el, t >= C.arrives - 0.05);
        clearCanvas(sparks);
        if (cOn) {
          let mi = 0; months.forEach(([tt], j) => { if (t >= tt) mi = j; });
          const [mt, yy, mm] = months[mi];
          const map = cal.setMonth(yy, mm);
          const days = Object.keys(map).length;
          Object.keys(map).forEach(k => {
            const d = +k;
            const ft = mt + 0.02 + (d / days) * 0.24;
            const isJan1 = yy === 2027 && d === 1;
            const miss = (d * 7 + mm * 3) % 23 === 0;
            cal.paint(d, { a: miss || (yy === 2027 && d > 1) ? 0 : E.outCubic(prog(t, ft, 0.12)), gold: isJan1 ? E.outCubic(prog(t, C.year, 0.3)) : 0, dim: yy === 2027 && d > 1 ? 0.5 : 1 });
          });
          const cIn = E.outCubic(prog(t, C.byTheTime - 0.2, 0.4));
          const flip = Math.max(...months.slice(1).map(([tt]) => pulse(t, tt, 9)));
          css(calWrap, { opacity: (cIn * (1 - stepOut)).toFixed(3), transform: `translateY(${lerp(50, 0, cIn).toFixed(1)}px) scale(${(lerp(0.92, 0.94, cIn) * (1 + 0.03 * flip) * lerp(1, 0.25, stepOut)).toFixed(4)})`, filter: flip > 0.05 ? `blur(${(flip * 1.6).toFixed(2)}px)` : '' });
          // gold sparkle on Jan 1 — the milestone
          const sp = prog(t, C.year, 1.1);
          if (sp > 0 && sp < 1 && cal.map[1]) {
            // Jan 1's centre through the calendar's own transform (origin 216,300)
            const [lx, ly] = layoutCenter(cal.map[1], el);
            const S = lerp(0.92, 0.94, cIn) * (1 + 0.03 * flip) * lerp(1, 0.25, stepOut);
            const cx = 216 + (lx - 216) * S, cy = 300 + (ly - 300) * S + lerp(50, 0, cIn);
            const ctx = sparks.ctx;
            for (let j = 0; j < 22; j++) {
              const a = (j / 22) * 6.283 + rnd(j) * 0.3, d = lerp(6, rndr(j + 3, 50, 110), E.outCubic(sp));
              ctx.fillStyle = `rgba(245,197,99,${(1 - sp).toFixed(3)})`;
              ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d + 20 * sp * sp, lerp(2.4, 0.6, sp), 0, 6.283); ctx.fill();
            }
          }
        }
        // the level-up card lands as the year turns
        if (t >= C.arrives - 0.05) {
          const a = E.outBack(prog(t, C.arrives - 0.05, 0.45));
          css(lvc.el, { opacity: (clamp(a * 2, 0, 1) * (1 - stepOut)).toFixed(3), transform: `translateY(${lerp(30, 0, a).toFixed(1)}px) scale(${(lerp(0.85, 1, a) * lerp(1, 0.3, stepOut)).toFixed(4)})` });
          // confetti in the app's colours
          const ctx = sparks.ctx, cols = ['#4a7c9e', '#8e3b5f', '#6b7c3f', '#7a7b4d', '#5a9fd4'];
          const cp = t - (C.arrives - 0.05);
          for (let j = 0; j < 70; j++) {
            const x0 = rnd(j * 3.1) * W, vy = rndr(j + 7, 120, 260), y = -20 + vy * cp + 0.5 * 160 * cp * cp - rnd(j + 2) * 120;
            if (y < -10 || y > H) continue;
            ctx.save(); ctx.translate(x0 + 20 * Math.sin(cp * rndr(j, 2, 5) + j), y); ctx.rotate(cp * rndr(j + 4, 2, 7));
            ctx.globalAlpha = 0.85 * (1 - stepOut); ctx.fillStyle = cols[j % 5]; ctx.fillRect(-3, -4, 6, 8); ctx.restore();
          }
        }
      },
    });
  }
  return out;
}
