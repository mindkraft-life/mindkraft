// ════════════════════════════════════════════════════════════════════════
// Components — Mindkraft UI pieces built from the app's own markup (copied
// from app.js renderers / index.html) so the app's style.css paints them
// exactly as it does in the product. Each builder returns the element plus
// small setters the scenes drive from t. No CSS transitions run here (the
// scene stylesheet disables them); every visual change is set per frame.
// ════════════════════════════════════════════════════════════════════════
import { h, css, clamp, lerp, E, fmt, hiCanvas, clearCanvas } from './engine.js';

export const COL = {
  bg: '#1a1a1a', card: '#22242a', blue: '#5a9fd4', blueDk: '#4a7c9e', green: '#4ade80', greenXp: '#6dbf7e',
  ring: '#5fa874', coral: '#fb923c', amber: '#fbbf24', rose: '#c26a7a', gold: '#f5c563',
  txt: '#ffffff', txt2: '#b0b0b0',
  dim: { blue: '#4a7c9e', red: '#8e3b5f', green: '#6b7c3f', olive: '#7a7b4d', purple: '#7a5d9e', teal: '#3f8a87', amber: '#b88242', rose: '#c26a7a', indigo: '#5a6ba8', sage: '#6b8b6f' },
};
// Overlay series colours from app.js CHART_LINE_COLORS / CHART_FILL_COLORS.
export const CHART_LINE = ['#5a9fd4', '#6dbf7e', '#e0a050', '#e05c7a', '#9b6db5'];

const FLAME = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>';
const RISK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.7 3h16.96a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>';
const CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const RING_CIRC = 125.66;

// ── Activity card (renderActivityCards) ──────────────────────────────────
export function activityCard({ name, xp = 20, streak = 0, dim = null, risk = false }) {
  const wrap = h('div', 'act-group-body expanded mk-cardwrap');
  wrap.innerHTML = `
    <div class="activity-item" ${dim ? `style="--dim-color:${COL.dim[dim] || dim};"` : ''}>
      <div class="activity-info-container">
        <div class="activity-row-main">
          <button class="act-expand-btn" aria-label="Expand"><svg class="act-expand-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
          <div class="card-content-col">
            <div class="activity-name"></div>
            <div class="card-meta">
              <span class="card-xp"></span>
              <span class="card-streak">${FLAME}<b class="mk-streak-n"></b></span>
              <span class="card-atrisk" aria-label="Streak at risk">${RISK}Risk</span>
            </div>
          </div>
          <div class="activity-row-right">
            <div class="act-ring-wrap">
              <svg class="act-ring-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <circle class="act-ring-bg" cx="24" cy="24" r="20" fill="none" stroke-width="3"/>
                <circle class="act-ring-done-fill" cx="24" cy="24" r="20" stroke="none"/>
                <circle class="act-ring-fill" cx="24" cy="24" r="20" fill="none" stroke-width="3" stroke-dasharray="${RING_CIRC}" stroke-dashoffset="${RING_CIRC}" transform="rotate(-90 24 24)"/>
              </svg>
              <div class="act-ring-label"><span class="mk-check">${CHECK}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="mk-sheenwrap"><div class="mk-sheen"></div></div>
    </div>`;
  const item = wrap.firstElementChild;
  const q = s => item.querySelector(s);
  const r = {
    el: wrap, item,
    name: q('.activity-name'), xp: q('.card-xp'), streak: q('.card-streak'), streakN: q('.mk-streak-n'),
    risk: q('.card-atrisk'), done: q('.act-ring-done-fill'), arc: q('.act-ring-fill'), bg: q('.act-ring-bg'),
    check: q('.mk-check'), ringWrap: q('.act-ring-wrap'), sheen: q('.mk-sheen'),
  };
  /** A light sweep across the card, p: 0..1 (hidden outside). */
  r.setSheen = (p) => css(r.sheen, { opacity: p > 0 && p < 1 ? '1' : '0', transform: `translateX(${lerp(-140, 480, E.inOutSine(clamp(p, 0, 1))).toFixed(1)}px) skewX(-18deg)` });
  r.name.textContent = name;
  r.xp.textContent = `+${xp} XP`;
  r.setName = (s) => { if (r.name.textContent !== s) r.name.textContent = s; };
  r.setXP = (n) => { const s = `+${n} XP`; if (r.xp.textContent !== s) r.xp.textContent = s; };
  r.setStreak = (n) => { show(r.streak, n > 0); const s = String(n); if (r.streakN.textContent !== s) r.streakN.textContent = s; css(r.arc, { strokeDashoffset: (RING_CIRC * (1 - Math.min(n, 5) / 5)).toFixed(2) }); };
  r.setRisk = (on) => show(r.risk, on);
  /** p: 0 = open ring, 1 = completed (green fill + check + muted card). */
  r.setDone = (p) => {
    const on = p >= 0.5;
    if (item.classList.contains('completed') !== on) item.classList.toggle('completed', on);
    css(r.done, { fillOpacity: String(clamp(p * 1.4, 0, 1)) });
    css(r.check, { opacity: String(clamp((p - 0.35) * 3, 0, 1)), transform: `scale(${lerp(0.4, 1, E.outBack(clamp((p - 0.3) * 1.6, 0, 1)))})` });
    css(r.ringWrap, { boxShadow: p > 0 ? `0 0 ${12 + 14 * (1 - p)}px rgba(95,168,116,${0.2 + 0.25 * (1 - p) * p * 4})` : 'none', borderRadius: '50%' });
  };
  r.setStreak(streak); r.setRisk(risk); r.setDone(0);
  return r;
}
function show(el, on) { css(el, { display: on ? '' : 'none' }); }

/** A burst of particles (completion sparkle / gold milestone), p: 0..1. */
export function burst(ctx, x, y, p, seed, { n = 16, r0 = 4, r1 = 56, cols = ['#4ade80', '#6dbf7e', '#b8f5cc'], size = 2.2, gravity = 18 } = {}) {
  if (p <= 0 || p >= 1) return;
  const e = E.outCubic(p);
  for (let j = 0; j < n; j++) {
    const k = seed * 31 + j;
    const a = (j / n) * 6.283 + (Math.sin(k * 12.9898) * 43758.5453 % 1) * 0.6;
    const d = lerp(r0, r1 * (0.6 + 0.4 * Math.abs(Math.sin(k * 7.13))), e);
    ctx.globalAlpha = (1 - p) * (j % 3 ? 0.9 : 0.6);
    ctx.fillStyle = cols[j % cols.length];
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d + gravity * p * p, size * (1 - 0.6 * p), 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── Group header ("To Do" section) ───────────────────────────────────────
export function groupHeader(label, icon, count) {
  return h('div', 'act-group-header', `<span class="collapse-icon expanded"><i class="ph-bold ph-caret-down"></i></span><span class="act-group-label">${icon ? `<i class="ph-bold ph-${icon} mk-ico-lead"></i> ` : ''}${label}</span><span class="act-group-count">${count}</span>`);
}

// ── Sticky header: level + XP bar + avatar ───────────────────────────────
let _gradId = 0;
export function stickyHeader({ level = 14, xp = 620, toNext = 230, pct = 0.7, initial = 'A' }) {
  const gid = 'lvlGrad' + (++_gradId);
  const el = h('div', 'sticky-header mk-header', `
    <div class="header-content"><div class="header-top">
      <div class="level-badge"><span class="level-label">Level</span>
        <div class="level-display">
          <svg class="level-svg" width="68" height="50" overflow="visible" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="30%" stop-color="var(--color-text-primary)"/><stop offset="100%" stop-color="var(--color-progress)"/></linearGradient></defs>
            <text class="level-svg-text level-svg-fill mk-lvl" x="0" y="42" style="fill:url(#${gid})"></text>
            <text class="level-svg-text level-svg-trace mk-lvl-trace" x="0" y="42"></text>
          </svg>
        </div>
      </div>
      <div class="progress-section">
        <div class="progress-meta">
          <div class="progress-alt"><div class="progress-alt-frame">
            <span class="progress-alt-spacer">100% done</span>
            <span class="progress-alt-item progress-alt-xp" data-state="active"><span class="progress-alt-num mk-xp"></span><span class="progress-alt-label"> XP</span></span>
          </div></div>
          <div class="header-meta-right"><span class="header-meta-xp-left"><span class="mk-next"></span> XP to next</span></div>
        </div>
        <div class="progress-bar-container"><div class="progress-bar mk-bar"></div></div>
      </div>
      <div class="user-info"><button class="profile-avatar-btn"><span style="font-size:15px;font-weight:700;line-height:1;">${initial}</span></button></div>
    </div></div>`);
  const r = { el, lvl: el.querySelector('.mk-lvl'), trace: el.querySelector('.mk-lvl-trace'), xp: el.querySelector('.mk-xp'), next: el.querySelector('.mk-next'), bar: el.querySelector('.mk-bar'), svg: el.querySelector('.level-svg') };
  r.set = ({ level, xp, toNext, pct, trace = 0, pop = 0 }) => {
    const L = String(level);
    if (r.lvl.textContent !== L) { r.lvl.textContent = L; r.trace.textContent = L; r.svg.setAttribute('width', L.length > 1 ? 68 : 40); }
    const X = fmt(xp); if (r.xp.textContent !== X) r.xp.textContent = X;
    const N = fmt(toNext); if (r.next.textContent !== N) r.next.textContent = N;
    css(r.bar, { width: (clamp(pct, 0, 1) * 100).toFixed(2) + '%' });
    // Gold trace: the app's levelTraceDraw keyframes, driven by `trace` 0..1.
    const off = trace < 0.6 ? lerp(600, 0, E.inOutSine(trace / 0.6)) : lerp(0, -600, E.inSine((trace - 0.6) / 0.4));
    const op = trace <= 0 || trace >= 1 ? 0 : Math.min(1, trace * 12, (1 - trace) * 6);
    css(r.trace, { strokeDashoffset: off.toFixed(1), opacity: op.toFixed(3) });
    css(r.svg, { transform: `scale(${1 + 0.18 * pop})`, transformOrigin: '30% 70%' });
  };
  r.set({ level, xp, toNext, pct });
  return r;
}

// ── Toast pill (_showToastPill) ──────────────────────────────────────────
export function toastPill(label, tone = 'xp', icon = 'lightning') {
  const TONES = { xp: { fg: 'var(--chip-xp-fg)', ring: 'rgba(74,222,128,0.32)' }, info: { fg: 'var(--color-progress)', ring: 'rgba(90,159,212,0.32)' }, streak: { fg: 'var(--chip-streak-fg)', ring: 'rgba(251,146,60,0.34)' }, neg: { fg: 'var(--color-accent-red)', ring: 'rgba(193,103,103,0.34)' } };
  const t = TONES[tone];
  const el = h('div', 'xp-toast-pill mk-pill', `<span class="xp-toast-icon" style="color:${t.fg};"><i class="ph-fill ph-${icon}"></i></span><span class="xp-toast-label">${label}</span>`);
  el.style.setProperty('--toast-ring', t.ring); el.style.setProperty('--toast-fg', t.fg);
  return { el, label: el.querySelector('.xp-toast-label') };
}

// ── Message toast (showToast → .mk-toast) ────────────────────────────────
export function msgToast(msg, icon = 'fire', color = '#6dbf7e') {
  const el = h('div', 'mk-toast mk-toast-in mk-msgtoast', `<span class="mk-toast-icon" style="color:${color}"><i class="ph-fill ph-${icon}"></i></span><span class="mk-toast-msg">${msg}</span>`);
  el.style.setProperty('--toast-accent', color);
  return { el };
}

// ── Floating "+XP" (spawnFloatingXP) ─────────────────────────────────────
export function floatXP(text, color = COL.green) {
  return h('div', 'mk-float', text, `color:${color}`);
}

// ── Level-up card (showLevelUpAnimation, no-reward branch) ───────────────
export function levelUpCard(level) {
  const el = h('div', 'level-up-card mk-lvlcard', `
    <button type="button" class="level-up-close" aria-label="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    <div class="level-up-eyebrow">LEVEL UP</div>
    <div class="level-up-emoji"><i class="ph-fill ph-confetti mk-ico-block"></i></div>
    <div class="level-up-headline">Level ${level}</div>
    <button type="button" class="level-up-share-btn"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg><span>Share progress</span></button>`);
  return { el, headline: el.querySelector('.level-up-headline') };
}

// ── Landing logo (lp-logo-ring + lp-brand-name) ──────────────────────────
export function brandLockup({ tagline = 'Gamify your life.', chips = false } = {}) {
  const el = h('div', 'mk-brand', `
    <div class="lp-logo-ring"><div class="lp-logo-pulse"></div><div class="lp-logo-emoji"><i class="ph-bold ph-brain"></i></div></div>
    <div class="lp-brand-name">Mindkraft</div>
    <div class="lp-tagline mk-tag">${tagline}</div>
    ${chips ? `<div class="lp-pills mk-lpchips"><span class="lp-pill mk-lpchip"><i class="ph-bold ph-lightning mk-ico-lead" aria-hidden="true"></i>XP &amp; Levels</span><span class="lp-pill mk-lpchip"><i class="ph-bold ph-fire mk-ico-lead" aria-hidden="true"></i>Streaks</span><span class="lp-pill mk-lpchip"><i class="ph-bold ph-trophy mk-ico-lead" aria-hidden="true"></i>Challenges</span></div>` : ''}`);
  return { el, ring: el.querySelector('.lp-logo-ring'), pulse: el.querySelector('.lp-logo-pulse'), icon: el.querySelector('.lp-logo-emoji'), name: el.querySelector('.lp-brand-name'), tag: el.querySelector('.mk-tag'), chips: [...el.querySelectorAll('.mk-lpchip')] };
}

// ── Calendar card (renderCalendar) ───────────────────────────────────────
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function calendarCard({ title = true } = {}) {
  const el = h('div', 'analytics-card mk-cal', `
    ${title ? `<div class="an-cal-header"><div class="an-cal-nav"><button class="an-cal-arrow" aria-label="Previous month"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button><span class="an-cal-month mk-cal-title"></span><button class="an-cal-arrow" aria-label="Next month"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button></div></div>` : ''}
    <div class="calendar-month-grid">${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => `<div class="calendar-dow">${d}</div>`).join('')}${Array.from({ length: 42 }, () => '<div class="calendar-day"><span class="mk-cal-n"></span></div>').join('')}</div>`);
  const cells = [...el.querySelectorAll('.calendar-day')];
  const r = { el, cells, title: el.querySelector('.mk-cal-title'), y: 0, m: -1 };
  /** Lay out a month; returns a map day → cell. */
  r.setMonth = (y, m) => {
    if (r.y === y && r.m === m) return r.map;
    r.y = y; r.m = m;
    if (r.title) r.title.textContent = `${MONTHS[m]} ${y}`;
    const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    const rows = Math.ceil((first + days) / 7);
    r.map = {};
    cells.forEach((c, i) => {
      const d = i - first + 1;
      const vis = i < rows * 7;
      css(c, { display: vis ? '' : 'none' });
      if (d >= 1 && d <= days) { c.className = 'calendar-day'; c.firstChild.textContent = d; r.map[d] = c; }
      else { c.className = 'calendar-day empty'; c.firstChild.textContent = ''; }
      c.__c = {}; c.removeAttribute('style'); if (!vis) c.style.display = 'none';
    });
    return r.map;
  };
  /** Paint one day: a = has-data alpha (0..1), today ring, rose (missed) outline. */
  r.paint = (d, { a = 0, today = false, rose = 0, gold = 0, dim = 1 } = {}) => {
    const c = r.map[d]; if (!c) return;
    const bg = a > 0 ? `rgba(90,159,212,${(0.88 * a).toFixed(3)})` : '';
    const ring = gold > 0 ? `0 0 0 ${1.5 * gold}px rgba(245,197,99,${gold}), 0 0 ${16 * gold}px rgba(245,197,99,${0.6 * gold})`
      : rose > 0 ? `0 0 0 ${1.5 * rose}px rgba(194,106,122,${rose}), 0 0 ${14 * rose}px rgba(194,106,122,${0.55 * rose})` : '';
    css(c, { background: bg, boxShadow: ring, opacity: String(dim) });
    if (c.classList.contains('today') !== today) c.classList.toggle('today', today);
    css(c.firstChild, { color: a > 0.4 ? 'rgba(255,255,255,0.95)' : '' });
  };
  return r;
}

// ── Stat tile (renderAnalyticsSummary) ───────────────────────────────────
const STAT_ICONS = {
  bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  fire: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
};
export function statTile(kind, icon, value, label) {
  const el = h('div', `an-stat-card an-stat-${kind}`, `<div class="an-stat-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${STAT_ICONS[icon]}</svg></div><div class="an-stat-value"></div><div class="an-stat-label">${label}</div>`);
  const v = el.querySelector('.an-stat-value');
  const r = { el, set: (s) => { if (v.textContent !== s) v.textContent = s; } };
  r.set(value);
  return r;
}

// ── Analytics chart card shell (XP Over Time) ────────────────────────────
export function chartCard({ w = 360, ch = 220, range = 'All', mode = 'cumulative' } = {}) {
  const el = h('div', 'analytics-card mk-chartcard', `
    <div class="an-chart-top">
      <div class="an-chart-title-row">
        <span class="an-section-kicker">XP Over Time</span>
        <div class="an-mode-tabs"><button class="an-mode-tab ${mode === 'cumulative' ? 'active' : ''}">Cumulative</button><button class="an-mode-tab ${mode === 'daily' ? 'active' : ''}">Daily</button></div>
      </div>
      <div class="an-range-selector">${['1M', '3M', '6M', '1Y', 'All'].map(k => `<button class="an-range-btn" data-r="${k}">${k}</button>`).join('')}</div>
    </div>
    <div class="mk-chartbox" style="height:${ch}px"></div>`, `width:${w}px`);
  const btns = [...el.querySelectorAll('.an-range-btn')];
  const r = { el, btns, box: el.querySelector('.mk-chartbox') };
  r.setRange = (k) => btns.forEach(b => { const on = b.dataset.r === k; if (b.classList.contains('active') !== on) b.classList.toggle('active', on); });
  r.setRange(range);
  return r;
}

/**
 * Draw an XP-over-time chart the way renderXPChart does — grid with y labels,
 * gradient fill under the main series, 2.5px line, dots when ≤ 40 points —
 * into `rect` (CSS px on a full-frame canvas), plus the video's extras:
 * progressive reveal (`upto` in x units), a glowing head, line glow, and a
 * camera { s, rot, F:[x,y], T:[x,y] } that zooms/rolls about screen point F
 * and places it at T. Line widths stay constant on screen while zooming.
 *
 * series: [{ pts:[{x, v}], color, fill, dashed, width, glow, dots, head, upto, alpha }]
 * view:   { x0, x1, v0, v1 } — the data window mapped onto rect.
 */
export function drawChart(cv, series, view, o = {}) {
  const ctx = cv.ctx;
  if (!o.noClear) clearCanvas(cv);
  const R = o.rect;
  const { x0, x1, v0, v1 } = view;
  const px = x => R.x + (x - x0) / (x1 - x0) * R.w;
  const py = v => R.y + R.h - (v - v0) / (v1 - v0) * R.h;
  const cam = o.cam || { s: 1, rot: 0, F: [0, 0], T: [0, 0] };
  const k = 1 / cam.s;
  ctx.save();
  ctx.translate(cam.T[0], cam.T[1]); ctx.rotate(cam.rot); ctx.scale(cam.s, cam.s); ctx.translate(-cam.F[0], -cam.F[1]);
  const ga = o.gridAlpha == null ? 1 : o.gridAlpha;
  if (ga > 0.001) {
    ctx.globalAlpha = ga;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = k;
    ctx.font = `${10 * k}px Inter, sans-serif`; ctx.fillStyle = 'rgba(176,176,176,0.7)';
    for (let i = 0; i <= 4; i++) {
      const y = R.y + R.h / 4 * i;
      ctx.beginPath(); ctx.moveTo(R.x, y); ctx.lineTo(R.x + R.w, y); ctx.stroke();
      if (!o.noYLabels) {
        const label = Math.round(v1 - (v1 - v0) * i / 4);
        ctx.textAlign = 'right';
        ctx.fillText(label >= 1000 ? (label / 1000).toFixed(1) + 'k' : label, R.x - 6 * k, y + 4 * k);
      }
    }
    if (o.xLabels) {
      ctx.textAlign = 'center';
      o.xLabels.forEach(([x, s, a = 1]) => { const X = px(x); if (X >= R.x - 2 && X <= R.x + R.w + 2) { ctx.globalAlpha = ga * a; ctx.fillText(s, X, R.y + R.h + 26 * k); } });
    }
    ctx.globalAlpha = 1;
  }
  if (o.clip !== false) { ctx.beginPath(); ctx.rect(R.x - 8 * k, R.y - 40 * k, R.w + 16 * k, R.h + 40 * k + 2 * k); ctx.clip(); }
  series.forEach((s, si) => {
    const upto = s.upto == null ? Infinity : s.upto;
    const pts = [];
    for (let i = 0; i < s.pts.length; i++) {
      const p = s.pts[i];
      if (p.x <= upto) pts.push(p);
      else { const q = s.pts[i - 1]; if (q) { const u = (upto - q.x) / (p.x - q.x); pts.push({ x: upto, v: lerp(q.v, p.v, u), partial: true }); } break; }
    }
    if (!pts.length) return;
    const a = s.alpha == null ? 1 : s.alpha;
    if (a <= 0.001) return;
    ctx.globalAlpha = a;
    if (s.fill && pts.length > 1) {
      const g = ctx.createLinearGradient(0, R.y, 0, R.y + R.h);
      g.addColorStop(0, s.fill); g.addColorStop(1, 'rgba(74,124,158,0)');
      ctx.beginPath(); ctx.moveTo(px(pts[0].x), py(pts[0].v));
      pts.forEach(p => ctx.lineTo(px(p.x), py(p.v)));
      ctx.lineTo(px(pts[pts.length - 1].x), R.y + R.h); ctx.lineTo(px(pts[0].x), R.y + R.h); ctx.closePath();
      ctx.fillStyle = g; ctx.fill();
    }
    const line = () => { ctx.beginPath(); ctx.moveTo(px(pts[0].x), py(pts[0].v)); pts.forEach(p => ctx.lineTo(px(p.x), py(p.v))); };
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const lw = (s.width || (si === 0 ? 2.5 : 2)) * k;
    ctx.setLineDash(s.dashed ? [5 * k, 3 * k] : []);
    if (s.glow && pts.length > 1) {
      line(); ctx.strokeStyle = s.color; ctx.lineWidth = lw + 7 * k * s.glow; ctx.globalAlpha = a * 0.16 * Math.min(1, s.glow); ctx.stroke();
      line(); ctx.lineWidth = lw + 2.5 * k * s.glow; ctx.globalAlpha = a * 0.35 * Math.min(1, s.glow); ctx.stroke();
      ctx.globalAlpha = a;
    }
    if (pts.length > 1) { line(); ctx.strokeStyle = s.color; ctx.lineWidth = lw; ctx.stroke(); }
    ctx.setLineDash([]);
    if (s.dots) {
      const r0 = (s.dotR || 3.5) * k;
      pts.forEach(p => { if (p.partial) return; const r = r0 * (s.dotScale ? s.dotScale(p) : 1); if (r <= 0) return; ctx.beginPath(); ctx.arc(px(p.x), py(p.v), r, 0, Math.PI * 2); ctx.fillStyle = s.color; ctx.fill(); });
    }
    if (s.head) {
      const p = pts[pts.length - 1], X = px(p.x), Y = py(p.v), r = 24 * k * s.head;
      const g = ctx.createRadialGradient(X, Y, 0, X, Y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.22, s.headColor || 'rgba(90,159,212,0.85)'); g.addColorStop(1, 'rgba(90,159,212,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(X, Y, 3.2 * k, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
  ctx.restore();
  // screen-space mapping helper (for placing DOM over chart points)
  const toScreen = (x, v) => {
    let X = px(x) - cam.F[0], Y = py(v) - cam.F[1];
    X *= cam.s; Y *= cam.s;
    const c = Math.cos(cam.rot), s_ = Math.sin(cam.rot);
    return [cam.T[0] + X * c - Y * s_, cam.T[1] + X * s_ + Y * c];
  };
  return { px, py, toScreen };
}

// ── Activity History rows (renderActivityHistory) ────────────────────────
export function historyCard() {
  const el = h('div', 'analytics-card mk-hist', `
    <div class="an-collapse-btn mk-hist-head"><span class="an-collapse-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span><div class="an-collapse-text"><span class="an-collapse-title">Activity History</span><span class="an-collapse-sub">All XP changes</span></div><svg class="an-collapse-chevron" style="transform:rotate(180deg)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
    <div class="mk-hist-list"></div>`);
  return { el, list: el.querySelector('.mk-hist-list') };
}
export function historyDateHeader(date, total) {
  return h('div', 'ah-date-header', `<span>${date}</span><div style="display:flex;align-items:center;gap:8px;"><span style="color:#6fcf97;font-size:11px;font-weight:700;">+${total} XP</span></div>`);
}
export function historyRow(xp, name, time) {
  return h('div', 'ah-row', `<span class="ah-xp pos">+${xp} XP</span><span class="ah-name">${name}</span><span class="ah-meta">${time}</span>`);
}

// ── Activity editor (openActivityModal) — the parts the story needs ──────
export function activityEditor() {
  const el = h('div', 'modal pl-modal ay-modal mk-editor', `
    <div class="modal-header pl-modal-header">
      <div class="ay-modal-titlerow"><div><div class="pl-modal-eyebrow">Activity</div><h3 class="modal-title">Create Activity</h3></div></div>
      <button class="pl-modal-close" type="button" aria-label="Close"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body pl-modal-body ay-modal-body">
      <div class="ay-field"><label class="pl-field-label">Activity Name</label><div class="pl-input mk-input"><span class="mk-typed"></span><span class="mk-caret"></span><span class="mk-ph">e.g., Morning Run, Read 10 pages</span></div></div>
      <div class="ay-field"><label class="pl-field-label">Base XP</label>
        <div class="ay-xp-presets">
          <button type="button" class="ay-xp-chip" data-xp="10"><span class="ay-xp-chip-label">Easy habit</span><span class="ay-xp-chip-value">10 XP</span></button>
          <button type="button" class="ay-xp-chip" data-xp="25"><span class="ay-xp-chip-label">Medium habit</span><span class="ay-xp-chip-value">25 XP</span></button>
          <button type="button" class="ay-xp-chip" data-xp="40"><span class="ay-xp-chip-label">Hard habit</span><span class="ay-xp-chip-value">40 XP</span></button>
        </div>
      </div>
      <div class="ay-field"><label class="pl-field-label">Frequency</label><div class="pl-input mk-select"><span class="mk-freq">Select…</span><svg class="mk-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></div>
    </div>
    <div class="modal-footer pl-modal-footer mk-editor-foot"><button type="button" class="btn-secondary pl-btn-secondary">Cancel</button><button type="button" class="btn-primary pl-btn-primary mk-save">Save Activity</button></div>`);
  const q = s => el.querySelector(s);
  return { el, typed: q('.mk-typed'), caret: q('.mk-caret'), ph: q('.mk-ph'), input: q('.mk-input'), chips: [...el.querySelectorAll('.ay-xp-chip')], freq: q('.mk-freq'), select: q('.mk-select'), save: q('.mk-save') };
}

// ── Tab pair with the indicator primitive (an-mode-tabs) ─────────────────
export function tabPair(a, b) {
  const el = h('div', 'an-mode-tabs mk-tabs', `<button class="an-mode-tab mk-tab">${a}</button><button class="an-mode-tab mk-tab">${b}</button><span class="mk-ind"></span>`);
  const tabs = [...el.querySelectorAll('.mk-tab')];
  return { el, tabs, ind: el.querySelector('.mk-ind') };
}

// ── Tap ripple ───────────────────────────────────────────────────────────
export function ripple() { return h('div', 'mk-ripple'); }
