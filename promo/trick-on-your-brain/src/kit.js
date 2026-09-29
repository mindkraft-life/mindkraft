/* ---------------------------------------------------------------------------
   PROMO KIT — shared helpers for the "A trick on your brain" B-roll scenes.
   Lives inside the SCENE block so the engine above stays untouched. Every
   helper is a pure function of its arguments; the grain tile and Path2D cache
   are fixed-seed caches, so frames stay deterministic in t.
   ------------------------------------------------------------------------- */
const K = (() => {
  const TAU = Math.PI * 2;
  const hash = (i, s = 0) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  const hexA = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const fmtN = n => Math.round(n).toLocaleString('en-US');

  /* ---- icons: 24-unit stroke geometry (Feather/Lucide style), drawn — never emoji ---- */
  const ICONS = {
    check:   ['M20 6 9 17 4 12'],
    heart:   ['M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'],
    bell:    ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
    lock:    ['r:3,11,18,11,2', 'M7 11V7a5 5 0 0 1 10 0v4'],
    unlock:  ['r:3,11,18,11,2', 'M7 11V7a5 5 0 0 1 9.9-1'],
    gift:    ['M20 12v10H4V12', 'r:2,7,20,5,1', 'M12 22V7', 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z', 'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'],
    zap:     ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'],
    bag:     ['M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
    play:    ['M6 3.5l13 8.5-13 8.5V3.5z'],
    userPlus:['M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'c:8.5,7,4', 'M20 8v6', 'M23 11h-6'],
    users:   ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'c:9,7,4', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
    clock:   ['c:12,12,10', 'M12 6v6l4 2'],
    trend:   ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
    book:    ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
    pulse:   ['M22 12h-4l-3 9L9 3l-3 9H2'],
    code:    ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
    music:   ['M9 18V5l12-2v13', 'c:6,18,3', 'c:18,16,3'],
    dollar:  ['M12 1v22', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
    star:    ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
    tag:     ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'c:7,7,1'],
    chat:    ['M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'],
    cap:     ['M22 10 12 5 2 10l10 5 10-5z', 'M6 12v5c3 3 9 3 12 0v-5', 'M22 10v6'],
    flame:   ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z'],
    trophy:  ['M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16', 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22', 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22', 'M18 2H6v7a6 6 0 0 0 12 0V2z'],
    calendar:['r:3,4,18,18,2', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
    sun:     ['c:12,12,4', 'M12 2v2', 'M12 20v2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M2 12h2', 'M20 12h2', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'],
    compass: ['c:12,12,10', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'],
    feather: ['M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z', 'M16 8 2 22', 'M17.5 15H9'],
    link:    ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
    arrowUp: ['M12 19V5', 'M5 12l7-7 7 7'],
    target:  ['c:12,12,10', 'c:12,12,6', 'c:12,12,2'],
  };
  const P2 = {};
  function paths(name) {
    if (!P2[name]) P2[name] = ICONS[name].map(d => {
      const p = new Path2D();
      if (d.startsWith('c:')) { const [x, y, r] = d.slice(2).split(',').map(Number); p.arc(x, y, r, 0, TAU); return p; }
      if (d.startsWith('r:')) { const [x, y, w, h, r] = d.slice(2).split(',').map(Number); p.roundRect(x, y, w, h, r); return p; }
      return new Path2D(d);
    });
    return P2[name];
  }
  function icon(c, name, x, y, size, col, o = {}) {
    c.save();
    if (o.alpha != null) c.globalAlpha *= o.alpha;
    c.translate(x, y);
    if (o.rot) c.rotate(o.rot);
    c.scale(size / 24, size / 24); c.translate(-12, -12);
    c.lineWidth = o.lw || 2; c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = col; c.fillStyle = o.fillCol || col;
    if (o.glow) shadow(c, o.glow, o.blur || 16);
    for (const p of paths(name)) { if (o.fill) c.fill(p); c.stroke(p); }
    c.restore();
  }

  /* ---- text ---- */
  function text(c, s, x, y, o = {}) {
    c.save();
    c.font = fn(o.w || 600, o.s || 40);
    c.fillStyle = o.col || COL.txt;
    c.textAlign = o.align || 'left';
    c.textBaseline = o.base || 'middle';
    if (o.track) { c.letterSpacing = o.track + 'px'; if (c.textAlign === 'center') x += o.track / 2; else if (c.textAlign === 'right') x += o.track; }
    if (o.alpha != null) c.globalAlpha *= o.alpha;
    if (o.glow) shadow(c, o.glow, o.blur || 20);
    c.fillText(s, x, y);
    c.restore();
  }
  function measure(c, s, w, size, track = 0) {
    c.save(); c.font = fn(w, size); if (track) c.letterSpacing = track + 'px';
    const m = c.measureText(s).width; c.restore(); return m;
  }
  /* a headline that reveals word by word: list = [{s, at, col}] */
  function words(c, list, cx, y, t, o = {}) {
    const w = o.w || 800, size = o.s || 96, gap = size * 0.28;
    const ws = list.map(it => measure(c, it.s, w, size, o.track || 0));
    let x = cx - (ws.reduce((a, b) => a + b, 0) + gap * (list.length - 1)) / 2;
    list.forEach((it, i) => {
      const p = prog(t, it.at, o.dur || 0.42);
      if (p > 0) {
        const oy = lerp(size * 0.45, 0, E.outBack(p));
        text(c, it.s, x, y + oy, { w, s: size, col: it.col || COL.txt, alpha: p * (o.alpha ?? 1), track: o.track, glow: it.glow });
      }
      x += ws[i] + gap;
    });
  }

  /* ---- atmosphere ---- */
  function glow(c, x, y, r, col, a) {
    if (a <= 0) return;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0));
    c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function vignette(c, W, H, a = 0.5) {
    const g = c.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.42, W / 2, H * 0.48, Math.max(W, H) * 0.72);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  let grainTile = null;
  function grain(c, W, H, t, a = 0.05) {
    if (!grainTile) {
      grainTile = document.createElement('canvas'); grainTile.width = grainTile.height = 256;
      const g = grainTile.getContext('2d'), im = g.createImageData(256, 256);
      for (let i = 0; i < 65536; i++) { const v = Math.floor(hash(i, 7) * 255); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
      g.putImageData(im, 0, 0);
    }
    // static grain: dithers the dark gradients against banding without costing bitrate
    c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'soft-light';
    c.fillStyle = c.createPattern(grainTile, 'repeat'); c.fillRect(0, 0, W, H);
    c.restore();
  }
  /* fade the whole frame in/out of black — soft in/out handles for the edit */
  function fadeEdges(c, W, H, t, dur, fin = 0.12, fout = 0.18) {
    const a = Math.max(1 - prog(t, 0, fin), prog(t, dur - fout, fout));
    if (a > 0.001) { c.save(); c.globalAlpha = a; c.fillStyle = '#0d0d0f'; c.fillRect(0, 0, W, H); c.restore(); }
  }
  function flash(c, W, H, p, col = '#ffffff', a = 0.35) {
    if (p <= 0 || p >= 1) return;
    c.save(); c.globalAlpha = (1 - E.outCubic(p)) * a; c.fillStyle = col; c.fillRect(0, 0, W, H); c.restore();
  }
  const shake = (t, t0, dur, amp, seed = 1) => {
    if (t < t0 || t > t0 + dur) return [0, 0];
    const k = 1 - prog(t, t0, dur), f = Math.floor(t * 60);
    return [(hash(f, seed) - 0.5) * 2 * amp * k, (hash(f, seed + 9) - 0.5) * 2 * amp * k];
  };

  /* ---- particles (non-gold; gold is sparkleBurst, reserved for level-ups) ---- */
  function burst(c, x, y, p, n, rad, col, seed = 0, size = 7) {
    if (p <= 0 || p >= 1) return;
    c.save(); c.fillStyle = col; shadow(c, col, 14);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + hash(i, seed) * 0.6;
      const d = E.outExpo(p) * rad * (0.45 + 0.55 * hash(i, seed + 1));
      c.globalAlpha = (1 - p) * (0.6 + 0.4 * hash(i, seed + 2));
      c.beginPath(); c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d - p * p * rad * 0.25, lerp(size, 1.2, p), 0, TAU); c.fill();
    }
    c.restore();
  }

  /* ---- progress ring ---- */
  function ring(c, x, y, r, pct, col, lw, track = COL.track) {
    c.save(); c.lineCap = 'round'; c.lineWidth = lw;
    c.strokeStyle = track; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    if (pct > 0.001) {
      c.strokeStyle = col; shadow(c, col, 16);
      c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(pct, 0, 1)); c.stroke();
    }
    c.restore();
  }

  /* ---- the completion circle + animated check (from the app's activity card) ---- */
  function checkCircle(c, cx, cy, r, done, k = 1) {
    c.save();
    c.beginPath(); c.arc(cx, cy, r, 0, TAU);
    if (done) {
      c.fillStyle = COL.green; shadow(c, 'rgba(74,222,128,0.6)', 16); c.fill(); noShadow(c);
      c.strokeStyle = '#0c1f12'; c.lineWidth = Math.max(3, r * 0.2); c.lineCap = 'round'; c.lineJoin = 'round';
      const a = clamp(k * 2, 0, 1), b = clamp((k - 0.5) * 2, 0, 1);
      c.beginPath(); c.moveTo(cx - r * 0.42, cy);
      c.lineTo(lerp(cx - r * 0.42, cx - r * 0.1, a), lerp(cy, cy + r * 0.32, a));
      if (k > 0.5) c.lineTo(lerp(cx - r * 0.1, cx + r * 0.45, b), lerp(cy + r * 0.32, cy - r * 0.4, b));
      c.stroke();
    } else {
      c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = Math.max(2, r * 0.07); c.stroke();
    }
    c.restore();
  }

  /* ---- activity card: dimension edge, icon tile, name, XP chip, completion circle ---- */
  function activity(c, x, y, w, h, o) {
    const done = !!o.done;
    c.save();
    if (o.pulse) { const s = 1 + 0.045 * Math.sin(clamp(o.pulse, 0, 1) * Math.PI); c.translate(x + w / 2, y + h / 2); c.scale(s, s); c.translate(-(x + w / 2), -(y + h / 2)); }
    card(c, x, y, w, h, { dim: o.dim, dimGlow: done, bg: done ? '#23271f' : COL.card, r: o.r });
    const bs = h * 0.5, bx = x + w * 0.045 + bs / 2 + 4, by = y + h / 2;
    rr(c, bx - bs / 2, by - bs / 2, bs, bs, bs * 0.3); c.fillStyle = hexA(o.dim, 0.16); c.fill();
    icon(c, o.icon || 'check', bx, by, bs * 0.52, o.dim, { lw: 2.2 });
    const tx = bx + bs / 2 + w * 0.045;
    text(c, o.name, tx, y + h * (o.xp ? 0.37 : 0.5), { w: 600, s: o.fs || h * 0.24 });
    if (o.xp) chip(c, tx - 12 * h * 0.011 * (done ? 1 : 0), y + h * 0.53, o.xp, done ? 'xp' : 'counter', h * 0.011);
    if (o.right) o.right(c, x + w - h * 0.5, y + h / 2);
    else checkCircle(c, x + w - h * 0.5, y + h / 2, h * 0.22, done, o.k ?? 1);
    c.restore();
  }

  /* ---- notification toast (the instant-gratification world) ---- */
  function notif(c, x, y, w, h, o) {
    card(c, x, y, w, h, { r: h * 0.26 });
    const bs = h * 0.58, bx = x + h * 0.21 + bs / 2, by = y + h / 2;
    rr(c, bx - bs / 2, by - bs / 2, bs, bs, bs * 0.28); c.fillStyle = hexA(o.col, 0.18); c.fill();
    icon(c, o.icon, bx, by, bs * 0.5, o.col, { lw: 2.3, fill: o.fillIcon });
    const tx = bx + bs / 2 + h * 0.2;
    text(c, o.title, tx, y + h * 0.36, { w: 700, s: h * 0.2 });
    text(c, o.sub, tx, y + h * 0.66, { w: 500, s: h * 0.17, col: COL.txt3 });
    if (o.time) text(c, o.time, x + w - h * 0.24, y + h * 0.36, { w: 600, s: h * 0.15, col: COL.txt4, align: 'right' });
  }

  /* ---- the app's LEVEL UP! reward card (popIn: scale .6→1 with overshoot) ---- */
  function levelCard(c, cx, cy, w, p, o = {}) {
    if (p <= 0) return;
    const h = w * 0.9, s = lerp(0.6, 1, E.outBack(clamp(p, 0, 1)));
    c.save(); c.globalAlpha *= clamp(p * 2, 0, 1);
    c.translate(cx, cy); c.scale(s, s); c.translate(-cx, -cy);
    const x = cx - w / 2, y = cy - h / 2;
    shadow(c, 'rgba(245,197,99,0.30)', 70);
    rr(c, x, y, w, h, w * 0.06); c.fillStyle = COL.card; c.fill(); noShadow(c);
    rr(c, x, y, w, h, w * 0.06); c.lineWidth = 3; c.strokeStyle = hexA(COL.gold, 0.55); c.stroke();
    const ip = prog(p, 0.25, 0.6);
    icon(c, o.icon || 'gift', cx, y + h * 0.26, w * 0.2, COL.gold, { lw: 1.8, rot: lerp(-0.35, 0, E.outBack(ip)), glow: 'rgba(245,197,99,0.8)', blur: 24 });
    text(c, o.kicker || 'LEVEL UP!', cx, y + h * 0.47, { w: 800, s: w * 0.052, col: COL.gold, align: 'center', track: w * 0.012 });
    text(c, o.title || 'You earned a reward!', cx, y + h * 0.59, { w: 700, s: w * 0.075, align: 'center' });
    text(c, o.desc || '', cx, y + h * 0.69, { w: 500, s: w * 0.045, col: COL.txt2, align: 'center' });
    const bw = w * 0.62, bh = w * 0.14, bx = cx - bw / 2, by = y + h * 0.78;
    rr(c, bx, by, bw, bh, bh / 2); c.fillStyle = COL.blueDk; c.fill();
    text(c, o.cta || 'Claim Reward', cx, by + bh / 2, { w: 700, s: w * 0.05, align: 'center' });
    c.restore();
  }

  /* ---- ⚡ bolt drawn as a shape (logo mark) ---- */
  function bolt(c, x, y, size, col = '#fff', glowA = 0.6) {
    icon(c, 'zap', x, y, size, col, { fill: true, lw: 1.2, glow: `rgba(90,159,212,${glowA})`, blur: size * 0.6 });
  }

  return { TAU, hash, hexA, fmtN, icon, text, measure, words, glow, vignette, grain, fadeEdges, flash, shake, burst, ring, checkCircle, activity, notif, levelCard, bolt };
})();
