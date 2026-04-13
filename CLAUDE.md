# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

This is a Next.js project using next-intl for i18n, Ant Design for UI components, and deployed on Netlify. The project has TypeScript (primary), and CSS. Always use ESLint for linting and Biome for formatting (no semis, single quotes).

## Commands

```sh
npm run dev           # Start dev server at http://localhost:3000
npm run build         # Production build
npm run lint          # ESLint
npm run format        # Biome formatter (write)
npm run format:check  # Biome formatter (check only)
npm run test          # Vitest (all tests)
npm run test:coverage # Check test coverage
```

Run a single test file: `npx vitest run src/lib/character/model.test.ts`

## Architecture

**ProMe** is a companion app for a solo TTRPG. Data lives in `localStorage` by default, with optional sync to a Neon Postgres database when authenticated via Netlify Identity.

### Routing

Uses Next.js App Router with `next-intl`. All pages are under `src/app/[locale]/`. Supported locales: `fr` (primary), `en`. Routing config lives in `src/i18n/routing.ts`.

Key pages: `(home)/`, `characters/`, `characters/[id]/`, `generators/npc/`, `generators/village/`, `login/`, `faq/`, `settings/`.

API routes under `src/app/api/characters/` handle remote character sync (read, write, import).

### PWA

The app is a PWA using Serwist (`@serwist/next`). Service worker lives in `src/app/sw.ts`, manifest in `src/app/manifest.ts`.

### Data layer (`src/lib/`)

- **`character/`** — Core character domain. `types.ts` defines the `Character` and `CharacterInput` shapes. `model.ts` handles normalization, creation, and validation. `store/localStorageStore.ts` persists to localStorage (key `prome:characters`). `store/remoteStore.ts` persists to Neon via API routes. `store/syncedStore.ts` merges local and remote bidirectionally (most recent `updatedAt` wins). `store/migrations.ts` handles schema migrations.
- **`auth/`** — Netlify Identity integration. `context.tsx` provides `useAuth()` with `user`, `oauthLogin`, and `logout`. Auth state drives whether the synced store writes to remote.
- **`db/`** — Neon Postgres client (`client.ts` via `@netlify/neon`) and schema (`schema.ts`). One `characters` table: `id TEXT PK`, `user_id TEXT`, `data JSONB`.
- **`settings/`** — App-wide settings. `storage.ts` reads/writes `prome:settings:v1` in localStorage. `model.ts` handles normalization.
- **`clock/`** — Game clock logic tied to the stamina stat.
- **`random/`** — RNG utilities and random biome selection.
- **`map/`**, **`inhabitant/`**, **`village/`** — Domain logic for generators and map.
- **`journal/`** — Journal entry logic and auto-journal from map moves.
- **`gathering/`**, **`sounds/`**, **`codec/`**, **`localization/`**, **`markdown/`** — Supporting domain modules.
- **`types.ts`** — Shared types: `BiomeId`, `Faction`, `Gender`, `Suit`, `Rank`, `PlayingCard`, etc.

### Path alias

`@/` maps to `src/`. Use it for all imports.

### Testing

Tests live alongside source files (`*.test.ts` / `*.test.tsx`). Coverage excludes `src/app/**` and `src/components/**` — only `src/lib/` and `src/hooks/` are covered. Environment is `node`.

## Code Quality

When implementing new UI features, avoid creating duplicate components. Check for existing similar components first and extract shared logic into reusable utilities or components proactively.

## Ant Design / Forms

After making changes, always verify they work within the existing Form context (Ant Design). Be especially careful with Form.useWatch, form.setFieldValue, and components rendered outside Form providers (e.g., portals, modals).

## Debugging Guidelines

When debugging, don't guess at root causes — trace the actual execution path before proposing fixes. Avoid applying speculative fixes that address the wrong root cause.

## Pre-Commit Checklist

Before committing or considering a task done, verify all related navigation links and routes still work (especially character sheet links on home/list pages, and relative links from sub-routes).
