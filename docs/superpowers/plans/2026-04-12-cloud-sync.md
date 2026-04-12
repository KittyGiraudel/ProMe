# Cloud Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the cloud sync design spec — a single `SyncedCharacterStore` that transparently dual-writes to local and remote stores when authenticated, with a `useNetworkStatus` hook for offline notifications and reconnect sync.

**Architecture:** `SyncedCharacterStore` wraps `localStorageStore` and `remoteStore` and routes reads/writes based on an `isAuthenticated` flag. When unauthenticated it is a transparent passthrough to local storage. `AuthProvider` calls `store.login()` and `store.logout()` instead of swapping stores. A `useNetworkStatus` hook mounted in `AppProviders` listens to browser `online`/`offline` events and triggers reconnect syncs.

**Tech Stack:** TypeScript, Vitest, Ant Design `App.useApp()` for notifications, browser `online`/`offline` events.

**Design spec:** `docs/superpowers/specs/2026-04-12-cloud-sync-design.md`

---

## File Map

**New files:**
- `src/lib/character/store/syncedStore.ts` — `sync()` algorithm + `createSyncedCharacterStore()` factory
- `src/lib/character/store/syncedStore.test.ts` — unit tests for both
- `src/hooks/useNetworkStatus.ts` — connectivity hook

**Modified files:**
- `src/lib/character/store/types.ts` — add `SyncedCharacterStore` type
- `src/lib/character/store/index.ts` — export a single `SyncedCharacterStore` instance; remove `setCharacterStore`
- `src/lib/auth/context.tsx` — call `characterStore.login()`/`.logout()` instead of `setCharacterStore()`
- `src/components/AppProviders/AppProviders.tsx` — mount `useNetworkStatus` via a `NetworkStatusMonitor` component

---

## Task 1: Add `SyncedCharacterStore` type

**Files:**
- Modify: `src/lib/character/store/types.ts`

- [ ] **Step 1: Append the new type**

The current file exports only `CharacterStore`. Add `SyncedCharacterStore` below it:

```ts
import type { Character, CharacterInput } from '@/lib/character/types'

export type CharacterStore = {
  getAll(): Promise<Character[]>
  list(): Promise<Character[]>
  get(id: string): Promise<Character | null>
  create(input?: Partial<CharacterInput>): Promise<Character>
  save(character: Character): Promise<Character>
  delete(id: string): Promise<boolean>
  import(json: string): Promise<Character>
}

export type SyncedCharacterStore = CharacterStore & {
  /** Sets authenticated state and runs the initial bidirectional merge sync. */
  login(): Promise<void>
  /** Sets authenticated state to false. Local is already current; no sync needed. */
  logout(): void
  /** Syncs local and remote stores. Called on reconnect by useNetworkStatus. */
  syncToRemote(): Promise<void>
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/character/store/types.ts
git commit -m "feat(store): add SyncedCharacterStore type"
```

---

## Task 2: Implement and test the sync algorithm

**Files:**
- Create: `src/lib/character/store/syncedStore.test.ts`
- Create: `src/lib/character/store/syncedStore.ts`

The `sync()` function merges two character stores bidirectionally. It uses `import()` for local writes (which does not call `touchCharacter()`, preserving `updatedAt`) and `save()` for remote writes.

- [ ] **Step 1: Write failing tests**

Create `src/lib/character/store/syncedStore.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import type { CharacterStore } from '@/lib/character/store/types'
import { sync } from '@/lib/character/store/syncedStore'
import type { Character } from '@/lib/character/types'

function makeChar(id: string, updatedAt: string): Character {
  return {
    id,
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt,
    name: `Character ${id}`,
    archetype: 'warrior',
    honor: 0,
    inspiration: 0,
    money: 0,
    health: { current: 10, max: 10 },
    courage: { current: 10, max: 10 },
    stamina: { current: 10, max: 10 },
    clock: 0,
    map: { currentPosition: { q: 0, r: 0 }, cells: [] },
    inventory: [],
    spellbook: [],
    journalEntries: [],
    lifeStatus: 'alive',
  }
}

function makeStore(characters: Character[]): CharacterStore {
  const chars = [...characters]
  return {
    getAll: vi.fn(async () => chars),
    list: vi.fn(async () => chars),
    get: vi.fn(async id => chars.find(c => c.id === id) ?? null),
    create: vi.fn(),
    save: vi.fn(async c => {
      const idx = chars.findIndex(x => x.id === c.id)
      if (idx >= 0) chars[idx] = c
      else chars.push(c)
      return c
    }),
    delete: vi.fn(async () => true),
    import: vi.fn(async json => {
      const c = JSON.parse(json) as Character
      const idx = chars.findIndex(x => x.id === c.id)
      if (idx >= 0) chars[idx] = c
      else chars.push(c)
      return c
    }),
  }
}

describe('sync', () => {
  it('copies a character that only exists in local to remote', async () => {
    const local = makeStore([makeChar('a', '2026-01-02T00:00:00.000Z')])
    const remote = makeStore([])
    await sync(local, remote)
    expect(remote.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }))
    expect(local.import).not.toHaveBeenCalled()
  })

  it('copies a character that only exists in remote to local', async () => {
    const local = makeStore([])
    const remote = makeStore([makeChar('b', '2026-01-02T00:00:00.000Z')])
    await sync(local, remote)
    expect(local.import).toHaveBeenCalledWith(expect.stringContaining('"id":"b"'))
    expect(remote.save).not.toHaveBeenCalled()
  })

  it('writes the local version to remote when local is more recent', async () => {
    const localChar = makeChar('c', '2026-01-03T00:00:00.000Z')
    const remoteChar = makeChar('c', '2026-01-01T00:00:00.000Z')
    const local = makeStore([localChar])
    const remote = makeStore([remoteChar])
    await sync(local, remote)
    expect(remote.save).toHaveBeenCalledWith(localChar)
    expect(local.import).not.toHaveBeenCalled()
  })

  it('writes the remote version to local when remote is more recent', async () => {
    const localChar = makeChar('d', '2026-01-01T00:00:00.000Z')
    const remoteChar = makeChar('d', '2026-01-05T00:00:00.000Z')
    const local = makeStore([localChar])
    const remote = makeStore([remoteChar])
    await sync(local, remote)
    expect(local.import).toHaveBeenCalledWith(expect.stringContaining('"id":"d"'))
    expect(remote.save).not.toHaveBeenCalled()
  })

  it('does nothing when both sides have the same updatedAt', async () => {
    const char = makeChar('e', '2026-01-01T00:00:00.000Z')
    const local = makeStore([char])
    const remote = makeStore([{ ...char }])
    await sync(local, remote)
    expect(local.import).not.toHaveBeenCalled()
    expect(remote.save).not.toHaveBeenCalled()
  })

  it('handles multiple characters correctly in one pass', async () => {
    const local = makeStore([
      makeChar('f', '2026-01-03T00:00:00.000Z'), // local ahead
      makeChar('g', '2026-01-01T00:00:00.000Z'), // remote ahead
    ])
    const remote = makeStore([
      makeChar('f', '2026-01-01T00:00:00.000Z'),
      makeChar('g', '2026-01-05T00:00:00.000Z'),
    ])
    await sync(local, remote)
    expect(remote.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'f' }))
    expect(local.import).toHaveBeenCalledWith(expect.stringContaining('"id":"g"'))
  })
})
```

- [ ] **Step 2: Run tests and confirm they fail**

```bash
npx vitest run src/lib/character/store/syncedStore.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/character/store/syncedStore'"

- [ ] **Step 3: Implement the sync algorithm**

Create `src/lib/character/store/syncedStore.ts`:

```ts
import type { CharacterStore } from '@/lib/character/store/types'
import type { Character } from '@/lib/character/types'

/**
 * Merges two character stores bidirectionally.
 *
 * For each unique character ID across both stores:
 * - Exists only in local  → written to remote via save()
 * - Exists only in remote → written to local via import() (preserves updatedAt)
 * - Exists in both        → most recent updatedAt wins; winner is written to the other side
 * - Equal updatedAt       → no-op
 *
 * All writes are fired in parallel. Safe to re-run (idempotent).
 */
export async function sync(
  local: CharacterStore,
  remote: CharacterStore
): Promise<void> {
  const [localChars, remoteChars] = await Promise.all([
    local.getAll(),
    remote.getAll(),
  ])

  const localMap = new Map<string, Character>(localChars.map(c => [c.id, c]))
  const remoteMap = new Map<string, Character>(remoteChars.map(c => [c.id, c]))
  const allIds = new Set([...localMap.keys(), ...remoteMap.keys()])

  const toLocal: Character[] = []
  const toRemote: Character[] = []

  for (const id of allIds) {
    const localChar = localMap.get(id)
    const remoteChar = remoteMap.get(id)

    if (!localChar) {
      toLocal.push(remoteChar!)
    } else if (!remoteChar) {
      toRemote.push(localChar)
    } else if (localChar.updatedAt > remoteChar.updatedAt) {
      toRemote.push(localChar)
    } else if (remoteChar.updatedAt > localChar.updatedAt) {
      toLocal.push(remoteChar)
    }
    // Equal timestamps: no-op
  }

  await Promise.all([
    ...toLocal.map(c => local.import(JSON.stringify(c))),
    ...toRemote.map(c => remote.save(c)),
  ])
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
npx vitest run src/lib/character/store/syncedStore.test.ts
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/character/store/syncedStore.ts src/lib/character/store/syncedStore.test.ts
git commit -m "feat(store): implement sync algorithm with tests"
```

---

## Task 3: Implement `createSyncedCharacterStore` (TDD)

**Files:**
- Modify: `src/lib/character/store/syncedStore.ts`
- Modify: `src/lib/character/store/syncedStore.test.ts`

- [ ] **Step 1: Add failing tests**

Add the following import at the top of `src/lib/character/store/syncedStore.test.ts`, alongside the existing imports:

```ts
import { createSyncedCharacterStore } from '@/lib/character/store/syncedStore'
```

Then append the following describe block at the bottom of the file:

```ts
describe('createSyncedCharacterStore', () => {
  describe('when not authenticated (default state)', () => {
    it('reads from local only', async () => {
      const localChar = makeChar('x', '2026-01-01T00:00:00.000Z')
      const local = makeStore([localChar])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      const result = await store.getAll()
      expect(result).toContain(localChar)
      expect(remote.getAll).not.toHaveBeenCalled()
    })

    it('writes to local only', async () => {
      const local = makeStore([])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.save(makeChar('y', '2026-01-01T00:00:00.000Z'))
      expect(local.save).toHaveBeenCalled()
      expect(remote.save).not.toHaveBeenCalled()
    })
  })

  describe('after login()', () => {
    it('runs the initial bidirectional sync on login', async () => {
      const localChar = makeChar('a', '2026-01-03T00:00:00.000Z')
      const remoteChar = makeChar('b', '2026-01-05T00:00:00.000Z')
      const local = makeStore([localChar])
      const remote = makeStore([remoteChar])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      expect(remote.save).toHaveBeenCalledWith(localChar)
      expect(local.import).toHaveBeenCalledWith(
        expect.stringContaining('"id":"b"')
      )
    })

    it('reads from remote', async () => {
      const remoteChar = makeChar('z', '2026-01-01T00:00:00.000Z')
      const local = makeStore([])
      const remote = makeStore([remoteChar])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      ;(remote.getAll as ReturnType<typeof vi.fn>).mockClear()
      await store.getAll()
      expect(remote.getAll).toHaveBeenCalled()
    })

    it('dual-writes on save: local first, then remote', async () => {
      const local = makeStore([])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      await store.save(makeChar('w', '2026-01-01T00:00:00.000Z'))
      expect(local.save).toHaveBeenCalled()
      expect(remote.save).toHaveBeenCalled()
    })

    it('succeeds on save even if the remote write fails', async () => {
      const local = makeStore([])
      const remote = makeStore([])
      ;(remote.save as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('network error')
      )
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      await expect(
        store.save(makeChar('v', '2026-01-01T00:00:00.000Z'))
      ).resolves.toBeDefined()
      expect(local.save).toHaveBeenCalled()
    })

    it('dual-writes on delete', async () => {
      const char = makeChar('del', '2026-01-01T00:00:00.000Z')
      const local = makeStore([char])
      const remote = makeStore([char])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      await store.delete('del')
      expect(local.delete).toHaveBeenCalledWith('del')
      expect(remote.delete).toHaveBeenCalledWith('del')
    })
  })

  describe('after logout()', () => {
    it('reads from local again after logout', async () => {
      const local = makeStore([makeChar('a', '2026-01-01T00:00:00.000Z')])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      store.logout()
      ;(local.getAll as ReturnType<typeof vi.fn>).mockClear()
      ;(remote.getAll as ReturnType<typeof vi.fn>).mockClear()
      await store.getAll()
      expect(local.getAll).toHaveBeenCalled()
      expect(remote.getAll).not.toHaveBeenCalled()
    })

    it('writes to local only after logout', async () => {
      const local = makeStore([])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      store.logout()
      ;(remote.save as ReturnType<typeof vi.fn>).mockClear()
      await store.save(makeChar('p', '2026-01-01T00:00:00.000Z'))
      expect(remote.save).not.toHaveBeenCalled()
    })
  })

  describe('syncToRemote()', () => {
    it('pushes locally-ahead characters to remote when authenticated', async () => {
      const localChar = makeChar('q', '2026-01-10T00:00:00.000Z')
      const remoteChar = makeChar('q', '2026-01-01T00:00:00.000Z')
      const local = makeStore([localChar])
      const remote = makeStore([remoteChar])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      ;(remote.save as ReturnType<typeof vi.fn>).mockClear()
      await store.syncToRemote()
      expect(remote.save).toHaveBeenCalledWith(localChar)
    })

    it('does nothing when not authenticated', async () => {
      const local = makeStore([makeChar('r', '2026-01-01T00:00:00.000Z')])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.syncToRemote()
      expect(remote.save).not.toHaveBeenCalled()
      expect(remote.getAll).not.toHaveBeenCalled()
    })
  })
})
```

- [ ] **Step 2: Run tests and confirm they fail**

```bash
npx vitest run src/lib/character/store/syncedStore.test.ts
```

Expected: FAIL — `createSyncedCharacterStore` is not exported.

- [ ] **Step 3: Implement `createSyncedCharacterStore`**

Add the following imports at the top of `src/lib/character/store/syncedStore.ts`, alongside the existing imports:

```ts
import { createLocalStorageCharacterStore } from '@/lib/character/store/localStorageStore'
import { createRemoteCharacterStore } from '@/lib/character/store/remoteStore'
import type { SyncedCharacterStore } from '@/lib/character/store/types'
```

Then append the following function at the bottom of the file:

```ts
export function createSyncedCharacterStore(
  localStore: CharacterStore = createLocalStorageCharacterStore(),
  remoteStore: CharacterStore = createRemoteCharacterStore()
): SyncedCharacterStore {
  let isAuthenticated = false

  async function attemptRemote(fn: () => Promise<unknown>): Promise<void> {
    try {
      await fn()
    } catch {
      // Remote failures are swallowed silently. The local write already
      // succeeded, so data is safe. The next reconnect sync will retry.
    }
  }

  return {
    async getAll() {
      return isAuthenticated ? remoteStore.getAll() : localStore.getAll()
    },

    async list() {
      return isAuthenticated ? remoteStore.list() : localStore.list()
    },

    async get(id) {
      return isAuthenticated ? remoteStore.get(id) : localStore.get(id)
    },

    async create(input) {
      // Create locally first (generates id + timestamps), then push to remote.
      // Requires PUT /api/characters/:id to support upsert (create-if-not-exists).
      const character = await localStore.create(input)
      if (isAuthenticated) {
        await attemptRemote(() => remoteStore.save(character))
      }
      return character
    },

    async save(character) {
      // Local write is authoritative (touchCharacter runs here, setting updatedAt).
      // The touched version is then pushed to remote.
      const saved = await localStore.save(character)
      if (isAuthenticated) {
        await attemptRemote(() => remoteStore.save(saved))
      }
      return saved
    },

    async delete(id) {
      const result = await localStore.delete(id)
      if (isAuthenticated) {
        await attemptRemote(() => remoteStore.delete(id))
      }
      return result
    },

    async import(json) {
      const character = await localStore.import(json)
      if (isAuthenticated) {
        await attemptRemote(() => remoteStore.save(character))
      }
      return character
    },

    async login() {
      isAuthenticated = true
      await sync(localStore, remoteStore)
    },

    logout() {
      isAuthenticated = false
    },

    async syncToRemote() {
      if (!isAuthenticated) return
      await sync(localStore, remoteStore)
    },
  }
}
```

- [ ] **Step 4: Run all sync tests**

```bash
npx vitest run src/lib/character/store/syncedStore.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/character/store/syncedStore.ts src/lib/character/store/syncedStore.test.ts
git commit -m "feat(store): implement SyncedCharacterStore with tests"
```

---

## Task 4: Wire up `store/index.ts`

**Files:**
- Modify: `src/lib/character/store/index.ts`

Replace the store-swapping pattern with a single exported `SyncedCharacterStore` instance.

- [ ] **Step 1: Check for existing usages of `setCharacterStore`**

```bash
grep -r 'setCharacterStore' src/
```

Note any files that import it — they will need to be updated in this task or in Task 5.

- [ ] **Step 2: Replace the file content**

Replace the entire content of `src/lib/character/store/index.ts` with:

```ts
import { createSyncedCharacterStore } from '@/lib/character/store/syncedStore'
import type { CharacterStore, SyncedCharacterStore } from '@/lib/character/store/types'

/**
 * The single character store instance for the lifetime of the app.
 * Always a SyncedCharacterStore — behaves as a local-only store when
 * unauthenticated, and dual-writes to remote when authenticated.
 */
export const characterStore: SyncedCharacterStore = createSyncedCharacterStore()

/** Returns the active character store. Used by hooks and components. */
export function getCharacterStore(): CharacterStore {
  return characterStore
}
```

- [ ] **Step 3: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests pass. If any test fails because it imported `setCharacterStore`, update it to import `characterStore` directly and call `characterStore.login()` / `characterStore.logout()` as appropriate.

- [ ] **Step 4: Commit**

```bash
git add src/lib/character/store/index.ts
git commit -m "feat(store): replace store swapping with a single SyncedCharacterStore instance"
```

---

## Task 5: Update `AuthProvider`

**Files:**
- Modify: `src/lib/auth/context.tsx`

- [ ] **Step 1: Replace the store imports**

In `src/lib/auth/context.tsx`, remove:

```ts
import { setCharacterStore } from '@/lib/character/store'
import { createLocalStorageCharacterStore } from '@/lib/character/store/localStorageStore'
import { createRemoteCharacterStore } from '@/lib/character/store/remoteStore'
```

Add:

```ts
import { characterStore } from '@/lib/character/store'
```

- [ ] **Step 2: Replace `applyUser`**

Replace:

```ts
const applyUser = useCallback((nextUser: NetlifyUser | null) => {
  setUser(nextUser)
  setCharacterStore(
    nextUser
      ? createRemoteCharacterStore()
      : createLocalStorageCharacterStore()
  )
}, [])
```

With:

```ts
const applyUser = useCallback((nextUser: NetlifyUser | null) => {
  setUser(nextUser)
  if (nextUser) {
    characterStore.login().catch(error => {
      console.error('Login sync failed:', error)
    })
  } else {
    characterStore.logout()
  }
}, [])
```

- [ ] **Step 3: Remove the debug log**

Remove the following line from the component body:

```ts
console.log({ user, loading })
```

- [ ] **Step 4: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/context.tsx
git commit -m "feat(auth): call store.login/logout instead of swapping stores"
```

---

## Task 6: Implement `useNetworkStatus`

**Files:**
- Create: `src/hooks/useNetworkStatus.ts`

This hook listens to browser `online`/`offline` events, shows Ant Design message notifications, and calls `characterStore.syncToRemote()` when the connection is restored. Must be rendered inside an Ant Design `<App>` provider (which `AppProviders` already wraps around all content).

- [ ] **Step 1: Create the hook**

Create `src/hooks/useNetworkStatus.ts`:

```ts
import { App } from 'antd'
import { useEffect } from 'react'
import { characterStore } from '@/lib/character/store'

/**
 * Monitors network connectivity.
 * - Shows a notification when going offline or coming back online.
 * - Triggers a sync to remote on reconnect so locally-saved characters
 *   are pushed to the cloud.
 *
 * Must be mounted inside an Ant Design <App> provider.
 */
export function useNetworkStatus(): void {
  const { message } = App.useApp()

  useEffect(() => {
    function handleOffline() {
      message.info('Now offline — saving locally')
    }

    async function handleOnline() {
      message.info('Back online — syncing to cloud')
      try {
        await characterStore.syncToRemote()
      } catch (error) {
        console.error('Reconnect sync failed:', error)
      }
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [message])
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useNetworkStatus.ts
git commit -m "feat(hooks): add useNetworkStatus for offline notifications and reconnect sync"
```

---

## Task 7: Mount `useNetworkStatus` in `AppProviders`

**Files:**
- Modify: `src/components/AppProviders/AppProviders.tsx`

`useNetworkStatus` calls `App.useApp()`, which requires it to be rendered inside the Ant Design `<App>` component. The cleanest approach is a dedicated `NetworkStatusMonitor` component that renders nothing but calls the hook.

- [ ] **Step 1: Add `NetworkStatusMonitor` and mount it inside `<App>`**

Replace the full content of `src/components/AppProviders/AppProviders.tsx` with:

```ts
'use client'

import { App, ConfigProvider } from 'antd'
import localeEn from 'antd/locale/en_US'
import localeFr from 'antd/locale/fr_FR'
import type { ReactNode } from 'react'
import { NavigationBlockerProvider } from '@/components/AppProviders/NavigationBlockerContext'
import { ThemeProvider } from '@/components/AppProviders/ThemeProvider'
import { SettingsProvider } from '@/components/PageSettings/SettingsContext'
import { AuthProvider } from '@/lib/auth/context'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

function NetworkStatusMonitor() {
  useNetworkStatus()
  return null
}

export function AppProviders({
  children,
  locale,
}: {
  children: ReactNode
  locale: 'fr' | 'en'
}) {
  return (
    <ConfigProvider locale={locale === 'fr' ? localeFr : localeEn}>
      <SettingsProvider>
        <AuthProvider>
          <ThemeProvider>
            <NavigationBlockerProvider>
              <App>
                <NetworkStatusMonitor />
                {children}
              </App>
            </NavigationBlockerProvider>
          </ThemeProvider>
        </AuthProvider>
      </SettingsProvider>
    </ConfigProvider>
  )
}
```

- [ ] **Step 2: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppProviders/AppProviders.tsx
git commit -m "feat(app): mount NetworkStatusMonitor for offline/online notifications"
```

---

## Task 8: Verify in the browser

- [ ] **Step 1: Start the dev server**

```bash
netlify dev
```

- [ ] **Step 2: Verify fully local mode**

Without logging in, create and save a character. Confirm it appears in DevTools → Application → Local Storage under key `prome:characters:v1`. Confirm no network requests are made to `/api/characters`.

- [ ] **Step 3: Verify login sync**

Log in with Google. Open DevTools → Application → Local Storage. Confirm characters from the cloud now appear locally after login (if any existed in the DB). Check the Neon DB via the Netlify dashboard to confirm local characters were pushed up.

- [ ] **Step 4: Verify dual-write while online**

Save a character while logged in. Check both local storage and Neon DB to confirm the character was written to both.

- [ ] **Step 5: Verify offline fallback**

In DevTools → Network, set throttling to "Offline". Confirm the "Now offline — saving locally" notification appears. Save a character. Confirm the save succeeds without an error shown to the user. Check local storage for the updated character.

- [ ] **Step 6: Verify reconnect sync**

Set network throttling back to "No throttling". Confirm the "Back online — syncing to cloud" notification appears. Confirm the character saved while offline now appears in the Neon DB.

- [ ] **Step 7: Verify logout**

Log out. Confirm local storage still contains all characters. Confirm the app works in local-only mode (saves go to local storage, no remote requests).
