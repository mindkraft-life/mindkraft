#!/usr/bin/env bash
# Pulls the two webfonts the app itself uses (Inter + Phosphor 2.1.2) from npm
# into .cache/vendor so the scene renders offline with the same glyphs as the
# app. The app loads them from Google Fonts / unpkg; npm carries identical files.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
v="$here/.cache/vendor"
mkdir -p "$v" && cd "$v"
if [ ! -d phosphor ]; then
  npm pack --silent @phosphor-icons/web@2.1.2 >/dev/null
  mkdir -p phosphor && tar xzf phosphor-icons-web-2.1.2.tgz -C phosphor --strip-components=2 package/src/bold package/src/fill
  rm -f phosphor-icons-web-2.1.2.tgz
fi
if [ ! -d inter ]; then
  npm pack --silent @fontsource-variable/inter@5.3.0 >/dev/null
  mkdir -p inter && tar xzf fontsource-variable-inter-5.3.0.tgz -C inter --strip-components=2 package/files/inter-latin-wght-normal.woff2
  rm -f fontsource-variable-inter-5.3.0.tgz
  printf "@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;src:url(inter-latin-wght-normal.woff2) format('woff2');}\n" > inter/inter.css
fi
echo "vendor assets ready in $v"
