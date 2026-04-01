# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```sh
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Biome formatter (write)
npm run format:check # Biome formatter (check only)
npm run test         # Vitest (all tests)
npm run test:coverage
```

Run a single test file: `npx vitest run src/lib/character/model.test.ts`

## Architecture

**ProMe** is a companion app for a solo TTRPG. No backend, no auth — all data lives in `localStorage`.

### Routing

Uses Next.js App Router with `next-intl`. All pages are under `src/app/[locale]/`. Supported locales: `fr` (primary), `en`. Routing config lives in `src/i18n/routing.ts`.

### Data layer (`src/lib/`)

- **`character/`** — Core character domain. `types.ts` defines the `Character` and `CharacterInput` shapes. `model.ts` handles normalization, creation, and validation. `store/localStorageStore.ts` persists characters to localStorage (key `prome:characters`). `store/migrations.ts` handles schema migrations.
- **`settings/`** — App-wide settings. `storage.ts` reads/writes `prome:settings:v1` in localStorage. `model.ts` handles normalization.
- **`character/clock.ts`** — Game clock logic tied to the stamina stat.
- **`rng.ts`**, **`hex/`**, **`map/`**, **`inhabitant/`**, **`village/`** — Domain logic for generators and map.
- **`types.ts`** — Shared types: `BiomeId`, `Faction`, `Gender`, `Suit`, `Rank`, `PlayingCard`, etc.

### Path alias

`@/` maps to `src/`. Use it for all imports.

### Testing

Tests live alongside source files (`*.test.ts` / `*.test.tsx`). Coverage excludes `src/app/**` and `src/components/**` — only `src/lib/` and `src/hooks/` are covered. Environment is `node`.
