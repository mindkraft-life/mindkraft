---
type: engine
sources: [app.js, index.html, sw.js]
last_verified: 2026-10-05
---
# Icons

> [!summary] In plain words
> The little pictures used throughout the app all come from one icon set, so they look the same on every phone. Quests and rewards let you pick an icon from a short list.
>
> **How it connects:** Used on every screen, including the [[Level-Up Share Card]], [[Quests]] and [[Level Rewards]].

**In one line:** Mindkraft draws icons with the Phosphor icon webfont (bold and fill weights, pinned to @phosphor-icons/web 2.1.2 on unpkg), via `phIcon()` for HTML and `phGlyph()` for canvas/SVG text, and stores user-picked icons as `ph-<name>` strings.

## How it works
- index.html links only the `bold` and `fill` stylesheets. The service worker caches the unpkg font files on first use so icons survive offline.
- `phIcon(name, opts)` returns `<i class="ph-bold ph-name">` (or `ph-fill`); `opts.lead` adds trailing spacing.
- `PH_GLYPH` maps a few names to Private Use Area codepoints for drawing into `<canvas>` (the level-up card, the spider chart); `ensureIconFont()` waits for the fonts before drawing.
- `renderStoredIcon(value)` / `storedIconName(value)` render stored quest/reward icons, mapping legacy emoji values so no Firestore migration was needed.
- The icon picker (`openIconPicker`, `pickIcon`, `closeIconPicker`, `setIconPickerValue`) offers a curated `ICON_PICKER_SET` for quests and rewards.
- Some modules also inline their own SVG sets (`ttIcon` for the Map, `pr*Svg` for Quests, `editIconSvg`/`trashIconSvg` for Categories).

## Key functions
- `phIcon`, `phGlyph`, `renderStoredIcon`, `storedIconName`, `setIconStatus`, `ensureIconFont`, `openIconPicker`, `pickIcon`, `closeIconPicker`, `setIconPickerValue`.

## Data it touches
- [[users]] (quest `emoji` field and reward icons hold `ph-<name>` strings)

## Connected to
- [[Level-Up Share Card]], [[Character Title And Life Balance]], [[Quests]], [[Level Rewards]], [[Service Worker]], [[Rendering And Window Globals]]

## If you change this
- Bumping the Phosphor version changes two `<link>` URLs and the SW cache rule; `PH_GLYPH` codepoints must be re-checked.
- Only two weights are loaded — `ph-light`, `ph-duotone` etc. render as empty boxes.

## Where in the code
- app.js — "Icons (Phosphor)" block near the top (`PH_GLYPH`, `phIcon`, `renderStoredIcon`, icon picker).
- index.html — Phosphor `<link>` tags in `<head>`.
