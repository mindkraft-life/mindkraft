"""Write captions as SubRip (.srt) from data/captions.json + data/words.json.

    python3 tools/srt.py out/winter-arc.srt

The phrasing matches the burned-in captions exactly; each cue runs from its
first word's onset to the next cue (or its last word + 0.5 s).
"""
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
words = json.loads((root / "data" / "words.json").read_text())
phrases = json.loads((root / "data" / "captions.json").read_text())
cues, i = [], 0
for p in phrases:
    n = len(p.split())
    ws = words[i:i + n]
    i += n
    cues.append([ws[0]["t"], ws[-1]["end"], p])
assert i == len(words), "captions.json and words.json disagree"
for k, c in enumerate(cues):
    nxt = cues[k + 1][0] if k + 1 < len(cues) else None
    c[1] = min(nxt - 0.02, c[1] + 0.5) if nxt else c[1] + 0.6


def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


out = "\n".join(f"{k + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n" for k, (a, b, txt) in enumerate(cues))
Path(sys.argv[1] if len(sys.argv) > 1 else "winter-arc.srt").write_text(out)
print(f"{len(cues)} cues")
