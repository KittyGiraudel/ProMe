# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

This is a Next.js project using next-intl for i18n, Ant Design for UI components, and deployed on Netlify. The project has TypeScript (primary), Rust, and CSS. Always use Biome for formatting (no semis, single quotes).

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
- **`rng.ts/`**, **`map/`**, **`inhabitant/`**, **`village/`** — Domain logic for generators and map.
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
