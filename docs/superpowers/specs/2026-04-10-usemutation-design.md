# Design: `useMutation` Storage Hook API

**Date:** 2026-04-10  
**Status:** Approved

## Overview

Introduce a `useMutation`-style hook API mirroring Apollo's `useMutation` pattern. Mutations return a tuple `[mutate, { data, loading, error }]`. Hooks own no user feedback — toasts, navigation, and error display are the call site's responsibility.

## Architecture

Same layered structure as `useQuery`:

### 1. Generic internal hook — `src/hooks/useMutation.ts`

Takes the mutation function at hook definition time. Not part of the public API — components never call it directly.

```ts
function useMutation<TData, TVariables>(
  fn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData>
): [mutate: (variables: TVariables) => Promise<void>, result: MutationResult<TData>]
```

- Sets `loading: true` while the mutation is in flight
- On success: sets `data`, clears `error`, calls `onCompleted(data)`
- On failure: sets `error`, retains previous `data`, calls `onError(error)`
- Does not reset `data` to `null` before each call

### 2. Typed domain hooks

Existing hooks rewritten in-place (same filenames). Each wraps `useMutation` with a specific store call.

| Hook | `mutate` input | `data` type |
|---|---|---|
| `useCharacterSave(options?)` | `character: Character` | `Character` |
| `useCharacterCreate(options?)` | `values: CharacterCreateValues` | `Character` |
| `useCharacterDelete(options?)` | `{ id: string }` | `boolean` |
| `useSettingsSave(options?)` | `settings: AppSettings` | `void` |

`CharacterCreateValues` is defined in the existing `useCharacterCreate.ts`.

### 3. Existing store — unchanged

Store methods are wrapped in `Promise.resolve()` as with `useQuery`.

## Return Shape

```ts
type MutationResult<TData> = {
  data: TData | null   // result of last successful mutation; null initially
  loading: boolean     // true while mutation is in flight
  error: Error | null  // last error; cleared on next successful call
}

type MutationOptions<TData> = {
  onCompleted?: (data: TData) => void
  onError?: (error: Error) => void
}
```

## Migration Impact

Call sites take over responsibilities previously owned by the hooks:

- **`useCharacterSave`** — drops `message`, `useTranslations`, `validationErrors` state, and the `form`/`character`/`onSave` parameters. `useCharacterSheetForm` (the main consumer) updates to pass `onCompleted: refetch` and handle errors via `onError`.
- **`useCharacterCreate`** — drops `router.push` and `message`. Call site handles navigation in `onCompleted`.
- **`useCharacterDelete`** — drops `router.push` and `message`. Call site handles navigation in `onCompleted`.
- **`useSettingsSave`** — new hook; `SettingsContext` continues calling `saveSettings()` directly for now (no migration required).

## Error Handling

The generic `useMutation` wraps the fn in try/catch. `SaveError` and `ValidationErrorCollection` propagate as-is through `error` — call sites that need to distinguish them import those classes directly.

## Testing

No React testing infrastructure is available (node environment, no jsdom). Hooks are not directly unit-tested, matching the existing project convention.

## Out of Scope

- Optimistic updates
- Automatic refetch of related queries after mutation (call sites call `refetch` manually via `onCompleted`)
- `useCharacterLibraryActions` migration — it has async file I/O and complex branching that doesn't fit cleanly into `useMutation`; left as-is
