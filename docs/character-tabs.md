# Character sheet tabs

This document describes the tabbed layout of the character sheet under `/characters/[id]`.

## Scope

- Each tab has its **own URL path** under the character id (nested `page.tsx` routes): **identity** at `/characters/{id}/identity` (canonical), with a **308 redirect** from bare `/characters/{id}` via [`middleware.ts`](../src/middleware.ts) (excluding `/characters/new`). Other tabs: `/characters/{id}/map`, `journal`, `inventory`, `tools`.
- The sheet keeps **one** shared Ant Design `Form` in [`CharacterSheetShell`](../src/app/characters/[id]/CharacterSheetShell.tsx) (layout client). Tab content is rendered as **route `children`** and unmounts when you leave the tab; the form uses **`preserve`** so field values stay in memory until save.
- Unsaved edits persist when switching tabs. **In-sheet tab navigations** (same character id, only the tab segment changes) do not trigger the blocking unsaved modal on browser back/forward; leaving the sheet or changing query still does.
- Tab sections remain dedicated components under `src/app/characters/[id]/tabs/`.

## Tab structure

The shell renders five tabs (custom nav + `next/link`, not Ant Design `Tabs`):

1. **Identity** — `identity` (bare `/characters/{id}` redirects here)
2. **Map** — `map`
3. **Inventory** — `inventory`
4. **Journal** — `journal`
5. **Tools** — `tools`

Path helpers live in [`characterSheetRoutes.ts`](../src/app/characters/[id]/characterSheetRoutes.ts). Unknown tab paths → Next.js **404** (no matching route).

Do **not** leave an empty `[[...slug]]` folder under `[id]` after removing its `page.tsx`: Turbopack can still treat it as routing surface and **shadow** real folders like `journal`, producing 404s for `/characters/{id}/journal`. Remove the directory entirely.

## Persistence and navigation behavior

- Map cell links in the journal use a **relative** `./map` URL plus the hash (e.g. `#E13`) so they resolve under the current character id.
- Save/export stay in the sheet header.

## Implementation notes

- Dead-protector readonly behavior is unchanged.
- Active tab and document title follow `usePathname()` and `CHARACTER_SHEET_TAB_KEYS` path segments.
- Inventory/spellbook/journal list handlers stay in tab section components; they share the same form state via Ant Design `Form`.
