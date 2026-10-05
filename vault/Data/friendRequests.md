---
type: data
sources: [app.js, functions/index.js, test/rules/firestore.rules.test.mjs]
last_verified: 2026-10-05
---
# friendRequests

**In one line:** `friendRequests/{toUid}_{fromUid}` is a "someone added you" notice: adding by code is one-sided, so this document only tells the other person and offers an add-back, which writes an `accepted` marker and then deletes the document.

## How it works
- Created by `addFriendByCode` after the sender has already added the recipient to their own `friends`: `{ toUID, fromUID, fromName, fromPhotoURL, fromCode, createdAt }`. The deterministic id prevents duplicates.
- Read by the recipient: `renderFriendsTab` (requests list) and `frRequestsOnLogin` (a popup on app open, de-duplicated per device in localStorage).
- Accept (`acceptFriendRequest` / `frPopupAddBack`): add the sender to `friends`, then `updateDoc` `{status: 'accepted', toName, acceptedAt}`, then delete. Dismiss deletes silently.
- [[onFriendRequestWrite]] pushes on create (to the recipient) and on the `accepted` marker (to the sender); the delete is ignored.

## Key functions
- `addFriendByCode`, `acceptFriendRequest`, `dismissFriendRequest`, `frRequestsOnLogin`, `frShowRequestPopup`, `frPopupAddBack`.

## Data it touches
- [[users]] (`friends`), [[publicProfiles]]

## Connected to
- [[Friends]], [[Friends Page]], [[onFriendRequestWrite]], [[Security Rules]], [[Rules Test]]

## If you change this
- The accept marker exists only so the push trigger can tell accept from dismiss; removing it silences the "added you back" push.
- Rules limit what the recipient may write onto the sender's document (no free text in front of the sender beyond `toName`).

## Where in the code
- app.js — FRIENDS FEATURE (`addFriendByCode`, `acceptFriendRequest`, `dismissFriendRequest`) and "SOMEONE ADDED YOU" popup block.
