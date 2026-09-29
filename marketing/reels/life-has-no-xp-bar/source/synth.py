"""Sound design for the Mindkraft reel — every event sits on the scene's beat times.

Pure numpy/scipy synthesis: impacts, whooshes, UI plucks, streak ticks, risers,
pads and bells, through a convolution reverb. Writes a 48 kHz stereo WAV.
"""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 15.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)
WET_L = np.zeros(N)   # reverb send
WET_R = np.zeros(N)

# ---- beat times (mirror scene.js) ----
W_HITS = [0.12, 0.44, 0.76]
TRACK, SPARK, BLOW, RISE = 1.2, 1.95, 2.15, 2.2
CARDS = 2.4
TAPS = [3.45, 4.15, 4.75, 5.25]
STREAK, STREAK_DUR = 5.7, 1.65
DIVE, FLASH, ROLL, LAND = 7.45, 7.85, 7.98, 8.3
HERO_OUT = 10.05
N_HITS = [10.37, 10.62, 10.87]
FILL, PAY_OUT, OUTRO, LOGO, WORD, URL = 10.95, 11.5, 11.72, 12.05, 12.28, 12.8


def hz(note):
    names = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + (o - 4) * 12) / 12)


def place(sig, t0, gain=1.0, pan=0.0, send=0.0):
    """Mix a mono signal at time t0 (s) with constant-power pan and a reverb send."""
    i0 = int(round(t0 * SR))
    if i0 >= N:
        return
    if i0 < 0:
        sig = sig[-i0:]
        i0 = 0
    sig = sig[: N - i0] * gain
    a = (pan + 1) * np.pi / 4
    gl, gr = np.cos(a), np.sin(a)
    L[i0:i0 + len(sig)] += sig * gl
    R[i0:i0 + len(sig)] += sig * gr
    if send:
        WET_L[i0:i0 + len(sig)] += sig * gl * send
        WET_R[i0:i0 + len(sig)] += sig * gr * send


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def att(t, a):
    return np.clip(t / a, 0, 1)


def lp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, 'low', fs=SR, output='sos'), x)


def hp(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, 'high', fs=SR, output='sos'), x)


def sweep_bp(x, f_start, f_end, q=1.2, block=256, curve=None):
    """Band-pass noise whose centre glides f_start → f_end (exponentially)."""
    out = np.zeros_like(x)
    nb = int(np.ceil(len(x) / block))
    zi = None
    for b in range(nb):
        u = b / max(1, nb - 1)
        if curve is not None:
            u = curve(u)
        fc = f_start * (f_end / f_start) ** u
        lo, hi = fc / (1 + 1 / (2 * q)), fc * (1 + 1 / (2 * q))
        sos = signal.butter(1, [lo, min(hi, SR / 2 * 0.95)], 'band', fs=SR, output='sos')
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        seg = x[b * block:(b + 1) * block]
        y, zi = signal.sosfilt(sos, seg, zi=zi)
        out[b * block:b * block + len(seg)] = y
    return out


# ---------------- instruments ----------------
def impact(size=1.0, dur=1.6):
    t = tt(dur)
    f = 38 + (120 - 38) * np.exp(-t / 0.05)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.32 + 0.35 * size)) * att(t, 0.002)
    body = lp(rng.standard_normal(len(t)), 260) * np.exp(-t / 0.09) * 3.0
    click = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t / 0.008) * 0.35
    x = np.tanh((sub * 1.1 + body * 0.5 + click) * (1.2 + 0.6 * size))
    return x * 0.9


def whoosh(dur, f0, f1, shape='bell', q=1.4):
    t = tt(dur)
    n = rng.standard_normal(len(t))
    y = sweep_bp(n, f0, f1, q=q)
    u = t / dur
    if shape == 'bell':
        env = np.sin(np.pi * u) ** 1.6
    elif shape == 'rise':   # swells, then cuts hard
        env = u ** 2.4 * (1 - np.clip((u - 0.985) / 0.015, 0, 1))
    else:                   # 'fall': quick attack, long decay
        env = np.minimum(u / 0.06, 1) * (1 - u) ** 2
    y = y / (np.abs(y).max() + 1e-9)
    return y * env


def pluck(freq, dur=0.9, bright=1.0):
    t = tt(dur)
    x = np.zeros(len(t))
    for n in range(1, 7):
        x += (1 / n ** 1.25) * np.sin(2 * np.pi * freq * n * t + n) * np.exp(-t / (0.42 / n ** (0.7 / bright)))
    x += 0.35 * np.sin(2 * np.pi * freq * 2.01 * t) * np.exp(-t / 0.06)   # mallet transient
    return x * att(t, 0.003) * 0.5


def bell(freq, dur=3.0, decay=1.0):
    t = tt(dur)
    parts = [(1, 1.0, 2.2), (2.0, 0.35, 1.4), (2.76, 0.45, 1.0), (5.4, 0.22, 0.5), (8.93, 0.1, 0.25)]
    x = np.zeros(len(t))
    for r, a, d in parts:
        x += a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t / (d * decay))
    return x * att(t, 0.002) * 0.35


def tick(freq, dur=0.08):
    t = tt(dur)
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.012)
    x += hp(rng.standard_normal(len(t)), 4000) * np.exp(-t / 0.004) * 0.25
    return x * 0.5


def pad(notes, dur, attack=0.6, release=1.2, bright=(1.5, 4.0), level=1.0):
    """Additive saw-ish pad; brightness (harmonic roll-off) glides over the note."""
    t = tt(dur)
    u = t / dur
    b = bright[0] + (bright[1] - bright[0]) * u
    x = np.zeros(len(t))
    for note in notes:
        f0 = hz(note) if isinstance(note, str) else note
        for det in (-0.07, 0.0, 0.07):
            f = f0 * 2 ** (det / 12)
            ph = rng.uniform(0, 2 * np.pi)
            for n in range(1, 13):
                if f * n > 9000:
                    break
                x += (1 / n) * np.exp(-(n - 1) / b) * np.sin(2 * np.pi * f * n * t + ph * n)
    env = np.minimum(t / attack, 1) * np.clip((dur - t) / release, 0, 1)
    x = x * env
    return x / (np.abs(x).max() + 1e-9) * level


# ---------------- ACT I: the hook ----------------
for i, th in enumerate(W_HITS):
    place(impact(0.6 if i < 2 else 1.1), th - 0.004, gain=0.85 if i < 2 else 1.0, send=0.18)
# low tension drone under the empty bar
t = tt(1.4)
drone = (np.sin(2 * np.pi * 55 * t) + 0.4 * np.sin(2 * np.pi * 110.3 * t)) * np.minimum(t / 0.5, 1) * np.clip((1.4 - t) / 0.25, 0, 1)
place(drone, 0.85, gain=0.16)
# the track "drawing on": a thin glide
t = tt(0.6)
glide = np.sin(2 * np.pi * np.cumsum(380 + 520 * (t / 0.6) ** 1.5) / SR) * np.sin(np.pi * t / 0.6) ** 2
place(glide, TRACK, gain=0.07, send=0.3)
place(whoosh(0.55, 900, 5000, 'bell', q=2.0), TRACK, gain=0.05, pan=-0.3)
# spark
place(bell(hz('A6'), 2.0, 0.7), SPARK, gain=0.35, pan=-0.25, send=0.5)
place(tick(5200), SPARK, gain=0.4)
# words blow away + phone rises
place(whoosh(0.7, 500, 6000, 'bell', q=1.1), BLOW - 0.05, gain=0.55, pan=0.2, send=0.2)
place(whoosh(0.9, 120, 900, 'bell', q=0.9), RISE, gain=0.45, send=0.1)
place(impact(0.25, 0.8), RISE + 0.78, gain=0.35)

# ---------------- ACT II: the grind ----------------
for i in range(5):
    place(tick(2200 + 180 * i, 0.06), CARDS + i * 0.075 + 0.12, gain=0.18, pan=-0.2 + 0.1 * i)
notes = ['E5', 'G5', 'A5', 'C6']
for i, tp in enumerate(TAPS):
    place(tick(3200, 0.05), tp - 0.01, gain=0.35)                                  # touch
    place(pluck(hz(notes[i]), 1.0, 1.2), tp, gain=0.55, pan=(-0.2 + 0.13 * i), send=0.35)
    place(pluck(hz(notes[i]) / 2, 0.8, 0.8), tp, gain=0.25)                         # body
    place(impact(0.15, 0.5), tp, gain=0.22)                                         # low thump
    place(bell(hz(notes[i]) * 2, 1.2, 0.35), tp + 0.46, gain=0.12, pan=0.35, send=0.4)  # XP lands
# bed: A minor 9 pad opening up across the grind
place(pad(['A2', 'E3', 'A3', 'C4', 'E4', 'B4'], DIVE + 0.35 - 2.9, attack=1.2, release=0.3, bright=(1.2, 5.5), level=0.13), 2.9, send=0.25)
t = tt(DIVE + 0.35 - 2.9)
sub = np.sin(2 * np.pi * 55 * t) * np.minimum(t / 1.0, 1) * np.clip((len(t) / SR - t) / 0.2, 0, 1)
place(sub, 2.9, gain=0.1)
# streak time-lapse: accelerating ticks climbing in pitch
for s in range(1, 19):
    ts = STREAK + (s / 18) ** (1 / 1.8) * STREAK_DUR
    f = 1400 * 2 ** (s / 18 * 1.2)
    place(tick(f, 0.07), ts, gain=0.28 + 0.12 * s / 18, pan=0.25 * np.sin(s * 1.7))
    if s % 3 == 0:
        place(impact(0.1, 0.35), ts, gain=0.16 + 0.1 * s / 18)
# riser into the dive: noise + a climbing tone, cut at the flash
rl = FLASH - STREAK
place(whoosh(rl, 300, 9000, 'rise', q=1.0), STREAK, gain=0.5, send=0.15)
t = tt(rl)
tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (3 * (t / rl) ** 1.6)) / SR) * (t / rl) ** 2 * (1 - np.clip((t / rl - 0.985) / 0.015, 0, 1))
place(tone, STREAK, gain=0.12)
place(whoosh(FLASH - DIVE + 0.02, 1500, 12000, 'rise', q=0.8), DIVE, gain=0.5)

# ---------------- ACT III: LEVEL 10 ----------------
place(whoosh(0.3, 3000, 800, 'fall', q=1.0), ROLL, gain=0.2)         # 9 rolls out
place(impact(1.6, 2.4), LAND - 0.004, gain=1.0, send=0.25)
crash = hp(rng.standard_normal(int(2.6 * SR)), 3500) * np.exp(-tt(2.6) / 0.7) * att(tt(2.6), 0.003)
place(crash, LAND, gain=0.16, send=0.5)
place(pad(['F2', 'C3', 'F3', 'A3', 'C4', 'G4', 'A4', 'C5'], HERO_OUT + 0.35 - LAND, attack=0.02, release=0.6, bright=(6.0, 2.5), level=0.3), LAND, send=0.45)
for i, (nt, dt) in enumerate([('C6', 0.05), ('E6', 0.22), ('G6', 0.39), ('A6', 0.56), ('C7', 0.73), ('E7', 0.9)]):
    place(bell(hz(nt), 3.0, 0.9), LAND + dt, gain=0.24 - 0.02 * i, pan=(-0.5 + 0.2 * i), send=0.55)
place(whoosh(1.2, 6000, 12000, 'bell', q=0.8), LAND + 0.1, gain=0.08, send=0.6)    # shimmer
place(whoosh(0.4, 4000, 500, 'fall', q=1.0), HERO_OUT, gain=0.25)

# ---------------- ACT IV: NOW IT DOES. ----------------
booms = ['C2', 'C2', 'G1']
for i, th in enumerate(N_HITS):
    place(impact(0.6 if i < 2 else 1.1), th - 0.004, gain=0.85 if i < 2 else 1.0, send=0.2)
    place(pluck(hz(['C4', 'E4', 'G4'][i]), 1.2, 0.9), th, gain=0.25, send=0.4)
t = tt(0.55)
zip_ = np.sin(2 * np.pi * np.cumsum(300 * 2 ** (3 * (t / 0.55) ** 0.6)) / SR) * np.sin(np.pi * t / 0.55) ** 1.2
place(zip_, FILL - 0.05, gain=0.08, send=0.3)
place(whoosh(0.55, 800, 9000, 'bell', q=1.3), FILL - 0.05, gain=0.3, pan=-0.2)
for nt in ['C6', 'E6', 'G6']:
    place(bell(hz(nt), 2.0, 0.6), FILL + 0.5, gain=0.14, send=0.5)
place(whoosh(0.6, 600, 7000, 'bell', q=1.1), PAY_OUT, gain=0.45, pan=0.2, send=0.2)

# ---------------- ACT V: the lockup ----------------
place(whoosh(LOGO - OUTRO + 0.02, 400, 5000, 'rise', q=1.0), OUTRO, gain=0.3)
place(impact(0.7, 2.0), LOGO - 0.004, gain=0.65, send=0.35)
place(pad(['C2', 'G2', 'C3', 'E3', 'G3', 'D4', 'E4', 'G4'], DUR - LOGO, attack=0.08, release=2.2, bright=(4.5, 2.0), level=0.26), LOGO, send=0.5)
for i, nt in enumerate(['G5', 'C6', 'D6', 'E6', 'G6']):
    place(bell(hz(nt), 2.6, 0.8), WORD + i * 0.11, gain=0.17, pan=(-0.4 + 0.2 * i), send=0.55)
place(tick(2600, 0.06), URL, gain=0.18, send=0.3)
place(whoosh(0.9, 5000, 11000, 'bell', q=0.8), 13.35, gain=0.07, send=0.5)       # wordmark shine

# ---------------- reverb + master ----------------
def ir(seconds, seed):
    r = np.random.default_rng(seed)
    t = tt(seconds)
    x = r.standard_normal(len(t)) * np.exp(-t / 0.55) * np.minimum(t / 0.01, 1)
    x = lp(x, 6000)
    return x / np.sqrt(np.sum(x ** 2))

wet_l = signal.fftconvolve(WET_L, ir(2.6, 1))[:N]
wet_r = signal.fftconvolve(WET_R, ir(2.6, 2))[:N]
mix_l = L + wet_l * 0.9
mix_r = R + wet_r * 0.9
mix = np.stack([mix_l, mix_r], axis=1)
mix = hp(mix.T, 28).T
# gentle fade at the very end so the loop point is clean
fade = np.ones(N)
k = int(0.35 * SR)
fade[-k:] = np.linspace(1, 0, k) ** 2
mix *= fade[:, None]
mix /= np.abs(mix).max() + 1e-9
mix = np.tanh(mix * 1.3) / np.tanh(1.3)        # soft saturation / glue
mix *= 0.89 * 10 ** (-0.7 / 20)                 # lands at about -14.6 LUFS, -1.6 dBTP
wavfile.write('sfx.wav', SR, (mix * 32767).astype(np.int16))
print('wrote sfx.wav', mix.shape, 'peak', float(np.abs(mix).max()))
