#!/usr/bin/env bash
# Builds the Winter Arc reel end to end:
#   picture  (headless Chromium renders scene/ frame by frame)
#   score    (audio/score.py synthesises music + sound design)
#   mix      (audio/mix.py: VO clean-up, ducking, −14 LUFS master)
#   mux      (H.264 + AAC, 1080×1920 @ 30 fps, captions burned in)
#   captions (out/winter-arc.srt for platforms that take a caption file)
#
#   ./build.sh            full build
#   PY=/path/to/python ./build.sh     python with numpy, scipy, soundfile, pyloudnorm
set -euo pipefail
cd "$(dirname "$0")"
PY="${PY:-python3}"
WORKERS="${WORKERS:-4}"
mkdir -p out/audio
./tools/fetch-assets.sh
# 60 fps render, then pairs of frames are blended down to 30 fps: a 180°
# shutter, i.e. natural motion blur on every camera move.
node tools/render.mjs video --out out/silent60.mp4 --fps 60 --workers "$WORKERS"
"$PY" audio/score.py out/audio
"$PY" audio/mix.py out/audio out/audio/master.wav
ffmpeg -y -loglevel error -i out/silent60.mp4 -i out/audio/master.wav \
  -map 0:v -map 1:a -vf "tmix=frames=2,fps=30" -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p \
  -x264-params aq-mode=3:deblock=-1,-1 -r 30 -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest \
  out/winter-arc.mp4
python3 tools/srt.py out/winter-arc.srt
echo "done → out/winter-arc.mp4"
