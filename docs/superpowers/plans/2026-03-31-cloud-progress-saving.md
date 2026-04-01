# Cloud Progress Saving for ProMe — Design Brainstorm

**Date:** 2026-03-31  
**Status:** Thought experiment / design reference

---

## Background

ProMe is currently a fully client-side application. All user data — characters, journal entries, hex maps, inventory, spellbooks, settings — is stored in `localStorage` under the key `prome:characters:v1`. The README explicitly describes this as a deliberate design choice: no accounts, no database, no server.

The tradeoff is that progress is tied to a single browser. Clearing the browser, switching devices, or using a private window means losing everything. The only safeguard is a manual JSON export/import flow that already exists in the app.

This document explores what it would look like to offer cloud-based saving as an option, without removing the existing anonymous local-storage path.

---

## Principles for any cloud solution

1. **Opt-in, not mandatory.** Unauthenticated users must continue to work exactly as today. Cloud saving is an enhancement, not a gate.
2. **Security by design.** User data should be inaccessible to anyone but the user. This must be enforced at the infrastructure level, not just the application level.
3. **Privacy-respecting.** The app is currently zero-knowledge. Any auth solution should collect as little personal information as possible.
4. **Migration path.** Users with existing localStorage data need a clear, guided import flow when they first log in.
5. **Graceful degradation.** If the cloud is unavailable (offline, service outage), the app should still be usable via local cache.

---

## What needs to be stored

| Data | Shape | Current key |
|---|---|---|
| Characters (incl. journal, map, inventory, spellbook) | Array of complex nested JSON objects | `prome:characters:v1` |
| App settings | Flat JSON object | `prome:settings:v1` |
| Character drafts (in-progress edits) | Transient, session-only — **not** worth syncing | `prome:characterDraft:v1:*` |

The character blob for an active playthrough can be substantial (journal entries, many map cells, etc.) but is still well within any reasonable cloud storage limit.

---

## A critical architectural constraint

The current `CharacterStore` interface (`/src/lib/character/store/types.ts`) is **fully synchronous**:

```ts
list(): Character[]
get(id: string): Character | null
save(character: Character): Character
create(input?: Partial<CharacterInput>): Character
delete(id: string): boolean
```

Any cloud backend is inherently async. Making the store cloud-aware requires converting these return types to `Promise<T>` and updating every call site in the app. This is not insurmountable, but it is a non-trivial cross-cutting change — not a drop-in swap.

One mitigation: a **write-through cache** pattern. The store writes to localStorage immediately (keeping the synchronous interface intact for UI responsiveness), then syncs to the cloud asynchronously in the background. Reads always try the cloud first on page load, falling back to localStorage if offline.

---

## Authentication options

### GitHub / Google OAuth (via a provider)

The most frictionless option for users. No password to remember, no email verification. The OAuth provider issues a JWT; the app uses that JWT to scope database access per user. This is the recommended auth approach regardless of which backend is chosen.

### Email + password

Traditional but adds complexity (password reset flows, email verification, account management). Worth supporting as a fallback but shouldn't be the primary path.

### Magic link (passwordless email)

A middle ground — user enters email, receives a one-time login link. Good UX, but requires the backend to send emails (adds a transactional email service to the stack).

### Anonymous token (no auth at all)

Generate a UUID on first use, store it in localStorage, and use it as a "secret" key to retrieve data from the cloud. No account required.

- **Pro:** Simplest possible UX; preserves anonymity.
- **Con:** The token is just a shared secret — anyone who knows it can overwrite the user's data. No recovery if the token is lost. Not a real authentication mechanism.
- **Verdict:** Fine as a quick proof-of-concept or interim solution, but not recommended for production.

---

## Storage / backend options

### Option A — Supabase (Auth + PostgreSQL)

Supabase provides authentication (OAuth, email, magic link), a PostgreSQL database, and a JavaScript client SDK that works directly from the browser.

**Data model:**
```sql
-- characters table
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
data        jsonb NOT NULL   -- the full Character JSON blob
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()

-- settings table
user_id     uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
data        jsonb NOT NULL
updated_at  timestamptz DEFAULT now()
```

Row Level Security (RLS) policies enforce at the database level that users can only read/write their own rows — even if the client SDK is called directly from the browser, a compromised session cannot access another user's data.

**Architecture:** No serverless functions needed for basic CRUD. The Supabase JS client handles auth and database calls directly. API routes would only be needed for more complex operations.

**Pros:**
- Single service handles both auth and storage
- PostgreSQL + JSONB is a natural fit for the existing character data shape
- RLS provides strong, database-enforced security
- Excellent Next.js integration and documentation
- Free tier: 500 MB file storage, 500 MB database, 2 GB bandwidth, 50,000 MAU

**Cons:**
- External dependency outside the Netlify ecosystem
- Free tier projects pause after 1 week of inactivity (problematic for an occasional-use hobby app — paid tier removes this)
- Requires the async store refactor

**Effort:** Medium-high

---

### Option B — Netlify Identity + Netlify Blobs

Netlify Identity (powered by GoTrue) provides OAuth and email/password auth. Netlify Blobs is a key-value object store native to Netlify.

**Data model:** One blob per user, keyed by user ID:
- `characters/{userId}` → full characters JSON export (reuses existing `exportAll()` format)
- `settings/{userId}` → settings JSON

**Architecture:** Netlify Blobs are not directly accessible from browsers — they require a Netlify Function as an intermediary. So every read/write goes: browser → Netlify Function → Blobs.

```
browser → POST /api/characters/save → Netlify Function → Netlify Blobs
browser → GET  /api/characters/load → Netlify Function → Netlify Blobs
```

The Netlify Function validates the JWT from Netlify Identity before touching the blob, ensuring only the authenticated user can access their data.

**Pros:**
- Entirely within the Netlify ecosystem — no external services
- Netlify Identity OAuth is straightforward to configure
- Blobs are simple for this use case (one big JSON blob per user, not relational data)

**Cons:**
- Netlify Functions add latency to every read/write
- Need to write and maintain the Functions layer
- Netlify Identity is less feature-rich than Supabase Auth
- Plan limits need verification — confirm whether Netlifriend includes Blobs and how many Function invocations are allowed
- Requires the async store refactor

**Effort:** Medium-high

---

### Option C — Firebase Auth + Firestore

Firebase Auth handles Google/GitHub OAuth; Firestore is a NoSQL document store. Both have browser SDKs and use Security Rules (similar to Supabase's RLS) to enforce per-user access at the database level.

**Data model:**
```
/users/{userId}/characters/{characterId}   → Character document
/users/{userId}/settings                   → Settings document
```

**Pros:**
- Very mature and battle-tested
- Client SDK + Security Rules means no serverless functions needed
- Generous free tier (Spark plan): 1 GB storage, 50K reads/day, 20K writes/day

**Cons:**
- Google dependency and heavier SDK bundle than Supabase
- Firestore's document model has a 1 MB per-document limit — fine for normal use but worth monitoring for users with very long journals
- Firebase pricing can surprise at scale
- Requires the async store refactor

**Effort:** Medium-high (similar to Supabase)

---

### Option D — Enhanced export (lightweight middle ground)

Rather than full auth + cloud database, enhance the existing JSON export/import:

- Add a "Save to cloud" button that uploads the existing `exportAll()` JSON to a simple storage endpoint (Netlify Blobs, S3, etc.) under a unique anonymous token
- Add a "Load from cloud" button that retrieves it using the same token
- The token is stored in localStorage and can be copied to another browser

**Pros:**
- No auth flow — much simpler to build
- Leverages existing `exportAll()` / `importAll()` logic (already implemented)
- Store interface stays synchronous
- Preserves full anonymity

**Cons:**
- The token is just a shared secret — no real security model
- No recovery if the token is lost
- Not multi-device in real-time — user must manually push/pull
- Not a proper account; no way to manage/revoke access

**Verdict:** Good as a quick win or stepping stone. Could ship this first while building out full auth later.

**Effort:** Low

---

## Sync strategy considerations

Regardless of backend, *when* to sync is a key UX decision:

| Strategy | Description | Trade-off |
|---|---|---|
| **On explicit save** | Cloud write happens when user clicks "Save" | Matches current mental model; adds cloud latency to save action |
| **Write-through cache** | Write to localStorage immediately, sync to cloud async in background | Best UX — no perceived latency; adds complexity |
| **On load + on save** | Read from cloud on page load, write on save | Good multi-device support; page loads may feel slower |
| **Periodic background sync** | Sync every N minutes if dirty | Resilient to network issues; can lose up to N minutes on crash |

The **write-through cache** approach is likely the best fit: it preserves the snappy feel of the current app (localStorage writes are instant) while ensuring cloud consistency in the background.

---

## Conflict resolution

If a user edits the same character on two devices without syncing, whose version wins?

Every character already has an `updatedAt` timestamp — this enables a **last-write-wins** strategy without extra infrastructure. It's simple and good enough for a solo TTRPG app where concurrent multi-device editing is unlikely.

For users who want safety, the existing JSON export creates a manual backup they can restore from.

---

## Migration path for existing users

On first login, the app should detect any characters in localStorage and prompt:

> "We found 2 characters saved locally. Would you like to import them to your account?"

This reuses the existing `importAll()` function. After a successful import, optionally offer to clear localStorage (or keep it as a local cache).

---

## Recommended path

**Near-term:** Ship Option D (anonymous token + cloud blob) using the existing export format. Fast to build, zero auth complexity, and immediately solves the "switch devices" problem for users who are okay with a token-based approach.

**Medium-term:** Add proper auth with Option A (Supabase). GitHub OAuth covers the majority of the likely user base (tabletop RPG players tend to be tech-adjacent). Supabase's free tier is generous and the developer experience is excellent. Migrate Option D token-users by letting them "claim" their anonymous data when they create an account.

---

## Open questions

1. **What does the Netlifriend plan actually include?** Specifically: are Netlify Blobs available, and what are the Function invocation limits? This determines whether Option B is viable without additional cost.
2. **What OAuth providers should be supported?** GitHub and Google cover most users; GitLab and email/password can be added later.
3. **Should cloud save replace localStorage or supplement it?** (Write-through cache vs. cloud-primary)
4. **Is there an appetite for the async store refactor?** The synchronous `CharacterStore` interface is the biggest technical obstacle for Options A–C.
