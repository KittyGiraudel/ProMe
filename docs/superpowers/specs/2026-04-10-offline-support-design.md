# Offline Support Design

**Date:** 2026-04-10
**Goal:** Prevent the browser's "no connection" error page. Once the app has loaded once, it must remain fully functional offline — no network required.

---

## Context

ProMe is a static Next.js app with no backend. All character and settings data lives in `localStorage`. The app already has a web manifest (`src/app/manifest.ts`) with `display: "standalone"` and PWA icons. The only missing piece is a service worker.

`next/font/google` downloads fonts at build time and self-hosts them, so there are no external runtime font dependencies.

---

## Library

**Serwist (`@serwist/next` + `serwist`)** — the actively-maintained, App Router-aware successor to next-pwa. It reads the Next.js build manifest at build time and auto-generates a precache manifest, so the cache list never goes stale across deploys.

---

## Architecture

Three touch points:

### 1. `next.config.ts`

Wrap the existing config with `withSerwist` as the outermost wrapper (outside `withNextIntl`):

```ts
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
})

export default withSerwist(withNextIntl(nextConfig))
```

### 2. `src/sw.ts`

The service worker entry point. Uses Serwist's `defaultCache` runtime strategies plus the auto-generated precache manifest:

```ts
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

### 3. `tsconfig.sw.json`

A separate TypeScript config for the SW compilation, targeting `WebWorker` lib (incompatible with `DOM`):

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2015", "WebWorker"],
    "noEmit": false
  },
  "include": ["src/sw.ts"]
}
```

The `@serwist/next` plugin uses this config automatically when compiling `src/sw.ts`.

---

## Caching Strategy

| Asset type | Strategy | Details |
|---|---|---|
| Next.js build artifacts (JS, CSS, fonts) | Precache | Hashed by build, never stale |
| Images (`/images/*`) | Cache-first | 30-day expiry via `defaultCache` |
| Navigation requests | Network-first, fallback to cache | Serwist `defaultCache` handles this |

---

## Behaviour Notes

- The SW is **only registered in production** (`NODE_ENV === 'production'`). `next dev` is unaffected.
- `skipWaiting: true` + `clientsClaim: true` means a new SW activates immediately on deploy, with no manual "click to update" prompt needed.
- SW registration is automatic — Serwist injects the registration script into the app.
- If SW registration fails silently (e.g. unsupported browser), the app behaves exactly as it does today.

---

## Verification

After a production build, verify in DevTools:

1. Application → Service Workers → confirm SW is registered and active
2. Application → Cache Storage → confirm precache entries exist
3. Network tab → check "Offline" → reload the page → app should load normally
