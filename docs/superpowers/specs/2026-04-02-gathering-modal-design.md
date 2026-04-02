# Gathering Modal — Design Spec

**Date:** 2026-04-02

## Overview

Add a "Voir la collecte" / "See gathering" button to `MapCard`, opening a modal that lists collectible items per biome (indexed by die roll 1–6). Each lootable entry has a small icon button to add it directly to the character's inventory.

## Schema

New file: `src/lib/gathering/schema.ts`

Defines a typed schema mapping each biome × roll to one of three entry types:

```ts
type GatheringEntry =
  | { type: 'collectible'; regex: RegExp }  // regex captures (quantity)(label) from the translated string
  | { type: 'choice' }                      // roll 6 joker — show text, no button
  | { type: 'none' }                        // non-lootable action — show text, no button

export const GATHERING_SCHEMA: Record<BiomeId, Record<'1'|'2'|'3'|'4'|'5'|'6', GatheringEntry> | null>
```

The regex is provided per entry (e.g. `/^(\d+)\s+(.+)$/`) and applied to the localised translation string at collect time. No secondary translation key needed.

## Components

New folder: `src/components/GatheringList/`

### `GatheringButton.tsx`
Mirrors `EncountersButton`. Receives `currentBiome: BiomeId | 'unexplored'`, manages `open` state, renders a `Button type='link'` and the `GatheringDialog`.

### `GatheringDialog.tsx`
Mirrors `EncountersDialog` (no footer). Tabs through all `BIOME_IDS`. `defaultActiveKey` is set to `currentBiome`, falling back to `BIOME_IDS[0]` when `'unexplored'`. Each tab renders `<GatheringList biome={biome} />`. When `GATHERING_SCHEMA[biome]` is `null`, the list renders an empty state instead.

### `GatheringList.tsx`
Renders a plain ordered list of exactly 6 items (no duplicate-collapse logic). For each roll `1–6`:
- Display the translated text from `common.gathering.<biome>.<roll>`
- Look up `GATHERING_SCHEMA[biome][roll]`
- Render a small icon button (Ant Design `<PlusOutlined />`) only when `type === 'collectible'`

## Collect Action

On collect:
1. Read the translated string via `t('common.gathering.<biome>.<roll>')`
2. Apply `entry.regex` → capture group 1 = quantity (parsed as int), group 2 = label
3. Append `{ id: randomId(), quantity, label }` to the inventory via `Form.useFormInstance().getFieldValue('inventory')` + `setFieldValue`

Item shape matches `InventoryItem`: `{ id: string, label: string, quantity: number }`.

## MapCard Change

Add `<GatheringButton key='gathering' currentBiome={currentBiome} />` to the `actions` array in `MapCard`, alongside the existing `EncountersButton`.

## Translations

Keys to add in both `messages/en.json` and `messages/fr.json`:

| Key | EN | FR |
|-----|----|----|
| `characters.map.gathering_button` | See gathering | Voir la collecte |
| `characters.map.gathering_dialog_title` | Gathering | Collecte |
| `common.gathering.<biome>.<1-6>` | *(content to be filled by user)* | *(content to be filled by user)* |

## Out of Scope

- Flooded plains (no gathering possible): set `GATHERING_SCHEMA.floodedPlains = null`. The empty state UI is a byproduct of the schema design, no extra work needed.
- No new CSS required.
