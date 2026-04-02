# Gathering Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Voir la collecte / See gathering" button to MapCard that opens a biome-tabbed modal listing 6 collectible items per biome, each with an optional "collect" button that adds the item to the character's inventory.

**Architecture:** Mirror the `EncountersList` folder pattern with three new components (`GatheringButton`, `GatheringDialog`, `GatheringList`) under `src/components/GatheringList/`. A TypeScript schema file at `src/lib/gathering/schema.ts` defines per-biome/per-roll metadata (collectible, choice, none). Because Ant Design modals render in a portal outside the Form tree, inventory writes go through `CharacterContext` rather than `Form.useFormInstance()`.

**Tech Stack:** Next.js App Router, next-intl, Ant Design (Modal, Tabs, Button), TypeScript.

---

## File Map

| Path | Action | Purpose |
|------|--------|---------|
| `src/lib/gathering/parseGatheringItem.ts` | Create | Parse "2 potatoes" → `{ quantity: 2, label: 'Potatoes' }` |
| `src/lib/gathering/parseGatheringItem.test.ts` | Create | Unit tests for parser |
| `src/lib/gathering/schema.ts` | Create | `GatheringEntry` types + `GATHERING_SCHEMA` data |
| `src/components/PageCharacterSheet/CharacterContext.tsx` | Modify | Add `setCharacterValue` to context |
| `src/components/GatheringList/GatheringList.tsx` | Create | 6-item list with per-entry collect buttons |
| `src/components/GatheringList/GatheringDialog.tsx` | Create | Biome-tabbed modal |
| `src/components/GatheringList/GatheringButton.tsx` | Create | Button + open state, wires dialog |
| `src/components/PageCharacterSheet/MapCard.tsx` | Modify | Add `GatheringButton` to card actions |
| `messages/en.json` | Modify | UI strings + gathering content (EN) |
| `messages/fr.json` | Modify | UI strings + gathering content (FR) |

---

## Task 1: `parseGatheringItem` utility

**Files:**
- Create: `src/lib/gathering/parseGatheringItem.ts`
- Create: `src/lib/gathering/parseGatheringItem.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/gathering/parseGatheringItem.test.ts
import { describe, expect, it } from 'vitest'
import { parseGatheringItem } from './parseGatheringItem'

describe('parseGatheringItem', () => {
  it('extracts quantity and label from a matching string', () => {
    expect(parseGatheringItem('2 potatoes', /^(\d+)\s+(.+)$/)).toEqual({
      quantity: 2,
      label: 'Potatoes',
    })
  })

  it('capitalizes the first character of the label', () => {
    expect(parseGatheringItem('1 apple', /^(\d+)\s+(.+)$/)).toEqual({
      quantity: 1,
      label: 'Apple',
    })
  })

  it('handles multi-word labels', () => {
    expect(parseGatheringItem('3 wild mushrooms', /^(\d+)\s+(.+)$/)).toEqual({
      quantity: 3,
      label: 'Wild mushrooms',
    })
  })

  it('falls back to quantity 1 and full text (capitalized) when no match', () => {
    expect(parseGatheringItem('some herb', /^(\d+)\s+(.+)$/)).toEqual({
      quantity: 1,
      label: 'Some herb',
    })
  })
})
```

- [ ] **Step 2: Run the tests — confirm they fail**

```bash
npx vitest run src/lib/gathering/parseGatheringItem.test.ts
```

Expected: FAIL — `Cannot find module './parseGatheringItem'`

- [ ] **Step 3: Implement `parseGatheringItem`**

```ts
// src/lib/gathering/parseGatheringItem.ts
export function parseGatheringItem(
  text: string,
  regex: RegExp
): { quantity: number; label: string } {
  const match = text.match(regex)
  if (!match) {
    return {
      quantity: 1,
      label: text.charAt(0).toUpperCase() + text.slice(1),
    }
  }
  return {
    quantity: parseInt(match[1], 10),
    label: match[2].charAt(0).toUpperCase() + match[2].slice(1),
  }
}
```

- [ ] **Step 4: Run the tests — confirm they pass**

```bash
npx vitest run src/lib/gathering/parseGatheringItem.test.ts
```

Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/gathering/parseGatheringItem.ts src/lib/gathering/parseGatheringItem.test.ts
git commit -m "feat: add parseGatheringItem utility"
```

---

## Task 2: Schema types + stub

**Files:**
- Create: `src/lib/gathering/schema.ts`

- [ ] **Step 1: Create the schema file with types and an empty stub**

```ts
// src/lib/gathering/schema.ts
import type { BiomeId } from '@/lib/types'

export type GatheringEntry =
  | { type: 'collectible'; regex: RegExp }
  | { type: 'choice' }
  | { type: 'none' }

type BiomeGathering = Record<'1' | '2' | '3' | '4' | '5' | '6', GatheringEntry>

export const GATHERING_SCHEMA: Record<BiomeId, BiomeGathering | null> = {
  floodedPlains: null,
  shadowForest: {
    '1': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '2': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '3': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '4': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '5': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '6': { type: 'choice' },
  },
  mushroomJungle: {
    '1': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '2': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '3': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '4': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '5': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '6': { type: 'choice' },
  },
  fieldSea: {
    '1': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '2': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '3': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '4': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '5': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '6': { type: 'choice' },
  },
  silentDesert: {
    '1': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '2': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '3': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '4': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '5': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '6': { type: 'choice' },
  },
  giganticGardens: {
    '1': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '2': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '3': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '4': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '5': { type: 'collectible', regex: /^(\d+)\s+(.+)$/ },
    '6': { type: 'choice' },
  },
}
```

> **Note:** The stub above assumes `type: 'collectible'` for rolls 1–5 and `type: 'choice'` for roll 6 in every biome. Update each entry after adding translations in Task 3: change to `type: 'none'` for non-lootable entries (e.g. "discover a ruin"), adjust the regex if the item string has a non-standard format (e.g. `/^(\d+)\s+(\w+)$/` for single-word items), and set `type: 'choice'` for any joker entry.

- [ ] **Step 2: Commit**

```bash
git add src/lib/gathering/schema.ts
git commit -m "feat: add GATHERING_SCHEMA types and stub"
```

---

## Task 3: Add translations and finalize schema data

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/fr.json`
- Modify: `src/lib/gathering/schema.ts` (update entries to match translation content)

- [ ] **Step 1: Add EN gathering UI strings**

In `messages/en.json`, inside the `characters.map` object, add after `"encounters_dialog_title"`:

```json
"gathering_button": "See gathering",
"gathering_dialog_title": "Gathering",
"gathering_empty": "No gathering available in this biome.",
```

- [ ] **Step 2: Add FR gathering UI strings**

In `messages/fr.json`, inside the `characters.map` object, add after `"encounters_dialog_title"`:

```json
"gathering_button": "Voir la collecte",
"gathering_dialog_title": "Collecte",
"gathering_empty": "Pas de collecte disponible dans ce biome.",
```

- [ ] **Step 3: Add EN gathering content**

In `messages/en.json`, inside the `common` object, add a `"gathering"` key alongside `"encounters"`. Fill in each value from the rulebook. The keys must match each `BiomeId` (excluding `floodedPlains`):

```json
"gathering": {
  "shadowForest": {
    "1": "<fill from rulebook>",
    "2": "<fill from rulebook>",
    "3": "<fill from rulebook>",
    "4": "<fill from rulebook>",
    "5": "<fill from rulebook>",
    "6": "<fill from rulebook>"
  },
  "mushroomJungle": {
    "1": "<fill from rulebook>",
    "2": "<fill from rulebook>",
    "3": "<fill from rulebook>",
    "4": "<fill from rulebook>",
    "5": "<fill from rulebook>",
    "6": "<fill from rulebook>"
  },
  "fieldSea": {
    "1": "<fill from rulebook>",
    "2": "<fill from rulebook>",
    "3": "<fill from rulebook>",
    "4": "<fill from rulebook>",
    "5": "<fill from rulebook>",
    "6": "<fill from rulebook>"
  },
  "silentDesert": {
    "1": "<fill from rulebook>",
    "2": "<fill from rulebook>",
    "3": "<fill from rulebook>",
    "4": "<fill from rulebook>",
    "5": "<fill from rulebook>",
    "6": "<fill from rulebook>"
  },
  "giganticGardens": {
    "1": "<fill from rulebook>",
    "2": "<fill from rulebook>",
    "3": "<fill from rulebook>",
    "4": "<fill from rulebook>",
    "5": "<fill from rulebook>",
    "6": "<fill from rulebook>"
  }
}
```

- [ ] **Step 4: Add FR gathering content**

Same structure as Step 3, in `messages/fr.json`, with French text from the rulebook.

- [ ] **Step 5: Update schema entries to match translation content**

For each entry in `src/lib/gathering/schema.ts`, update the `type` and `regex` based on what the translation says:

- Entry is a lootable item like "2 pommes de terre" → `{ type: 'collectible', regex: /^(\d+)\s+(.+)$/ }`
- Entry is "pick any item from the list" (roll 6 joker) → `{ type: 'choice' }`
- Entry describes a non-lootable action (discover ruins, find a building, etc.) → `{ type: 'none' }`

Adjust the regex capture groups if needed. The regex must produce group 1 = quantity (integer) and group 2 = item name string.

- [ ] **Step 6: Commit**

```bash
git add messages/en.json messages/fr.json src/lib/gathering/schema.ts
git commit -m "feat: add gathering translations and schema data"
```

---

## Task 4: Expose `setCharacterValue` in `CharacterContext`

**Files:**
- Modify: `src/components/PageCharacterSheet/CharacterContext.tsx`

Context reason: Ant Design modals render in a portal outside the React Form tree. `Form.useFormInstance()` does not work in portals. `CharacterContext` already holds the form reference and exposes `getCharacterValue` — `setCharacterValue` is the symmetric write counterpart.

- [ ] **Step 1: Add `setCharacterValue` to the context type**

In `CharacterContext.tsx`, find the `CharacterContextValue` type and add the new field:

```ts
type CharacterContextValue = {
  getCharacterValue: <T = unknown>(
    path: string | (string | number)[]
  ) => T | undefined
  setCharacterValue: (
    path: string | (string | number)[],
    value: unknown
  ) => void
  getCellData: (ref: CellRef | string) => CharacterCellData | null
  onKill: () => void
  onExport: () => void
  onRevive: () => void
  onDelete: () => void
  isDead: boolean
}
```

- [ ] **Step 2: Implement `setCharacterValue` in `CharacterProvider`**

Inside `CharacterProvider`, after the existing `getCharacterValue` callback, add:

```ts
const setCharacterValue = useCallback(
  (path: string | (string | number)[], value: unknown) => {
    form.setFieldValue(path, value)
  },
  [form]
)
```

- [ ] **Step 3: Add `setCharacterValue` to the memoized context value**

Update the `useMemo` call for `value`:

```ts
const value = useMemo<CharacterContextValue>(
  () => ({
    getCharacterValue,
    setCharacterValue,
    getCellData,
    onKill,
    onExport,
    onRevive,
    onDelete,
    isDead,
  }),
  [
    getCharacterValue,
    setCharacterValue,
    getCellData,
    onKill,
    onExport,
    onRevive,
    onDelete,
    isDead,
  ]
)
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: no TypeScript errors in `CharacterContext.tsx`

- [ ] **Step 5: Commit**

```bash
git add src/components/PageCharacterSheet/CharacterContext.tsx
git commit -m "feat: expose setCharacterValue in CharacterContext"
```

---

## Task 5: `GatheringList` component

**Files:**
- Create: `src/components/GatheringList/GatheringList.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/GatheringList/GatheringList.tsx
'use client'

import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Button, Empty } from 'antd'
import { useTranslations } from 'next-intl'
import { useCharacterContext } from '@/components/PageCharacterSheet/CharacterContext'
import { randomId } from '@/lib/character/model'
import type { InventoryItem } from '@/lib/character/types'
import { GATHERING_SCHEMA } from '@/lib/gathering/schema'
import { parseGatheringItem } from '@/lib/gathering/parseGatheringItem'
import type { BiomeId } from '@/lib/types'

const ROLLS = ['1', '2', '3', '4', '5', '6'] as const

export function GatheringList({ biome }: { biome: BiomeId }) {
  const t = useTranslations()
  const { getCharacterValue, setCharacterValue } = useCharacterContext()
  const schema = GATHERING_SCHEMA[biome]

  if (!schema) {
    return <Empty description={t('characters.map.gathering_empty')} />
  }

  function handleCollect(roll: (typeof ROLLS)[number]) {
    const entry = schema![roll]
    if (entry.type !== 'collectible') return
    const text = t(`common.gathering.${biome}.${roll}`)
    const { quantity, label } = parseGatheringItem(text, entry.regex)
    const current = getCharacterValue<InventoryItem[]>('inventory') ?? []
    setCharacterValue('inventory', [
      ...current,
      { id: randomId(), quantity, label, note: '' },
    ])
  }

  return (
    <ol>
      {ROLLS.map(roll => {
        const entry = schema[roll]
        return (
          <li key={roll}>
            {t(`common.gathering.${biome}.${roll}`)}
            {entry.type === 'collectible' && (
              <Button
                type='text'
                size='small'
                icon={<PlusOutlined />}
                htmlType='button'
                onClick={() => handleCollect(roll)}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: no TypeScript errors in the new file.

- [ ] **Step 3: Commit**

```bash
git add src/components/GatheringList/GatheringList.tsx
git commit -m "feat: add GatheringList component"
```

---

## Task 6: `GatheringDialog`, `GatheringButton`, and `MapCard` wiring

**Files:**
- Create: `src/components/GatheringList/GatheringDialog.tsx`
- Create: `src/components/GatheringList/GatheringButton.tsx`
- Modify: `src/components/PageCharacterSheet/MapCard.tsx`

- [ ] **Step 1: Create `GatheringDialog`**

```tsx
// src/components/GatheringList/GatheringDialog.tsx
'use client'

import { Modal, Tabs } from 'antd'
import { useTranslations } from 'next-intl'
import { BIOME_IDS } from '@/lib/constants/misc'
import type { BiomeId } from '@/lib/types'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'
import { GatheringList } from './GatheringList'

type Props = {
  open: boolean
  onClose: () => void
  currentBiome: BiomeId | 'unexplored'
}

export function GatheringDialog({ open, onClose, currentBiome }: Props) {
  const t = useTranslations()
  const defaultActiveKey =
    currentBiome === 'unexplored' ? BIOME_IDS[0] : currentBiome

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('characters.map.gathering_dialog_title')}
      footer={null}
      width='min(900px, 96vw)'
      destroyOnHidden>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        items={BIOME_IDS.map(biome => ({
          key: biome,
          label: (
            <>
              <BiomeBubble biome={biome} /> {t(`common.biomes.${biome}`)}
            </>
          ),
          children: <GatheringList biome={biome} />,
        }))}
      />
    </Modal>
  )
}
```

- [ ] **Step 2: Create `GatheringButton`**

```tsx
// src/components/GatheringList/GatheringButton.tsx
'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/Button/Button'
import type { BiomeId } from '@/lib/types'
import { GatheringDialog } from './GatheringDialog'

export function GatheringButton({
  currentBiome,
}: {
  currentBiome: BiomeId | 'unexplored'
}) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type='link' htmlType='button' onClick={() => setOpen(true)}>
        {t('characters.map.gathering_button')}
      </Button>
      <GatheringDialog
        open={open}
        onClose={() => setOpen(false)}
        currentBiome={currentBiome}
      />
    </>
  )
}
```

- [ ] **Step 3: Add `GatheringButton` to `MapCard`**

In `src/components/PageCharacterSheet/MapCard.tsx`, add the import:

```ts
import { GatheringButton } from '../GatheringList/GatheringButton'
```

Then update the `actions` array on the `Card`:

```tsx
actions={[
  <EncountersButton key='encounters' currentBiome={currentBiome} />,
  <GatheringButton key='gathering' currentBiome={currentBiome} />,
]}
```

- [ ] **Step 4: Verify the build passes**

```bash
npm run build 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 5: Smoke-test in browser**

```bash
npm run dev
```

- Open the character sheet map tab
- Click "See gathering" — modal opens on the correct biome tab
- Lootable entries show a `+` button; choice/none entries do not
- Clicking `+` adds the item to the inventory section with the correct quantity and label
- Flooded Plains tab shows the empty state message

- [ ] **Step 6: Commit**

```bash
git add src/components/GatheringList/GatheringDialog.tsx src/components/GatheringList/GatheringButton.tsx src/components/PageCharacterSheet/MapCard.tsx
git commit -m "feat: add gathering modal and wire into MapCard"
```
