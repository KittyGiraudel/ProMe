# Character Sheet Simplification

**Date:** 2026-04-08

## Goal

Remove the multi-page mode (MPM) / single-page mode (SPM) duality from the character sheet. Commit permanently to a single scrollable page. Eliminate the `CharacterSheetShell` abstraction, all sub-routes, the tab nav, and the `singlePageMode` setting.

## What Gets Deleted

| Item | Location |
|---|---|
| `CharacterSheetShell` component | `src/components/CharacterSheetShell/` |
| Next.js layout wrapping the shell | `src/app/[locale]/characters/[id]/layout.tsx` |
| Sub-route: identity | `src/app/[locale]/characters/[id]/identity/` |
| Sub-route: map | `src/app/[locale]/characters/[id]/map/` |
| Sub-route: journal | `src/app/[locale]/characters/[id]/journal/` |
| Sub-route: inventory | `src/app/[locale]/characters/[id]/inventory/` |
| Sub-route: tools | `src/app/[locale]/characters/[id]/tools/` |
| Sub-route: actions | `src/app/[locale]/characters/[id]/actions/` |
| `CharacterSheetTabNav` component | `src/components/CharacterSheetTabNav/` |
| Route constants + tab ID type | `src/constants/characterSheetRoutes.ts` |
| `singlePageMode` setting | `src/lib/settings/types.ts`, `model.ts`, `storage.test.ts` |
| Settings UI checkbox | `src/components/PageSettings/Settings.tsx` |
| `activeTab` / `tabKeyFromPathname` | `src/hooks/useCharacterSheetForm.ts`, `useCharacterSheetDocumentTitle.ts` |
| MPM branching in `useCharacterLink` | `src/hooks/useCharacterLink.ts` |
| `Form preserve` prop | `src/components/CharacterSheetShell/CharacterSheetShell.tsx` (then gone) |
| `SettingsHint` conditioned on SPM | `src/components/CharacterSheetShell/CharacterSheetShell.tsx` (then gone) |

## What the Character Sheet Becomes

`/characters/[id]/page.tsx` is the only route. It renders inline what `CharacterSheetShell` provided (form setup, theme, layout, keyboard shortcuts, character loading) plus all the section cards that `CharacterAllPage` renders today.

The existing `/characters/[id]/page.tsx` (`CharacterAllPage`) already has the right card order — it just needs the shell logic folded in.

## Key Simplifications

### `useCharacterLink`
Remove all SPM/MPM branching. The function always returns:
- `basePath#section` when a `tabId` is provided (using the section's path as hash)
- `basePath` when no `tabId`
- `basePath#hash` when a custom hash is provided

The `singlePageMode` read from settings is removed entirely.

### `Form preserve`
The `preserve` prop on `<Form>` in `CharacterSheetShell` is removed. Since all cards are always mounted on the single page, form field values are never cleared by unmounting.

### `Form.useWatch({ preserve: true })` in `InheritanceCard`
This is part of the new-character flow (a separate form) — leave it untouched.

### Breadcrumbs
Simplified to two entries: Home → Characters → character name (no tab-level breadcrumb).

### `useCharacterSheetDocumentTitle`
Remove `tabKeyFromPathname` and any tab-suffix logic. The document title is just the character name.

## Out of Scope

- No changes to `InheritanceCard` or the new-character form.
- No changes to any card components themselves.
- No new navigation (no section jump nav — rely on scrolling).
