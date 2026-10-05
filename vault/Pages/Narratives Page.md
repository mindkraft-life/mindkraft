---
type: page
sources: [index.html]
last_verified: 2026-10-05
---
# Narratives Page

**In one line:** Pursuits › Narratives is a placeholder page that only shows a book icon and "Coming soon"; no code renders or stores anything for it.

## How it works
- Host `#mkEmptyPursuitsNarratives` with a static empty state; the nav's `activateEmpty` shows it.

## Key functions
- `activateEmpty` (index.html nav script).

## Data it touches
- none

## Connected to
- [[Bottom Navigation]], [[Tab Switching]]

## If you change this
- Building the feature means adding a render hook in `activateEmpty` the way Modes and Rewards do.

## Where in the code
- index.html — `#mkEmptyPursuitsNarratives`.
