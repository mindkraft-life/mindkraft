#!/usr/bin/env python3
"""Music + sound design for the "A trick on your brain" B-rolls.

Every clip gets its own score and SFX, synthesised from scratch (numpy/scipy,
no samples) and placed on the exact cue times the scene exports
(build/<clip>.cues.json, written by tools/render.mjs). Then it is loudness-
normalised to sit under a voiceover and muxed with the rendered video.

Usage: python3 tools/audio.py [clipPrefix ...]
"""
import json
import os
import subprocess
import sys

import numpy as np
from scipy import signal
from scipy.ndimage import maximum_filter1d

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, 'build')
OUT = os.path.join(ROOT, 'clips')
TARGET_LUFS = -20.0      # sits ~6 dB under a typical -14 LUFS voice track
CEILING_DB = -2.0

TAU = 2 * np.pi
N = lambda d: max(1, int(round(d * SR)))
secs = lambda n: np.arange(n) / SR
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def hz(n):
    """'A4' / 'F#3' / 'Bb2' or a MIDI number -> Hz."""
    if isinstance(n, (int, float, np.integer, np.floating)):
        return 440.0 * 2 ** ((n - 69) / 12)
    m = NAMES[n[0]] + (1 if '#' in n else -1 if 'b' in n[1:2] else 0)
    return 440.0 * 2 ** ((m + 12 * (int(n.lstrip('ABCDEFG#b')) + 1) - 69) / 12)


def rng(seed):
    return np.random.default_rng(seed)


# ---------------------------------------------------------------- filters ----
def filt(x, kind, f, order=2):
    f = np.clip(np.asarray(f, float), 20, SR * 0.45)
    return signal.sosfilt(signal.butter(order, f, kind, fs=SR, output='sos'), x)


def sweep(x, lo, hi, curve='exp', kind='bandpass', width=0.6, block=256):
    """Band-pass (or low-pass) whose centre glides lo -> hi across x."""
    n = len(x)
    out = np.zeros(n)
    zi = None
    for i in range(0, n, block):
        u = i / max(1, n - 1)
        fc = lo * (hi / lo) ** u if curve == 'exp' else lo + (hi - lo) * u
        if kind == 'bandpass':
            wn = [max(25, fc * (1 - width / 2)), min(SR * 0.45, fc * (1 + width / 2))]
        else:
            wn = min(SR * 0.45, fc)
        sos = signal.butter(1 if kind == 'bandpass' else 2, wn, kind, fs=SR, output='sos')
        if zi is None or zi.shape != (sos.shape[0], 2):
            zi = np.zeros((sos.shape[0], 2))
        out[i:i + block], zi = signal.sosfilt(sos, x[i:i + block], zi=zi)
    return out


# ------------------------------------------------------------ oscillators ----
def phase(freq, n):
    f = np.full(n, float(freq)) if np.ndim(freq) == 0 else np.asarray(freq, float)[:n]
    return TAU * np.cumsum(f) / SR


def additive(freq, dur, amp_k, odd=False, fmax=16000, ph0=0.0):
    n = N(dur)
    ph = phase(freq, n)
    top = float(np.max(freq))
    out = np.zeros(n)
    k = 1
    while k * top < fmax and k < 64:
        a = amp_k(k)
        if a:
            out += a * np.sin(k * ph + ph0 * k)
        k += 2 if odd else 1
    return out


def sine(f, dur, ph0=0.0):
    return np.sin(phase(f, N(dur)) + ph0)


def saw(f, dur, soft=4000, ph0=0.0):
    f0 = float(np.max(f))
    return additive(f, dur, lambda k: (1 / k) / (1 + (k * f0 / soft) ** 4), ph0=ph0, fmax=min(16000, soft * 3.5))


def square(f, dur, fmax=12000):
    return additive(f, dur, lambda k: 1 / k, odd=True, fmax=fmax)


def noise(dur, seed=0):
    return rng(seed).standard_normal(N(dur))


def env_ad(n, a=0.005, d=0.3):
    t = secs(n)
    e = np.exp(-np.maximum(t - a, 0) / max(d, 1e-4))
    if a > 0:
        e *= np.minimum(t / a, 1)
    return e


def env_ar(n, a, r):
    e = np.ones(n)
    na, nr = min(n, N(a)), min(n, N(r))
    if na:
        e[:na] = np.linspace(0, 1, na) ** 1.5
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e


def mixa(*xs):
    """Sum sounds of different lengths (mono stays mono; any stereo -> stereo)."""
    stereo = any(x.ndim == 2 for x in xs)
    xs = [st(x) if stereo and x.ndim == 1 else x for x in xs]
    n = max(x.shape[-1] for x in xs)
    out = np.zeros((2, n) if stereo else n)
    for x in xs:
        out[..., :x.shape[-1]] += x
    return out


def st(x, pan=0.0):
    """mono -> stereo with constant-power pan."""
    a = (pan + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)])


# ------------------------------------------------------------ instruments ----
def pluck(f, dur=0.7, bright=1.0, decay=3.5, kind='saw'):
    t = secs(N(dur))
    out = np.zeros(len(t))
    for k in range(1, 40, 2 if kind == 'square' else 1):
        if k * f > 15000:
            break
        out += (1 / k) * np.exp(-t * (decay + bright * 2.2 * k)) * np.sin(TAU * k * f * t)
    return out * np.minimum(t / 0.002, 1)


def marimba(f, dur=0.8):
    t = secs(N(dur))
    x = np.sin(TAU * f * t) * np.exp(-t * 5.5) + 0.35 * np.sin(TAU * f * 3.93 * t) * np.exp(-t * 22)
    x += 0.12 * np.sin(TAU * f * 9.2 * t) * np.exp(-t * 60)
    return x * np.minimum(t / 0.001, 1)


def bell(f, dur=2.0, ratio=3.5, index=2.5, decay=2.2):
    t = secs(N(dur))
    mod = index * np.exp(-t * decay * 1.6) * np.sin(TAU * f * ratio * t)
    return np.exp(-t * decay) * np.sin(TAU * f * t + mod) * np.minimum(t / 0.002, 1)


def ks_guitar(f, dur=1.4, seed=0, damp=0.996):
    """Karplus–Strong string via an IIR comb (fast, in C)."""
    n = N(dur)
    L = max(2, int(round(SR / f)))
    exc = np.zeros(n)
    exc[:L] = filt(rng(seed).uniform(-1, 1, L), 'lowpass', 5500)
    a = np.zeros(L + 2)
    a[0], a[L], a[L + 1] = 1, -0.5 * damp, -0.5 * damp
    y = signal.lfilter([1.0], a, exc)
    return filt(y, 'highpass', 70) * env_ar(n, 0.001, 0.08)


def pad(notes, dur, attack=0.5, release=0.8, cutoff=1600, detune=7, gain=1.0, seed=1, width=0.7):
    n = N(dur)
    out = np.zeros((2, n))
    r = rng(seed)
    for i, nt in enumerate(notes):
        f = hz(nt)
        for j, cents in enumerate((-detune, 0, detune)):
            fi = f * 2 ** (cents / 1200)
            v = saw(fi, dur, soft=cutoff, ph0=r.uniform(0, TAU))
            lfo = 1 + 0.08 * np.sin(TAU * (0.3 + 0.07 * i + 0.05 * j) * secs(n) + r.uniform(0, TAU))
            out += st(v * lfo, (j - 1) * width)
    out *= env_ar(n, attack, release) * gain / (len(notes) * 3) * 1.6
    return np.vstack([filt(ch, 'highpass', 110) for ch in out])   # leave the low end to the bass


def bass(f, dur, drive=1.6):
    while f < 60:          # phone speakers can't reproduce octave-1 roots; lift them
        f *= 2
    n = N(dur)
    x = sine(f, dur) + 0.3 * sine(2 * f, dur)
    return np.tanh(drive * x) / np.tanh(drive) * env_ar(n, 0.006, min(0.08, dur * 0.4))


def kick(gain=1.0, f0=150, f1=56, dec=9.0):
    n = N(0.5)
    t = secs(n)
    f = f1 + (f0 - f1) * np.exp(-t * 30)
    body = np.sin(phase(f, n)) * np.exp(-t * dec)
    click = filt(noise(0.5, 3), 'highpass', 3000) * np.exp(-t * 320) * 0.25
    return np.tanh(1.6 * (body + click)) * gain


def clap(gain=1.0, seed=5):
    n = N(0.28)
    t = secs(n)
    x = filt(noise(0.28, seed), 'bandpass', [900, 2600])
    e = np.zeros(n)
    for o in (0.0, 0.011, 0.022):
        e += (t >= o) * np.exp(-np.maximum(t - o, 0) * 90)
    e += (t >= 0.03) * np.exp(-np.maximum(t - 0.03, 0) * 16) * 0.6
    return x * e * gain * 0.7


def hat(gain=1.0, open_=False, seed=7):
    d = 0.3 if open_ else 0.06
    n = N(d)
    return filt(noise(d, seed), 'highpass', 7000) * env_ad(n, 0.0005, 0.09 if open_ else 0.014) * gain * 0.5


def snare(gain=1.0, seed=9):
    n = N(0.25)
    t = secs(n)
    x = filt(noise(0.25, seed), 'bandpass', [1400, 7000]) * np.exp(-t * 18)
    x += 0.5 * np.sin(TAU * 190 * t) * np.exp(-t * 30)
    return x * gain * 0.7


def crash(gain=1.0, dur=1.6, seed=13):
    n = N(dur)
    x = filt(noise(dur, seed), 'highpass', 4200) + 0.3 * filt(noise(dur, seed + 1), 'bandpass', [5200, 6400])
    return x * env_ad(n, 0.002, dur * 0.35) * gain * 0.35


# -------------------------------------------------------------------- SFX ----
def s_tap():
    n = N(0.07)
    t = secs(n)
    x = 0.55 * np.sin(TAU * 2600 * t) * np.exp(-t * 170)
    x += 0.8 * np.sin(phase(180 + 520 * np.exp(-t * 90), n)) * np.exp(-t * 60)
    x += 0.25 * filt(noise(0.07, 21), 'highpass', 3500) * np.exp(-t * 500)
    return x * 0.8


def s_tap_dull(seed=0):
    n = N(0.18)
    t = secs(n)
    x = np.sin(phase(150 + 180 * np.exp(-t * 55), n)) * np.exp(-t * 32)
    x += 0.3 * filt(noise(0.18, 30 + seed), 'lowpass', 1100) * np.exp(-t * 110)
    return x * 0.9


def s_tick(hi=True, seed=0):
    n = N(0.06)
    t = secs(n)
    f = 3300 if hi else 2400
    return (0.5 * np.sin(TAU * f * t) * np.exp(-t * 200)
            + 0.45 * filt(noise(0.06, 40 + seed), 'highpass', 2500) * np.exp(-t * 900)) * 0.7


def s_whoosh(dur=0.7, lo=300, hi=4500, seed=0, pan_from=-0.6, pan_to=0.6, shape=1.4):
    n = N(dur)
    u = np.linspace(0, 1, n)
    x = sweep(noise(dur, 60 + seed), lo, hi, width=0.9) * np.sin(np.pi * u) ** shape
    pans = np.linspace(pan_from, pan_to, n)
    a = (pans + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)]) * 1.4


def s_riser(dur, lo=250, hi=7000, seed=0, tone=True):
    n = N(dur)
    u = np.linspace(0, 1, n)
    x = sweep(noise(dur, 70 + seed), lo, hi, width=0.7) * u ** 2.2 * 1.3
    if tone:
        x += 0.25 * saw(180 * 2 ** (2.2 * u), dur, soft=2500) * u ** 2 * (0.6 + 0.4 * np.sin(TAU * (4 + 18 * u) * u))
    return st(x)


def s_impact(gain=1.0, seed=0):
    n = N(1.6)
    t = secs(n)
    x = np.sin(phase(52 + 70 * np.exp(-t * 9), n)) * np.exp(-t * 3.6)
    x += 0.5 * filt(noise(1.6, 80 + seed), 'lowpass', 2500) * np.exp(-t * 14)
    return np.tanh(1.8 * x) * gain


def s_slam():
    x = s_impact(0.9, 1)
    t = secs(len(x))
    x += 0.18 * bell(185, 1.6, ratio=1.41, index=3, decay=4.5)
    return x


def s_far_bell():
    return bell(hz('A5'), 3.0, ratio=3.5, index=1.4, decay=1.4) * 0.3 + bell(hz('E6'), 3.0, ratio=3.5, index=1.0, decay=1.8) * 0.12


def s_swell_in(dur=0.55, seed=0):
    n = N(dur)
    t = secs(n)
    x = sweep(noise(dur, 90 + seed), 5000, 900, width=1.0) * np.minimum(t / 0.04, 1) * np.exp(-t * 6)
    return st(x * 0.9)


def s_stretch(dur):
    n = N(dur)
    u = np.linspace(0, 1, n)
    f = 110 * 2 ** (0.55 * u) * (1 + 0.012 * u * np.sin(TAU * (3 + 5 * u) * u * dur))
    tone = filt(saw(f, dur, soft=900) + 0.8 * saw(f * 1.006, dur, soft=900), 'lowpass', 1400) * 0.35
    dop = 0.3 * sine(1300 * 2 ** (-1.4 * u), dur) * (1 - u) ** 1.5 * np.minimum(u / 0.05, 1)
    air = sweep(noise(dur, 95), 600, 5000, width=0.8) * u * 0.6
    x = (tone + dop + air) * np.sin(np.pi * np.minimum(u * 1.1, 1)) ** 0.6
    return np.vstack([x, np.roll(x, 240)])


def s_pop(f=520, gain=1.0):
    n = N(0.14)
    t = secs(n)
    return np.sin(phase(f * (1 + 1.2 * (1 - np.exp(-t * 60))), n)) * np.exp(-t * 32) * gain * 0.6


def s_coin(n=0):
    tr = 2 ** ([0, 2, 4, 7, 9][n % 5] / 12)
    a = square(hz('B5') * tr, 0.07) * 0.28
    b = square(hz('E6') * tr, 0.34) * env_ad(N(0.34), 0.001, 0.12) * 0.28
    return np.concatenate([a, b])


def s_xp_chime():
    return mixa(bell(hz('C6'), 1.4, ratio=2.0, index=1.2, decay=3.2) * 0.35,
                np.pad(bell(hz('G6'), 1.3, ratio=2.0, index=1.0, decay=3.4), (N(0.06), 0)) * 0.3)


def s_sparkle(dur=1.2, seed=0, n=26, gain=1.0):
    out = np.zeros((2, N(dur) + N(0.3)))
    r = rng(200 + seed)
    for i in range(n):
        at = N(r.uniform(0, dur) ** 1.3 / dur ** 0.3)
        f = r.uniform(3200, 8500)
        b = bell(f, 0.25, ratio=2.01, index=0.6, decay=18) * r.uniform(0.3, 1) * (1 - at / len(out[0])) ** 1.2
        s = st(b, r.uniform(-0.9, 0.9))
        out[:, at:at + s.shape[1]] += s[:, :len(out[0]) - at]
    return out * 0.22 * gain


def s_level_up():
    notes = ['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7']
    arp = np.concatenate([square(hz(nm), 0.05) * env_ad(N(0.05), 0.001, 0.04) for nm in notes])
    arp = np.concatenate([arp, square(hz('C7'), 0.4) * env_ad(N(0.4), 0.001, 0.15)]) * 0.22
    chord = sum(bell(hz(nm), 2.2, ratio=3.0, index=1.2, decay=1.6) for nm in ('C6', 'E6', 'G6')) * 0.18
    x = st(chord) + st(np.pad(arp, (0, N(2.2) - len(arp))))
    x += st(crash(0.9, 2.2), 0) * 0.8
    sp = s_sparkle(1.4, 3)
    x[:, :sp.shape[1]] += sp[:, :x.shape[1]]
    return x


def s_unlock():
    x = np.zeros(N(0.35))
    for o, f in ((0.0, 2100), (0.075, 2900)):
        seg = mixa(s_tick(True, int(o * 100)) * 0.8, 0.3 * bell(f, 0.25, ratio=1.5, index=1.5, decay=14))
        x[N(o):N(o) + len(seg)] += seg[:len(x) - N(o)]
    return x


def s_spring():
    n = N(0.6)
    t = secs(n)
    f = 300 * (1 + 0.22 * np.sin(TAU * 13 * t) * np.exp(-t * 5))
    return np.sin(phase(f, n)) * np.exp(-t * 6) * np.minimum(t / 0.005, 1) * 0.45


def s_suck(dur):
    n = N(dur)
    u = np.linspace(0, 1, n)
    x = sweep(noise(dur, 111), 400, 6000, width=0.8) * u ** 2.5 * 1.3
    return st(x) + s_riser(dur, 300, 3000, 4, tone=False) * 0.3


def s_tick_up(n=0):
    return mixa(s_tick(True, n) * 0.5, marimba(hz(['A5', 'C6', 'D6', 'E6', 'G6'][n % 5]), 0.35) * 0.3)


def s_instant():
    n = N(0.5)
    t = secs(n)
    g = np.sin(phase(700 * 2 ** (np.minimum(t / 0.07, 1) * 1.7), n)) * np.exp(-t * 18) * 0.35
    return g + bell(hz('A6'), 0.5, ratio=2.0, index=1.0, decay=7) * 0.3


def s_glint():
    dur = 0.7
    n = N(dur)
    u = np.linspace(0, 1, n)
    x = sum(sine(f * 2 ** (0.8 * u), dur) for f in (3100, 4150, 5230)) / 3 * np.sin(np.pi * u) ** 2 * 0.25
    pans = np.linspace(-0.8, 0.8, n)
    a = (pans + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)])


NOTIF_PENTA = ['C6', 'D6', 'E6', 'G6', 'A6', 'C7']


def s_notif(n, kind, dense=0.0):
    r = rng(300 + n)
    tr = 2 ** (r.integers(-3, 4) / 12)
    if kind in ('bag',):
        x = np.concatenate([bell(hz('E6') * tr, 0.12, 2.0, 1.0, 12) * 0.5, bell(hz('C6') * tr, 0.45, 2.0, 1.0, 7) * 0.5])
    elif kind == 'heart':
        x = s_pop(560 * tr, 1.3)
    elif kind == 'userPlus':
        x = marimba(hz('G5') * tr, 0.3) * 0.5 + np.pad(marimba(hz('B5') * tr, 0.3), (N(0.05), 0))[:N(0.3)] * 0.4
    elif kind == 'play':
        x = mixa(s_tap_dull(n) * 0.5, np.pad(s_pop(900 * tr), (N(0.03), 0)) * 0.7)
    elif kind == 'chat':
        x = np.concatenate([bell(hz('A5') * tr, 0.09, 1.0, 0.3, 20), bell(hz('A5') * tr, 0.3, 1.0, 0.3, 12)]) * 0.5
    elif kind == 'tag':
        x = bell(hz('E6') * tr, 0.5, ratio=2.76, index=2.0, decay=6) * 0.45
    elif kind == 'star':
        x = bell(hz(NOTIF_PENTA[n % 6]), 0.45, ratio=2.0, index=1.0, decay=7) * 0.4
    else:  # bell / trend
        x = bell(hz(NOTIF_PENTA[(n * 2) % 6]) * tr, 0.5, ratio=1.4, index=1.6, decay=7) * 0.45
    return st(x, r.uniform(-0.7, 0.7)) * (1 - 0.55 * dense)


def s_zap():
    dur = 0.45
    n = N(dur)
    t = secs(n)
    r = rng(400)
    gate = (r.uniform(0, 1, n) > 0.965).astype(float)
    gate = np.convolve(gate, np.ones(40) / 6, 'same')
    crackle = filt(noise(dur, 401), 'highpass', 1800) * gate * np.exp(-t * 7)
    zz = saw(2400 * np.exp(-t * 9) + 90, dur, soft=6000) * np.exp(-t * 10) * 0.35
    return st((crackle * 0.6 + zz) * 0.8)


def s_logo_hit():
    return mixa(pad(['F3', 'C4', 'E4', 'G4', 'A4'], 1.8, attack=0.01, release=1.5, cutoff=2600, gain=1.3, seed=9), s_impact(0.7, 5))


def s_fill_up(n=0):
    dur = 0.45
    u = np.linspace(0, 1, N(dur))
    base = 420 * 2 ** (n * 3 / 12)
    x = sine(base * 2 ** (u * 0.9), dur) * np.sin(np.pi * u) * 0.14
    return st(x) + s_whoosh(dur, 1200, 6000, 20 + n) * 0.25


def s_card_in():
    return mixa(s_pop(420, 0.9), s_whoosh(0.35, 800, 4000, 31) * 0.4, s_sparkle(0.6, 11, 10, 0.6))


def s_claim():
    x = np.zeros(N(0.9))
    for i, nm in enumerate(('C6', 'E6', 'G6')):
        p = pluck(hz(nm), 0.6, bright=0.6, decay=5, kind='square') * 0.18
        x[N(i * 0.06):N(i * 0.06) + len(p)] += p[:len(x) - N(i * 0.06)]
    return x


def s_strain(keys, dur):
    n = N(dur)
    t = secs(n)
    ks = np.array(keys, float)

    def ring(tt):
        out = np.zeros_like(tt)
        for (t0, v0), (t1, v1) in zip(ks[:-1], ks[1:]):
            m = (tt >= t0) & (tt < t1)
            u = (tt[m] - t0) / (t1 - t0)
            out[m] = v0 + (v1 - v0) * u * u * (3 - 2 * u)
        out[tt >= ks[-1][0]] = 1
        return out
    rv = ring(t)
    f = 95 * 2 ** (1.6 * rv)
    x = filt(saw(f, dur, soft=700) + saw(f * 1.01, dur, soft=700), 'lowpass', 1500)
    x *= (0.25 + 0.6 * rv) * (1 + 0.25 * np.sin(TAU * (5 + 9 * rv) * t)) * 0.3
    x *= (t < ks[-1][0]).astype(float) * np.minimum(t / 0.05, 1)
    return st(x)


def s_heartbeat(dur):
    x = np.zeros(N(dur))
    for beat in np.arange(0.05, dur, 0.72):
        for o, g in ((0, 1.0), (0.17, 0.7)):
            k = kick(g * 0.8, 95, 52, 12)
            i = N(beat + o)
            if i < len(x):
                x[i:i + len(k)] += k[:len(x) - i]
    return filt(x, 'lowpass', 400)


def s_slip():
    dur = 0.3
    u = np.linspace(0, 1, N(dur))
    return st(sine(700 * 2 ** (-1.3 * u), dur) * (1 - u) ** 2 * 0.25 + filt(noise(dur, 501), 'bandpass', [900, 3000]) * (1 - u) ** 3 * 0.25)


def s_day_one():
    ch = bell(hz('G5'), 1.4, 2.0, 1.2, 2.8) * 0.3 + bell(hz('D6'), 1.4, 2.0, 1.0, 3.0) * 0.22
    return st(mixa(kick(0.8, 120, 58, 9) * 0.8, s_tap() * 0.6, ch))


DAY_CHORDS = [(['C5', 'E5', 'G5', 'C6', 'E6', 'G6']),
              (['A4', 'C5', 'E5', 'A5', 'C6', 'E6', 'A6']),
              (['F4', 'A4', 'C5', 'F5', 'A5', 'C6', 'F6']),
              (['G4', 'B4', 'D5', 'G5', 'B5', 'D6', 'G6']),
              (['C6', 'E6'])]


def day_note(d):  # day index 1..29 for days 2..30
    day = d + 1
    wk = min(4, (day - 1) // 7)
    notes = DAY_CHORDS[wk]
    return notes[((day - 1) % 7 - (1 if wk == 0 else 0)) % len(notes)]


def s_day_note(n):
    return st(marimba(hz(day_note(n)), 0.7) * 0.42, ((n * 0.37) % 1.2) - 0.6)


def s_flame():
    dur = 1.1
    n = N(dur)
    u = np.linspace(0, 1, n)
    x = sweep(noise(dur, 601), 350, 2800, width=1.0) * np.sin(np.pi * u) ** 0.8
    r = rng(602)
    cr = (r.uniform(0, 1, n) > 0.992) * r.uniform(0.3, 1, n)
    x += filt(cr, 'highpass', 2000) * 1.6 * (1 - u)
    return st(x * 0.9)


def s_streak_hit():
    x = pad(['C4', 'G4', 'C5', 'E5', 'G5'], 2.2, attack=0.02, release=1.8, cutoff=3200, gain=1.1, seed=4)
    x += st(bell(hz('C6'), 2.2, 3.0, 1.2, 1.6) * 0.2 + bell(hz('G6'), 2.2, 3.0, 1.0, 1.9) * 0.14)
    x[:, :N(1.6)] += st(s_impact(0.5, 9))
    return x


def s_join(n):
    x = s_whoosh(0.4, 700, 5000, 40 + n) * 0.45
    p = pluck(hz(['A5', 'B5', 'D6', 'E6', 'F#6'][n % 5]), 0.4, bright=0.7, decay=6) * 0.25
    x[:, :len(p)] += st(p, (n % 2) * 0.8 - 0.4)
    return x


def s_deposit(n):
    notes = ['A5', 'C6', 'E6', 'A5', 'C6', 'E6', 'F5', 'A5', 'C6', 'F5', 'A5', 'C6',
             'C6', 'E6', 'G6', 'C6', 'E6', 'G6', 'G5', 'B5', 'D6', 'G6']
    b = bell(hz(notes[n % len(notes)]), 0.5, ratio=2.4, index=1.4, decay=9) * 0.3
    return st(mixa(b, s_tick(True, n) * 0.25), ((n * 0.41) % 1.2) - 0.6)


def s_accel_ticks(dur):
    x = np.zeros(N(dur + 0.1))
    t, iv, i = 0.0, 0.2, 0
    while t < dur:
        tk = s_tick(i % 2 == 0, i) * (0.5 + 0.5 * t / dur)
        j = N(t)
        x[j:j + len(tk)] += tk[:len(x) - j]
        t += iv
        iv = max(0.03, iv * 0.88)
        i += 1
    return st(x) + s_riser(dur + 0.1, 400, 5000, 12, tone=False) * 0.35


def s_stamp(n):
    return st(mixa(kick(0.7, 110, 58, 10) * 0.7, bell(hz(['E5', 'G5', 'A5', 'C6'][(n - 1) % 4]), 0.6, 2.0, 1.2, 6) * 0.25))


def s_chime_small():
    return st(mixa(bell(hz('E6'), 1.0, 2.0, 1.0, 3.6) * 0.18, np.pad(bell(hz('B6'), 0.9, 2.0, 0.8, 4), (N(0.05), 0)) * 0.1))


def s_rocket(dur):
    return s_riser(dur, 800, 9000, 17) * 0.8


def s_drop():
    x = st(s_impact(1.0, 21))
    x += s_whoosh(1.6, 5000, 200, 22, 0.6, -0.6)[:, :x.shape[1]] * 0.6
    return x


def s_nudge():
    return st(s_pop(700, 0.35))


SFX = {
    'tap': lambda c: st(s_tap()),
    'tapDull': lambda c: st(s_tap_dull(int(c['t'] * 10))),
    'tick': lambda c: st(s_tick(True, int(c['t'] * 10))) * 0.8,
    'swellIn': lambda c: s_swell_in(),
    'stretch': lambda c: s_stretch(c['dur']) * 0.8,
    'slam': lambda c: st(s_slam()),
    'farBell': lambda c: st(s_far_bell()),
    'popIn': lambda c: mixa(s_pop(480, 0.8), s_swell_in(0.4, 2) * 0.5),
    'accelTicks': lambda c: s_accel_ticks(c['dur']),
    'stamp': lambda c: s_stamp(c['n']),
    'unlock': lambda c: st(s_unlock()),
    'chimeSmall': lambda c: s_chime_small(),
    'deposit': lambda c: s_deposit(c['n']),
    'riser': lambda c: s_riser(c['dur']) * 0.7,
    'impact': lambda c: st(s_impact()),
    'rocket': lambda c: s_rocket(c['dur']),
    'chipPop': lambda c: st(mixa(s_pop(620, 0.7), bell(hz('E6'), 0.6, 2.0, 1.0, 6) * 0.15)),
    'notif': lambda c: s_notif(c['n'], c.get('kind', 'bell'), min(1, max(0, (c['t'] - 3.0) / 4.5))),
    'drop': lambda c: s_drop(),
    'tapeStop': lambda c: np.zeros((2, 1)),       # handled on the mix
    'padHold': lambda c: np.zeros((2, 1)),        # handled by the score
    'suck': lambda c: s_suck(c['dur']) * 0.8,
    'tickUp': lambda c: st(s_tick_up(c['n'])),
    'instant': lambda c: st(s_instant()),
    'spring': lambda c: st(s_spring()),
    'coin': lambda c: st(s_coin(c['n'])),
    'xpChime': lambda c: st(s_xp_chime()),
    'glint': lambda c: mixa(s_glint(), s_sparkle(0.6, 7, 12, 0.5)),
    'zap': lambda c: s_zap(),
    'logoHit': lambda c: s_logo_hit() * 0.8,
    'whooshUp': lambda c: s_whoosh(0.75, 250, 3800, 8, 0, 0),
    'cardPop': lambda c: st(s_pop(420 * 2 ** (c['n'] * 2 / 12), 0.5), c['n'] * 0.3 - 0.45),
    'fillUp': lambda c: s_fill_up(c['n']),
    'levelUp': lambda c: s_level_up(),
    'cardIn': lambda c: s_card_in(),
    'claim': lambda c: st(s_claim()),
    'strain': lambda c: s_strain(c['keys'], 2.0),
    'heartbeat': lambda c: st(s_heartbeat(c['dur'])) * 0.9,
    'slip': lambda c: s_slip(),
    'dayOne': lambda c: s_day_one(),
    'whooshOut': lambda c: s_whoosh(0.9, 3500, 300, 50, -0.3, 0.3) * 0.7,
    'dayNote': lambda c: s_day_note(c['n']),
    'flame': lambda c: s_flame(),
    'streakHit': lambda c: s_streak_hit() * 0.8,
    'join': lambda c: s_join(c['n']),
    'pulse': lambda c: st(kick(0.9, 160, 56, 7)) * 0.8,
    'shimmer': lambda c: s_sparkle(1.0, 21, 18, 0.7),
    'nudge': lambda c: s_nudge(),
}


# ---------------------------------------------------------------- the mix ----
class Bus:
    def __init__(self, dur, tail=3.0):
        self.n = N(dur)
        self.dry = np.zeros((2, self.n + N(tail)))
        self.wet = np.zeros_like(self.dry)

    def add(self, x, t, gain=1.0, pan=0.0, send=0.15):
        if x.ndim == 1:
            x = st(x, pan)
        i = N(t)
        if i < 0:
            x, i = x[:, -i:], 0
        m = min(x.shape[1], self.dry.shape[1] - i)
        if m <= 0:
            return
        self.dry[:, i:i + m] += x[:, :m] * gain
        self.wet[:, i:i + m] += x[:, :m] * gain * send


def make_ir(dur, decay, seed, bright=6000):
    n = N(dur)
    t = secs(n)
    out = []
    for s in (seed, seed + 1):
        x = rng(s).standard_normal(n) * np.exp(-t * decay)
        x = filt(x, 'lowpass', bright) * 0.6 + filt(x, 'lowpass', 1800) * 0.4 * (1 - np.exp(-t * 3))
        x[:N(0.012)] = 0
        out.append(x / np.sqrt(np.sum(x ** 2)))
    return np.array(out)


IR = make_ir(2.6, 2.4, 1000)


def render_bus(b):
    wet = np.vstack([signal.fftconvolve(b.wet[ch], IR[ch])[:b.dry.shape[1]] for ch in (0, 1)])
    return b.dry + wet * 0.9


def k_weight(x):
    b1, a1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585]
    b2, a2 = [1.0, -2.0, 1.0], [1, -1.99004745483398, 0.99007225036621]
    return signal.lfilter(b2, a2, signal.lfilter(b1, a1, x, axis=-1), axis=-1)


def lufs(x):
    y = k_weight(x)
    blk, hop = N(0.4), N(0.1)
    ms = np.array([np.sum(np.mean(y[:, i:i + blk] ** 2, axis=1)) for i in range(0, max(1, y.shape[1] - blk + 1), hop)])
    ld = -0.691 + 10 * np.log10(ms + 1e-12)
    g = ms[ld > -70]
    if not len(g):
        return -70.0
    rel = -0.691 + 10 * np.log10(np.mean(g)) - 10
    g = ms[(ld > -70) & (ld > rel)]
    return -0.691 + 10 * np.log10(np.mean(g))


def limit(x, ceiling_db=CEILING_DB):
    c = 10 ** (ceiling_db / 20)
    peak = maximum_filter1d(np.max(np.abs(x), axis=0), N(0.006))
    g = np.minimum(1.0, c / np.maximum(peak, 1e-9))
    a = np.exp(-1 / (0.08 * SR))
    g = signal.lfilter([1 - a], [1, -a], g - 1) + 1       # smooth release
    g = np.minimum(g, c / np.maximum(peak, 1e-9))
    g = np.minimum(g, 1.0)
    look = N(0.003)
    g = np.concatenate([g[look:], np.full(look, g[-1])])  # tiny look-ahead
    return np.clip(x * g, -c, c)


def tape_stop(x, t0, dur):
    i0, n = N(t0), N(dur)
    out = x.copy()
    v = (1 - np.linspace(0, 1, n)) ** 1.7
    pos = i0 + np.cumsum(v)
    for ch in (0, 1):
        out[ch, i0:i0 + n] = np.interp(pos, np.arange(x.shape[1]), x[ch])
    out[:, i0 + n:] = 0
    out[:, i0 + n - N(0.03):i0 + n] *= np.linspace(1, 0, N(0.03))
    return out


# ------------------------------------------------------------ the scores ----
def beat_grid(t0, spb, until, start=None):
    """Grid times anchored on t0 (step spb) that fall in [start or t0, until)."""
    k = np.ceil(((t0 if start is None else start) - t0) / spb - 1e-9)
    out = []
    while t0 + k * spb < until:
        out.append(t0 + k * spb)
        k += 1
    return out


def drums(m, times, kind, gain=1.0, **kw):
    for i, t in enumerate(times):
        if kind == 'kick':
            m.add(st(kick(gain, **kw)), t, send=0.03)
        elif kind == 'clap':
            m.add(st(clap(gain, 5 + i)), t, send=0.2)
        elif kind == 'snare':
            m.add(st(snare(gain, 9 + i)), t, send=0.18)
        elif kind == 'hat':
            m.add(st(hat(gain, kw.get('open_', False), 7 + i), 0.25 * ((i % 2) * 2 - 1)), t, send=0.05)


def chord_pads(m, prog, gain=0.5, cutoff=1500, attack=0.35, release=0.6, send=0.35, seed=1):
    for i, (t0, t1, notes) in enumerate(prog):
        m.add(pad(notes, t1 - t0 + release * 0.8, attack=attack, release=release, cutoff=cutoff, seed=seed + i), t0, gain, send=send)


def bassline(m, events, gain=0.5):
    for t0, dur, nt in events:
        m.add(st(bass(hz(nt), dur)), t0, gain * 0.7, send=0.02)


def score_01(m, D, cues):
    chord_pads(m, [(-0.3, 3.76, ['D3', 'F3', 'A3', 'E4']), (3.76, D, ['Bb2', 'D3', 'F3', 'A3'])], 0.55, cutoff=1100, attack=0.3, release=1.2)
    bassline(m, [(-0.2, 4.0, 'D2'), (3.76, D - 3.6, 'Bb1')], 0.35)
    for i, t in enumerate(beat_grid(0.05, 0.5, 2.3)):
        m.add(st(s_tick(i % 2 == 0, i)) * 0.55, t, send=0.2)
    pat = ['D4', 'A3', 'F4', 'A3', 'E4', 'A3', 'F4', 'A3']
    for i, t in enumerate(beat_grid(0.05, 0.25, 2.4)):
        m.add(st(pluck(hz(pat[i % 8]), 0.35, bright=0.25, decay=9)), t, 0.14, send=0.25)


def score_02(m, D, cues):
    un = next(c['t'] for c in cues if c['s'] == 'unlock')
    chord_pads(m, [(-0.3, un, ['A2', 'E3', 'B3', 'C4']), (un, D, ['C3', 'G3', 'B3', 'E4'])], 0.5, cutoff=1300, attack=0.2)
    bassline(m, [(-0.1, un + 0.1, 'A1'), (un, D - un, 'C2')], 0.35)
    for i, t in enumerate(beat_grid(0.0, 60 / 140 / 4, un - 0.05)):
        m.add(st(bass(hz('A2' if i % 4 else 'A1'), 0.08)), t, 0.12 + 0.12 * t / un, send=0.0)
    m.add(st(bell(hz('C6'), 1.2, 2.0, 1.0, 3)), un + 0.05, 0.12, send=0.5)


def score_03(m, D, cues):
    q, K0, kick_t = 0.706, 1.28, 7.28
    prog = [(-0.3, K0 + 2 * q, ['A2', 'E3', 'A3', 'C4']), (K0 + 2 * q, K0 + 4 * q, ['F2', 'C3', 'A3', 'C4']),
            (K0 + 4 * q, 5.52, ['C3', 'G3', 'C4', 'E4']), (5.52, kick_t, ['G2', 'D3', 'B3', 'D4']),
            (kick_t, D, ['C3', 'G3', 'D4', 'E4', 'B4'])]
    chord_pads(m, prog, 0.5, cutoff=1400)
    roots = {0: 'A1', 1: 'F1', 2: 'C2', 3: 'G1'}
    for i, t in enumerate(beat_grid(K0, q, 5.52)):
        bassline(m, [(t, q * 0.9, roots[min(3, int((t - K0) // (2 * q)))])], 0.4)
    bassline(m, [(5.52, 1.7, 'G1'), (kick_t, D - kick_t, 'C2')], 0.42)
    drums(m, beat_grid(K0, q, 5.52), 'kick', 0.55)
    drums(m, beat_grid(K0 + q / 2, q, 5.52), 'hat', 0.5)
    drums(m, beat_grid(5.52, q / 4, kick_t - 0.05), 'hat', 0.45)
    rolls = beat_grid(6.4, 0.088, kick_t - 0.03)
    for i, t in enumerate(rolls):
        m.add(st(snare(0.12 + 0.5 * i / len(rolls), 30 + i)), t, send=0.15)
    drums(m, [kick_t], 'kick', 1.0)
    m.add(st(crash(1.0, 2.0)), kick_t, send=0.3)
    for i, t in enumerate(beat_grid(kick_t, q / 2, D)):
        m.add(st(pluck(hz(['C5', 'G5', 'E5', 'B5'][i % 4]), 0.4, bright=0.5, decay=6)), t, 0.18, send=0.3)


def score_04(m, D, cues):
    spb, bar = 60 / 128, 4 * 60 / 128
    end = D
    prog = [['F3', 'Ab3', 'C4'], ['Db3', 'F3', 'Ab3'], ['Ab2', 'C3', 'Eb3'], ['Eb3', 'G3', 'Bb3']]
    broots = ['F1', 'Db1', 'Ab1', 'Eb1']
    for b, t0 in enumerate(beat_grid(0, bar, end)):
        ch = prog[b % 4]
        for j, t in enumerate(beat_grid(t0, spb / 2, min(end, t0 + bar))):
            hard = t >= 7.12
            if j % 2 == 1 or hard:
                m.add(pad(ch, 0.16, attack=0.004, release=0.1, cutoff=3000 if hard else 2000, gain=1.0, seed=b * 9 + j), t, 0.3 if hard else 0.2, send=0.15)
            bassline(m, [(t, spb / 2 * 0.8, broots[b % 4] if j % 2 == 0 else broots[b % 4].replace('1', '2'))], 0.35 if hard else 0.28)
    drums(m, beat_grid(0, spb, end), 'kick', 0.75)
    drums(m, beat_grid(spb / 2, spb, end), 'hat', 0.55, open_=True)
    drums(m, beat_grid(spb, 2 * spb, end, start=2.8), 'clap', 0.6)
    drums(m, beat_grid(0, spb / 4, end, start=5.0), 'hat', 0.35)
    drums(m, beat_grid(0, spb / 2, end, start=7.12), 'kick', 0.45)
    m.add(st(crash(0.9, 2.0)), 7.12, send=0.3)


def score_05(m, D, cues):
    chord_pads(m, [(-0.3, 0.9, ['D3', 'F3', 'A3', 'E4']), (0.9, 1.5, ['Bb2', 'D3', 'F3', 'A3']),
                   (1.5, 2.08, ['C3', 'E3', 'G3', 'Bb3']), (2.08, D, ['F3', 'A3', 'C4', 'E4', 'G4'])], 0.5, cutoff=1500, attack=0.25)
    bassline(m, [(-0.2, 1.1, 'D2'), (0.9, 0.6, 'Bb1'), (1.5, 0.6, 'C2'), (2.08, D - 2.08, 'F1')], 0.35)
    harp = ['D4', 'F4', 'A4', 'C5', 'D5', 'F5', 'A5', 'C6', 'D6', 'F6', 'A6']
    t, iv = 0.6, 0.2
    for i, nt in enumerate(harp):
        m.add(st(pluck(hz(nt), 0.9, bright=0.35, decay=3.5), (i / len(harp)) * 1.2 - 0.6), t, 0.16, send=0.45)
        t += iv
        iv *= 0.88
    motif = ['F5', 'A5', 'C6', 'A5', 'G5', 'C6', 'E6', 'C6']
    for i, t in enumerate(beat_grid(2.35, 0.3, D - 0.2)):
        m.add(st(marimba(hz(motif[i % 8]), 0.6)), t, 0.18, send=0.35)
    drums(m, beat_grid(2.08, 0.6, D - 0.2), 'kick', 0.35)


def score_06(m, D, cues):
    spb = 0.5
    chord_pads(m, [(0.7, 2.0, ['C3', 'G3', 'D4', 'E4'])], 0.35, cutoff=1200, attack=0.5)
    ch = [(2.0, 3.0, ['C3', 'E3', 'G3', 'B3'], 'C2'), (3.0, 4.0, ['A2', 'E3', 'G3', 'C4'], 'A1'),
          (4.0, 5.0, ['F2', 'C3', 'A3', 'E4'], 'F1'), (5.0, 6.0, ['G2', 'D3', 'B3', 'F4'], 'G1'),
          (6.0, 7.0, ['C3', 'G3', 'C4', 'E4'], 'C2'), (7.0, 7.5, ['F2', 'C3', 'A3', 'F4'], 'F1'),
          (7.5, 8.0, ['G2', 'D3', 'B3', 'G4'], 'G1'), (8.0, D + 0.4, ['C3', 'G3', 'C4', 'E4'], 'C2')]
    chord_pads(m, [(a, b, n) for a, b, n, _ in ch], 0.4, cutoff=1800, attack=0.05, release=0.3)
    for a, b, _, r in ch:
        bassline(m, [(t, spb * 0.45, r) for t in beat_grid(a, spb / 2, b)], 0.33)
    arp = {'C': ['C5', 'E5', 'G5', 'C6'], 'A': ['A4', 'C5', 'E5', 'A5'], 'F': ['F4', 'A4', 'C5', 'F5'], 'G': ['G4', 'B4', 'D5', 'G5']}
    for a, b, notes, r in ch:
        pat = arp[r[0]]
        for i, t in enumerate(beat_grid(a, spb / 4, b)):
            m.add(st(pluck(hz(pat[i % 4]), 0.25, bright=0.6, decay=10), 0.3 if i % 2 else -0.3), t, 0.1, send=0.2)
    drums(m, beat_grid(2.0, spb, 5.5), 'kick', 0.7)
    drums(m, beat_grid(2.5, 2 * spb, 5.5), 'clap', 0.55)
    drums(m, beat_grid(2.25, spb, 5.5), 'hat', 0.5)
    rolls = beat_grid(5.5, spb / 4, 5.95)
    for i, t in enumerate(rolls):
        m.add(st(snare(0.2 + 0.4 * i / len(rolls), 60 + i)), t, send=0.15)
    drums(m, beat_grid(6.0, spb, D), 'kick', 0.8)
    drums(m, beat_grid(6.5, 2 * spb, D), 'clap', 0.6)
    drums(m, beat_grid(6.0, spb / 2, D), 'hat', 0.45)
    lead = ['C6', 'E6', 'G6', 'E6', 'C6', 'G5', 'A5', 'C6', 'F6', 'A6', 'G6', 'F6', 'D6', 'B5', 'C6', 'G6', 'C7']
    for i, t in enumerate(beat_grid(6.25, spb / 2, D - 0.1)):
        nt = lead[i % len(lead)]
        m.add(st(square(hz(nt), 0.22) * env_ad(N(0.22), 0.003, 0.09), 0.15), t, 0.07, send=0.25)


def score_07(m, D, cues):
    T = [c['t'] for c in cues if c['s'] == 'dayNote']
    wk = lambda d: T[d - 2]
    bassline(m, [(-0.2, 2.2, 'A1')], 0.25)
    chord_pads(m, [(-0.3, 2.0, ['A2', 'E3', 'B3'])], 0.35, cutoff=700, attack=0.4)
    prog = [(1.95, wk(8), ['C3', 'G3', 'C4', 'E4'], 'C2'), (wk(8), wk(15), ['A2', 'E3', 'A3', 'C4'], 'A1'),
            (wk(15), wk(22), ['F2', 'C3', 'A3', 'C4'], 'F1'), (wk(22), wk(29), ['G2', 'D3', 'B3', 'D4'], 'G1'),
            (wk(29), D, ['C3', 'G3', 'C4', 'E4', 'G4'], 'C2')]
    chord_pads(m, [(a, b, n) for a, b, n, _ in prog], 0.45, cutoff=1600, attack=0.15)
    bassline(m, [(a, b - a, r) for a, b, _, r in prog], 0.32)
    drums(m, [a for a, *_ in prog], 'kick', 0.5)
    drums(m, beat_grid(2.5, 0.3, D - 0.3), 'hat', 0.3)


def score_08(m, D, cues):
    b = 0.4
    at = {c['n']: c['t'] for c in cues if c['s'] == 'join'}
    P = [c['t'] for c in cues if c['s'] == 'pulse']
    chord_pads(m, [(-0.3, 3.8, ['D3', 'A3', 'D4', 'F#4'])], 0.3, cutoff=1000, attack=0.4)
    riff = ['D3', 'A3', 'D4', 'F#4', 'A4', 'F#4', 'D4', 'A3']
    for i, t in enumerate(beat_grid(at[0], b / 2, D)):
        g = 0.3 if t < 5.8 else 0.22
        m.add(st(ks_guitar(hz(riff[i % 8]), 1.2, seed=i), 0.35), t, g, send=0.25)
    bassline(m, [(t, b * 0.8, 'D2') for t in beat_grid(at[1], b, 5.0)], 0.35)
    drums(m, beat_grid(at[1], b / 4, 5.8), 'hat', 0.18)
    drums(m, beat_grid(at[2], b, 5.0), 'kick', 0.65)
    drums(m, beat_grid(at[3] + b, 2 * b, 5.0), 'clap', 0.5)
    chord_pads(m, [(at[2], 5.8, ['D3', 'A3', 'D4', 'E4', 'F#4'])], 0.35, cutoff=2000, attack=0.2)
    rolls = beat_grid(5.0, b / 4, 5.78)
    for i, t in enumerate(rolls):
        m.add(st(snare(0.15 + 0.5 * i / len(rolls), 90 + i)), t, send=0.15)
    stabs = [['D3', 'A3', 'D4', 'F#4'], ['A2', 'E3', 'A3', 'C#4'], ['B2', 'F#3', 'B3', 'D4'], ['G2', 'D3', 'G3', 'B3'], ['D3', 'A3', 'D4', 'F#4', 'A4']]
    roots = ['D2', 'A1', 'B1', 'G1', 'D2']
    for i, t in enumerate(P):
        ln = (P[i + 1] - t) if i + 1 < len(P) else D - t + 0.3
        m.add(pad(stabs[i], ln + 0.3, attack=0.01, release=0.35, cutoff=3000, gain=1.0, seed=40 + i), t, 0.5, send=0.3)
        bassline(m, [(t, ln, roots[i])], 0.45)
        m.add(st(crash(0.5 if i < 4 else 1.0, 1.5)), t, send=0.2)
    drums(m, beat_grid(5.8, b / 2, D), 'hat', 0.4)
    drums(m, beat_grid(6.0, b, D), 'clap', 0.45)


def score_09(m, D, cues):
    chord_pads(m, [(0.0, D, ['F2', 'C3', 'A3', 'E4', 'G4'])], 0.45, cutoff=1600, attack=0.05, release=1.6)
    bassline(m, [(0.0, D, 'F1')], 0.3)
    for t, nt in ((0.55, 'C6'), (1.0, 'A5'), (1.45, 'G5'), (2.25, 'F5')):
        m.add(st(bell(hz(nt), 2.0, 3.0, 1.0, 1.8)), t, 0.12, send=0.5)


SCORES = {'01': score_01, '02': score_02, '03': score_03, '04': score_04, '05': score_05,
          '06': score_06, '07': score_07, '08': score_08, '09': score_09}


# ------------------------------------------------------------------ main ----
def write_wav(path, x):
    y = (np.clip(x, -1, 1) * 32767).astype('<i2').T.copy()
    import wave
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(y.tobytes())


def ffmpeg():
    import imageio_ffmpeg
    return os.environ.get('FFMPEG') or imageio_ffmpeg.get_ffmpeg_exe()


def build(name):
    info = json.load(open(os.path.join(BUILD, name + '.cues.json')))
    D = info['meta']['duration']
    cues = info['cues']
    music, sfx = Bus(D), Bus(D)
    SCORES[name[:2]](music, D, cues)
    for c in cues:
        x = SFX[c['s']](c)
        heavy = c['s'] in ('farBell', 'chimeSmall', 'glint', 'shimmer', 'levelUp', 'xpChime', 'streakHit', 'logoHit')
        sfx.add(x, c['t'], send=0.45 if heavy else 0.14)
    n = N(D)
    hpf = lambda x: np.vstack([filt(ch, 'highpass', 40, order=4) for ch in x])
    mus, fx = hpf(render_bus(music)[:, :n]), hpf(render_bus(sfx)[:, :n])
    stop = next((c for c in cues if c['s'] == 'tapeStop'), None)
    if stop:
        mus, fx = tape_stop(mus, stop['t'], stop['dur']), tape_stop(fx, stop['t'], stop['dur'])
    # gentle edges so the hard cuts back to camera never click
    ramp = np.ones(n)
    ramp[:N(0.012)] = np.linspace(0, 1, N(0.012))
    ramp[-N(0.12):] *= np.linspace(1, 0, N(0.12)) ** 1.5
    mus, fx = mus * ramp, fx * ramp
    mix = mus * 0.62 + fx * 1.0
    gain = 10 ** ((TARGET_LUFS - lufs(mix)) / 20)
    final = limit(mix * gain)
    os.makedirs(os.path.join(OUT, 'stems'), exist_ok=True)
    wav = os.path.join(BUILD, name + '.mix.wav')
    write_wav(wav, final)
    write_wav(os.path.join(OUT, 'stems', name + '.music.wav'), limit(mus * 0.62 * gain))
    write_wav(os.path.join(OUT, 'stems', name + '.sfx.wav'), limit(fx * gain))
    video = os.path.join(BUILD, name + '.video.mp4')
    if os.path.exists(video):
        subprocess.run([ffmpeg(), '-y', '-loglevel', 'error', '-i', video, '-i', wav, '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', str(SR), '-movflags', '+faststart',
                        os.path.join(OUT, name + '.mp4')], check=True)
    print(f'{name}: {D:.2f}s  {lufs(final):.1f} LUFS  peak {20 * np.log10(np.max(np.abs(final)) + 1e-9):.1f} dBFS'
          + ('' if os.path.exists(video) else '  (no video yet — audio only)'))


if __name__ == '__main__':
    only = sys.argv[1:]
    names = sorted(f[:-10] for f in os.listdir(BUILD) if f.endswith('.cues.json'))
    for nm in names:
        if not only or any(nm.startswith(o) for o in only):
            build(nm)
