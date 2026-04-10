# Design: `useQuery` Storage Hook API

**Date:** 2026-04-10  
**Status:** Approved

## Overview

Introduce a `useQuery`-style hook API for reading from the storage layer. The goal is to give components a consistent `{ data, loading, error, refetch }` interface that can be swapped for a real asynchronous backend in the future without changing call sites.

## Architecture

Three layers:

### 1. Generic internal hook — `src/hooks/useQuery.ts`

A hook that accepts `() => Promise<T>` as its fetcher and manages state. This is the shared state engine. It is **not part of the public API** — components never call it directly.

- Sets `loading: true` on mount and on every `refetch()` call
- Retains previous `data` during a refetch (no blank flash)
- Catches errors from the fetcher and stores them in `error`
- Does not retry automatically

### 2. Typed domain hooks

Each hook wraps `useQuery` with a specific storage call. They accept an options object (not positional parameters) for consistency and forward-compatibility.

| Hook | Options | Data type |
|---|---|---|
| `useCharactersQuery({ limit? })` | `src/hooks/useCharactersQuery.ts` | `Character[]` |
| `useCharacterQuery({ id })` | `src/hooks/useCharacterQuery.ts` | `Character \| null` |
| `useSettingsQuery()` | `src/hooks/useSettingsQuery.ts` | `AppSettings` |

Additional domain hooks follow the same pattern as new storage domains are added.

### 3. Existing store — unchanged

`CharacterStore`, `getCharacterStore()`, `loadSettings()`, and `saveSettings()` are left untouched. The typed hooks wrap their synchronous calls in `Promise.resolve()`. When a real async backend is introduced, only the fetcher inside the typed hook changes.

## Return Shape

```ts
type QueryResult<T> = {
  data: T | null      // null until resolved, or if fetch returns null
  loading: boolean    // true on initial fetch and during refetch
  error: Error | null
  refetch: () => void
}
```

## Error Handling

The generic `useQuery` wraps the fetcher in try/catch. On error, `error` is populated and `data` is retained from its previous value (or `null` on initial load). No automatic retry logic. Typed hooks pass the fetcher through without additional error handling.

## Testing

- `useQuery` is testable with a fake async fetcher.
- Typed hooks are testable by mocking `getCharacterStore()` or `loadSettings()`.
- No new testing infrastructure required.

## Out of Scope

- `useMutation` — a separate design, to follow.
- Caching / deduplication — not needed while the store is synchronous localStorage.
- Context-based store injection — can be introduced later if dependency injection becomes necessary.
