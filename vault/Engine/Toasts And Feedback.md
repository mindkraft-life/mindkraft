---
type: engine
sources: [app.js]
last_verified: 2026-10-05
---
# Toasts And Feedback

> [!summary] In plain words
> The small messages that pop up and fade away ("+12 XP", "Saved", "Shield added") and the numbers that float up from a card when you tick it off.
>
> **How it connects:** Used all over the app, especially by [[Activity Completion]] and [[Grit Currency]].

**In one line:** Short-lived feedback in Mindkraft comes from `showToast()` (stacked message toasts with a colour tone and optional icon/tap action), `_showToastPill()` (the single XP/undo pill), and floating "+XP"/"+Grit" numbers spawned over the tapped card.

## How it works
- `showToast(message, color = 'blue', onTap = null, icon = null)` — builds a `.mk-toast` in `#mkToastStack` (created on demand), newest on top, auto-dismissed after ~3.2 s. Colours come from `TOAST_CONFIG` (`blue`, `green`, `olive`, `red`). The message is set with `textContent`, so it is XSS-safe; `icon` is a Phosphor name. `onTap` makes the toast a button (used by the leaderboard award toast).
- `_showToastPill({ icon, label, tone })` — one centred pill at a time (`xp`, `neg`, `undo`, `streak`, `info` tones); used by `showXPToast` and `showUndoToast` after completions. Its label is inserted as HTML.
- `spawnFloat`, `spawnFloatingXP`, `spawnFloatingGrit` — numbers that rise off an activity card; `completeActivityById` shows the predicted XP via `predictCompletionXP`.
- `animateCounter(id, target)` — the header XP number ticks up.
- `checkStreakMilestone(name, streak)` — milestone toast.
- `gritBurstAdd` / `gritFlushBurst` — collect several Grit grants from one completion into a single toast.
- Larger moments use overlays instead: level-up (`showLevelUpAnimation`), rewards (`showRewardUnlock`), mode resolutions (`modesShowResolution`), gift reveals (`giftShowReveal`).

## Key functions
- `showToast` — see [[showToast]].
- `_showToastPill`, `showXPToast`, `showUndoToast`, `spawnFloatingXP`, `spawnFloatingGrit`, `animateCounter`, `checkStreakMilestone`.

## Data it touches
- none (UI only)

## Connected to
- [[Activity Completion]], [[Grit Currency]], [[Level Rewards]], [[XP And Levels]], [[Leaderboard Payouts]], [[Rendering And Window Globals]]

## If you change this
- `showToast` is called ~200 times; changing its signature is a large sweep.
- Callers that pass markup in the message will see literal tags (by design since the emoji-to-icon switch) — pass `icon` separately.

## Where in the code
- app.js — `showToast`, `_ensureToastStack` (before the Auth functions); `_showToastPill`, `showXPToast`, `showUndoToast` (after the retroactive write functions); `spawnFloat*` near `completeActivityById`; `animateCounter`, `checkStreakMilestone` after activity search.
