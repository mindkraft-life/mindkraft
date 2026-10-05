---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Character Title And Life Balance

**In one line:** The Profile shows a "life balance" spider chart across five life categories (Body, Mind, People, Work, Extra) built from activities the user has tagged, and derives a character title from the dominant category and level (e.g. "The Athlete" → "The Iron Will", or "The Well-Rounded" when balanced).

## How it works
- `window.LIFE_CATEGORIES` defines the five categories (label, icon, colour, description).
- Tagging: Profile › Life Balance › configure (`toggleSpiderConfig`, `renderSpiderConfigList`, `setSpiderTag(actId, catId)`) stores `profile.spiderTags[activityId] = categoryId`.
- `getProfileCategoryXP()` sums each tagged activity's non-penalty history XP per category.
- `getCharacterTitle(level, categoryXP)`: one category above 50% of the total → its title ladder (index `floor(level/33)`); three or more categories with none above 35% → "The Well-Rounded" / "The Polymath" (50+); otherwise a level-based default (The Initiate, Apprentice at 15, Journeyman at 30, Adept at 50, Master at 70).
- `renderSpiderChartCanvas(container, legendEl, catXP, opts)` draws the chart (also used on friend profile cards with their published `categoryXP`).
- The title and category XP are published via [[Public Profile]].

## Key functions
- `getProfileCategoryXP`, `getCharacterTitle`, `renderProfileSpiderChart`, `renderSpiderChartCanvas`, `toggleSpiderConfig`, `renderSpiderConfigList`, `setSpiderTag`, `getCategoryXP`.

## Data it touches
- [[users]] (`profile.spiderTags`, activities' history), [[publicProfiles]] (`categoryXP`, `characterTitle`)

## Connected to
- [[Profile Page]], [[Friend Profile Page]], [[Public Profile]], [[Level-Up Share Card]]

## If you change this
- Category ids are stored in users' data; renaming one orphans existing tags.

## Where in the code
- app.js — `LIFE_CATEGORIES`, `getCategoryXP`, `getProfileCategoryXP`, `getCharacterTitle` (top of file); spider chart and config in the Profile section.
