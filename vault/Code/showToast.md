---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# showToast

**In one line:** `showToast(message, color = 'blue', onTap = null, icon = null)` shows a short stacked notification (newest on top, gone after ~3.2 s) in one of four tones, with an optional Phosphor icon and an optional tap action — the app's most-called UI helper (about 200 call sites).

## How it works
- Tones from `TOAST_CONFIG`: `blue`, `green`, `olive`, `red` (unknown colours fall back to blue).
- Creates `#mkToastStack` on first use; message set via `textContent` (XSS-safe; markup shows literally).
- `onTap` turns it into a button (used to open leaderboard standings).

## Key functions
- `showToast`, `_ensureToastStack`, `phIcon`.

## Data it touches
- none

## Connected to
- [[Toasts And Feedback]], [[Icons]], [[Rendering And Window Globals]], [[Leaderboard Payouts]]

## If you change this
- Changing the parameter order breaks ~200 calls; add options at the end.

## Where in the code
- app.js — just before the Auth functions (`handleGoogleSignIn`).
