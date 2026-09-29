#!/usr/bin/env bash
# Contact sheet of stills: tools/sheet.sh out.png in1.png in2.png ...
out=$1; shift
FF=$(python3 -c 'import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())')
args=(); fc=""; i=0
for f in "$@"; do args+=(-i "$f"); fc+="[$i]scale=432:-1[v$i];"; i=$((i+1)); done
for ((j=0;j<i;j++)); do fc+="[v$j]"; done
"$FF" -y -loglevel error "${args[@]}" -filter_complex "${fc}hstack=inputs=$i" "$out"
