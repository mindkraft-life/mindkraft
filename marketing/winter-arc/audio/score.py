"""
Winter Arc — original score and sound design, synthesised from scratch.

Every musical event is placed from data/cues.json (the same beat sheet the
picture uses). The timing runs on a tempo map: each section has its own
steady grid (around 120 BPM) anchored on the words that matter, so "winter",
"fail", "Mindkraft", "step back", "arc" and the end card all land on a
downbeat. Nothing here is sampled; it is all oscillators, noise and filters,
so the track is ours outright.

    python audio/score.py OUT_DIR

writes OUT_DIR/music.wav (score), OUT_DIR/sfx.wav (sound design) and
OUT_DIR/duck.npy (the VO-driven ducking curve used by mix.py).
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy import signal

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
CUE = json.loads((ROOT / "data" / "cues.json").read_text())
C = CUE["cues"]
SR = 48000
DUR = CUE["duration"]
N = int(SR * DUR)
RNG = np.random.default_rng(20261007)


# ── utilities ──────────────────────────────────────────────────────────────
def buf():
    return np.zeros((2, N))


def nn(name):
    """'D4' / 'Bb2' / 'F#5' → MIDI number."""
    pcs = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
    p = pcs[name[0]]
    i = 1
    while i < len(name) and name[i] in "#b":
        p += 1 if name[i] == "#" else -1
        i += 1
    return p + 12 * (int(name[i:]) + 1)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def place(bus, sig, t, gain=1.0, pan=0.0):
    """Mix mono/stereo `sig` into `bus` at time t with equal-power pan."""
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.vstack([sig * np.cos(a), sig * np.sin(a)]) * np.sqrt(2)
    i0 = int(round(t * SR))
    j0 = max(0, -i0)
    i0 = max(0, i0)
    n = min(sig.shape[1] - j0, N - i0)
    if n > 0:
        bus[:, i0:i0 + n] += gain * sig[:, j0:j0 + n]


def env_adsr(n, a, d, s, r, sus_len=None):
    a, d, r = int(a * SR) + 1, int(d * SR) + 1, int(r * SR) + 1
    sl = n - a - d - r if sus_len is None else int(sus_len * SR)
    sl = max(0, sl)
    e = np.concatenate([np.linspace(0, 1, a), np.linspace(1, s, d), np.full(sl, s), np.linspace(s, 0, r)])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def saw(freq, n, ph0=0.0):
    """Band-limited sawtooth (PolyBLEP). freq may be scalar or array."""
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    dt = f / SR
    ph = (ph0 + np.cumsum(dt)) % 1.0
    y = 2 * ph - 1
    m = ph < dt
    x = ph[m] / dt[m]
    y[m] -= x + x - x * x - 1
    m = ph > 1 - dt
    x = (ph[m] - 1) / dt[m]
    y[m] -= x * x + x + x + 1
    return y


def sine(freq, n, ph0=0.0):
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    return np.sin(2 * np.pi * (ph0 + np.cumsum(f) / SR))


def biquad(kind, fc, q=0.707, gain_db=0.0):
    w = 2 * np.pi * min(fc, SR * 0.45) / SR
    cw, sw = np.cos(w), np.sin(w)
    al = sw / (2 * q)
    A = 10 ** (gain_db / 40)
    if kind == "lp":
        b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == "hp":
        b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == "bp":
        b = [al, 0, -al]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == "peak":
        b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]
    elif kind == "hs":
        sq = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * cw + sq), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - sq)]
        a = [(A + 1) - (A - 1) * cw + sq, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - sq]
    elif kind == "ls":
        sq = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) - (A - 1) * cw + sq), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - sq)]
        a = [(A + 1) + (A - 1) * cw + sq, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - sq]
    b, a = np.array(b) / a[0], np.array(a) / a[0]
    return b, a


def filt(x, kind, fc, q=0.707, gain_db=0.0):
    b, a = biquad(kind, fc, q, gain_db)
    return signal.lfilter(b, a, x, axis=-1)


def filt_tv(x, kind, fc_of_t, q=0.707, block=256, t0=0.0):
    """Time-varying biquad: cutoff re-evaluated every `block` samples."""
    x = np.atleast_2d(x)
    y = np.zeros_like(x)
    zi = np.zeros((x.shape[0], 2))
    for s in range(0, x.shape[1], block):
        b, a = biquad(kind, float(fc_of_t(t0 + s / SR)), q)
        y[:, s:s + block], zi = signal.lfilter(b, a, x[:, s:s + block], axis=-1, zi=zi)
    return y


def noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def smoothstep(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def tline():
    return np.arange(N) / SR


def kf_curve(keys):
    """Piecewise-linear automation over the whole timeline: [(t, v), ...]."""
    ks = np.array(keys, dtype=float)
    return np.interp(tline(), ks[:, 0], ks[:, 1])


# ── reverb (synthetic stereo hall) ─────────────────────────────────────────
def make_ir(decay=2.8, length=4.0, bright=0.35, seed=7):
    n = int(length * SR)
    t = np.arange(n) / SR
    ir = np.zeros((2, n))
    for ch in range(2):
        w = noise(n, seed + ch)
        lo = filt(w, "lp", 2500)
        hi = w - lo
        ir[ch] = lo * np.exp(-6.9 * t / decay) + bright * hi * np.exp(-6.9 * t / (decay * 0.35))
    pre = int(0.018 * SR)
    ir = np.pad(ir, ((0, 0), (pre, 0)))[:, :n]
    ir[:, :int(0.004 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    return ir


IR_HALL = make_ir(3.2, 4.5, 0.3, 11)
IR_ROOM = make_ir(1.1, 1.6, 0.5, 21)


def reverb(x, ir, wet=0.3):
    y = np.vstack([signal.oaconvolve(x[0], ir[0])[:N], signal.oaconvolve(x[1], ir[1])[:N]])
    return y * wet


def delay(x, time, fb=0.35, pingpong=True, lp=4000):
    d = int(time * SR)
    y = np.zeros_like(x)
    tap = x.copy()
    g = 1.0
    for k in range(1, 6):
        g *= fb
        tap = filt(tap, "lp", lp)
        sh = np.zeros_like(x)
        src = tap[::-1] if pingpong and k % 2 else tap
        sh[:, d * k:] = src[:, :N - d * k]
        y += g * sh
    return y


# ── instruments ────────────────────────────────────────────────────────────
def supersaw_note(m, dur, detune=0.11, voices=5, seed=0, fc=1800, a=0.6, r=1.5):
    n = int((dur + r) * SR)
    rng = np.random.default_rng(seed)
    out = np.zeros((2, n))
    for v in range(voices):
        cents = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune * 100 if voices > 1 else 0
        f = hz(m) * 2 ** (cents / 1200)
        s = saw(f, n, rng.random())
        pan = (v / (voices - 1) * 2 - 1) * 0.8 if voices > 1 else 0
        aa = (pan + 1) * np.pi / 4
        out[0] += s * np.cos(aa)
        out[1] += s * np.sin(aa)
    out = filt(out, "lp", fc, 0.6)
    out *= env_adsr(n, a, 0.4, 0.85, r, sus_len=max(0, dur - a - 0.4))
    return out / voices


def pad_chord(bus, notes, t0, t1, gain=0.12, fc=1600, a=0.8, r=1.8, seed=0, detune=0.11):
    for i, nm in enumerate(notes):
        m = nn(nm) if isinstance(nm, str) else nm
        place(bus, supersaw_note(m, t1 - t0, detune, 5, seed * 31 + i, fc, a, r), t0, gain)


def felt_piano(m, vel=0.7, length=3.5, bright=0.6, seed=0):
    n = int(length * SR)
    t = np.arange(n) / SR
    f0 = hz(m)
    B = 0.00035
    y = np.zeros(n)
    rng = np.random.default_rng(seed)
    for k in range(1, 13):
        fk = k * f0 * np.sqrt(1 + B * k * k)
        if fk > 12000:
            break
        amp = (1.0 / k ** (1.55 - 0.5 * bright)) * (0.6 + 0.4 * rng.random())
        dec = 0.55 + 0.42 * k + 0.0009 * f0
        y += amp * np.exp(-t * dec) * np.sin(2 * np.pi * fk * t + rng.random() * 6.28)
    # felt hammer: a soft thump
    th = filt(noise(int(0.03 * SR), seed + 99), "lp", 900) * np.linspace(1, 0, int(0.03 * SR)) * 0.15
    y[:len(th)] += th
    att = np.minimum(1, t / 0.006)
    y = filt(y * att, "lp", 1500 + 3500 * bright * vel)
    return y * vel


def pluck(m, vel=0.7, length=1.2, fc0=4500, decay=6.0, seed=0):
    n = int(length * SR)
    t = np.arange(n) / SR
    s = 0.6 * saw(hz(m), n, seed * 0.13 % 1) + 0.4 * saw(hz(m) * 1.003, n, seed * 0.29 % 1)
    fc = lambda tt: 300 + fc0 * np.exp(-(tt) * decay)
    y = filt_tv(s, "lp", fc, 0.9, 128)[0]
    return y * np.exp(-t * 3.2) * np.minimum(1, t / 0.003) * vel


def bell(m, vel=0.6, length=2.5, ratio=1.4, index=2.2, seed=0):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = hz(m)
    I = index * np.exp(-t * 2.5)
    y = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * ratio * t))
    y += 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4)
    return y * np.exp(-t * 1.6) * np.minimum(1, t / 0.002) * vel


def sub_note(m, dur, vel=0.5, r=0.08):
    n = int((dur + r) * SR)
    y = sine(hz(m), n) + 0.18 * sine(hz(m) * 2, n)
    y = np.tanh(1.4 * y) / np.tanh(1.4)
    return y * env_adsr(n, 0.008, 0.05, 0.9, r, sus_len=max(0, dur - 0.06)) * vel


def bass_note(m, dur, vel=0.5):
    n = int((dur + 0.06) * SR)
    s = saw(hz(m), n) * 0.5 + sine(hz(m), n)
    y = filt(s, "lp", 420, 0.9)
    return y * env_adsr(n, 0.006, 0.12, 0.7, 0.06, sus_len=max(0, dur - 0.13)) * vel


def kick(vel=1.0, seed=0, tone=1.0):
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 28) * tone
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = filt(noise(n, seed), "hp", 2500) * np.exp(-t * 300) * 0.25
    return np.tanh(1.6 * (y + click)) * vel


def clap(vel=0.6, seed=0):
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    w = filt(noise(n, seed), "bp", 1500, 0.9)
    e = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        i = int(o * SR)
        e[i:] += np.exp(-(t[:n - i]) * (90 if k < 2 else 16))
    body = filt(noise(n, seed + 1), "bp", 220, 2) * np.exp(-t * 30) * 0.4
    return (w * e + body) * vel * 0.8


def hat(vel=0.3, open_=False, seed=0):
    n = int((0.3 if open_ else 0.08) * SR)
    t = np.arange(n) / SR
    w = filt(filt(noise(n, seed), "hp", 7500), "peak", 10000, 1.2, 4)
    return w * np.exp(-t * (14 if open_ else 70)) * vel


def shaker(vel=0.15, seed=0):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    w = filt(noise(n, seed), "bp", 6500, 1.5)
    return w * np.sin(np.pi * np.minimum(1, t / 0.09)) ** 2 * vel


def tick(vel=0.4, f=2600, seed=0):
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    y = filt(noise(n, seed), "bp", f, 3) * np.exp(-t * 260) + 0.5 * np.sin(2 * np.pi * f * 0.75 * t) * np.exp(-t * 180)
    return y * vel


def riser(dur, f0=400, f1=9000, vel=0.4, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    w = noise(n, seed)
    fc = lambda tt: f0 * (f1 / f0) ** (min(tt, dur) / dur)
    y = filt_tv(w, "bp", fc, 1.4, 256)[0]
    ramp = (t / dur) ** 2.2
    tone = saw(np.geomspace(hz(nn("D3")), hz(nn("D5")), n), n) * 0.06
    return (y * 0.9 + filt(tone, "lp", 3000)) * ramp * vel


def whoosh(dur=0.6, f0=300, f1=3500, vel=0.35, seed=0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    u = t / dur
    fc = lambda tt: f0 + (f1 - f0) * np.sin(np.pi * min(tt / dur, 1))
    y = filt_tv(noise(n, seed), "bp", fc, 1.1, 256)[0]
    return y * np.sin(np.pi * u) ** 1.5 * vel


def impact(vel=1.0, seed=0, f0=58):
    n = int(2.6 * SR)
    t = np.arange(n) / SR
    f = f0 * (0.6 + 0.4 * np.exp(-t * 3))
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    crack = filt(noise(n, seed), "lp", 3000) * np.exp(-t * 18) * 0.5
    air = filt(noise(n, seed + 1), "hp", 4000) * np.exp(-t * 5) * 0.12
    return np.tanh(1.8 * (boom + crack + air)) * vel


def reverse_swell(dur, notes, vel=0.25, seed=0):
    """A pad chord through the hall, reversed: swells into its end."""
    tmp = np.zeros((2, int((dur + 1) * SR)))
    for i, nm in enumerate(notes):
        s = supersaw_note(nn(nm), 0.35, 0.1, 3, seed + i, 2500, 0.01, 0.3)
        tmp[:, :s.shape[1]] += s
    wet = np.vstack([signal.oaconvolve(tmp[0], IR_HALL[0])[:tmp.shape[1]], signal.oaconvolve(tmp[1], IR_HALL[1])[:tmp.shape[1]]])
    wet = wet[:, :int(dur * SR)][:, ::-1]
    return wet / (np.max(np.abs(wet)) + 1e-9) * vel


def crackle(dur, density=40, vel=0.25, seed=0):
    """Ice crackle: sparse resonant clicks."""
    n = int(dur * SR)
    rng = np.random.default_rng(seed)
    y = np.zeros(n)
    cnt = int(density * dur)
    for k in range(cnt):
        i = rng.integers(0, n - 2000)
        L = rng.integers(200, 1400)
        f = rng.uniform(3000, 9000)
        tt = np.arange(L) / SR
        y[i:i + L] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(400, 1200)) * rng.uniform(0.2, 1)
    return y * vel


# ── the score ──────────────────────────────────────────────────────────────
# Tempo map: (anchor time, beat length). Grids run from their anchor; each
# section's beat length is set so its last beat lands on the next anchor.
TM = {
    "hook": (C["everyone"], 0.5),                                   # "winter" 4.0 and "fail" 6.0 are beats
    "story": (C["storytelling"], 0.5),
    "reveal": (C["onlyAudience"], 0.5),
    "groove": (C["soFor"], (C["memory"] - C["soFor"]) / 40),         # 10 bars → "But don't trust your memory"
    "memory": (C["memory"], 0.5),
    "drop": (C["mindkraft"], (C["stepBack"] - C["mindkraft"]) / 24),  # 6 bars → "step back"
    "climax": (C["stepBack"], (C["arcEnd"] - C["stepBack"]) / 8),     # 2 bars → "arc"
    "outro": (C["arcEnd"], 0.5),
}


def bt(sec, k):
    """Time of beat k (may be fractional) in a section of the tempo map."""
    t0, b = TM[sec]
    return t0 + k * b


def steps(t0, t1, dt):
    """Times from t0 (inclusive) to t1 (exclusive) every dt."""
    n = int(np.floor((t1 - t0) / dt + 1e-9))
    return [t0 + i * dt for i in range(max(0, n))]


CH = {  # chord voicings
    "Dm9": ["D3", "A3", "C4", "E4", "F4", "A4"],
    "Bbmaj9": ["Bb2", "F3", "A3", "C4", "D4", "F4"],
    "Gm9": ["G2", "D3", "F3", "A3", "Bb3", "D4"],
    "Asus": ["A2", "E3", "A3", "D4", "E4"],
    "A": ["A2", "E3", "A3", "C#4", "E4"],
    "Bb": ["Bb2", "F3", "Bb3", "C4", "D4", "F4"],
    "F/A": ["A2", "F3", "C4", "F4", "A4"],
    "C": ["C3", "G3", "C4", "D4", "E4", "G4"],
    "Dm": ["D3", "A3", "D4", "E4", "F4", "A4"],
    "Gm7": ["G2", "D3", "F3", "Bb3", "D4"],
    "F": ["F2", "C3", "F3", "A3", "C4", "G4"],
    "Bbmaj7": ["Bb2", "F3", "A3", "D4", "F4"],
    "Csus": ["C3", "G3", "C4", "F4", "G4"],
    "Fadd9": ["F2", "C3", "F3", "G3", "A3", "C4"],
}
ROOT_OF = {k: v[0] for k, v in CH.items()}

def _prog():
    st, mem = C["storytelling"], C["memory"]
    g = lambda k: bt("groove", k)
    d = lambda k: bt("drop", k)
    c = lambda k: bt("climax", k)
    return [
        (st, st + 4, "Dm9"), (st + 4, st + 8, "Bbmaj9"), (st + 8, st + 12, "Gm9"), (st + 12, st + 15, "Asus"), (st + 15, C["onlyAudience"], "A"),
        (C["onlyAudience"], C["over"], "Bb"), (C["over"], C["onceChar"], "F/A"), (C["onceChar"], C["endOfJourney"], "C"),
        (C["endOfJourney"], C["journeyEnd"], "Asus"), (C["journeyEnd"], C["soFor"], "A"),
        (g(0), g(8), "Dm"), (g(8), g(16), "Bb"), (g(16), g(24), "F"), (g(24), g(32), "C"), (g(32), g(40), "Dm"),
        (mem, mem + 2, "Dm9"), (mem + 2, mem + 4, "Bbmaj7"), (mem + 4, mem + 6, "Gm9"), (mem + 6, C["thisIsWhere"], "Gm7"),
        (d(0), d(4), "Bb"), (d(4), d(8), "F/A"), (d(8), d(12), "Gm7"), (d(12), d(16), "C"), (d(16), d(20), "Bb"), (d(20), d(24), "C"),
        (c(0), c(2), "Dm"), (c(2), c(4), "Bb"), (c(4), c(6), "C"), (c(6), c(8), "F"),
        (C["arcEnd"], C["arcEnd"] + 2, "Bbmaj7"), (C["arcEnd"] + 2, C["arcEnd"] + 4, "Csus"), (C["arcEnd"] + 4, DUR, "Fadd9"),
    ]


PROG = _prog()


def chord_at(t):
    for a, b, c in PROG:
        if a <= t < b:
            return c
    return None


def build():
    pads, keys, bass, drums, plk, lead, sfx = buf(), buf(), buf(), buf(), buf(), buf(), buf()
    hb = TM["hook"][1]

    # ── HOOK 0 → "In storytelling" ────────────────────────────────────────
    # low D drone with a dark filter, from silence
    dr = supersaw_note(nn("D2"), 6.0, 0.06, 3, 1, 300, 1.2, 0.8) + supersaw_note(nn("A2"), 6.0, 0.06, 3, 2, 320, 1.2, 0.8)
    place(pads, dr, 0.0, 0.85)
    place(pads, supersaw_note(nn("D4"), 5.4, 0.09, 3, 5, 900, 2.0, 1.0), 0.0, 0.18)
    place(sfx, whoosh(0.7, 200, 2200, 0.18, 3), C["fewDays"] - 0.55)
    # the calendar counts back a few days to Oct 1: ticks falling in pitch
    # (same step times as the scene: fewDays + 0.08, every 0.088 s, 7 steps)
    st0, sdt, nst = C["fewDays"] + 0.08, 0.088, 7
    for i in range(nst):
        place(sfx, tick(0.2, 2600 - i * 110, i), st0 + i * sdt, pan=0.2 * ((i % 2) * 2 - 1))
    place(sfx, bell(nn("D6"), 0.17, 2.0, 2.0, 1.2, 4), st0 + sdt * nst + 0.08, pan=-0.2)
    # dive into the Day 1 cell
    place(sfx, whoosh(0.55, 400, 6000, 0.17, 5), C["everyone"] - 0.45)
    # everyone starts: a cascade of soft plinks (pentatonic), widening
    pent = [nn(x) for x in ["D5", "F5", "G5", "A5", "C6", "D6", "F6"]]
    for k in range(26):
        tt = C["everyone"] + 0.55 + (k / 26) ** 0.8 * 1.25 + RNG.uniform(0, 0.05)
        place(sfx, bell(pent[k % 7], 0.09, 1.2, 2.0, 0.8, 50 + k), tt, pan=RNG.uniform(-0.8, 0.8))
    # pulse enters with "everyone": 8th-note bass on D and ticking hats
    pulse8 = steps(C["everyone"], C["winterArc"] - 0.05, hb / 2)
    for k, tt in enumerate(pulse8):
        place(bass, bass_note(nn("D2"), 0.22, 0.32 + 0.2 * k / len(pulse8)), tt)
        place(drums, hat(0.12 + 0.1 * k / len(pulse8), False, k), tt + hb / 4, pan=0.3)
    place(sfx, riser(1.0, 600, 9000, 0.09, 6), C["winterArc"] - 1.08)
    # WINTER ARC — the slam (on a beat of the hook grid)
    place(sfx, impact(0.55, 7, 52), C["winterArc"])
    pad_chord(pads, CH["Dm9"], C["winterArc"], C["andYours"] + 0.2, 0.10, 2600, 0.01, 1.4, 3)
    place(keys, felt_piano(nn("D3"), 0.9, 3, 0.8, 1), C["winterArc"])
    place(keys, felt_piano(nn("A4"), 0.6, 3, 0.8, 2), C["winterArc"])
    place(keys, felt_piano(nn("D5"), 0.5, 3, 0.8, 3), C["winterArc"])
    for k, tt in enumerate(steps(C["winterArc"] + hb / 2, C["andYours"], hb / 2)):   # driving 8ths under the title
        place(bass, bass_note(nn("D2"), 0.22, 0.42), tt)
        if k % 2 == 1:
            place(drums, kick(0.5, k, 0.8), tt)
    # "and yours will…" — a dissonant swell
    sw = np.zeros((2, int(1.0 * SR)))
    for i, m in enumerate(["D4", "Eb4", "A4", "Bb4"]):
        s = supersaw_note(nn(m), 0.8, 0.18, 3, 70 + i, 1800, 0.7, 0.2)
        sw[:, :s.shape[1]] += s[:, :sw.shape[1]]
    place(pads, sw, C["fail"] - 0.85, 0.11)
    place(sfx, riser(C["fail"] - C["andYours"], 300, 5000, 0.2, 8), C["andYours"])
    # FAIL — boom, a tape-stop drop, and the floor falls away
    place(sfx, impact(1.0, 9, 44), C["fail"])
    n = int(0.6 * SR)
    ts = np.cumsum(np.linspace(1, 0.05, n)) / SR
    stop = sum(np.sin(2 * np.pi * hz(nn(m)) * ts) for m in ["D3", "A3", "D4"]) * np.linspace(1, 0, n) ** 1.5
    place(sfx, filt(stop, "lp", 1800) * 0.16, C["fail"])
    place(sfx, filt(noise(int(1.6 * SR), 12), "lp", 200) * np.exp(-np.arange(int(1.6 * SR)) / SR * 2) * 0.12, C["fail"])
    # the dot in the dark
    place(sfx, bell(nn("A5"), 0.22, 3.0, 1.0, 0.4, 13), C["understand"] - 0.1, pan=-0.1)
    place(sfx, bell(nn("D6"), 0.13, 3.0, 1.0, 0.4, 14), C["this"] + 0.06, pan=0.1)
    place(pads, reverse_swell(1.1, CH["Dm9"], 0.22, 15), C["storytelling"] - 1.1)

    # ── STORY → "Only the audience": felt piano, pad, the arc ───────────
    for a, b, c in PROG:
        if C["storytelling"] - 0.01 <= a < C["onlyAudience"] - 0.01:
            pad_chord(pads, CH[c], a, b, 0.055, 1300, 1.2, 2.0, int(a * 10))
            place(keys, felt_piano(nn(CH[c][0]) - 12 if nn(CH[c][0]) > 40 else nn(CH[c][0]), 0.55, 4.5, 0.3, int(a)), a)
    # arpeggio: quarters in the definition, 8ths from the dive, sparse in the
    # fog, gentle 8ths for "one day at a time"
    pat = [1, 2, 3, 4, 5, 4, 3, 2]
    sb = TM["story"][1]
    t, k = C["storytelling"], 0
    while t < C["onlyAudience"] - 0.1:
        c = chord_at(t)
        step = sb if t < C["butTake"] - 0.2 else sb / 2
        fog = C["theCharacter"] - 0.1 <= t < C["theyLive"]
        if not (fog and k % 4):
            notes = CH[c]
            m = nn(notes[pat[k % 8] % len(notes)]) + 12
            vel = 0.30 + 0.08 * np.sin(k * 0.7) + (0.06 if k % 4 == 0 else 0)
            place(keys, felt_piano(m, vel * (0.75 if fog else 1), 2.5, 0.45, 100 + k), t, pan=0.25 * np.sin(k * 0.9))
        t += step; k += 1
    # the character levels up as the arc draws: a rising chime per level
    draw = lambda tt: 0.5 - 0.5 * np.cos(np.pi * np.clip((tt - (C["anArc"] + 0.1)) / (C["within"] - C["anArc"] - 0.15), 0, 1))
    lvl_prev = 1
    scale = [nn(x) for x in ["D5", "E5", "F5", "G5", "A5", "C6", "D6", "E6", "F6", "G6", "A6", "C7", "D7"]]
    for i in range(int(C["anArc"] * 100), int(C["within"] * 100) + 10):
        tt = i / 100
        lv = 1 + int(13 * draw(tt) ** 1.2 + 1e-6)
        if lv > lvl_prev:
            place(sfx, bell(scale[min(12, lv - 2)], 0.07, 1.4, 2.0, 0.6, 200 + lv), tt, pan=-0.4 + 0.06 * lv)
            lvl_prev = lv
    # "from within": warm swell + gold shimmer
    place(pads, reverse_swell(0.8, ["F4", "A4", "C5", "E5"], 0.12, 16), C["within"] - 0.75)
    for j, m in enumerate(["A5", "C6", "E6", "A6"]):
        place(sfx, bell(nn(m), 0.045, 2.5, 3.5, 0.5, 220 + j), C["within"] + 0.05 + j * 0.09, pan=0.5 - j * 0.3)
    # the dive to the character
    place(sfx, whoosh(1.6, 150, 2400, 0.32, 17), C["butTake"] - 0.1)
    # one day at a time: tap + confirm chime + xp tick, rising
    days = [C["day1"], C["day2"], C["day3"], C["day4"]]
    for i, d in enumerate(days):
        place(sfx, tick(0.35, 1800, 300 + i), d - 0.03)
        place(sfx, bell(nn(["D5", "F5", "A5", "D6"][i]), 0.13, 1.6, 2.0, 1.0, 310 + i), d + 0.02, pan=0.25)
        place(sfx, bell(nn(["A5", "C6", "E6", "A6"][i]), 0.06, 1.2, 2.0, 0.8, 320 + i), d + 0.12, pan=0.35)
        place(sfx, whoosh(0.45, 300, 1800, 0.12, 330 + i), d + 0.16, pan=-0.3)
    # soft heartbeat pulse while the character lives day to day
    for k, tt in enumerate(steps(bt("story", np.ceil((C["theyLive"] - C["storytelling"]) / sb)), C["onlyAudience"] - 0.6, sb * 2)):
        place(drums, kick(0.22, 400 + k, 0.5), tt)
    place(sfx, riser(1.5, 300, 10000, 0.3, 18), C["onlyAudience"] - 1.5)

    # ── REVEAL "Only the audience" → "So for your winter arc" ────────────
    place(sfx, impact(0.55, 19, 50), C["onlyAudience"])
    for a, b, c in PROG:
        if C["onlyAudience"] - 0.01 <= a < C["soFor"] - 0.01:
            pad_chord(pads, CH[c], a, b + 0.3, 0.085, 3200, 0.3 if a < C["onlyAudience"] + 0.1 else 0.6, 1.6, int(a * 10))
            place(bass, sub_note(nn(ROOT_OF[c]) - 12, b - a, 0.38), a)
            place(keys, felt_piano(nn(CH[c][0]), 0.7, 4, 0.6, int(a)), a)
    # wide piano arps an octave up
    for k, t in enumerate(steps(C["onlyAudience"], C["soFor"] - 0.1, TM["reveal"][1] / 2)):
        notes = CH[chord_at(t)]
        m = nn(notes[[1, 3, 4, 5, 4, 3][k % 6] % len(notes)]) + 12
        place(keys, felt_piano(m, 0.32 + 0.05 * np.sin(k), 2.4, 0.7, 500 + k), t, pan=0.3 * np.sin(k * 1.3))
    # "see the arc": a glass glissando with the light sweep
    for j in range(12):
        place(sfx, bell(nn("D5") + [0, 3, 5, 7, 10][j % 5] + 12 * (j // 5), 0.07, 1.5, 3.5, 0.5, 600 + j), C["seesArc"] - 0.2 + j * 0.065, pan=-0.7 + j * 0.12)
    # range pills: 1M → 3M → 6M → 1Y on "long", "period", "time"
    for j, tt in enumerate([C["r3m"], C["r6m"], C["r1y"]]):
        place(sfx, tick(0.3, 2400, 620 + j), tt)
        place(sfx, pluck(nn(["C5", "E5", "G5"][j]), 0.22, 0.8, 5000, 8, 630 + j), tt, pan=0.2)
        place(sfx, whoosh(0.3, 500, 3000, 0.08, 640 + j), tt)
    # "once the character reaches the end of their journey": a soft rising
    # glide while the character rides the line, a warm chime on arrival
    n = int((C["endOfJourney"] - C["onceChar"]) * SR)
    gl = sine(np.geomspace(hz(nn("A4")), hz(nn("E5")), n), n) * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.7 * 0.045
    place(sfx, gl, C["onceChar"], pan=0.2)
    for j, m in enumerate(["A5", "E6", "A6"]):
        place(sfx, bell(nn(m), 0.09 - 0.02 * j, 2.4, 2.0, 0.8, 650 + j), C["endOfJourney"] + 0.02 + j * 0.07, pan=0.3 - 0.3 * j)

    # ── GROOVE "So for your winter arc" → "But don't trust your memory" ──
    for a, b, c in PROG:
        if C["soFor"] - 0.01 <= a < C["memory"] - 0.01:
            pad_chord(pads, CH[c], a, b, 0.085, 1900, 0.5, 1.2, int(a * 10))
    gbeat = TM["groove"][1]
    for k, t in enumerate(steps(C["soFor"], C["memory"] - 0.05, gbeat / 2)):
        c = chord_at(t)
        r = nn(ROOT_OF[c])
        b8 = k % 8
        place(bass, bass_note(r - 12 if r >= 43 else r, 0.2, 0.42 if b8 % 2 == 0 else 0.3), t)
        if b8 in (0, 3):
            place(drums, kick(0.6 if b8 == 0 else 0.42, 700 + k, 0.8), t)
        if b8 in (2, 6):
            place(drums, clap(0.26, 800 + k), t, pan=0.05)
        place(drums, hat(0.13 if b8 % 2 else 0.07, False, 900 + k), t + gbeat / 4, pan=0.35)
        place(drums, shaker(0.07, 1000 + k), t + gbeat / 8, pan=-0.4)
        # marimba-ish plucks on chord tones, every 8th
        notes = CH[c]
        m = nn(notes[[1, 3, 2, 4, 3, 5, 4, 2][b8] % len(notes)]) + 12
        place(plk, pluck(m, 0.15 if b8 % 2 == 0 else 0.1, 0.7, 3000, 9, 1100 + k), t + gbeat / 4, pan=0.4 * np.sin(k))
    # tabs, whips, typing, saving, templates, history
    place(sfx, whoosh(0.4, 600, 3500, 0.1, 21), C["needToBe"] - 0.15)
    place(sfx, whoosh(0.45, 400, 5000, 0.16, 22), C["both"] - 0.1)
    place(sfx, tick(0.25, 2100, 23), C["character"]); place(sfx, tick(0.25, 2500, 24), C["audience"])
    place(sfx, whoosh(0.5, 300, 6000, 0.3, 25), C["beingCharacter"] - 0.35, pan=0.5)
    tp0, tp1 = C["something"] - 0.24, C["something"] + 0.58
    for i in range(13):                      # "Read 10 pages": 13 keystrokes
        place(sfx, tick(0.16 + 0.06 * RNG.random(), RNG.uniform(3500, 5200), 26 + i), tp0 + i * (tp1 - tp0) / 13, pan=RNG.uniform(-0.2, 0.2))
    place(sfx, tick(0.28, 2200, 50), C["everyDay"] + 0.1)
    place(sfx, pluck(nn("A5"), 0.2, 0.8, 5000, 8, 51), C["purposeful"])
    place(sfx, bell(nn("E6"), 0.08, 2.0, 3.5, 0.6, 52), C["ownDefinition"] - 0.05)
    place(sfx, tick(0.35, 1700, 53), C["save"] - 0.03)
    place(sfx, bell(nn("D6"), 0.2, 1.8, 2.0, 1.0, 54), C["save"] + 0.05)
    place(sfx, bell(nn("A6"), 0.12, 1.8, 2.0, 1.0, 55), C["save"] + 0.16)
    for i in range(3):
        place(sfx, whoosh(0.35, 500, 2500, 0.08, 56 + i), C["notLiving"] + 0.05 + i * 0.12, pan=0.6)
        place(sfx, whoosh(0.4, 800, 6000, 0.16, 60 + i), C["instagram2"] + i * 0.07, pan=0.7)
    place(sfx, whoosh(0.5, 300, 6000, 0.3, 63), C["beingAudience"] - 0.3, pan=-0.5)
    for i, tt in enumerate([C["means"], C["means"] + 0.32, C["means"] + 0.62, C["record"] - 0.1, C["record"] + 0.2]):
        place(sfx, tick(0.22, 2800, 64 + i), tt)
    for i in range(18):
        place(sfx, tick(0.1, 3600, 70 + i), C["journey"] - 0.6 + i * 0.075)
    place(sfx, whoosh(1.4, 300, 4000, 0.16, 90), C["journey"] - 0.65)

    # ── MEMORY "But don't trust your memory" → "This is where" ───────────
    mem = buf()
    for a, b, c in PROG:
        if C["memory"] - 0.01 <= a < C["thisIsWhere"] - 0.01:
            pad_chord(mem, CH[c], a, b + 0.6, 0.06, 1400, 0.9, 2.0, int(a * 10), 0.16)
            place(mem, felt_piano(nn(CH[c][0]), 0.55, 4, 0.3, int(a)), a)
    for k, t in enumerate(steps(C["memory"], C["thisIsWhere"] - 0.3, TM["memory"][1])):
        notes = CH[chord_at(t)]
        m = nn(notes[[1, 3, 2, 4, 3, 5][k % 6] % len(notes)]) + 12
        place(mem, felt_piano(m, 0.34, 2.5, 0.35, 1200 + k), t, pan=0.3 * np.sin(k))
    # wow & flutter: a slowly modulated delay line = pitch wobble ("memory")
    tt = tline()
    dly = 0.006 + 0.004 * np.sin(2 * np.pi * 0.45 * tt) + 0.0015 * np.sin(2 * np.pi * 3.1 * tt)
    idx = np.clip(np.arange(N) - dly * SR, 0, N - 1)
    i0 = np.floor(idx).astype(int); fr = idx - i0
    mem = mem[:, i0] * (1 - fr) + mem[:, np.minimum(i0 + 1, N - 1)] * fr
    m0, m1 = C["memory"], C["thisIsWhere"]
    fade_mem = kf_curve([(0, 0), (m0 - 0.1, 0), (m0 + 0.2, 1), (m1 - 0.7, 0.7), (m1 + 0.3, 0.0), (DUR, 0)])
    mem = filt_tv(mem, "lp", lambda x: float(np.interp(x, [m0, m0 + 1.8, m0 + 5.8, m1 + 0.3], [3500, 1100, 700, 400])), 0.7) * fade_mem
    keys += mem
    place(sfx, crackle(2.6, 22, 0.07, 91), C["memory"] + 0.1)
    place(sfx, crackle(1.4, 12, 0.05, 92), C["memoryWord"] + 0.6)
    # the quits come forward: low clusters
    place(sfx, felt_piano(nn("C#3"), 0.35, 3, 0.2, 93) + felt_piano(nn("D3"), 0.35, 3, 0.2, 94), C["onlyRemember"] + 0.2)
    place(sfx, impact(0.32, 95, 40), C["quit"])
    place(sfx, reverse_swell(0.6, ["C#4", "D4", "G#4"], 0.1, 96), C["quit"] - 0.6)
    # "and not all the times that we showed up": each lost day a falling glint
    for i in range(28):
        place(sfx, bell(nn("A6") - (i % 7) * 2 - 12 * (i // 14), 0.035, 1.0, 1.9, 0.4, 1300 + i), C["forgetting"] - 0.1 + i * 0.055, pan=RNG.uniform(-0.7, 0.7))

    # ── MINDKRAFT: riser, a breath of silence, the drop ─────────────────
    gap = C["mindkraft"] - 0.12
    rz = riser(gap - C["thisIsWhere"] + 0.1, 200, 12000, 0.42, 97)
    place(sfx, rz, C["thisIsWhere"] - 0.1)
    place(pads, reverse_swell(gap - C["thisIsWhere"] + 0.1, ["D4", "A4", "D5", "F5"], 0.25, 98), C["thisIsWhere"] - 0.1)
    place(sfx, impact(0.85, 99, 48), C["mindkraft"])
    for j, m in enumerate(["F5", "A5", "C6", "D6", "F6", "A6", "C7"]):          # the shatter
        place(sfx, bell(nn(m), 0.045, 2.8, 2.7, 1.5, 1400 + j), C["mindkraft"] + j * 0.03, pan=-0.9 + j * 0.3)
    place(sfx, filt(noise(int(1.5 * SR), 1410), "hp", 5000) * np.exp(-np.arange(int(1.5 * SR)) / SR * 3) * 0.05, C["mindkraft"])

    # ── DROP "Mindkraft" → "step back" (24 beats) ─────────────────────────
    db = TM["drop"][1]
    for a, b, c in PROG:
        if C["mindkraft"] - 0.01 <= a < C["stepBack"] - 0.01:
            pad_chord(pads, CH[c], a, b + 0.1, 0.075, 2600, 0.04 if abs(a - C["mindkraft"]) < 0.01 else 0.25, 0.8, int(a * 10), 0.13)
            place(keys, felt_piano(nn(CH[c][0]), 0.7, 3, 0.7, int(a)), a)
    groove_on = bt("drop", 3)                     # beat 3 ≈ "Here"
    kicks = []
    for k, t in enumerate(steps(C["mindkraft"], C["stepBack"] - 0.02, db / 4)):
        c = chord_at(t)
        r = nn(ROOT_OF[c])
        groove = t >= groove_on - 0.01
        b16 = k % 16
        if groove:
            if b16 % 4 == 0:
                place(drums, kick(0.62, 1500 + k), t); kicks.append(t)
            if b16 in (4, 12):
                place(drums, clap(0.32, 1600 + k), t, pan=0.05)
            if b16 % 4 == 2:
                place(drums, hat(0.13, b16 == 14, 1700 + k), t, pan=0.3)
            elif b16 % 2 == 1:
                place(drums, hat(0.045, False, 1800 + k), t, pan=-0.3)
            if b16 % 2 == 0:
                place(bass, bass_note(r - 12 if r >= 43 else r, 0.2, 0.36 if b16 % 4 == 0 else 0.26), t)
        notes = CH[c]                              # 16th-note pluck arp throughout
        m = nn(notes[[1, 2, 3, 4, 5, 3, 4, 2][k % 8] % len(notes)]) + 12
        place(plk, pluck(m, 0.13 if groove else 0.08, 0.6, 3500 if groove else 2000, 10, 1900 + k), t, pan=0.5 * np.sin(k * 0.8))
    for i in range(4):                             # pickup fill into "Here"
        place(drums, clap(0.08 + 0.04 * i, 2000 + i), bt("drop", 2.5 + i / 8))
    # "define your arc": the group arrives; on "arc" a soft confirm
    place(sfx, whoosh(0.35, 600, 2800, 0.08, 2100), C["define"] - 0.3)
    place(sfx, tick(0.14, 2300, 2101), C["define"] - 0.05)
    place(sfx, bell(nn("D6"), 0.07, 1.6, 2.0, 0.8, 2102), C["define"] + 0.5, pan=-0.2)
    # "break it down into simple actions": three cards unfold
    for i in range(3):
        place(sfx, whoosh(0.3, 600, 2800, 0.08, 2105 + i), C["breakDown"] + i * 0.32)
        place(sfx, tick(0.13, 2200 + 300 * i, 2110 + i), C["breakDown"] + 0.2 + i * 0.32)
    # "you do every day": the streak chips light up in turn
    for i in range(3):
        place(sfx, pluck(nn(["A5", "C6", "D6"][i]), 0.07, 0.5, 5000, 10, 2115 + i), C["everyDay2"] - 0.2 + i * 0.16, pan=0.3)
    # "show up each day": tap, chime, xp flies to the bar and lands
    for i, tt in enumerate([C["log1"], C["log2"], C["log3"]]):
        place(sfx, tick(0.24, 1800, 2200 + i), tt - 0.03)
        place(sfx, bell(nn(["E5", "G5", "C6"][i]), 0.14, 1.6, 2.0, 1.0, 2210 + i), tt + 0.02, pan=0.25)
        place(sfx, whoosh(0.5, 800, 6000, 0.08, 2220 + i), tt + 0.06, pan=-0.2)
        place(sfx, pluck(nn(["G6", "C7", "E7"][i]), 0.08, 0.5, 6000, 12, 2230 + i), tt + 0.54)
    place(sfx, bell(nn("C6"), 0.12, 1.5, 1.5, 0.6, 2240), C["liveUp"] - 0.05)
    place(sfx, whoosh(0.4, 200, 1500, 0.1, 2241), C["liveUp"] - 0.05)
    # New Year: month flips, snare roll building, the year turns gold
    for i, tt in enumerate([C["byTheTime"] - 0.05, C["byTheTime"] + 0.3, C["byTheTime"] + 0.56, C["year"] - 0.04]):
        place(sfx, whoosh(0.25, 1000, 7000, 0.12, 2300 + i), tt - 0.05)
        place(sfx, tick(0.25, 2600 + 200 * i, 2310 + i), tt)
    r0 = bt("drop", 19)
    roll_t = r0
    while roll_t < C["stepBack"] - 0.02:
        u = (roll_t - r0) / (C["stepBack"] - r0)
        place(drums, clap(0.06 + 0.22 * u ** 1.5, int(roll_t * 1000)), roll_t, pan=0.1 * np.sin(roll_t * 40))
        roll_t += db / 2 if u < 0.25 else db / 4 if u < 0.6 else db / 8
    place(sfx, riser(2.2, 300, 12000, 0.35, 2320), C["stepBack"] - 2.2)
    for j, m in enumerate(["D6", "F6", "A6", "C7", "D7"]):                     # gold
        place(sfx, bell(nn(m), 0.07, 2.5, 3.5, 0.6, 2330 + j), C["year"] + 0.03 + j * 0.05, pan=-0.5 + j * 0.25)
    for j, m in enumerate(["F5", "A5", "C6", "F6"]):                           # level up
        place(sfx, bell(nn(m), 0.09, 2.0, 2.0, 1.2, 2340 + j), C["arrives"] + j * 0.07, pan=0.4 - j * 0.2)
    for j in range(12):                                                         # confetti
        place(sfx, tick(0.05, RNG.uniform(3000, 7000), 2350 + j), C["arrives"] + 0.05 + RNG.uniform(0, 0.8), pan=RNG.uniform(-0.8, 0.8))

    # ── CLIMAX "step back" → "arc" (8 beats) ──────────────────────────────
    cbeat = TM["climax"][1]
    place(sfx, impact(1.0, 2400, 46), C["stepBack"])
    place(sfx, whoosh(1.2, 2000, 200, 0.3, 2401), C["stepBack"] - 0.02)
    for a, b, c in PROG:
        if C["stepBack"] - 0.01 <= a < C["arcEnd"] - 0.01:
            pad_chord(pads, CH[c], a, b + 0.1, 0.095, 4200, 0.04 if abs(a - C["stepBack"]) < 0.01 else 0.25, 0.8, int(a * 10), 0.13)
            place(keys, felt_piano(nn(CH[c][0]), 0.7, 3, 0.7, int(a)), a)
            place(bass, sub_note(nn(ROOT_OF[c]) - 12, b - a, 0.3), a)
    for k, t in enumerate(steps(C["stepBack"], C["arcEnd"] - 0.02, cbeat / 4)):
        c = chord_at(t)
        r = nn(ROOT_OF[c])
        b16 = k % 16
        if b16 % 4 == 0:
            place(drums, kick(0.62, 2450 + k), t); kicks.append(t)
        if b16 in (4, 12):
            place(drums, clap(0.32, 2460 + k), t, pan=0.05)
        if b16 % 4 == 2:
            place(drums, hat(0.13, b16 == 14, 2470 + k), t, pan=0.3)
        elif b16 % 2 == 1:
            place(drums, hat(0.045, False, 2480 + k), t, pan=-0.3)
        if b16 % 2 == 0:
            place(bass, bass_note(r - 12 if r >= 43 else r, 0.2, 0.36 if b16 % 4 == 0 else 0.26), t)
        notes = CH[c]
        m = nn(notes[[1, 2, 3, 4, 5, 3, 4, 2][k % 8] % len(notes)]) + 12
        place(plk, pluck(m, 0.13, 0.6, 3800, 10, 2490 + k), t, pan=0.5 * np.sin(k * 0.8))
    place(drums, kick(0.5, 2499), C["arcEnd"]); kicks.append(C["arcEnd"])
    melody = [("F5", 0.0, 1.0), ("E5", 1.0, 0.5), ("F5", 1.5, 0.5), ("D5", 2.0, 1.0), ("F5", 3.0, 0.5), ("G5", 3.5, 0.5),
              ("A5", 4.0, 2.0), ("C6", 6.0, 1.0), ("A5", 7.0, 1.0)]       # offsets/durations in beats
    for nm, o, d in melody:
        tt = bt("climax", o)
        place(lead, pluck(nn(nm), 0.22, d * cbeat + 0.8, 5200, 5, int(tt * 100)), tt)
        place(lead, bell(nn(nm) + 12, 0.05, 1.6, 2.0, 0.6, int(tt * 100) + 1), tt)
    # the arc completes: stat counters tick, gold shimmer
    for i in range(20):
        place(sfx, tick(0.06, 4200, 2500 + i), C["ownArc2"] + 0.1 + i * 0.045, pan=-0.3 + 0.3 * (i % 3))
    for j, m in enumerate(["A6", "C7", "E7", "A7"]):
        place(sfx, bell(nn(m) - 12, 0.08, 2.4, 3.5, 0.5, 2520 + j), C["ownArc2"] + 0.22 + j * 0.06, pan=0.4 - 0.25 * j)

    # ── OUTRO "So, what's your winter arc…" → end card ───────────────────
    tail = DUR - 0.8
    for a, b, c in PROG:
        if a >= C["arcEnd"] - 0.01:
            last = c == "Fadd9"
            pad_chord(pads, CH[c], a, tail - 1.6 if last else b + 0.2, 0.07, 2200, 0.4, 2.6 if last else 0.8, int(a * 10), 0.12)
            place(keys, felt_piano(nn(CH[c][0]), 0.6, 5 if last else 3, 0.5, int(a)), a)
    fade0 = C["endCard"] + 1.6
    for k, t in enumerate(steps(C["arcEnd"], tail - 1.0, TM["outro"][1] / 2)):
        notes = CH[chord_at(t)]
        m = nn(notes[[1, 3, 5, 4, 2, 4][k % 6] % len(notes)]) + 12
        place(keys, felt_piano(m, 0.28 * (1 - max(0, t - fade0) / (tail - 1.0 - fade0)), 2.8, 0.6, 2600 + k), t, pan=0.35 * np.sin(k))
    for i, m in enumerate(["G5", "C6", "F5"]):                                  # the dashed possibilities
        st = C["winter3"] - 0.1 + i * 0.22
        n = int(1.1 * SR)
        gl = sine(np.geomspace(hz(nn(m) - 7), hz(nn(m)), n), n) * np.sin(np.pi * np.linspace(0, 1, n)) * 0.05
        place(sfx, gl, st, pan=-0.5 + 0.5 * i)
    place(sfx, impact(0.45, 2700, 55), C["endCard"])
    for j, m in enumerate(["F5", "A5", "C6", "G6", "A6"]):
        place(sfx, bell(nn(m), 0.09, 3.5, 2.0, 0.5, 2710 + j), C["endCard"] + 0.05 + j * 0.11, pan=-0.6 + 0.3 * j)
    place(sfx, tick(0.15, 3000, 2720), C["endCard"] + 1.25)

    # ── busses: sidechain pump, space, glue ──────────────────────────────
    pump = np.ones(N)
    for t in kicks:
        i = int(t * SR); L = min(int(0.3 * SR), N - i)
        if L > 0:
            pump[i:i + L] = np.minimum(pump[i:i + L], 1 - 0.45 * np.exp(-np.arange(L) / SR / 0.09))
    pads *= pump; plk *= pump; bass *= np.sqrt(pump)

    music = pads * 1.0 + keys * 0.9 + bass * 0.9 + drums * 0.8 + plk * 0.7 + lead * 0.75
    music += reverb(pads * 0.6 + keys + plk * 0.8 + lead, IR_HALL, 0.34)
    music += reverb(drums * 0.5, IR_ROOM, 0.16)
    music += delay(plk * 0.5 + lead * 0.4, 0.375, 0.38) * 0.5
    # section automation (dB): lift the hook and the long Character/Audience stretch
    sec = kf_curve([(0, 2.0), (C["storytelling"] - 1.0, 2.0), (C["storytelling"] - 0.3, 0), (C["soFor"] - 0.3, 0), (C["soFor"] + 0.2, 3.0),
                    (C["memory"] - 0.3, 3.0), (C["memory"] + 0.2, 0),
                    (C["soWhats"] - 0.3, 0), (C["soWhats"] + 0.2, -4.0), (C["endCard"] - 0.12, -4.0), (C["endCard"] + 0.05, 0), (DUR, 0)])
    music = music * 10 ** (sec / 20)
    music = filt(filt(music, "hp", 36, 0.7), "hp", 36, 0.7)
    music = filt(music, "peak", 280, 0.8, -3.0)
    music = filt(music, "peak", 3000, 0.9, -2.0)
    music = filt(music, "hs", 9000, 0.7, 2.0)
    sfx_out = sfx + reverb(sfx, IR_HALL, 0.22)
    sfx_out = filt(sfx_out, "hp", 40)
    return music, sfx_out


def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "out")
    out.mkdir(parents=True, exist_ok=True)
    import soundfile as sf
    music, sfx = build()
    sf.write(out / "music.wav", music.T.astype(np.float32), SR, subtype="FLOAT")
    sf.write(out / "sfx.wav", sfx.T.astype(np.float32), SR, subtype="FLOAT")
    print("wrote", out / "music.wav", out / "sfx.wav", "peak", float(np.max(np.abs(music))), float(np.max(np.abs(sfx))))


if __name__ == "__main__":
    main()
