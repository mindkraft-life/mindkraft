---
type: backend
sources: [functions/index.js, app.js]
last_verified: 2026-10-05
---
# onFriendRequestWrite

**In one line:** `onFriendRequestWrite` is a Firestore trigger on `friendRequests/{requestId}` that pushes the recipient when someone adds them, and pushes the original sender when the recipient adds them back (detected by the `status: 'accepted'` marker written before the delete).

## How it works
- `onDocumentWritten('friendRequests/{requestId}')`, region asia-south1.
- No `after` (deleted) → return. Dismissals are silent.
- Created → push `toUID`: "<fromName> added you on Mindkraft. Add them back…".
- `status` became `accepted` → push `fromUID`: "<toName> added you back."
- Payload `data.type: 'friend'` → the service worker opens the Friends tab.

## Key functions
- `onFriendRequestWrite`, `pushToUser`.

## Data it touches
- [[friendRequests]], [[users]]

## Connected to
- [[Friends]], [[Friends Page]], [[Push Delivery]], [[pushToUser]]

## If you change this
- The client's accept flow (`acceptFriendRequest`) must keep "mark accepted, then delete" in that order.

## Where in the code
- functions/index.js — "FRIEND REQUEST NOTIFICATIONS".
