#!/usr/bin/env python3
"""Plot short-term loudness of bed/ outputs with clip windows, and print level jumps at every cut."""
import os, sys, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audio as A  # noqa: E402
import bed as B  # noqa: E402


def load(p):
    w = wave.open(p)
    return np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, 2).T / 32768


def st_lufs(x, win=0.4, hop=0.05):
    y = A.k_weight(x)
    n, h = A.N(win), A.N(hop)
    ms = np.array([np.sum(np.mean(y[:, i:i + n] ** 2, axis=1)) for i in range(0, y.shape[1] - n, h)])
    return np.arange(len(ms)) * hop + win / 2, -0.691 + 10 * np.log10(ms + 1e-12)


full, bed = load(os.path.join(B.OUT, 'full-soundtrack.wav')), load(os.path.join(B.OUT, 'bg-bed.wav'))
t, lf = st_lufs(full)
_, lb = st_lufs(bed)
for k in sorted(B.INS):
    for lab, tt in (('In ', B.INS[k]), ('Out', B.OUTS[k])):
        if tt >= B.END - 0.5:
            continue
        pre = lf[(t > tt - 1.0) & (t < tt - 0.25)].mean()
        post = lf[(t > tt + 0.25) & (t < tt + 1.0)].mean()
        print(f'{k} {lab} {tt:7.2f}s  before {pre:6.1f}  after {post:6.1f}  jump {post - pre:+5.1f} LU')
if '--plot' in sys.argv:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig, axes = plt.subplots(3, 1, figsize=(18, 10))
    for ax, (a, b) in zip(axes, [(0, 55), (54, 110), (108, 162)]):
        m = (t >= a) & (t <= b)
        ax.plot(t[m], lf[m], lw=1, label='full soundtrack')
        ax.plot(t[m], lb[m], lw=1, label='bed only', alpha=.8)
        for k in B.INS:
            if a <= B.INS[k] <= b or a <= B.OUTS[k] <= b:
                ax.axvspan(B.INS[k], B.OUTS[k], color='orange', alpha=.15)
                ax.text(max(a, B.INS[k]) + .1, -12, k)
        ax.set_ylim(-60, -10); ax.set_xlim(a, b); ax.grid(alpha=.3)
    axes[0].legend(loc='lower right')
    plt.tight_layout()
    plt.savefig(os.path.join(A.BUILD, 'bed-loudness.png'), dpi=70)
