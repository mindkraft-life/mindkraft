// ════════════════════════════════════════════════════════════════════════
// Scenes — the story, beat by beat. Each scene is { t0, t1, el, update(t) }
// and update() sets every animated property from t alone. Cue names refer
// to data/cues.json (word onsets in the VO).
// ════════════════════════════════════════════════════════════════════════
import { W, H, clamp, lerp, prog, within, smooth, E, tw, kf, env, pulse, rnd, rndr, noise1, h, css, show, fmt, hiCanvas, clearCanvas } from './engine.js';
import { COL, CHART_LINE, activityCard, groupHeader, stickyHeader, toastPill, msgToast, floatXP, levelUpCard, brandLockup, calendarCard, statTile, chartCard, drawChart, historyCard, historyDateHeader, historyRow, activityEditor, tabPair, ripple } from './components.js';
import { sceneArc } from './scene-arc.js';
import { sceneStory } from './scene-story.js';
import { sceneFinale } from './scene-finale.js';

export function buildScenes(world, C, fx) {
  const list = [];
  const add = (s) => { if (s.el) world.appendChild(s.el); list.push(s); };
  add(sceneHook(C, fx));
  sceneArc(C, fx).forEach(add);
  sceneStory(C, fx).forEach(add);
  sceneFinale(C, fx).forEach(add);
  return list;
}

// ═════════════════════════════════════════════════════════════════════════
// S1 · HOOK  0.00 → 8.72
// "Few days ago, everyone on Instagram was starting a winter arc, and yours
//  will fail if you don't understand this."
// ═════════════════════════════════════════════════════════════════════════
const TRENDS = ['Cold plunge', '5 AM wake up', '75 Hard', 'Gym · push day', 'No sugar', 'Run 10K', 'Journal', 'Run 5K', 'Meditate', 'No phone after 9', 'Skincare', '10k steps', 'Learn Spanish', 'Stretch', 'Drink 3L water', 'Deep work 2h', 'Gratitude list', 'No junk food', 'Sleep by 10:30', 'Pushups ×50', 'Study 1h', 'Hike 5 miles', 'Plan tomorrow', 'Yoga', 'Protein 150g', 'Guitar practice', 'No alcohol', 'Ice bath', 'Clean room', 'Code 1h', 'Sauna', 'Cook at home', 'Cardio 30 min', 'Read the news', 'Floss'];

function sceneHook(C, fx) {
  const el = h('div', 'scene');

  // ── Calendar: count back a few days, to October 1 ─────────────────────
  const calWrap = h('div', 'abs', '', 'left:0;top:0;width:432px;height:768px;transform-origin:0 0;');
  const cal = calendarCard();
  css(cal.el, { left: '36px', top: '150px' });
  calWrap.appendChild(cal.el); el.appendChild(calWrap);
  const kick = h('div', 'kicker', 'Winter arc · Day 1', 'color:var(--color-progress);left:0;width:432px;text-align:center;top:118px;');
  el.appendChild(kick);
  const seq = [8, 7, 6, 5, 4, 3, 2, 1];          // today → Oct 1, Day 1 of the arc
  const STEPS = seq.length - 1;
  const stepT0 = C.fewDays + 0.08, stepDt = 0.088;
  const fillT = stepT0 + stepDt * STEPS + 0.08;
  let target = null;   // centre of Oct 1, measured after layout

  // ── The wall: everyone's Day 1 ─────────────────────────────────────────
  const COLS = 5, ROWS = 12, CW = 300, CH = 64, GX = 22, GY = 16;
  const wallOuter = h('div', 'abs', '', 'left:0;top:0;width:432px;height:768px;');
  const wall = h('div', 'abs', '', `width:${COLS * (CW + GX)}px;height:${ROWS * (CH + GY)}px;transform-origin:0 0;`);
  wallOuter.appendChild(wall); el.appendChild(wallOuter);
  const midC = 2, midR = 6;                      // "yours"
  const cards = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c, mine = r === midR && c === midC;
    const card = activityCard({ name: mine ? 'My winter arc' : TRENDS[(i * 11 + 3) % TRENDS.length], xp: mine ? 25 : [10, 15, 20, 25, 30, 40][i % 6], streak: mine ? 3 : 1 + (i * 5) % 3 });
    css(card.el, { left: (c * (CW + GX) + (r % 2) * 40 - 20) + 'px', top: (r * (CH + GY)) + 'px', width: CW + 'px' });
    wall.appendChild(card.el);
    const dist = Math.hypot(c - midC, (r - midR) * 0.9);
    cards.push({ card, mine, dist, r, c, x: c * (CW + GX) + (r % 2) * 40 - 20 + CW / 2, y: r * (CH + GY) + CH / 2, ra: rnd(i * 3.7), rb: rnd(i * 9.1 + 4) });
  }
  const mineCard = cards.find(k => k.mine);
  const WALL_W = COLS * (CW + GX), WALL_H = ROWS * (CH + GY);

  // ── Title ──────────────────────────────────────────────────────────────
  const title = h('div', 'abs', `<div class="kt kt-xl kt-ice" style="left:0;top:0;width:432px;text-align:center;">WINTER</div><div class="kt kt-xl kt-grad" style="left:0;top:70px;width:432px;text-align:center;">ARC</div>`, 'left:0;top:236px;width:432px;height:150px;');
  const sheen = h('div', 'abs', '', 'left:0;top:236px;width:432px;height:150px;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.55) 50%,transparent 60%);mix-blend-mode:overlay;');
  el.appendChild(title); el.appendChild(sheen);

  // Blue wipe: the Day 1 cell fills the frame and opens onto the wall
  const wipe = h('div', 'layer', '', 'background:radial-gradient(ellipse 80% 60% at 50% 40%, rgba(90,159,212,0.95), rgba(74,124,158,0.9));');
  el.appendChild(wipe);

  // ── The seed dot ───────────────────────────────────────────────────────
  const dot = h('div', 'abs', '', 'width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(90,159,212,0.55),0 0 24px 6px rgba(90,159,212,0.55);');
  el.appendChild(dot);

  return {
    t0: 0, t1: C.storytelling + 0.6, el,
    update(t) {
      // Calendar
      const calOn = t < C.everyone + 0.47;
      show(calWrap, calOn); show(kick, calOn);
      if (calOn) {
        const idx = t < stepT0 ? 0 : Math.min(STEPS, 1 + Math.floor((t - stepT0) / stepDt));
        const d = seq[idx];
        cal.setMonth(2026, 9);
        if (!target) { const c1 = cal.map[1]; target = { x: 36 + c1.offsetLeft + c1.offsetWidth / 2, y: 150 + c1.offsetTop + c1.offsetHeight / 2 }; }
        Object.keys(cal.map).forEach(k => cal.paint(+k, { today: +k === d && t < fillT + 0.05 }));
        if (t >= fillT) cal.paint(1, { a: E.outCubic(prog(t, fillT, 0.18)), today: false, gold: 0 });
        const appear = E.outExpo(prog(t, 0.0, 0.55));
        const dive = E.inExpo(prog(t, C.everyone - 0.08, 0.5));
        const s = lerp(0.9, 1, appear) * lerp(1, 9, dive);
        const cx = target ? target.x : 216, cy = target ? target.y : 300;
        const dc = E.inOutCubic(prog(t, C.everyone - 0.25, 0.6));
        css(calWrap, { transform: `translate(${lerp(cx, 216, dc).toFixed(2)}px,${lerp(cy, 300, dc).toFixed(2)}px) scale(${s.toFixed(4)}) translate(${-cx}px,${-cy}px) translateY(${lerp(14, 0, appear).toFixed(2)}px)`, opacity: (appear * (1 - prog(t, C.everyone + 0.3, 0.15))).toFixed(3), filter: `blur(${(lerp(6, 0, appear) + dive * 2).toFixed(2)}px)` });
        css(kick, { opacity: (E.outCubic(prog(t, fillT, 0.2)) * (1 - prog(t, C.everyone - 0.05, 0.15))).toFixed(3), transform: `translateY(${lerp(6, 0, E.outCubic(prog(t, fillT, 0.25)))}px)` });
      }

      const wp = env(t, C.everyone + 0.12, C.everyone + 0.62, 0.14, 0.32, E.inQuad, E.outQuad);
      show(wipe, wp > 0.002); css(wipe, { opacity: (wp * 0.85).toFixed(3) });

      // Wall
      const wallOn = t >= C.everyone && t < C.understand + 0.2;
      show(wallOuter, wallOn);
      if (wallOn) {
        // camera: pull back to reveal "everyone", then dive into "yours"
        const pull = E.outCubic(prog(t, C.everyone, 1.9));
        const dive = E.inOutCubic(prog(t, C.andYours, 0.62));
        const fall = t >= C.fail + 0.06;
        const sc = lerp(lerp(1.25, 0.66, pull), 1.18, dive);
        const rx = lerp(lerp(30, 22, pull), 0, dive), rz = lerp(lerp(-14, -9, pull), 0, dive);
        const fx0 = mineCard.x, fy0 = mineCard.y;
        const scrX = lerp(216, 216, dive), scrY = lerp(lerp(330, 300, pull), 300, dive);
        css(wall, { transform: `translate(${scrX}px,${scrY}px) perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)}) translate(${-fx0}px,${-fy0}px)` });
        const titleDim = env(t, C.winterArc - 0.02, C.andYours + 0.15, 0.08, 0.3);
        cards.forEach(k => {
          const ta = C.everyone + 0.05 + k.dist * 0.07 + k.ra * 0.06;
          const a = prog(t, ta, 0.42);
          const td = C.everyone + 0.55 + k.dist * 0.11 + k.rb * 0.2;
          let done = E.outCubic(prog(t, td, 0.3));
          let op = E.outCubic(a), y = lerp(26, 0, E.outBack(a)), rot = 0, filt = '';
          if (k.mine) {
            done *= 1 - E.inOutCubic(prog(t, C.fail - 0.26, 0.26));
            k.card.setRisk(t >= C.fail - 0.24 && t < C.fail + 0.1);
            k.card.setStreak(t < C.fail - 0.24 ? 3 : 0);
            if (t >= C.fail) filt = `grayscale(${E.outCubic(prog(t, C.fail, 0.2))}) brightness(${lerp(1, 0.55, prog(t, C.fail, 0.3))})`;
            const pop = Math.sin(clamp((t - C.fail) / 0.18, 0, 1) * Math.PI) * 0.05;
            css(k.card.el, { zIndex: '5' });
            k.card.item.style.setProperty('transform', `scale(${1 + pop})`);
          } else {
            op *= lerp(1, 0.18, E.inOutCubic(prog(t, C.andYours, 0.5)));
            if (titleDim > 0) op *= lerp(1, 0.45, titleDim);
          }
          if (fall) {
            const tf = C.fail + 0.06 + (k.mine ? 0.2 : k.dist * 0.035 + k.ra * 0.08);
            const g = Math.max(0, t - tf);
            y += 900 * g * g;
            rot = (k.ra - 0.5) * 50 * g + (k.mine ? 20 * g : 0);
            op *= 1 - prog(t, tf + 0.25, 0.5);
          }
          k.card.setDone(done);
          css(k.card.el, { opacity: op.toFixed(3), transform: `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`, filter: filt });
        });
      }

      // Title slam
      const tIn = prog(t, C.winterArc - 0.03, 0.26), tOut = E.inBack(prog(t, C.andYours, 0.28));
      const titleOn = t >= C.winterArc - 0.03 && t < C.andYours + 0.3;
      show(title, titleOn); show(sheen, titleOn);
      if (titleOn) {
        const sIn = lerp(1.7, 1, E.outExpo(tIn));
        css(title, { opacity: (clamp(tIn * 3, 0, 1) * (1 - tOut)).toFixed(3), transform: `translateY(${(-160 * tOut).toFixed(1)}px) scale(${(sIn * lerp(1, 0.9, tOut)).toFixed(4)})`, filter: `blur(${(lerp(10, 0, E.outCubic(tIn)) + 6 * tOut).toFixed(2)}px) drop-shadow(0 0 18px rgba(90,159,212,${(0.55 * (1 - tOut)).toFixed(2)}))` });
        const sw = prog(t, C.winterArc + 0.12, 0.55);
        css(sheen, { opacity: (sw > 0 && sw < 1 ? 1 : 0).toString(), backgroundPosition: '0 0', transform: `translateX(${lerp(-430, 430, E.inOutSine(sw)).toFixed(1)}px)`, WebkitMaskImage: 'none' });
      }


      // Seed dot appears in the dark
      const dOn = t >= C.understand - 0.1;
      show(dot, dOn);
      if (dOn) {
        const a = E.outBack(prog(t, C.understand - 0.1, 0.4));
        const pp = pulse(t, C.this, 5);
        const toX = kf(t, [[C.storytelling, 216], [C.storytelling + 0.6, 216]]);
        css(dot, { left: toX + 'px', top: '300px', transform: `scale(${(a * (1 + 0.6 * pp)).toFixed(3)})`, opacity: (1 - prog(t, C.storytelling + 0.3, 0.3)).toFixed(3) });
      }
    },
  };
}
