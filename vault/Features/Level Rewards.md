---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Level Rewards

**In one line:** Users define their own real-world rewards for reaching a user level (2–100) or a dimension level, and Mindkraft shows a celebration overlay with the reward when that level is reached; Level 100 has a built-in "Legendary" message.

## How it works
- Global rewards: `userData.rewards[level] = {title, description, icon, link}`; edited in the Profile's Rewards card (`openRewardModal`, `openRewardForAnyLevel`, `saveReward`, `deleteReward`), listed by `renderRewards` (past rewards, current level and five levels ahead, plus 100).
- Dimension rewards: `dimension.dimRewards[level]`, edited via `openDimRewardModal`, `openDimRewardForAnyLevel`, `deleteDimReward`, listed by `renderDimRewards` with a dimension selector (`populateDimRewardSelect`, `switchRewardMode`).
- Unlocks: `showRewardUnlock(level)` (from the level-up flow) and `showDimRewardUnlock(dim, level)` (from `applyDimXP`) fill `#rewardUnlockOverlay` / `#dimRewardUnlockOverlay`; links are escaped.
- Icons are `ph-<name>` strings from the icon picker.
- Not to be confused with the **Rewards page** (More › Rewards), which is the Grit shop.

## Key functions
- `renderRewards`, `openRewardForAnyLevel`, `openRewardModal`, `closeRewardModal`, `saveReward`, `deleteReward`, `showRewardUnlock`, `dismissRewardOverlay`, `switchRewardMode`, `populateDimRewardSelect`, `renderDimRewards`, `openDimRewardModal`, `openDimRewardForAnyLevel`, `deleteDimReward`, `showDimRewardUnlock`.

## Data it touches
- [[users]] (`rewards`, `dimensions[].dimRewards`)

## Connected to
- [[Profile Page]], [[XP And Levels]], [[Dimension Levels]], [[Level-Up Share Card]], [[Icons]]

## If you change this
- The reward modal is shared between global and dimension rewards (`_editingDimRewardLevel` decides which); keep both save paths in step.

## Where in the code
- app.js — `renderRewards` … `deleteDimReward` (after the toast/level-up helpers).
- index.html — `#rewardModal`, `#rewardUnlockOverlay`, `#dimRewardUnlockOverlay`, Profile "Rewards" card.
