#!/usr/bin/env python3
"""Full-length background bed for the talking-head edit, plus a complete soundtrack.

A subtle score runs under the narration for the whole video. In every gap between two
B-roll clips it walks from the last clip's key and tempo into the next clip's: chords
voice-lead into the next clip's opening chord, and the pulse lands on the next clip's beat
grid (accelerating into it where the tempo rises). It swells into each In point, ducks
under the clip while following that clip's chords, and blooms on the clip's last chord at
the Out point before settling back under the voice.

Writes bed/:
  bg-bed.wav             the bed alone: put it at 00:00 and keep the clips' own audio
  full-soundtrack.wav    bed + every clip's score (with its natural tail) + SFX, as one
                         continuous track: mute the clips' audio and use this instead
Needs build/*.cues.json (node tools/render.mjs --cues). Usage: python3 tools/bed.py
"""
import json
import os
import sys

import numpy as np
from scipy import signal

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audio as A  # noqa: E402
from audio import N, SR, TAU, filt, hz, secs, st  # noqa: E402

ROOT = A.ROOT
OUT = os.path.join(ROOT, 'bed')
END = 161.99                      # the end card runs to 02:41.99
BED_LUFS = -27.0                  # under narration: ~13 dB below a -14 LUFS voice

# Clip In points on the edit timeline (the insert map in README.md)
INS = {'01': 3.66, '02': 12.14, '03': 33.13, '04': 56.49, '05': 78.74,
       '06': 88.10, '07': 118.66, '08': 137.22, '09': 157.99}
NAMES = {f[:2]: f[:-10] for f in os.listdir(A.BUILD) if f.endswith('.cues.json')}
CUES = {k: json.load(open(os.path.join(A.BUILD, v + '.cues.json'))) for k, v in NAMES.items()}
DUR = {k: c['meta']['duration'] for k, c in CUES.items()}
OUTS = {k: INS[k] + DUR[k] for k in INS}


def mid(n):
    return int(round(69 + 12 * np.log2(hz(n) / 440.0)))


# --------------------------------------------------------------- harmony ----
# (start, end, voicing, bass). Inside a clip window the chords copy that clip's score,
# so the ducked bed stays consonant; in the gaps they voice-lead into the next clip.
_wk = [INS['07'] + c['t'] for c in CUES['07']['cues'] if c['s'] == 'dayNote']
WK = lambda d: _wk[d - 2]
Dm9, Bbmaj7 = ['D3', 'F3', 'A3', 'E4'], ['Bb2', 'D3', 'F3', 'A3']
Cmaj7, Fmaj7, Fmaj9 = ['C3', 'G3', 'B3', 'E4'], ['F2', 'C3', 'E3', 'A3'], ['F3', 'A3', 'C4', 'E4', 'G4']
CH = [
    # hook → 01 The Gap (D minor)
    (0.00, 7.42, Dm9, 'D2'), (7.42, 10.40, Bbmaj7, 'Bb1'),
    # "Let me explain…" → 02 Four Years (A minor)
    (10.40, 11.80, ['A2', 'F3', 'C4', 'E4'], 'A1'), (11.80, 15.38, ['A2', 'E3', 'B3', 'C4'], 'A1'),
    # 02 resolves to C → relationship section → 03 Compounding (Am, 85 BPM)
    (15.38, 17.466, Cmaj7, 'C2'), (17.466, 20.29, ['C3', 'G3', 'D4', 'E4'], 'C2'),
    (20.29, 23.114, ['B2', 'G3', 'D4'], 'B1'), (23.114, 25.938, ['A2', 'E3', 'G3', 'C4'], 'A1'),
    (25.938, 28.762, Fmaj7, 'F1'), (28.762, 31.586, ['D3', 'F3', 'A3', 'C4'], 'D2'),
    (31.586, 33.13, ['G2', 'D3', 'G3', 'B3'], 'G1'),
    (33.13, 35.822, ['A2', 'E3', 'A3', 'C4'], 'A1'), (35.822, 37.234, ['F2', 'C3', 'A3', 'C4'], 'F1'),
    (37.234, 38.65, ['C3', 'G3', 'C4', 'E4'], 'C2'), (38.65, 40.41, ['G2', 'D3', 'B3', 'D4'], 'G1'),
    # "the reward… comes late" → "don't even try" → V of F minor → 04 Dopamine Feed
    (40.41, 43.10, ['C3', 'G3', 'D4', 'E4', 'B4'], 'C2'), (43.10, 45.00, ['A2', 'E3', 'G3', 'B3', 'C4'], 'A1'),
    (45.00, 46.97, Fmaj7, 'F1'), (46.97, 50.73, ['F2', 'Ab2', 'C3', 'G3'], 'F1'),
    (50.73, 52.01, ['Db3', 'F3', 'Ab3', 'C4'], 'Db2'), (52.01, 54.60, ['C3', 'F3', 'G3', 'Bb3'], 'C2'),
    (54.60, 56.49, ['C3', 'E3', 'G3', 'Bb3'], 'C2'),
    (56.49, 58.365, ['F3', 'Ab3', 'C4'], 'F1'), (58.365, 60.24, ['Db3', 'F3', 'Ab3'], 'Db1'),
    (60.24, 62.115, ['Ab2', 'C3', 'Eb3'], 'Ab1'), (62.115, 63.99, ['Eb3', 'G3', 'Bb3'], 'Eb1'),
    # tape-stop → "slow and boring" → "what if…" → 05 Fake Reward (D minor → F)
    (63.99, 71.62, ['F2', 'C3', 'Ab3', 'G4'], 'F1'), (71.62, 73.30, ['Db3', 'F3', 'Ab3', 'C4'], 'Db2'),
    (73.30, 76.00, Bbmaj7, 'Bb1'), (76.00, 77.40, ['C3', 'F3', 'G3', 'C4'], 'C2'),
    (77.40, 78.74, ['C3', 'E3', 'G3', 'C4'], 'C2'),
    (78.74, 79.64, Dm9, 'D2'), (79.64, 80.24, Bbmaj7, 'Bb1'), (80.24, 80.82, ['C3', 'E3', 'G3', 'Bb3'], 'C2'),
    # "Now how will you do that?" → 06 Level Up (opens on Fmaj9)
    (80.82, 85.90, Fmaj9, 'F1'), (85.90, 87.30, ['Bb2', 'D3', 'F3', 'A3', 'C4'], 'Bb1'),
    (87.30, 88.80, Fmaj9, 'F1'), (88.80, 90.10, ['C3', 'G3', 'D4', 'E4'], 'C2'),
    (90.10, 91.10, ['C3', 'E3', 'G3', 'B3'], 'C2'), (91.10, 92.10, ['A2', 'E3', 'G3', 'C4'], 'A1'),
    (92.10, 93.10, ['F2', 'C3', 'A3', 'E4'], 'F1'), (93.10, 94.10, ['G2', 'D3', 'B3', 'F4'], 'G1'),
    (94.10, 95.10, ['C3', 'G3', 'C4', 'E4'], 'C2'), (95.10, 95.60, ['F2', 'C3', 'A3', 'F4'], 'F1'),
    (95.60, 96.10, ['G2', 'D3', 'B3', 'G4'], 'G1'),
    # "Of course, all of this is fake…" (120 BPM, C) → "difficult to begin with" → 07 (A sus2)
    (96.10, 98.10, ['C3', 'G3', 'C4', 'E4'], 'C2'), (98.10, 100.10, ['E3', 'G3', 'B3', 'D4'], 'E2'),
    (100.10, 102.10, Fmaj7, 'F1'), (102.10, 104.10, ['G2', 'D3', 'E3', 'B3'], 'G1'),
    (104.10, 106.10, ['A2', 'E3', 'G3', 'C4'], 'A1'), (106.10, 108.10, Fmaj7, 'F1'),
    (108.10, 110.10, ['C3', 'G3', 'C4', 'E4'], 'C2'), (110.10, 112.10, ['G2', 'D3', 'G3', 'B3'], 'G1'),
    (112.10, 114.10, ['F2', 'C3', 'A3', 'C4'], 'F1'), (114.10, 115.00, ['G2', 'D3', 'G3', 'B3'], 'G1'),
    (115.00, 120.61, ['A2', 'E3', 'B3'], 'A1'),
    (120.61, WK(8), ['C3', 'G3', 'C4', 'E4'], 'C2'), (WK(8), WK(15), ['A2', 'E3', 'A3', 'C4'], 'A1'),
    (WK(15), WK(22), ['F2', 'C3', 'A3', 'C4'], 'F1'), (WK(22), WK(29), ['G2', 'D3', 'B3', 'D4'], 'G1'),
    # testimonial (C, 100 BPM) → "building momentum": G → A → 08 Momentum (D, 150 BPM)
    (WK(29), 127.16, ['C3', 'G3', 'C4', 'E4'], 'C2'), (127.16, 129.56, ['A2', 'E3', 'G3', 'C4'], 'A1'),
    (129.56, 133.38, Fmaj7, 'F1'), (133.38, 135.22, ['G2', 'D3', 'G3', 'B3'], 'G1'),
    (135.22, 137.22, ['A2', 'E3', 'A3', 'C#4'], 'A1'),
    (137.22, 143.42, ['D3', 'A3', 'D4', 'F#4'], 'D2'), (143.42, 143.82, ['A2', 'E3', 'A3', 'C#4'], 'A1'),
    (143.82, 144.22, ['B2', 'F#3', 'B3', 'D4'], 'B1'), (144.22, 144.62, ['G2', 'D3', 'G3', 'B3'], 'G1'),
    # close: D → Bm → G → Gm (= ii of F) → Bb → C → 09 End Card (Fmaj9)
    (144.62, 147.78, ['D3', 'A3', 'D4', 'F#4'], 'D2'), (147.78, 150.18, ['B2', 'F#3', 'A3', 'D4'], 'B1'),
    (150.18, 151.78, ['G2', 'D3', 'F#3', 'B3'], 'G1'), (151.78, 154.24, ['G2', 'D3', 'G3', 'Bb3'], 'G1'),
    (154.24, 156.20, Bbmaj7, 'Bb1'), (156.20, 157.99, ['C3', 'F3', 'G3', 'Bb3'], 'C2'),
    (157.99, END + 2, ['F2', 'C3', 'A3', 'E4', 'G4'], 'F1'),
]


def chord_at(t):
    for t0, t1, notes, _ in CH:
        if t0 <= t < t1:
            return notes
    return CH[-1][2]


def arp(t, i, shift=12, pattern=(0, 1, 2, 3, 2, 1)):
    ms = sorted(mid(n) + shift for n in chord_at(t))
    return ms[pattern[i % len(pattern)] % len(ms)]


# ----------------------------------------------------------- instruments ----
def soft_pad(notes, dur, attack, release, bright=0.5, wob=0.0, seed=0):
    """Rounder than the clips' saw pads (few harmonics) so it sits under a voice."""
    n = N(dur)
    t = secs(n)
    r = A.rng(900 + seed)
    out = np.zeros((2, n))
    for i, nt in enumerate(notes):
        f = hz(nt)
        for j, cents in enumerate((-6, 0, 6)):
            fi = f * 2 ** (cents / 1200) * (1 + wob * np.sin(TAU * 0.55 * t + r.uniform(0, TAU)))
            ph = A.phase(fi, n) + r.uniform(0, TAU)
            v = sum((1 / k) ** (1.9 - 0.6 * bright) * np.sin(k * ph) for k in range(1, 8) if k * f < 6000)
            lfo = 1 + 0.1 * np.sin(TAU * (0.17 + 0.05 * i + 0.03 * j) * t + r.uniform(0, TAU))
            out += st(v * lfo, (j - 1) * 0.65)
    return out * A.env_ar(n, attack, release) / (len(notes) * 3)


def felt(f, dur=0.6, decay=5.0, wob=0.0):
    """Soft felt-piano-ish pluck."""
    n = N(dur)
    t = secs(n)
    ph = A.phase(f * (1 + wob * np.sin(TAU * 0.8 * t)), n)
    x = sum((1 / k ** 1.5) * np.exp(-t * (decay + 2.8 * k)) * np.sin(k * ph) for k in range(1, 9) if k * f < 9000)
    return x * np.minimum(t / 0.004, 1)


def rev_swell(dur, lo=500, hi=5000, seed=0):
    n = N(dur)
    u = np.linspace(0, 1, n)
    x = A.sweep(A.noise(dur, 1300 + seed), lo, hi, width=0.8) * u ** 2.6
    x[-N(0.03):] *= np.linspace(1, 0, N(0.03))
    return st(x)


def grid(anchor, step, t0, t1):
    """Beat times on the grid anchor + k*step inside [t0, t1)."""
    k = np.ceil((t0 - anchor) / step - 1e-9)
    out = []
    while anchor + k * step < t1 - 1e-9:
        out.append(anchor + k * step)
        k += 1
    return out


def ramp_to(t0, anchor, spb_from, spb_to):
    """Accelerating (or slowing) beats from t0 that land exactly one step before `anchor`."""
    beats, t = [], anchor
    while True:
        u = min(1.0, (anchor - t) / (anchor - t0))
        t -= spb_to + (spb_from - spb_to) * u
        if t < t0:
            break
        beats.append(t)
    return beats[::-1]


def env(t, pts):
    """Piecewise-linear gain over time: pts = [(t, g), …]."""
    xs, ys = zip(*pts)
    return float(np.interp(t, xs, ys))


def peaking(x, f0, db, q=0.8):
    a = 10 ** (db / 40)
    w0 = TAU * f0 / SR
    al = np.sin(w0) / (2 * q)
    b = [1 + al * a, -2 * np.cos(w0), 1 - al * a]
    aa = [1 + al / a, -2 * np.cos(w0), 1 - al / a]
    return signal.lfilter(b, aa, x, axis=-1)


# ------------------------------------------------------------------ bed ----
def compose():
    pads, bass, pul, perc, fx = (A.Bus(END, tail=4.0) for _ in range(5))

    for i, (t0, t1, notes, b) in enumerate(CH):
        seg = t1 - t0
        att, rel = min(0.8, max(0.06, seg * 0.45)), min(1.3, max(0.25, seg * 0.5))
        dark = 115.0 <= t0 < 120.61                         # "difficult to begin with"
        slow = 63.99 <= t0 < 71.62                          # "slow and boring"
        x = soft_pad(notes, seg + att * 0.5 + rel, att, rel, bright=0.15 if dark else 0.5,
                     wob=0.0035 if slow else 0.0, seed=i)
        pads.add(x, t0 - att * 0.5, 1.0, send=0.4)
        bass.add(st(A.bass(hz(b), seg + 0.15) * A.env_ar(N(seg + 0.15), 0.06, 0.2)), t0, 0.22, send=0.05)

    # hook → 01: clip 01's own ostinato and clock, arriving on its grid (3.71 + k·0.25)
    ost = ['D4', 'A3', 'F4', 'A3', 'E4', 'A3', 'F4', 'A3']
    for t in grid(3.71, 0.25, 1.4, INS['01']):
        i = int(round((t - 3.71) / 0.25))
        pul.add(st(A.pluck(hz(ost[i % 8]), 0.35, bright=0.25, decay=9)), t, env(t, [(1.4, 0.02), (3.66, 0.12)]), send=0.25)
    for t in grid(3.71, 0.5, 2.2, INS['01']):
        i = int(round((t - 3.71) / 0.5))
        perc.add(st(A.s_tick(i % 2 == 0, i)), t, env(t, [(2.2, 0.1), (3.66, 0.35)]), send=0.2)
    fx.add(rev_swell(1.3, seed=1), INS['01'] - 1.3, 0.25)

    # "Think about anything worth having" → 02: A pulse accelerating onto clip 02's 140 BPM grid
    for j, t in enumerate(ramp_to(10.4, INS['02'], 0.3, 60 / 140 / 4)):
        pul.add(st(A.bass(hz('A2' if j % 4 else 'A1'), 0.08)), t, env(t, [(10.4, 0.03), (12.14, 0.13)]), send=0.0)
    fx.add(A.s_riser(1.3, 300, 4000, 5, tone=False), INS['02'] - 1.3, 0.3)

    # relationship section at 85 BPM, on clip 03's grid (34.41 + k·0.706)
    q = 0.706
    for t in grid(34.41, q / 2, 17.466, INS['03']):
        i = int(round((t - 34.41) / (q / 2)))
        pul.add(st(felt(A.hz(arp(t, i)), 0.9), 0.25 * (1 if i % 2 else -1)), t, env(t, [(17.4, 0.05), (26, 0.08), (33.1, 0.12)]), send=0.3)
    for t in grid(34.41, q, 25.938, INS['03']):
        perc.add(st(filt(A.kick(1.0, 110, 56, 10), 'lowpass', 900)), t, env(t, [(25.9, 0.1), (33.1, 0.22)]), send=0.03)
    for i, t in enumerate(grid(34.41 + q / 2, q, 28.762, INS['03'])):
        perc.add(st(A.hat(1.0, False, 40 + i), 0.3), t, 0.12, send=0.05)
    fx.add(rev_swell(1.2, seed=3), INS['03'] - 1.2, 0.22)

    # 03 ends in C at 85 BPM: its pluck pattern rings on and fades (grid 40.41 + k·0.353)
    for t in grid(40.41, q / 2, OUTS['03'], 44.2):
        i = int(round((t - 40.41) / (q / 2)))
        pul.add(st(A.pluck(hz(['C5', 'G5', 'E5', 'B5'][i % 4]), 0.4, bright=0.5, decay=6)), t,
                0.17 * np.exp(-(t - OUTS['03']) * 1.1), send=0.35)
    for t, nt in ((43.10, 'E5'), (45.00, 'C5'), (46.97, 'Ab4')):
        pul.add(st(felt(hz(nt), 1.6, decay=2.5)), t, 0.1, send=0.5)

    # "To make things worse…" → 04: a C pedal pumping on clip 04's 128 BPM grid, filter opening
    build = A.Bus(END, tail=1.0)
    e8 = 60 / 128 / 2
    for i, t in enumerate(grid(INS['04'], e8, 52.97, INS['04'])):
        build.add(st(A.bass(hz('C2' if i % 2 == 0 else 'C3'), e8 * 0.8)), t, env(t, [(52.9, 0.06), (56.4, 0.2)]), send=0.0)
    for i, t in enumerate(grid(INS['04'] + e8, 2 * e8, 54.6, INS['04'])):
        build.add(st(A.hat(1.0, True, 60 + i), 0.2), t, env(t, [(54.6, 0.05), (56.4, 0.22)]), send=0.05)
    b = A.render_bus(build)
    i0, i1 = N(52.9), N(INS['04'])
    b[:, i0:i1] = np.vstack([A.sweep(ch[i0:i1], 250, 5000, kind='lowpass') for ch in b])
    perc.dry[:, :b.shape[1]] += b[:, :perc.dry.shape[1]]
    fx.add(A.s_riser(1.5, 300, 6000, 8, tone=False), INS['04'] - 1.5, 0.35)

    # after the tape-stop: "slow and boring" — a lazy clock at 60 BPM and a wobbly pad
    for i, t in enumerate(grid(66.5, 1.0, 66.4, 71.62)):
        perc.add(st(A.s_tick(i % 2 == 0, 80 + i)), t, 0.22, send=0.3)
    for t, nt in ((67.0, 'F4'), (69.0, 'Ab4'), (71.0, 'G4')):
        pul.add(st(felt(hz(nt), 2.0, decay=2.2, wob=0.004)), t, 0.1, send=0.5)
    # "What if we could play a little trick…": airy bells on clip 05's 0.6 s grid
    bells = ['Bb5', 'D6', 'F6', 'A6', 'F6', 'D6']
    for i, t in enumerate(grid(80.82, 0.6, 73.3, 76.0)):
        pul.add(st(A.bell(hz(bells[i % 6]), 1.4, 3.0, 0.8, 3), 0.5 if i % 2 else -0.5), t, 0.05, send=0.6)
    for t in grid(81.09, 0.3, 76.0, INS['05']):
        i = int(round((t - 81.09) / 0.3))
        pul.add(st(A.marimba(hz(arp(t, i, 24)), 0.6)), t, env(t, [(76.0, 0.03), (78.7, 0.11)]), send=0.35)
    fx.add(rev_swell(1.2, seed=5), INS['05'] - 1.2, 0.2)

    # 05's marimba motif rings on after it (grid 81.09 + k·0.3), then a riser into 06's logo zap
    motif = ['F5', 'A5', 'C6', 'A5', 'G5', 'C6', 'E6', 'C6']
    for t in grid(81.09, 0.3, OUTS['05'], 86.2):
        i = int(round((t - 81.09) / 0.3))
        pul.add(st(A.marimba(hz(motif[i % 8]), 0.6)), t, 0.17 * np.exp(-(t - OUTS['05']) * 1.2), send=0.35)
    for t in grid(80.82, 0.6, OUTS['05'], 85.6):
        perc.add(st(A.kick(0.35)), t, np.exp(-(t - OUTS['05']) * 1.3), send=0.03)
    fx.add(A.s_riser(1.6, 300, 6000, 9, tone=False), INS['06'] - 1.6, 0.45)

    # "Of course, all of this is fake…": 06's 120 BPM groove continues as soft lo-fi (grid 88.10)
    lead = ['C6', 'E6', 'G6', 'E6', 'C6', 'G5', 'A5', 'C6', 'F6', 'A6', 'G6', 'F6', 'D6', 'B5', 'C6', 'G6', 'C7']
    for t in grid(94.35, 0.25, OUTS['06'], 98.1):
        i = int(round((t - 94.35) / 0.25))
        g = 0.06 * np.exp(-(t - OUTS['06']) * 1.8)
        pul.add(st(A.square(hz(lead[i % 17]), 0.2) * A.env_ad(N(0.2), 0.003, 0.08), 0.15), t, g, send=0.3)
    groove_g = lambda t: env(t, [(96.58, 1.0), (98.5, 0.6), (104, 0.65), (110, 0.8), (113.6, 0.8), (115.1, 0.0)])
    for t in grid(88.10, 0.25, OUTS['06'], 115.1):
        i = int(round((t - 88.10) / 0.25))
        pul.add(st(felt(hz(arp(t, i)), 0.7), 0.3 if i % 2 else -0.3), t, 0.09 * groove_g(t), send=0.3)
    for t in grid(88.10, 1.0, OUTS['06'], 115.1):
        perc.add(st(filt(A.kick(1.0, 120, 56, 10), 'lowpass', 1200)), t, 0.2 * groove_g(t), send=0.03)
    for i, t in enumerate(grid(88.60, 1.0, 104.1, 115.1)):
        perc.add(st(A.snare(1.0, 200 + i)), t, 0.05 * groove_g(t), send=0.2)
    for i, t in enumerate(grid(88.35, 0.5, OUTS['06'], 115.1)):
        perc.add(st(A.hat(1.0, False, 100 + i), 0.3), t, 0.12 * groove_g(t), send=0.05)
    # "difficult to begin with…": 07's heartbeat, arriving on its grid (118.71 − k·0.72)
    for t in grid(118.71, 0.72, 115.0, INS['07']):
        for o, g in ((0, 1.0), (0.17, 0.7)):
            perc.add(st(filt(A.kick(g, 95, 52, 12), 'lowpass', 400)), t + o, env(t, [(115, 0.25), (118.6, 0.5)]), send=0.05)

    # testimonial: 07's 100 BPM hats and marimba carry on (grid 121.16 + k·0.3) …
    for t in grid(121.16, 0.3, OUTS['07'], 130.8):
        i = int(round((t - 121.16) / 0.3))
        g = env(t, [(124.74, 1.0), (126.5, 0.6), (130.8, 0.7)])
        pul.add(st(A.marimba(hz(arp(t, i)), 0.6), 0.3 if i % 2 else -0.3), t, 0.1 * g, send=0.35)
        perc.add(st(A.hat(1.0, False, 300 + i), 0.25), t, 0.1 * g, send=0.05)
    for t in grid(121.16, 2.4, OUTS['07'], 130.8):
        perc.add(st(filt(A.kick(1.0, 110, 56, 10), 'lowpass', 1000)), t, 0.16, send=0.03)
    # … then "you start building momentum": accelerate onto 08's 150 BPM grid
    acc = ramp_to(130.8, INS['08'], 0.3, 0.2)
    for i, t in enumerate(acc):
        g = env(t, [(130.8, 0.07), (137.2, 0.14)])
        pul.add(st(A.marimba(hz(arp(t, i)), 0.5), 0.3 if i % 2 else -0.3), t, g, send=0.3)
        perc.add(st(A.hat(1.0, False, 400 + i), 0.25), t, g * 0.9, send=0.05)
        if i % 2 == 0:
            perc.add(st(filt(A.kick(1.0, 110, 56, 10), 'lowpass', 1000)), t, g * 1.3, send=0.03)
    fx.add(A.s_riser(1.5, 300, 6000, 11, tone=False), INS['08'] - 1.5, 0.3)

    # close: 08's guitar keeps picking (grid 137.42 + k·0.2) and relaxes to quarters, then halves
    riff = ['D3', 'A3', 'D4', 'F#4', 'A4', 'F#4', 'D4', 'A3']
    for t in grid(137.42, 0.2, OUTS['08'], 147.78):
        i = int(round((t - 137.42) / 0.2))
        pul.add(st(A.ks_guitar(hz(riff[i % 8]), 1.0, seed=500 + i), 0.35), t, env(t, [(145.38, 0.26), (147.7, 0.11)]), send=0.25)
    for t in grid(137.42, 0.1, OUTS['08'], 146.6):
        perc.add(st(A.hat(1.0, False, 600 + int(t * 10)), 0.2), t, 0.1 * np.exp(-(t - OUTS['08']) * 1.5), send=0.05)
    for t in grid(137.42, 0.4, 147.78, 150.18):
        i = int(round((t - 137.42) / 0.4))
        pul.add(st(A.ks_guitar(hz(arp(t, i, 0)), 1.4, seed=700 + i), 0.3), t, 0.12, send=0.3)
    for t in grid(157.99, 0.8, 150.18, 154.24):
        i = int(round((t - 157.99) / 0.8))
        pul.add(st(A.ks_guitar(hz(arp(t, i, 0)), 2.0, seed=800 + i, damp=0.998), 0.3), t, 0.11, send=0.35)
    # "Maybe it's time to play a little trick on your brain": a rising arpeggio into the end card
    up = [0, 1, 2, 3]
    for j, t in enumerate(grid(157.99, 0.4, 154.24, INS['09'])):
        ms = sorted(mid(n) + 24 for n in chord_at(t))
        m = ms[up[j % 4] % len(ms)] + 12 * (j // 4 % 2)
        pul.add(st(A.bell(hz(m), 1.4, 3.0, 0.8, 3), 0.4 if j % 2 else -0.4), t, 0.03 + 0.005 * j, send=0.55)
    fx.add(rev_swell(1.6, seed=9), INS['09'] - 1.6, 0.4)

    n = N(END)
    pd = A.render_bus(pads)[:, :n]
    pd = np.vstack([filt(filt(ch, 'highpass', 110), 'lowpass', 2400) for ch in pd])
    bs = np.vstack([filt(ch, 'lowpass', 350) for ch in A.render_bus(bass)[:, :n]])
    x = pd * 1.0 + bs + A.render_bus(pul)[:, :n] + A.render_bus(perc)[:, :n] + A.render_bus(fx)[:, :n]
    x = peaking(x, 2000, -4.5, 0.7)                      # leave room for the voice
    x = np.vstack([filt(ch, 'highpass', 40, order=4) for ch in x])
    # clip 04 tape-stops at 65.19 — stop the bed with it, silent until the voice returns
    ts = INS['04'] + next(c['t'] for c in CUES['04']['cues'] if c['s'] == 'tapeStop')
    i0, m = N(ts), N(0.56)
    pos = i0 + np.cumsum((1 - np.linspace(0, 1, m)) ** 1.7)
    for ch in (0, 1):
        x[ch, i0:i0 + m] = np.interp(pos, np.arange(x.shape[1]), x[ch])
    x[:, i0 + m:N(OUTS['04'] + 0.1)] = 0
    return x


# ----------------------------------------------------------- automation ----
def smooth(u):
    u = np.clip(u, 0, 1)
    return u * u * (3 - 2 * u)


def automation(n, pre, post, duck=-14.0, pre_len=2.0, post_len=3.5):
    """Gain in dB: swell into each In, duck under each clip, bloom at each Out.

    pre/post are per-clip dB, sized so the bed meets the level each clip starts and ends at.
    """
    t = secs(n)
    db = np.zeros(n)
    for k in sorted(INS):
        a, b = INS[k], OUTS[k]
        m = (t >= a - pre_len) & (t < a)
        db[m] += pre[k] * smooth((t[m] - (a - pre_len)) / pre_len)
        m = (t >= a) & (t < b)
        lvl = pre[k] + (duck - pre[k]) * smooth((t[m] - a) / 0.2)
        if k in post:
            lvl += (post[k] - lvl) * smooth((t[m] - (b - 0.15)) / 0.15)
        db[m] += lvl
        if k in post:
            m = (t >= b) & (t < b + post_len)
            db[m] += post[k] * (1 - smooth((t[m] - b) / post_len))
    # after 04's tape-stop the bed fades back in under "And that's why…"
    m = (t >= OUTS['04']) & (t < OUTS['04'] + 1.4)
    db[m] += -40 * (1 - smooth((t[m] - OUTS['04'] - 0.1) / 1.3))
    # hush under the single word "Try." (00:50.17)
    db += -7 * (smooth((t - 49.4) / 0.6) - smooth((t - 50.6) / 0.5))
    g = 10 ** (db / 20)
    g *= smooth(t / 1.5) * (1 - smooth((t - (END - 1.6)) / 1.6))
    return g


def narration_mask(n):
    t = secs(n)
    m = np.ones(n, bool)
    for k in INS:
        m &= ~((t >= INS[k]) & (t < OUTS[k]))
    return m


def main():
    os.makedirs(OUT, exist_ok=True)
    raw = compose()
    n = raw.shape[1]
    nm = narration_mask(n)

    # every clip's audio exactly as it plays (plus its natural 2 s tail for the full track)
    clips = {}
    for k in sorted(INS):
        mus, fxs, g, D, _ = A.clip_stems(NAMES[k], tail=2.0)
        clips[k] = ((mus * 0.62 + fxs) * g, D)

    # level the bed under narration, then size each swell and bloom from measured levels:
    # rise to ~3 LU under how a clip opens; take over ~5 LU under how it ends, then settle
    zero = {k: 0.0 for k in INS}
    ref = raw * automation(n, zero, zero)
    gain = 10 ** ((BED_LUFS - A.lufs(ref[:, nm])) / 20)
    ref *= gain
    win = lambda x, a, b: A.lufs(x[:, N(a):N(b)])
    pre, post = {}, {}
    for k, (x, D) in clips.items():
        pre[k] = float(np.clip(win(x, 0.25, 1.0) - 3 - win(ref, INS[k] - 1.0, INS[k] - 0.25), 0.0, 8.0))
        if k not in ('04', '09'):   # 04 tape-stops into silence; 09 ends the video
            post[k] = float(np.clip(win(x, D - 1.0, D - 0.25) - 5 - win(ref, OUTS[k] + 0.25, OUTS[k] + 1.0), 0.0, 12.0))

    bed = A.limit(raw * automation(n, pre, {k: v + 1.0 for k, v in post.items()}) * gain)
    A.write_wav(os.path.join(OUT, 'bg-bed.wav'), bed)

    full = raw * automation(n, pre, {k: v - 1.0 for k, v in post.items()}) * gain
    for k in sorted(INS):
        x, D = clips[k]
        x = x.copy()
        x[:, :N(0.012)] *= np.linspace(0, 1, N(0.012))
        tl = x.shape[1] - N(D)
        if tl > 0:
            x[:, N(D):] *= 1 - smooth(np.linspace(0, 1, tl))
        i = N(INS[k])
        w = min(x.shape[1], n - i)
        full[:, i:i + w] += x[:, :w]
    full = A.limit(full)
    A.write_wav(os.path.join(OUT, 'full-soundtrack.wav'), full)

    print('swell into each clip (dB):', {k: round(v, 1) for k, v in pre.items()})
    print('bloom after each clip (dB):', {k: round(v, 1) for k, v in post.items()})
    print(f'bed: {END:.2f}s  narration {A.lufs(bed[:, nm]):.1f} LUFS  peak {20 * np.log10(np.abs(bed).max()):.1f} dBFS')
    print(f'full soundtrack: {A.lufs(full):.1f} LUFS integrated  peak {20 * np.log10(np.abs(full).max()):.1f} dBFS')


if __name__ == '__main__':
    main()
