# Offline Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Serwist-powered service worker so the app loads and works fully offline after the first visit.

**Architecture:** Serwist integrates into the Next.js build pipeline via a config plugin. At build time it reads the `.next` build manifest and produces a compiled service worker at `public/sw.js` that precaches all static assets. At runtime the SW intercepts navigation and asset requests, serving from cache when offline.

**Tech Stack:** `@serwist/next`, `serwist`, Next.js 16 App Router

**Spec:** `docs/superpowers/specs/2026-04-10-offline-support-design.md`

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add `@serwist/next` and `serwist` deps |
| `next.config.ts` | Modify | Wrap config with `withSerwist` |
| `src/sw.ts` | Create | Service worker entry point |
| `tsconfig.sw.json` | Create | TypeScript config for WebWorker context |
| `tsconfig.json` | Modify | Exclude `src/sw.ts` from main DOM compilation |
| `.gitignore` | Modify | Ignore generated `public/sw.js` and `public/sw.js.map` |

---

### Task 1: Install Serwist

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the packages**

```bash
npm install @serwist/next serwist
```

- [ ] **Step 2: Verify the install succeeded**

```bash
node -e "require('@serwist/next'); require('serwist'); console.log('ok')"
```

Expected output: `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install serwist for offline support"
```

---

### Task 2: Add TypeScript config for the service worker

**Files:**
- Create: `tsconfig.sw.json`
- Modify: `tsconfig.json`

The service worker runs in a `WorkerGlobalScope`, not a browser DOM context. Compiling `src/sw.ts` with the main tsconfig (which uses `"lib": ["dom", "dom.iterable", "esnext"]`) causes type conflicts. We need a separate tsconfig for the SW and to exclude it from the main one.

- [ ] **Step 1: Create `tsconfig.sw.json`**

Create the file at the project root with these contents:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["ES2015", "WebWorker"],
    "noEmit": false,
    "module": "ES2015",
    "moduleResolution": "node"
  },
  "include": ["src/sw.ts"]
}
```

- [ ] **Step 2: Exclude `src/sw.ts` from the main `tsconfig.json`**

In `tsconfig.json`, update the `"exclude"` array:

```json
"exclude": ["node_modules", "src/sw.ts"]
```

- [ ] **Step 3: Verify main TypeScript compilation is unaffected**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json tsconfig.sw.json
git commit -m "feat: add tsconfig.sw.json for service worker compilation"
```

---

### Task 3: Create the service worker entry point

**Files:**
- Create: `src/sw.ts`

- [ ] **Step 1: Create `src/sw.ts`**

```typescript
import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
})

serwist.addEventListeners()
```

- [ ] **Step 2: Verify the SW file type-checks against `tsconfig.sw.json`**

```bash
npx tsc -p tsconfig.sw.json --noEmit
```

Expected: no errors. (If you see errors about missing types, ensure `serwist` is installed from Task 1.)

- [ ] **Step 3: Commit**

```bash
git add src/sw.ts
git commit -m "feat: add service worker entry point"
```

---

### Task 4: Wire Serwist into the Next.js config

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update `next.config.ts`**

Replace the entire file with:

```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
})

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()
export default withSerwist(withNextIntl(nextConfig))
```

- [ ] **Step 2: Verify the dev server still starts**

```bash
npm run dev
```

Expected: server starts on http://localhost:3000 with no errors. No SW is registered in dev — that's intentional. Stop the server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: wrap Next.js config with Serwist"
```

---

### Task 5: Ignore generated service worker files

**Files:**
- Modify: `.gitignore`

`public/sw.js` and `public/sw.js.map` are generated at build time — they should not be committed.

- [ ] **Step 1: Add generated files to `.gitignore`**

Add these two lines to `.gitignore` under the `# production` section:

```
# service worker (generated by Serwist at build time)
/public/sw.js
/public/sw.js.map
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore generated service worker files"
```

---

### Task 6: Verify offline support in a production build

**Files:** none — verification only.

- [ ] **Step 1: Build the app**

```bash
npm run build
```

Expected: build succeeds with no errors. Serwist will print something like:
```
[serwist] Precaching N entries…
```

Also verify the file was generated:

```bash
ls -lh public/sw.js
```

Expected: file exists and is non-empty.

- [ ] **Step 2: Start the production server**

```bash
npm start
```

The app is now running at http://localhost:3000.

- [ ] **Step 3: Verify in browser DevTools**

Open http://localhost:3000 in Chrome/Edge, then:

1. Open DevTools → Application → Service Workers
   - Confirm a SW is listed as **activated and running**
2. Application → Cache Storage
   - Confirm precache entries exist (JS chunks, CSS, images)
3. Network tab → check **Offline** checkbox → reload the page
   - App should load normally with no "No internet" error

Stop the server with Ctrl+C once verified.

- [ ] **Step 4: Commit if everything looks good**

No new files to commit at this stage (sw.js is gitignored). The implementation is complete.
