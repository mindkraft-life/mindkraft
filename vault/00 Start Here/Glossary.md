---
type: start
last_verified: 2026-10-05
---
# Glossary

**In one line:** Mindkraft's own vocabulary — the words used in the UI, the code and these notes — each with a one-line meaning and the note that explains it.

| Term | Meaning | Note |
|---|---|---|
| Activity | A tracked habit/task with base XP, frequency and history | [[Activities]] |
| Dimension / Path | Life area and its sub-area; the two levels above activities | [[Dimensions And Paths]] |
| Uncategorized | Fallback dimension/path for activities without a home | [[Activities]] |
| Frequency | daily, weekly, biweekly, monthly, custom, occasional | [[Activity Frequencies And Cycles]] |
| Window / cycle window | The period an activity is judged in (day, Monday week, fortnight, month, custom) | [[Activity Frequencies And Cycles]] |
| Completion history | Per-activity list of `{date, xp}` entries; the source of truth | [[recordCompletion]] |
| XP, level | Points from completions; levels 1–100, each needing `k(2L−1)` XP | [[XP And Levels]] |
| Level Scaling (k) | The factor in the level formula, default 8.5 | [[XP And Levels]] |
| Streak / best streak | Consecutive completed windows | [[Streaks And Shields]] |
| Multiplier | XP bonus from a streak of 5+ (`1 + 0.1 × streak^k`) | [[Activity Completion]] |
| Shield | Absorbs one missed window; 3 per streak, +1 at milestones, max 10 held | [[Streaks And Shields]] |
| Shield pool | Bought or gifted shields waiting to be applied to an activity | [[Grit Shop]] |
| Perform-negative | An activity that costs XP when done (a habit to break) | [[Negative Activities And Skip Penalty]] |
| Skip-negative / skip penalty | An activity that costs XP for each missed window, charged at login | [[Negative Activities And Skip Penalty]] |
| Dimension level | Per-dimension level track (half the user-level cost) | [[Dimension Levels]] |
| Level reward | A user-defined reward for reaching a level | [[Level Rewards]] |
| Ghost XP | XP not attached to any history row (mode bonuses, deleted activities) | [[Activity History Log]] |
| Retro edit | Adding/removing a completion up to 7 days back | [[Retroactive History Editing]] |
| Login pass | The streak/penalty/mode/Map/Grit catch-up run at sign-in | [[Login-Time Processing]] |
| Write invariant | The rule that only the loaded owner's data may be saved | [[Saving And The Write Invariant]] |
| Hook chain | Wrappers layered on `completeActivity` and friends | [[Hook Chains]] |
| Grit | The spendable effort currency | [[Grit Currency]] |
| Drip | 1 Grit per countable completion | [[Grit Currency]] |
| Quota / contributors | The week's expected completions from live activities | [[Grit Weekly Payout]] |
| Weekly payout | Ratio curve + absolute curve, paid after Monday | [[Grit Weekly Payout]] |
| Boost (double XP) | ×2 on the next completion, bought or gifted | [[Grit Shop]] |
| Gift / mirror | A shield or boost sent to a friend; the sender's private copy | [[Social Gifting]] |
| Routine (group) | A named, optionally timed bundle of activities | [[Routines]] |
| Active routine | System routine refilled weekly from Grit contributors | [[Routines]] |
| Planner slot | A scheduled activity/note on a day; ticks mirror real completions | [[Daily Planner]] |
| Quest (project) | A tree of groups and leaves; sealed for bonus XP and Grit | [[Quests]] |
| Group / leaf | Quest container (ordered pipeline or checklist, repeatable) / step (activity or task) | [[Quests]] |
| Seal / cycle | Completing a quest or one cycle of a repeating quest | [[Quests]] |
| Quest Composer | "Plan it for me": AI-drafted quest | [[Quest Composer]] |
| Map / Web / Tech tree | AI-woven graph of goals and practices | [[Tech Tree Map]] |
| Anchor / upgrade / fusion / wildcard | Map node roles: your activity / harder variant / two-dimension blend / surprise | [[Tech Tree Map]] |
| Mastery | Enough completions inside a rolling window | [[Tech Tree Map]] |
| Resolve | A Map node completing because its activity was mastered | [[Tech Tree Map]] |
| Reveal / silhouette | Paying Grit to see a dark Map node | [[Map Reveal Loop]] |
| Weave | A call to the weaveWeb function | [[Map Weaving]] |
| Mode | One of seven Grit-priced challenges, one at a time | [[Modes]] |
| Habit / Berserk / Recovery / Insurance / Stake / Pact / Focus Window | The seven modes | [[Habit Mode]], [[Berserk Mode]], [[Recovery Mode]], [[Insurance Mode]], [[Stake Mode]], [[Pact Mode]], [[Focus Window]] |
| Wager / stake / pot / escrow | Grit put at risk, held in a shared document until resolution | [[Versus Challenges]], [[Pact Mode]] |
| Payout claim | Each side crediting its own winnings from a resolved shared doc | [[vsRunMaintenance]] |
| Versus challenge | Two-friend Grit wager on activity targets | [[Versus Challenges]] |
| Requirement / mapping | A challenge target / which of your activities fulfils it | [[Versus Challenges]] |
| Board / scored roster / mutual | Leaderboard membership; frozen weekly; both on each other's board | [[Leaderboard Payouts]] |
| Friend code | `MK-XXXX` code used to add friends | [[Friends]] |
| Public profile | Shareable stats snapshot | [[Public Profile]] |
| Character title | Title from dominant life category and level | [[Character Title And Life Balance]] |
| Reminder (general / activity / mode) | Scheduled push documents | [[Reminders]] |
| nextSendAt | Precomputed UTC fire time of a reminder | [[Reminder Scheduling]] |
| VAPID | Keys that sign Web Push messages | [[Push Delivery]] |
| Narratives | Placeholder page ("Coming soon") | [[Narratives Page]] |

Back to [[Home]].
