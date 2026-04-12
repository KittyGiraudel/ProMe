# Cloud Sync Design

**Date:** 2026-04-12
**Status:** Approved
**Related PR:** KittyGiraudel/ProMe#46

## Overview

ProMe stores all character data in `localStorage`. PR #46 introduces Netlify Identity (auth) and Netlify DB / Neon (cloud storage). This document defines how local and remote data are kept in sync.

The goal is seamless, silent synchronization: users who authenticate get cloud storage transparently, users who stay logged out keep the local-only experience unchanged, and going offline mid-session is handled gracefully without data loss.

**Fully local usage is the default and a permanently supported mode.** A user who never logs in sees no change from the current behaviour: all reads and writes go to `localStorage`, no network requests are made, and the app works fully offline. Cloud sync is an opt-in layer activated solely by logging in.

---

## Behavioral Contract

| Situation                           | Behavior                                                                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Not logged in                       | Reads and writes go to `localStorage` only                                                                                             |
| Login                               | Merge local and remote (most recent `updatedAt` wins per character); missing characters are copied to whichever side doesn't have them |
| Logged in + online                  | Every write goes to local first, then remote                                                                                           |
| Logged in + offline                 | Every write goes to local only; user is notified                                                                                       |
| Back online                         | Characters saved while offline are synced to remote; user is notified                                                                  |
| Logout                              | No-op — local is already a live mirror of the remote                                                                                   |
| Deletion while logged in            | Removes from both stores                                                                                                               |
| Deletion while offline / logged out | Not propagated on next sync; character reappears if it exists in the other store                                                       |

### Notes

- **Most recent wins** is determined solely by `updatedAt`, which is set at explicit save time. This is safe because ProMe is a single-user, single-device-at-a-time app.
- **Deletions do not propagate** across stores. There are no tombstones. If a character exists on either side, it survives a sync. A user who deletes a character while offline will see it reappear on the next login sync; they can delete it again once online.
- **Simultaneous saves** (same millisecond on both sides) are not a concern and are not handled specially. Local wins in that case as a tiebreaker.

---

## Architecture

### Single unified store: `SyncedCharacterStore`

A single `SyncedCharacterStore` replaces the current store-swapping approach. It wraps both `localStorageStore` and `remoteStore`, implements the existing `CharacterStore` interface, and changes its internal behavior based on authentication state.

When `isAuthenticated` is `false` (the default), `SyncedCharacterStore` is a transparent passthrough to `localStorageStore`. The `remoteStore` is never touched. This means a user who never logs in is completely unaffected: behaviour is identical to the current local-only implementation.

The rest of the app — hooks, components, pages — continues to call `getCharacterStore()` and is entirely unaware of sync logic.

```
┌─────────────────────────────────────┐
│         SyncedCharacterStore        │
│                                     │
│  isAuthenticated: boolean           │
│                                     │
│  read  → remote (if auth) or local  │
│  write → local first, then remote   │
│          (if auth + remote succeeds)│
│                                     │
│  ┌─────────────────┐  ┌──────────┐  │
│  │  localStore     │  │remoteStore│ │
│  └─────────────────┘  └──────────┘  │
└─────────────────────────────────────┘
```

`SyncedCharacterStore` exposes two additional methods beyond the `CharacterStore` interface, called by `AuthProvider`:

- `login()` — sets `isAuthenticated = true` and runs the initial merge sync
- `logout()` — sets `isAuthenticated = false`

And one method called by the connectivity hook:

- `syncToRemote()` — pushes all locally-ahead characters to the remote (reconnect sync)

### AuthProvider responsibilities

`AuthProvider` calls:

- `store.login()` when Netlify Identity signals a successful authentication
- `store.logout()` when the user logs out

It does not call `setCharacterStore()` — the store is always the same `SyncedCharacterStore` instance for the lifetime of the app.

### Connectivity hook: `useNetworkStatus`

A `useNetworkStatus` hook mounted once at the app layout level owns the browser `online`/`offline` events. It:

1. Tracks current connectivity state
2. Shows a transient notification on state change:
   - Going offline: "Now offline — saving locally"
   - Coming back online: "Back online — syncing to cloud"
3. Calls `store.syncToRemote()` when the `online` event fires

The store itself does not listen to connectivity events and does not know whether it is online or offline. It simply attempts remote writes and handles failures gracefully.

---

## Sync Algorithm

The same algorithm is used in two contexts: **login merge** and **reconnect sync**.

```
sync(local: Character[], remote: Character[]) → void

Build a map of all unique character IDs from both sides.

For each ID:
  - Only in local  → write to remote
  - Only in remote → write to local
  - In both        → compare updatedAt (ISO string lexicographic sort)
                     winner is written to the losing side

Fire all writes in parallel (Promise.all).
```

**Properties:**

- **Idempotent** — running the algorithm twice in a row is a no-op (after the first pass, both sides agree on every character)
- **Safe to partially fail** — each write is independent; a failed remote write leaves local intact and will be retried on the next reconnect sync
- **Schema-safe** — characters are always at the current schema version by the time they reach the algorithm, because `localStorageStore` runs migrations on read and the remote API normalizes on write

---

## Error Handling

| Failure                                                | Handling                                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Remote write fails during normal save                  | Swallowed silently; local write already succeeded; next reconnect sync will push the local version |
| Remote write fails during login sync or reconnect sync | Same — partial sync is safe to retry; no error surfaced                                            |
| Local write fails (e.g. storage quota)                 | Hard error, surfaced to the user — same as current behavior                                        |

No errors are shown to the user for remote failures. The connectivity notification ("saving locally") is the only signal that something is being deferred.

---

## What This Design Does Not Cover

- **Conflict resolution beyond `updatedAt`** — there is no field-level merge. The entire character object is the unit of sync.
- **Multi-device simultaneous sessions** — not a supported use case. Most recent `updatedAt` is assumed to always be the authoritative version.
- **Deletion propagation** — intentionally omitted. See behavioral contract above.
- **Sync status UI beyond transient notifications** — no persistent sync indicator is specified.
