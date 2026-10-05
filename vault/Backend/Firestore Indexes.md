---
type: backend
sources: [firestore.indexes.json, firebase.json, functions/index.js, app.js]
last_verified: 2026-10-05
---
# Firestore Indexes

**In one line:** firestore.indexes.json declares the five composite indexes Mindkraft's queries need — reminders due-time, three for Versus challenges and one for Pacts — and the deploy workflow pushes them with `firestore:indexes`.

## How it works
| Collection | Scope | Fields | Used by |
|---|---|---|---|
| `reminders` | collection group | `active` ↑, `nextSendAt` ↑ | [[sendDueReminders]] due query |
| `versusChallenges` | collection | `participants` contains, `status` ↑ | client `vsFetch` list query |
| `versusChallenges` | collection | `status` ↑, `endsAt` ↑ | [[resolveDueVersusChallenges]] overdue |
| `versusChallenges` | collection | `status` ↑, `expiresAt` ↑ | [[resolveDueVersusChallenges]] lapsed |
| `pacts` | collection | `participants` contains, `status` ↑ | client `pactFetch` |
- Other queries use automatic single-field indexes: `publicProfiles where friendCode ==`, `friendRequests where toUID ==`, `gifts where status ==`, `reminders where type ==`, the ledger ordered by `at`.
- `vsFetch` falls back to a single-field query and filters in memory if its composite index is missing.

## Key functions
- Queries in `sendDueReminders`, `resolveDueVersusChallenges`, `vsFetch`, `pactFetch`.

## Data it touches
- [[reminders]], [[versusChallenges]], [[pacts]]

## Connected to
- [[Deploy Pipeline]], [[sendDueReminders]], [[resolveDueVersusChallenges]], [[Versus Challenges]], [[Pact Mode]]

## If you change this
- A new compound query fails at runtime with a "requires an index" error until the index is added here and deployed.
- Removing an index from this file does not delete it from the project (deploys only add/update unless forced).

## Where in the code
- firestore.indexes.json; referenced from firebase.json `firestore.indexes`.
