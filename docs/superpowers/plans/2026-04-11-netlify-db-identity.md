# Netlify DB + Identity Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate ProMe character storage from browser localStorage to Netlify DB (PostgreSQL), protected by Netlify Identity authentication.

**Architecture:** All character data moves to PostgreSQL (Netlify DB / Neon) behind Next.js Route Handler API endpoints. Netlify Identity handles user auth; clients pass a JWT Bearer token with every API request, which the server verifies using `jose` + the site's JWKS endpoint. A new `RemoteCharacterStore` implementation talks to the API routes. A module-level `setCharacterStore()` setter (called by `AuthProvider`) switches between remote and local stores without requiring hooks to change their call sites. The `CharacterStore` interface, store consumers, and hooks are already async — that refactor is complete.

**Tech Stack:** `@netlify/identity` (client auth), `@netlify/neon` (PostgreSQL/Neon connection), `jose` (server-side JWT verification), Next.js Route Handlers, React Context API.

---

## Pricing

### Netlify Identity

**Free, with no user cap.** All Netlify plans — including the free tier — get unlimited active users and unlimited invite-only users. The only things gated behind paid plans are custom outgoing email domains, custom email templates, and the identity audit log. Auth costs nothing regardless of how many people sign up.

### Netlify DB (Neon)

Netlify DB is Neon under the hood. The **free tier** gets:

| Resource       | Free limit                     |
| -------------- | ------------------------------ |
| Storage        | 0.5 GB per project             |
| Compute        | 100 compute-unit-hours / month |
| Network egress | 5 GB / month                   |
| Branches       | 10 per project                 |

For ProMe's use case this is very comfortable. Each character is a JSONB blob — even with rich journal entries, a character is unlikely to exceed 50–100 KB. At 0.5 GB that's roughly 5,000–10,000 characters stored before the limit becomes relevant. Compute hours are similarly unlikely to be a bottleneck for a personal companion app.

If the ceiling is ever hit, Neon's **Launch plan** is pure pay-as-you-go ($0.106/CU-hour, $0.35/GB-month) with no monthly minimum — you only pay for what you use.

**Bottom line: the full stack (auth + DB) costs $0/month for a personal or small-user-base app.**

---

## Local Development

`npm run dev` will **not work** after this migration — it won't have `DATABASE_URL` or `NETLIFY_IDENTITY_URL`. The Netlify CLI is required.

### One-time setup

```sh
npm install -g netlify-cli
netlify login    # opens browser to authenticate with your Netlify account
netlify link     # links this local directory to your Netlify project
```

### Daily dev

```sh
netlify dev      # starts the app at http://localhost:8888
```

`netlify dev` automatically injects `DATABASE_URL` (pointing at your Netlify DB instance) and `NETLIFY_IDENTITY_URL` (pointing at `https://yoursite.netlify.app/.netlify/identity`), and proxies `/.netlify/identity/*` requests to the live Identity service.

### Prerequisite order

You need a live Netlify site and provisioned services **before** local dev works:

1. Push the branch and let Netlify auto-deploy
2. In the dashboard: **Project configuration → Identity → Enable**
3. In the dashboard: **Extensions → Neon database → Add database**
4. `netlify link` the local repo
5. `netlify dev` — everything works locally from here

### Avoiding production data pollution

By default, `netlify dev` connects to the **production** Neon database. To use a separate local database, create a Neon branch in the Neon console and override in `.env.local`. You'll also need `NETLIFY_IDENTITY_URL` here since it's not auto-injected:

```sh
DATABASE_URL=postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
NETLIFY_IDENTITY_URL=https://<your-site>.netlify.app/.netlify/identity
```

Netlify CLI reads `.env.local` and it takes precedence. The fallback in `server.ts` (`URL` env var) may not resolve correctly during local dev, so the explicit variable is safer.

### Update the dev script

Add a warning to `package.json` so no one accidentally runs the broken command:

```json
"dev": "echo 'Use: netlify dev (npm run dev will not have DATABASE_URL or NETLIFY_IDENTITY_URL)' && exit 1"
```

---

## PWA Considerations

ProMe has a service worker (`src/app/sw.ts`) built with Serwist. The migration introduces several friction points.

### The service worker already excludes `/api/*` — keep it that way

All three `StaleWhileRevalidate` strategies in `sw.ts` already filter `!pathname.startsWith('/api/')`. The new `/api/characters/*` routes will fall through to the network. Do not add API routes to any cache strategy — stale character data is worse than a loading state.

### The `/login` route is precached automatically

Serwist builds the precache manifest from Next.js's page output. The new `/login` page will be included automatically. Because `skipWaiting: true` and `clientsClaim: true` are both set, an installed PWA will activate the new service worker immediately on the next refresh — users won't get stuck on an old cached version that predates the login route.

### Offline mode breaks — a decision is required

This is the most consequential PWA change. Currently the app works fully offline because everything is in localStorage. After the migration:

- The character list will show a loading spinner forever when offline
- The character sheet will fail to load

There are three options, in ascending order of complexity:

**Option A — Accept it (simplest).** Handle `fetch` errors in `RemoteCharacterStore` and surface a "you're offline" message instead of crashing. The app becomes online-only. This is the minimum viable response. Given that ProMe is a companion app used at a gaming table where internet access may be unreliable, this may be unacceptable.

**Option B — IndexedDB read-through cache (recommended if offline matters).** Keep a local copy of the user's characters in IndexedDB (localStorage is not accessible from service workers). On load: immediately render from IndexedDB cache (instant, offline-capable), then fetch fresh data from the API in the background and update if the response differs. This is a background-read pattern and is a meaningful additional task not currently in the plan.

**Option C — Background sync for writes (most complete).** If reads can serve a stale cache, writes made while offline (e.g., updating HP during play) must be queued and replayed when connectivity returns. The [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) handles this. Significantly more complex — treat as future scope.

**Minimum action item for this plan:** `RemoteCharacterStore` must catch network failures and throw a typed `NetworkError` so the UI can distinguish "offline" from "server error". Task 8 should include this. Add to the `apiFetch` helper:

```typescript
async function apiFetch(path: string, token: string, options: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(path, { ... })
  } catch (err) {
    throw new NetworkError('You appear to be offline.')
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}
```

Then `useQuery`'s error state will surface it correctly in the UI.

### `@netlify/identity` requires network on first load

The SDK initializes by fetching the JWKS from the Identity endpoint. If the user opens the PWA while offline, `getUser()` will fail or time out. The `AuthProvider` already handles this gracefully (the `finally` block sets `loading: false`), so the user will land in the unauthenticated state and see the login page — which they cannot use offline either. This is acceptable under Option A. Under Options B/C you would additionally want to cache the last-known user identity in IndexedDB so the app can resume a session without hitting the network.

### PWA action item summary

| Item                                                     | Required?                                              | In current plan?                  |
| -------------------------------------------------------- | ------------------------------------------------------ | --------------------------------- |
| Exclude `/api/*` from SW cache                           | Already done                                           | Yes                               |
| Precache `/login` route                                  | Automatic                                              | Yes                               |
| Home / FAQ / generators remain public (no auth required) | By design — `RequireAuth` is scoped to character pages | Yes (Task 10)                     |
| Typed `NetworkError` in `RemoteCharacterStore`           | Strongly recommended                                   | Add to Task 8                     |
| Graceful offline UI (error boundary or message)          | Strongly recommended                                   | Not yet — not in plan — follow-up |
| IndexedDB read-through cache for offline reads           | Recommended if offline matters                         | No — follow-up task               |
| Background sync for offline writes                       | Optional                                               | No — future scope                 |

---

## Scope Note

Auth (Netlify Identity) and database (Netlify DB) are coupled: the database rows are keyed by the Identity `user_id`. They cannot be delivered independently without leaving the app broken. Execute this plan as one unit.

---

## File Map

### New Files

| File                                     | Purpose                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `src/lib/auth/types.ts`                  | `NetlifyUser` type (matches `@netlify/identity` user shape)             |
| `src/lib/auth/context.tsx`               | `AuthProvider` + `useAuth` hook                                         |
| `src/lib/auth/server.ts`                 | `getAuthenticatedUser(req)` — verifies JWT in API routes                |
| `src/lib/db/client.ts`                   | Neon `sql` tagged-template connection                                   |
| `src/lib/db/schema.ts`                   | `initDatabase()` — creates the `characters` table                       |
| `src/lib/character/store/remoteStore.ts` | `createRemoteCharacterStore(token)`                                     |
| `src/app/api/characters/route.ts`        | `GET` (list), `POST` (create)                                           |
| `src/app/api/characters/[id]/route.ts`   | `GET`, `PUT`, `DELETE`                                                  |
| `src/app/api/characters/import/route.ts` | `POST` (single-character import — upserts without dead-freeze or touch) |
| `src/lib/auth/RequireAuth.tsx`           | Inline sign-in prompt for protected pages (no redirect)                 |
| `src/app/[locale]/login/page.tsx`        | Standalone login / sign-up page (for direct navigation)                 |

### Modified Files

| File                                        | What changes                                               |
| ------------------------------------------- | ---------------------------------------------------------- |
| `src/app/[locale]/layout.tsx`               | Wrap children with `<AuthProvider>` only — no global guard |
| `src/app/[locale]/characters/page.tsx`      | Wrap with `<RequireAuth>`                                  |
| `src/app/[locale]/characters/new/page.tsx`  | Wrap with `<RequireAuth>`                                  |
| `src/app/[locale]/characters/[id]/page.tsx` | Wrap with `<RequireAuth>`                                  |
| `netlify.toml`                              | Enable Netlify Identity                                    |

---

## Tasks

### Task 1: Install dependencies and enable Netlify Identity

> **Next.js on Netlify context:** Route Handlers are deployed as Netlify Functions via the OpenNext adapter. Netlify's automatic bearer-token injection (the `context.clientContext.user` mechanism) only applies to native Netlify Functions — it does not apply to Next.js Route Handlers. JWT verification must therefore be done manually in each Route Handler, which is what `jose` provides.

**Files:**

- No file changes — dashboard + package installs only

- [ ] **Step 1: Install packages**

Run: `npm install @netlify/identity @netlify/neon jose`

Expected: Packages installed, no peer dependency errors.

- [ ] **Step 2: Enable Identity in Netlify dashboard**

`[identity]` is **not** a valid `netlify.toml` section — Identity can only be enabled via the dashboard:

1. Go to the Netlify project dashboard
2. Navigate to **Project configuration → Identity**
3. Click **Enable Identity**
4. Under **Registration**, choose **Invite only** (Google OAuth handles account creation — no need for open registration)
5. Enable **Google** as an external OAuth provider (not GitHub)

- [ ] **Step 3: Set the `NETLIFY_IDENTITY_URL` environment variable**

Netlify does NOT automatically inject `NETLIFY_IDENTITY_URL` into Route Handlers. Set it manually in **Site configuration → Environment variables**:

```
NETLIFY_IDENTITY_URL = https://<your-site>.netlify.app/.netlify/identity
```

For local dev, add it to `.env.local`:

```sh
NETLIFY_IDENTITY_URL=https://<your-site>.netlify.app/.netlify/identity
```

- [ ] **Step 4: Set up Netlify DB**

Manual step:

1. In the Netlify dashboard, go to **Extensions → Neon database → Install**
2. Run `npx netlify db init` locally (requires Node 20.12.2+)
3. This sets the `DATABASE_URL` environment variable automatically in Netlify; add it to `.env.local` for local dev

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @netlify/identity, @netlify/neon, jose"
```

---

### Task 2: Create auth types and server-side JWT verifier

**Files:**

- Create: `src/lib/auth/types.ts`
- Create: `src/lib/auth/server.ts`

- [ ] **Step 1: Create src/lib/auth/types.ts**

```typescript
/** Shape returned by @netlify/identity's getUser() / login() / signup(). */
export type NetlifyUser = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    [key: string]: unknown
  }
  token: {
    access_token: string
    expires_at: number
    refresh_token: string
    token_type: 'bearer'
  }
}
```

- [ ] **Step 2: Create src/lib/auth/server.ts**

> **Why not `getUser()` from `@netlify/identity`?** Netlify's automatic JWT injection (`context.clientContext.user`) only applies to native Netlify Functions. Next.js Route Handlers are wrapped by OpenNext and do not receive that context. We must verify the JWT ourselves from the `Authorization` header.
>
> **Why not `NETLIFY_IDENTITY_URL` alone?** Netlify does not automatically inject this variable — it must be set manually (Task 1, Step 3). We derive a fallback from `URL` (which IS auto-injected) so the app fails clearly if neither is set.

```typescript
import { createRemoteJWKSet, jwtVerify } from 'jose'

// NETLIFY_IDENTITY_URL must be set manually in Netlify environment variables (see Task 1).
// Falls back to constructing from URL, which Netlify does inject automatically.
const identityUrl =
  process.env.NETLIFY_IDENTITY_URL ??
  (process.env.URL ? `${process.env.URL}/.netlify/identity` : null)

if (!identityUrl) {
  throw new Error(
    'Cannot determine Netlify Identity URL. Set NETLIFY_IDENTITY_URL in environment variables.'
  )
}

const JWKS = createRemoteJWKSet(new URL(`${identityUrl}/.well-known/jwks.json`))

export type AuthenticatedUser = {
  id: string
  email: string
}

/**
 * Extracts and verifies the Bearer JWT from an incoming Request.
 * Returns the authenticated user or null if missing / invalid.
 */
export async function getAuthenticatedUser(
  req: Request
): Promise<AuthenticatedUser | null> {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null

  const token = auth.slice('Bearer '.length)
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: identityUrl,
    })
    const sub = payload.sub
    const email = payload.email as string | undefined
    if (!sub || !email) return null
    return { id: sub, email }
  } catch {
    return null
  }
}

/**
 * Returns a 401 JSON response. Use in API routes when auth fails.
 */
export function unauthorizedResponse(): Response {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth/types.ts src/lib/auth/server.ts
git commit -m "feat: add Netlify Identity auth types and server-side JWT verifier"
```

---

### Task 3: Create AuthProvider and useAuth hook

**Files:**

- Create: `src/lib/auth/context.tsx`

- [ ] **Step 1: Create src/lib/auth/context.tsx**

OAuth-only — no email/password. `oauthLogin` calls `@netlify/identity`'s `oauthLogin`, which redirects to the provider. The redirect back is handled by `handleAuthCallback` on the next load.

```typescript
'use client'

import {
  getUser,
  handleAuthCallback,
  oauthLogin as netlifyOAuthLogin,
  logout,
} from '@netlify/identity'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { createLocalStorageCharacterStore } from '@/lib/character/store/localStorageStore'
import { createRemoteCharacterStore } from '@/lib/character/store/remoteStore'
import { setCharacterStore } from '@/lib/character/store'
import type { NetlifyUser } from '@/lib/auth/types'

type AuthContextValue = {
  user: NetlifyUser | null
  loading: boolean
  oauthLogin: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NetlifyUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Update the global character store whenever auth state changes.
  const applyUser = useCallback((nextUser: NetlifyUser | null) => {
    setUser(nextUser)
    if (nextUser) {
      setCharacterStore(
        createRemoteCharacterStore(nextUser.token.access_token)
      )
    } else {
      setCharacterStore(createLocalStorageCharacterStore())
    }
  }, [])

  useEffect(() => {
    // Handle OAuth redirect callbacks first.
    handleAuthCallback().then(result => {
      if (result) {
        applyUser(result.user as NetlifyUser)
        setLoading(false)
        return
      }
      // Otherwise, check for an existing session.
      getUser()
        .then(currentUser => applyUser(currentUser as NetlifyUser | null))
        .finally(() => setLoading(false))
    })
  }, [applyUser])

  const handleOAuthLogin = useCallback(() => {
    // Redirects to Google — no await. handleAuthCallback handles the return.
    netlifyOAuthLogin('google')
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    applyUser(null)
  }, [applyUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        oauthLogin: handleOAuthLogin,
        logout: handleLogout,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth/context.tsx
git commit -m "feat: add AuthProvider and useAuth hook"
```

---

### Task 4: Create the Netlify DB client and schema

**Files:**

- Create: `src/lib/db/client.ts`
- Create: `src/lib/db/schema.ts`

- [ ] **Step 1: Create src/lib/db/client.ts**

```typescript
import { neon } from '@netlify/neon'

// DATABASE_URL is set automatically by Netlify when Netlify DB is provisioned.
// Locally: `netlify dev` sets it via the CLI.
export const sql = neon()
```

- [ ] **Step 2: Create src/lib/db/schema.ts**

```typescript
import { sql } from '@/lib/db/client'

/**
 * Creates the characters table if it doesn't already exist.
 * Call this once at application startup (e.g., in the DB init API route).
 */
export async function initDatabase(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS characters (
      id         TEXT        PRIMARY KEY,
      user_id    TEXT        NOT NULL,
      data       JSONB       NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS characters_user_id_idx ON characters (user_id)
  `
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/db/client.ts src/lib/db/schema.ts
git commit -m "feat: add Neon DB client and characters table schema"
```

---

### Task 5: Create API route — DB init

**Files:**

- Create: `src/app/api/db/init/route.ts`

This route initializes the schema. Call it once manually after provisioning Netlify DB.

- [ ] **Step 1: Create the route**

```typescript
import { initDatabase } from '@/lib/db/schema'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth/server'

export async function POST(req: Request): Promise<Response> {
  const user = await getAuthenticatedUser(req)
  if (!user) return unauthorizedResponse()

  await initDatabase()
  return Response.json({ ok: true })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/db/init/route.ts
git commit -m "feat: add DB init API route"
```

---

### Task 6: Create API routes — character CRUD

**Files:**

- Create: `src/app/api/characters/route.ts`
- Create: `src/app/api/characters/[id]/route.ts`

The character's full JSON is stored in the `data` JSONB column. The `id`, `created_at`, and `updated_at` columns mirror the values inside `data` for indexing. All queries filter by `user_id` so users only see their own characters.

- [ ] **Step 1: Create src/app/api/characters/route.ts**

```typescript
import { normalizeCharacter } from '@/lib/character/model'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth/server'
import { sql } from '@/lib/db/client'
import type { Character } from '@/lib/character/types'

// GET /api/characters — list all characters for the authenticated user
export async function GET(req: Request): Promise<Response> {
  const user = await getAuthenticatedUser(req)
  if (!user) return unauthorizedResponse()

  const rows = await sql`
    SELECT data FROM characters
    WHERE user_id = ${user.id}
    ORDER BY updated_at DESC
  `

  const characters = rows
    .map(row => normalizeCharacter(row.data as unknown))
    .filter((c): c is Character => c !== null)

  return Response.json(characters)
}

// POST /api/characters — create a new character
export async function POST(req: Request): Promise<Response> {
  const user = await getAuthenticatedUser(req)
  if (!user) return unauthorizedResponse()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const character = normalizeCharacter(body)
  if (!character) {
    return Response.json(
      { error: 'Invalid character payload' },
      { status: 422 }
    )
  }

  await sql`
    INSERT INTO characters (id, user_id, data, created_at, updated_at)
    VALUES (
      ${character.id},
      ${user.id},
      ${JSON.stringify(character)},
      ${character.createdAt},
      ${character.updatedAt}
    )
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
  `

  return Response.json(character, { status: 201 })
}
```

- [ ] **Step 2: Create src/app/api/characters/[id]/route.ts**

```typescript
import {
  normalizeCharacter,
  touchCharacter,
  validateCharacterForPersistence,
} from '@/lib/character/model'
import { canPersistCharacterUpdate } from '@/lib/character/lifeStatus'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth/server'
import { sql } from '@/lib/db/client'
import type { Character } from '@/lib/character/types'

type Params = { params: Promise<{ id: string }> }

// GET /api/characters/[id]
export async function GET(req: Request, { params }: Params): Promise<Response> {
  const user = await getAuthenticatedUser(req)
  if (!user) return unauthorizedResponse()

  const { id } = await params
  const rows = await sql`
    SELECT data FROM characters
    WHERE id = ${id} AND user_id = ${user.id}
    LIMIT 1
  `

  if (rows.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json(rows[0].data)
}

// PUT /api/characters/[id] — save / update a character
export async function PUT(req: Request, { params }: Params): Promise<Response> {
  const user = await getAuthenticatedUser(req)
  if (!user) return unauthorizedResponse()

  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const normalized = normalizeCharacter(body)
  if (!normalized || normalized.id !== id) {
    return Response.json(
      { error: 'Invalid character payload' },
      { status: 422 }
    )
  }

  // Fetch the existing character to enforce dead-freeze rules.
  const existingRows = await sql`
    SELECT data FROM characters
    WHERE id = ${id} AND user_id = ${user.id}
    LIMIT 1
  `
  const existing =
    existingRows.length > 0
      ? normalizeCharacter(existingRows[0].data as unknown)
      : null

  if (!canPersistCharacterUpdate(existing, normalized)) {
    return Response.json({ error: 'DEAD_CHARACTER' }, { status: 409 })
  }

  const validation = validateCharacterForPersistence(normalized)
  if (!validation.ok) {
    return Response.json(
      { error: 'VALIDATION_ERROR', details: validation.errors },
      { status: 422 }
    )
  }

  const touched = touchCharacter(normalized)

  await sql`
    INSERT INTO characters (id, user_id, data, created_at, updated_at)
    VALUES (
      ${touched.id},
      ${user.id},
      ${JSON.stringify(touched)},
      ${touched.createdAt},
      ${touched.updatedAt}
    )
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
  `

  return Response.json(touched)
}

// DELETE /api/characters/[id]
export async function DELETE(
  req: Request,
  { params }: Params
): Promise<Response> {
  const user = await getAuthenticatedUser(req)
  if (!user) return unauthorizedResponse()

  const { id } = await params
  const result = await sql`
    DELETE FROM characters
    WHERE id = ${id} AND user_id = ${user.id}
  `

  const deleted = (result as unknown as { rowCount?: number }).rowCount ?? 0
  if (deleted === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return new Response(null, { status: 204 })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/characters/route.ts src/app/api/characters/[id]/route.ts
git commit -m "feat: add character CRUD API routes (Netlify DB)"
```

---

### Task 7: Create API route — single-character import

Import differs from `PUT /api/characters/[id]` in two ways: it accepts the character as a JSON **string** (the file content the user uploaded), and it skips the dead-freeze check and `touchCharacter` — a character imported from a backup should land exactly as exported.

**Files:**

- Create: `src/app/api/characters/import/route.ts`

- [ ] **Step 1: Create the route**

```typescript
import {
  normalizeCharacter,
  validateCharacterForPersistence,
} from '@/lib/character/model'
import { parseCharacter } from '@/lib/character/store/migrations'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth/server'
import { sql } from '@/lib/db/client'

// POST /api/characters/import
// Body: { json: string }  — the raw JSON string of a single exported character
export async function POST(req: Request): Promise<Response> {
  const user = await getAuthenticatedUser(req)
  if (!user) return unauthorizedResponse()

  let body: { json: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const character = parseCharacter(body.json)
  if (!character) {
    return Response.json({ error: 'INVALID_PAYLOAD' }, { status: 422 })
  }

  const validation = validateCharacterForPersistence(character)
  if (!validation.ok) {
    return Response.json(
      { error: 'VALIDATION_ERROR', details: validation.errors },
      { status: 422 }
    )
  }

  await sql`
    INSERT INTO characters (id, user_id, data, created_at, updated_at)
    VALUES (
      ${character.id},
      ${user.id},
      ${JSON.stringify(character)},
      ${character.createdAt},
      ${character.updatedAt}
    )
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
  `

  return Response.json(character)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/characters/import/route.ts
git commit -m "feat: add single-character import API route"
```

---

### Task 8: Create RemoteCharacterStore

**Files:**

- Create: `src/lib/character/store/remoteStore.ts`

The remote store calls the API routes created in Tasks 5–7. It passes the Netlify Identity JWT in every request. `getAll` / `list` / `get` / `create` / `save` / `delete` map directly to the CRUD routes. `import` posts the raw character JSON string to the dedicated import route, which upserts without dead-freeze or touch.

- [ ] **Step 1: Create src/lib/character/store/remoteStore.ts**

```typescript
import type { CharacterStore } from '@/lib/character/store/types'
import { SaveError } from '@/lib/character/store/localStorageStore'
import type { Character } from '@/lib/character/types'

async function apiFetch(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })
}

export function createRemoteCharacterStore(token: string): CharacterStore {
  return {
    async getAll() {
      const res = await apiFetch('/api/characters', token)
      if (!res.ok) throw new Error(`Failed to list characters: ${res.status}`)
      return res.json() as Promise<Character[]>
    },

    async list() {
      const characters = await this.getAll()
      return characters.toSorted((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      )
    },

    async get(id) {
      const res = await apiFetch(`/api/characters/${id}`, token)
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`Failed to get character: ${res.status}`)
      return res.json() as Promise<Character>
    },

    async create(input) {
      // Build a partial character locally then POST it — the server normalizes it.
      const { createCharacter } = await import('@/lib/character/model')
      const character = createCharacter(input)
      const res = await apiFetch('/api/characters', token, {
        method: 'POST',
        body: JSON.stringify(character),
      })
      if (!res.ok) throw new Error(`Failed to create character: ${res.status}`)
      return res.json() as Promise<Character>
    },

    async save(character) {
      const res = await apiFetch(`/api/characters/${character.id}`, token, {
        method: 'PUT',
        body: JSON.stringify(character),
      })
      if (res.status === 409) throw new SaveError('DEAD_CHARACTER')
      if (!res.ok) throw new Error(`Failed to save character: ${res.status}`)
      return res.json() as Promise<Character>
    },

    async delete(id) {
      const res = await apiFetch(`/api/characters/${id}`, token, {
        method: 'DELETE',
      })
      if (res.status === 404) return false
      if (!res.ok) throw new Error(`Failed to delete character: ${res.status}`)
      return true
    },

    async import(json) {
      // json is the raw file content of a single exported character.
      const res = await apiFetch('/api/characters/import', token, {
        method: 'POST',
        body: JSON.stringify({ json }),
      })
      if (res.status === 422) throw new Error('INVALID_PAYLOAD')
      if (!res.ok) throw new Error(`Failed to import character: ${res.status}`)
      return res.json() as Promise<Character>
    },
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/character/store/remoteStore.ts
git commit -m "feat: add RemoteCharacterStore (fetches from API routes)"
```

---

### Task 9: Create the standalone login page

The primary sign-in UI is the `RequireAuth` component rendered inline on character pages (Task 10). This standalone `/login` page serves as a direct-navigation fallback — for users who bookmark it, arrive via a confirmation email link, or prefer to sign in before browsing.

**Files:**

- Create: `src/app/[locale]/login/page.tsx`

- [ ] **Step 1: Create the login page**

OAuth-only — no email/password form. `oauthLogin` redirects to the provider; `handleAuthCallback` in `AuthProvider` handles the return.

```typescript
'use client'

import { Button, Card, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth/context'

export default function LoginPage() {
  const t = useTranslations()
  const { oauthLogin, loading } = useAuth()

  if (loading) return null

  return (
    <Space
      orientation='vertical'
      align='center'
      style={{ minHeight: '100dvh', justifyContent: 'center', width: '100%' }}>
      <Card style={{ width: 360 }}>
        <Space orientation='vertical' style={{ width: '100%' }}>
          <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
            ProMe
          </Typography.Title>
          <Typography.Text
            type='secondary'
            style={{ display: 'block', textAlign: 'center', marginBottom: '1em' }}>
            {t('auth.sign_in_prompt')}
          </Typography.Text>
          <Button block onClick={() => oauthLogin()}>
            {t('auth.sign_in_with_google')}
          </Button>
        </Space>
      </Card>
    </Space>
  )
}
```

> **Translation keys to add** — add to `messages/fr.json` and `messages/en.json` under an `"auth"` section:
>
> ```json
> "auth": {
>   "sign_in_prompt": "Vous devez être authentifié·e pour accéder à cette fonctionnalité. Connectez-vous avec votre compte Google pour continuer.",
>   "sign_in_with_google": "Continuer avec Google"
> }
> ```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/login/page.tsx
git commit -m "feat: add OAuth-only login page"
```

---

### Task 10: Wire AuthProvider into the layout and add just-in-time auth on character pages

The home page, FAQ, generators, and login page are all publicly accessible without authentication. The characters section (`/characters`, `/characters/new`, `/characters/[id]`) requires a signed-in user, but instead of a global redirect guard, auth is asked for **just in time** — the character page itself renders an inline sign-in prompt rather than bouncing the user to a separate route.

**Files:**

- Modify: `src/app/[locale]/layout.tsx`
- Create: `src/lib/auth/RequireAuth.tsx`
- Modify: `src/app/[locale]/characters/page.tsx`
- Modify: `src/app/[locale]/characters/new/page.tsx`
- Modify: `src/app/[locale]/characters/[id]/page.tsx`

- [ ] **Step 1: Wrap layout with AuthProvider only — no global guard**

Replace `src/app/[locale]/layout.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { AppConfig, hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { AuthProvider } from '@/lib/auth/context'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: {
      default: t('metadata.title'),
      template: `%s — ${t('metadata.tab_brand')}`,
    },
    description: t('metadata.description'),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <NextIntlClientProvider>
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  )
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}
```

- [ ] **Step 2: Create src/lib/auth/RequireAuth.tsx**

This component renders an inline sign-in prompt when the user is not authenticated. The URL does not change — after OAuth completes, `AuthProvider` updates `user` and the page re-renders to show `children`.

```typescript
'use client'

import { Button, Card, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth/context'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, oauthLogin } = useAuth()
  const t = useTranslations()

  // While auth state is resolving, render nothing to avoid a flash.
  if (loading) return null

  // Authenticated — render the protected content.
  if (user) return <>{children}</>

  // Not authenticated — render an inline OAuth sign-in prompt.
  return (
    <Space
      orientation='vertical'
      align='center'
      style={{ minHeight: '60dvh', justifyContent: 'center', width: '100%' }}>
      <Card style={{ width: 360 }}>
        <Space orientation='vertical' style={{ width: '100%' }}>
          <Typography.Title level={4} style={{ textAlign: 'center', marginBottom: 0 }}>
            {t('auth.sign_in_required')}
          </Typography.Title>
          <Typography.Text
            type='secondary'
            style={{ display: 'block', textAlign: 'center', marginBottom: '1em' }}>
            {t('auth.sign_in_prompt')}
          </Typography.Text>
          <Button block onClick={() => oauthLogin()}>
            {t('auth.sign_in_with_google')}
          </Button>
        </Space>
      </Card>
    </Space>
  )
}
```

> **Translation keys to add** to `messages/fr.json` and `messages/en.json` under the `"auth"` section (these are shared with the standalone login page):
>
> ```json
> "auth": {
>   "sign_in_required": "Connexion requise",
>   "sign_in_prompt": "Vous devez être authentifié·e pour accéder à cette fonctionnalité. Connectez-vous avec votre compte Google pour continuer.",
>   "sign_in_with_google": "Continuer avec Google"
> }
> ```

- [ ] **Step 3: Wrap character pages with RequireAuth**

Each of the three character pages is a thin server component. Add `RequireAuth` around the rendered client component.

`src/app/[locale]/characters/page.tsx`:

```typescript
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterLibrary } from '@/components/PageCharacterLibrary/CharacterLibrary'
import { RequireAuth } from '@/lib/auth/RequireAuth'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  return { title: t('characters_list.title') }
}

export default function CharactersPage() {
  return (
    <RequireAuth>
      <CharacterLibrary />
    </RequireAuth>
  )
}
```

`src/app/[locale]/characters/new/page.tsx`:

```typescript
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterCreate } from '@/components/PageCharacterCreate/CharacterCreate'
import { RequireAuth } from '@/lib/auth/RequireAuth'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  return { title: t('new_character.title') }
}

export default function CharacterCreatePage() {
  return (
    <RequireAuth>
      <CharacterCreate />
    </RequireAuth>
  )
}
```

`src/app/[locale]/characters/[id]/page.tsx`:

```typescript
import type { Metadata } from 'next'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterSheet } from '@/components/CharacterSheet/CharacterSheet'
import { RequireAuth } from '@/lib/auth/RequireAuth'

type Props = { params: Promise<{ id: string; locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  return { title: t('characters.title') }
}

export default async function CharacterIdPage({ params }: Props) {
  const { id } = await params
  return (
    <RequireAuth>
      <CharacterSheet characterId={id} />
    </RequireAuth>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/layout.tsx src/lib/auth/RequireAuth.tsx src/app/[locale]/characters/page.tsx src/app/[locale]/characters/new/page.tsx src/app/[locale]/characters/[id]/page.tsx
git commit -m "feat: add RequireAuth for just-in-time auth on character pages; home/FAQ remain public"
```

---

### Task 11: Final TypeScript check and full test run

- [ ] **Step 1: TypeScript**

Run: `npx tsc --noEmit`

Expected: 0 errors. Fix any remaining errors before proceeding.

- [ ] **Step 2: Tests**

Run: `npm run test`

Expected: All tests PASS.

- [ ] **Step 3: Lint**

Run: `npm run lint`

Expected: 0 errors.

- [ ] **Step 4: Smoke test locally**

Run: `netlify dev` (not `npm run dev` — Netlify CLI is needed to inject `DATABASE_URL` and `NETLIFY_IDENTITY_URL`).

1. Open `http://localhost:8888` — home page loads without auth
2. Navigate to `/characters` — should show the inline OAuth sign-in prompt
3. Click "Continuer avec Google" — redirects to the provider
4. Complete OAuth — redirects back, character list appears in place
5. Create a character — verify it's saved to the DB
6. Refresh the page — verify the character is still there
7. Log out — character page shows the sign-in prompt again
8. Log back in via OAuth — character list should be intact

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Netlify DB + Identity integration"
```

---

## Post-deployment checklist

After deploying to Netlify:

1. **Enable Identity**: Project configuration → Identity → Enable
2. **Provision Netlify DB**: Extensions → Neon database → Add database
3. **Run DB init**: `curl -X POST https://your-site.netlify.app/api/db/init -H "Authorization: Bearer <your-token>"`
4. **Claim the database** in the Neon console within 7 days to prevent deletion
5. **Test the full auth flow** in production

---

## Self-Review

### Spec coverage

| Requirement                                                    | Task                                     |
| -------------------------------------------------------------- | ---------------------------------------- |
| Netlify Identity auth (login/signup/logout)                    | Tasks 6, 7, 8, 14, 15                    |
| Netlify DB character storage                                   | Tasks 9, 10, 11, 12                      |
| JWT verification on API routes                                 | Task 7                                   |
| CharacterStore interface compatible with both local and remote | Tasks 1–3, 13                            |
| Just-in-time auth on character pages; home/FAQ public          | Task 10                                  |
| Settings remain in localStorage                                | Settings untouched — this is intentional |

### Potential issues

1. **Token expiry**: The `@netlify/identity` SDK manages token refresh transparently via `getUser()`. However, the token stored in `AuthContext` may expire during a long session. To fix: the `AuthProvider` should call `getUser()` before each API request or watch for 401 responses and refresh. This is a known limitation — a follow-up issue.

2. **`ProtectorJournalRef` and hooks in lists**: The component is created inside a mapping function in `journalMarkdownEmbellishmentRules`. This is fine — each `ProtectorJournalRef` is a proper React component with its own hook call. React handles this correctly.

3. **`netlify dev` required for local development**: `npm run dev` will not have `DATABASE_URL` or `NETLIFY_IDENTITY_URL`. Engineers must use `netlify dev` locally.

4. **Import of `createCharacter` in remoteStore.ts**: Uses a dynamic import (`await import(...)`) to avoid circular dependency. If the module graph changes, consider moving `createCharacter` to a separate import.
