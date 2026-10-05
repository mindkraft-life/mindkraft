---
type: engine
sources: [app.js]
last_verified: 2026-10-05
---
# Hook Chains

**In one line:** Later sections of app.js extend core actions like `completeActivity`, `undoActivity`, `switchTab` and `closeActivityModal` by re-assigning the `window.*` function to a wrapper that calls the previous one, so one tap runs a chain of feature hooks whose order is set by file order (plus a few wrappers applied in `setTimeout(…, 0)`).

## How it works
Core functions are defined once, then wrapped. The **last** wrapper assigned is the outermost and runs first; each awaits the previous one.

| Action | Base definition | Wrappers, in the order they are applied |
|---|---|---|
| `window.completeActivity` | Activities core | Daily Planner reconcile → Tech Tree mastery check → Versus progress (`vsOnCompletion`) → Modes (`modesOnCompletion`) |
| `window.undoActivity` | Activities core | Daily Planner reconcile → Versus (`vsOnUndo`) → Modes (`modesOnUndo`) |
| `window.retroactiveComplete` / `retroactiveDelete` | Retro engine | Daily Planner reconcile |
| `window.switchTab` | Tab switching | Versus (fetch on Challenges, detach listener elsewhere) → Modes (`modesRefreshBanner`) |
| `window.switchSubTab` | Tab switching | Tech Tree (`renderTechTree` on the Map sub-tab) |
| `window.saveActivity` | Activity editor | Versus (map a newly created activity to the accept walkthrough) |
| `window.deleteActivity` | Activity editor | Versus (warn, then forfeit live challenges using it) |
| `window.closeActivityModal` | Activity editor | Versus (return to accept walkthrough) → Tech Tree (clear accept context; applied in `setTimeout 0`, so it ends up outermost) |
| `window.completeProjectCycle` | Quests | Tech Tree mastery check (applied in `setTimeout 0`) |
| `window.openGridActionMenu` | Grid view | Tech Tree ("Add to web" button) |
| `window.closeProjectModal` | Quests builder | Quest Composer (clear `window._qcDraft`; applied in `setTimeout 0`) |
| `window.openProfileOverlay` / `closeProfileOverlay` | Profile | history push/pop for the back button |
| `window.applyThemePreset` | Themes | Modes (`modesApplyTheme`, keeps Berserk's colour class) |

- Not every feature uses a wrapper: Grit (`gritOnCompletion`, `gritOnRemoval`), gifts (`giftOnCompletion`), quests (`updateQuestProgress`), dimension XP (`applyDimXP`) and Grit's `gritOnRetroComplete` are **direct calls inside** the base `completeActivity` / `undoActivity` / retro functions.
- Wrappers detect "a completion really happened" by comparing `activity.completionCount` before and after, because the base function silently returns on a blocked tap.
- `completeActivityById` / `undoActivityById` (used by grid, planner, search) call `window.completeActivity`, so they go through the whole chain.
- `window.completeProject` is wrapped by the Tech Tree code if it exists, but no such function is defined anywhere.

## Key functions
- `completeActivity` — see [[completeActivity]].
- `undoActivity` — see [[undoActivity]].
- `switchTab` — see [[switchTab]].
- `vsOnCompletion`, `vsOnUndo`, `modesOnCompletion`, `modesOnUndo`, `plannerReconcileActivityToday`, `evaluateTechTreeMastery`.

## Data it touches
- [[users]], [[versusChallenges]], [[pacts]]

## Connected to
- [[Activity Completion]], [[Daily Planner]], [[Tech Tree Map]], [[Versus Challenges]], [[Modes]], [[Tab Switching]], [[Activity Editor Page]], [[Quests]], [[Quest Composer]], [[Themes]], [[modesOnCompletion]]

## If you change this
- Renaming or re-assigning `window.completeActivity` anywhere breaks every hook applied before that point. Always wrap; never replace.
- Code inside app.js that calls the module-level function by name (not via `window.`) skips the wrappers. Inline `onclick="completeActivity(...)"` resolves to `window.completeActivity` and gets the full chain.
- Because wrappers `await` the previous function, an exception in an inner hook propagates outward unless that hook catches it — most do (`try { … } catch`).
- Retroactive edits are deliberately not wrapped by Versus or Modes: challenge and mode progress only count live completions.

## Where in the code
- app.js — Daily Planner hooks (after `plannerUndoSlot`); Tech Tree "Hooks into existing flows" (just before the QUESTS section); Versus "Hooks into existing flows" (end of VERSUS CHALLENGES); Modes "WIRING" (end of file); Quest Composer `window.closeProjectModal`.
