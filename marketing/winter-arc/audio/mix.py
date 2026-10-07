"""
Mix: voice-over + score + sound design → final stereo master.

    python audio/mix.py STEMS_DIR OUT_WAV

- VO: high-pass, a touch of presence, gentle compression and a soft
  downward expander between phrases (phone-recorded VO, so the room noise
  is pulled down, never gated hard).
- Music and SFX duck under the voice from the VO's own envelope.
- Stems are set by loudness (pyloudnorm, BS.1770), then the master is
  normalised to −14 LUFS integrated with a −1 dBTP ceiling (ffmpeg loudnorm,
  two-pass) — the usual target for Reels / Shorts / TikTok.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

sys.path.insert(0, str(Path(__file__).resolve().parent))
from score import SR, N, filt, CUE  # noqa: E402

HERE = Path(__file__).resolve().parent

# Relative loudness of each stem (LUFS, integrated, before ducking)
VO_LUFS, MUSIC_LUFS, SFX_LUFS = -16.0, -22.5, -25.0
DUCK_MUSIC, DUCK_SFX = 0.6, 0.32       # gain reduction depth while speaking


def load_vo():
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(HERE / "vo.m4a"), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(float)
    out = np.zeros(N)
    out[:min(N, len(x))] = x[:N]
    return out


def follower(x, attack, release, hop=48):
    """Peak-ish envelope with separate attack/release (in seconds)."""
    e = np.sqrt(np.convolve(x * x, np.ones(hop) / hop, mode="same"))[::hop]
    a, r = np.exp(-hop / (SR * attack)), np.exp(-hop / (SR * release))
    y = np.zeros_like(e)
    v = 0.0
    for i, s in enumerate(e):
        v = a * v + (1 - a) * s if s > v else r * v + (1 - r) * s
        y[i] = v
    return np.interp(np.arange(len(x)), np.arange(len(y)) * hop, y)


def compress(x, thr_db, ratio, attack, release, knee=6.0):
    env = follower(x, attack, release)
    lv = 20 * np.log10(env + 1e-9)
    over = lv - thr_db
    gr = np.where(over <= -knee / 2, 0, np.where(over >= knee / 2, over * (1 - 1 / ratio), (1 - 1 / ratio) * (over + knee / 2) ** 2 / (2 * knee)))
    return x * 10 ** (-gr / 20)


def expand(x, thr_db, ratio, attack=0.005, release=0.12, floor_db=-12):
    env = follower(x, attack, release)
    lv = 20 * np.log10(env + 1e-9)
    under = np.minimum(0, lv - thr_db)
    g = np.maximum(floor_db, under * (ratio - 1))
    return x * 10 ** (g / 20)


def limiter(x, ceiling_db=-1.0, look=0.003, os=4):
    """Look-ahead peak limiter on (true-)peaks estimated at `os`x oversampling."""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    x2 = np.atleast_2d(x)
    up = signal.resample_poly(x2, os, 1, axis=-1)
    pk = np.abs(up).max(axis=0).reshape(-1, os).max(axis=1)[:x2.shape[1]]
    c = 10 ** (ceiling_db / 20)
    g = np.minimum(1.0, c / (pk + 1e-12))
    L = max(3, int(look * SR))
    g = minimum_filter1d(g, 2 * L + 1)
    g = uniform_filter1d(g, L)
    # slow release so the limiter does not flutter
    a = np.exp(-1 / (SR * 0.06))
    g = np.minimum(g, signal.lfilter([1 - a], [1, -a], g, zi=[g[0] * a])[0])
    y = x2 * g
    return y if x.ndim == 2 else y[0]


def process_vo(v):
    v = filt(v, "hp", 75, 0.7)
    v = filt(v, "peak", 220, 1.0, -1.5)
    v = filt(v, "peak", 3400, 0.9, 2.5)
    v = filt(v, "hs", 9000, 0.7, 1.5)
    v = expand(v, -46, 2.0)
    v = compress(v, -24, 3.0, 0.006, 0.09)
    v = compress(v, -12, 8.0, 0.001, 0.05)
    return v


def to_lufs(x, target, meter):
    stereo = x.T if x.ndim == 2 else x
    l = meter.integrated_loudness(stereo)
    return x * 10 ** ((target - l) / 20)


def main():
    stems = Path(sys.argv[1])
    out = Path(sys.argv[2])
    meter = pyln.Meter(SR)
    vo = process_vo(load_vo())
    vo = to_lufs(vo, VO_LUFS, meter)
    vo = limiter(vo, -4.0, 0.002)          # tame phone-mic plosives (PLR ~22 dB → ~12 dB)
    music = sf.read(stems / "music.wav", always_2d=True)[0].T[:, :N]
    sfx = sf.read(stems / "sfx.wav", always_2d=True)[0].T[:, :N]
    music = to_lufs(music, MUSIC_LUFS, meter)
    sfx = to_lufs(sfx, SFX_LUFS, meter)
    # duck from the voice: fast attack, slow release, normalised activity 0..1
    act = follower(vo, 0.03, 0.38)
    act = np.clip((20 * np.log10(act + 1e-9) + 42) / 18, 0, 1)
    act = signal.lfilter([0.002], [1, -0.998], act)  # smooth the curve
    act = np.clip(act / (np.percentile(act, 95) + 1e-9), 0, 1)
    # dynamic EQ: carve the speech band out of the music only while the voice speaks
    band = filt(filt(music, "hp", 900, 0.7), "lp", 4500, 0.7)
    music = (music - band) + band * (1 - 0.55 * act)
    music = music * (1 - DUCK_MUSIC * act)
    sfx = sfx * (1 - DUCK_SFX * act)
    mix = np.vstack([vo, vo]) + music + sfx
    # glue: gentle master compression
    mono = mix.mean(axis=0)
    env = follower(mono, 0.01, 0.2)
    lv = 20 * np.log10(env + 1e-9)
    gr = np.maximum(0, lv + 14) * (1 - 1 / 2.0)
    mix = mix * 10 ** (-gr / 20)
    # end fade
    t = np.arange(N) / SR
    mix *= np.clip((CUE["duration"] - t) / 1.2, 0, 1) ** 1.5
    # loudness to −14 LUFS with a −1 dBTP ceiling (limit, re-measure, repeat)
    for _ in range(3):
        l = meter.integrated_loudness(mix.T)
        mix = mix * 10 ** ((-14.0 - l) / 20)
        mix = limiter(mix, -1.2, 0.003)
    l = meter.integrated_loudness(mix.T)
    sf.write(out, mix.T.astype(np.float32), SR, subtype="PCM_24")
    js = {"input_i": round(l, 2)}
    print("mastered →", out, "| input", js["input_i"], "LUFS")


if __name__ == "__main__":
    main()
