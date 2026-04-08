# Character Sheet Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove multi-page mode entirely and collapse the `CharacterSheetShell` layout pattern into a single character page.

**Architecture:** Delete the Next.js `layout.tsx` + six sub-routes. Move all shell logic into a colocated `CharacterSheet` client component rendered by the route's `page.tsx`. Strip `singlePageMode` from settings everywhere; links are always hash-based anchors.

**Tech Stack:** Next.js App Router, Ant Design, next-intl, TypeScript, Biome (formatter — no semis, single quotes)

---

## File Map

| Action | Path |
|---|---|
| Modify | `src/lib/settings/types.ts` |
| Modify | `src/lib/settings/model.ts` |
| Modify | `src/lib/settings/storage.test.ts` |
| Modify | `src/components/PageSettings/Settings.tsx` |
| Modify | `src/hooks/useCharacterLink.ts` |
| Modify | `src/hooks/useCharacterSheetDocumentTitle.ts` |
| Modify | `src/hooks/useCharacterSheetForm.ts` |
| Modify | `src/components/CoordChip/CoordChip.tsx` |
| Create | `src/app/[locale]/characters/[id]/CharacterSheet.tsx` |
| Rewrite | `src/app/[locale]/characters/[id]/page.tsx` |
| Delete | `src/app/[locale]/characters/[id]/layout.tsx` |
| Delete | `src/app/[locale]/characters/[id]/identity/page.tsx` |
| Delete | `src/app/[locale]/characters/[id]/map/page.tsx` |
| Delete | `src/app/[locale]/characters/[id]/journal/page.tsx` |
| Delete | `src/app/[locale]/characters/[id]/inventory/page.tsx` |
| Delete | `src/app/[locale]/characters/[id]/tools/page.tsx` |
| Delete | `src/app/[locale]/characters/[id]/actions/page.tsx` |
| Delete | `src/components/CharacterSheetShell/CharacterSheetShell.tsx` |
| Delete | `src/components/CharacterSheetTabNav/CharacterSheetTabNav.tsx` |
| Delete | `src/constants/characterSheetRoutes.ts` |

---

## Task 1: Strip `singlePageMode` from settings

**Files:**
- Modify: `src/lib/settings/types.ts`
- Modify: `src/lib/settings/model.ts`
- Modify: `src/lib/settings/storage.test.ts`
- Modify: `src/components/PageSettings/Settings.tsx`

- [ ] **Step 1: Remove `singlePageMode` from the settings type**

In `src/lib/settings/types.ts`, remove the `singlePageMode` field from the `sheet` block:

```ts
export type AppSettings = {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION
  sheet: {
    adaptiveAppearanceTheme: boolean
  }
  // ... rest unchanged
}
```

- [ ] **Step 2: Remove `singlePageMode` from the default settings and normalizer**

In `src/lib/settings/model.ts`:

```ts
export const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  sheet: {
    adaptiveAppearanceTheme: false,
  },
  // ... rest unchanged
}

export function normalizeSettings(value: unknown): AppSettings {
  const source = value as Partial<AppSettings> | undefined
  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    sheet: {
      adaptiveAppearanceTheme: source?.sheet?.adaptiveAppearanceTheme === true,
    },
    // ... rest unchanged
  }
}
```

- [ ] **Step 3: Update the storage test**

In `src/lib/settings/storage.test.ts`, the 'persists and reloads' test currently passes `singlePageMode` in the saved object. Remove it:

```ts
it('persists and reloads normalized settings', () => {
  saveSettings({
    ...DEFAULT_SETTINGS,
    sheet: { adaptiveAppearanceTheme: true },
    journal: { timelineReverseChronological: true, createEntryOnMove: true },
  })

  const loaded = loadSettings()
  expect(loaded.sheet.adaptiveAppearanceTheme).toBe(true)
  expect(loaded.journal.timelineReverseChronological).toBe(true)
  expect(loaded.journal.createEntryOnMove).toBe(true)
})
```

- [ ] **Step 4: Run the settings tests**

```bash
npx vitest run src/lib/settings/storage.test.ts
```

Expected: all 3 tests pass.

- [ ] **Step 5: Remove `sheetSinglePageMode` from the Settings UI**

In `src/components/PageSettings/Settings.tsx`:

- Remove `sheetSinglePageMode` from the `SettingsFormValues` type
- Remove `sheetSinglePageMode: settings.sheet.singlePageMode` from `initialValues`
- Remove `sheetSinglePageMode: DEFAULT_SETTINGS.sheet.singlePageMode` from `handleReset`'s `setFieldsValue` call
- Remove `singlePageMode: allValues.sheetSinglePageMode === true` from `handleValuesChange`'s `sheet` block
- Remove the `<Col>` + `<Form.Item name='sheetSinglePageMode' ...>` JSX block from the sheet settings card (the card will now have only one column: `adaptiveAppearanceTheme`)

- [ ] **Step 6: Commit**

```bash
git add src/lib/settings/types.ts src/lib/settings/model.ts src/lib/settings/storage.test.ts src/components/PageSettings/Settings.tsx
git commit -m "feat: remove singlePageMode setting"
```

---

## Task 2: Simplify `useCharacterLink`

**Files:**
- Modify: `src/hooks/useCharacterLink.ts`

- [ ] **Step 1: Rewrite the hook**

Replace the entire file content. The hook no longer reads settings, no longer looks up a tab in `CHARACTER_SHEET_TAB_KEYS`, and always produces hash-based links. `tabId` is typed as `string` (the constants file will be deleted later):

```ts
'use client'

import { useParams } from 'next/navigation'
import { useCallback } from 'react'

type CharacterLinkOptions = {
  characterId?: string
  tabId?: string
  hash?: string
}

type GetterOptionsRequiringTabId = Omit<CharacterLinkOptions, 'tabId'> & {
  tabId: string
}

export function useCharacterLink(options: {
  tabId: string
  hash?: string
}): (options?: CharacterLinkOptions) => string
export function useCharacterLink(options?: {
  hash?: string
}): (options: GetterOptionsRequiringTabId) => string
export function useCharacterLink({
  tabId,
  hash,
}: {
  tabId?: string
  hash?: string
} = {}) {
  const params = useParams<{ id: string }>()
  const characterId = params?.id

  const getCharacterLink = useCallback(
    ({
      characterId: oCharacterId,
      tabId: oTabId,
      hash: oHash,
    }: CharacterLinkOptions = {}) => {
      const resolvedCharacterId = oCharacterId ?? characterId
      const resolvedTabId = oTabId ?? tabId
      const resolvedHash = (oHash ?? hash ?? '').replace('#', '')

      if (!resolvedCharacterId) {
        throw new Error('Missing character ID for character sheet link.')
      }

      const basePath = `/characters/${resolvedCharacterId}`

      if (resolvedHash) return `${basePath}#${resolvedHash}`
      if (resolvedTabId) return `${basePath}#${resolvedTabId}`
      return basePath
    },
    [characterId, tabId, hash]
  )

  return getCharacterLink
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useCharacterLink.ts
git commit -m "feat: simplify useCharacterLink to always use hash anchors"
```

---

## Task 3: Simplify `useCharacterSheetDocumentTitle` and `useCharacterSheetForm`

**Files:**
- Modify: `src/hooks/useCharacterSheetDocumentTitle.ts`
- Modify: `src/hooks/useCharacterSheetForm.ts`

- [ ] **Step 1: Simplify `useCharacterSheetDocumentTitle`**

Remove `tabKeyFromPathname`, `CHARACTER_SHEET_TAB_KEYS`, `usePathname`, and the tab-suffix logic. The title is just the character name:

```ts
'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import type { Character } from '@/lib/character/types'

export function useCharacterSheetDocumentTitle({
  character,
}: {
  character: Character | null
}) {
  const t = useTranslations()

  useEffect(
    function addNameToPageTitle() {
      if (!character) {
        document.title = `${t('characters.not_found_title')} — ${t('metadata.tab_brand')}`
        return
      }

      const displayName = character.name?.trim() || t('characters_list.unnamed')
      document.title = `${displayName} — ${t('metadata.tab_brand')}`
    },
    [character, t]
  )
}
```

- [ ] **Step 2: Remove `activeTab` from `useCharacterSheetForm`**

In `src/hooks/useCharacterSheetForm.ts`, remove:
- `usePathname` import
- `tabKeyFromPathname` import
- `const pathname = usePathname()`
- `const activeTab = tabKeyFromPathname(pathname)`
- `activeTab` from the `useMemo` return value and its deps array

The file becomes:

```ts
'use client'

import { Form } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import { SheetFormValues } from '@/lib/character/toFormValues'
import type { Character } from '@/lib/character/types'
import { useCharacterSave } from './useCharacterSave'
import { useCharacterSaveGuard } from './useCharacterSaveGuard'

export function useCharacterSheetForm({
  characterId,
}: {
  characterId: string
}) {
  const [form] = Form.useForm<SheetFormValues>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [hydratedFromStore, setHydratedFromStore] = useState(false)
  const { saveForm, validationErrors } = useCharacterSave({
    character,
    form,
    onSave: setCharacter,
  })

  useEffect(
    function hydrateCharacterFromStorage() {
      void Promise.resolve().then(() => {
        setHydratedFromStore(false)
        const saved = getCharacterStore().get(characterId)
        setCharacter(saved ?? null)
        setHydratedFromStore(true)
      })
    },
    [characterId]
  )

  useCharacterSaveGuard({ form, character })

  return useMemo(
    () => ({
      form,
      character,
      hydratedFromStore,
      saveForm,
      validationErrors,
    }),
    [form, character, hydratedFromStore, saveForm, validationErrors]
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCharacterSheetDocumentTitle.ts src/hooks/useCharacterSheetForm.ts
git commit -m "feat: remove tab-suffix logic and activeTab from sheet hooks"
```

---

## Task 4: Simplify `CoordChip`

**Files:**
- Modify: `src/components/CoordChip/CoordChip.tsx`

- [ ] **Step 1: Remove `singlePageMode` branch — always use `<a>`**

`CoordChip` used a `<Link>` in multi-page mode to navigate to the map tab and a plain `<a>` in single-page mode (because `hashchange` doesn't fire via `Link`). Since we're always single-page, always use `<a>`. Remove `useSettings`, `useCharacterLink`, and the conditional:

```tsx
'use client'

import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import type { CellCoordinate } from '@/lib/character/types'
import { formatDisplayedCellReference } from '@/lib/map/coordinates'
import type { PossibleBiomeId } from '@/lib/types'

import './CoordChip.css'

export function CoordChip({
  biome,
  value,
  coord,
  interactive = true,
}: {
  biome: PossibleBiomeId
  value: string
  coord?: CellCoordinate
  /** When false, never link to the map (e.g. journal preview inside a modal). */
  interactive?: boolean
}) {
  const inner = (
    <>
      <BiomeBubble biome={biome} />
      <span className='CoordChip__label'>{value}</span>
    </>
  )

  if (coord && interactive) {
    const hash = formatDisplayedCellReference(coord)
    return (
      <a className='CoordChip' href={'#' + hash}>
        {inner}
      </a>
    )
  }

  return <span className='CoordChip'>{inner}</span>
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CoordChip/CoordChip.tsx
git commit -m "feat: CoordChip always uses plain anchor (single-page only)"
```

---

## Task 5: Create `CharacterSheet` client component

**Files:**
- Create: `src/app/[locale]/characters/[id]/CharacterSheet.tsx`

- [ ] **Step 1: Create the file**

This is the former `CharacterSheetShell`, rewritten to include all cards directly (no `children` prop), with breadcrumbs simplified and `singlePageMode`/`SettingsHint`/`CharacterSheetTabNav` removed:

```tsx
'use client'

import { Alert, App, Col, ConfigProvider, Form, Row } from 'antd'
import { useTranslations } from 'next-intl'
import { ActionsCard } from '@/components/ActionsCard/ActionsCard'
import { AudioCard } from '@/components/AudioCard/AudioCard'
import { Button } from '@/components/Button/Button'
import { CardDraw } from '@/components/CardDraw/CardDraw'
import { CharacterProvider } from '@/components/CharacterContext/CharacterContext'
import { CharacterSheetEmptyState } from '@/components/CharacterSheetEmptyState/CharacterSheetEmptyState'
import { CharacterSheetValidationErrors } from '@/components/CharacterSheetValidationErrors/CharacterSheetValidationErrors'
import { CharacterStats } from '@/components/CharacterStats/CharacterStats'
import { CharacteristicsCard } from '@/components/CharacteristicsCard/CharacteristicsCard'
import { ClockCard } from '@/components/ClockCard/ClockCard'
import { CopyDropdown } from '@/components/CopyDropdown/CopyDropdown'
import { DiceRoll } from '@/components/DiceRoll/DiceRoll'
import { IdentityCard } from '@/components/IdentityCard/IdentityCard'
import { InventoryCard } from '@/components/InventoryCard/InventoryCard'
import { JournalCard } from '@/components/JournalCard/JournalCard'
import { Layout } from '@/components/Layout/Layout'
import { MapCard } from '@/components/MapCard/MapCard'
import { Spacing } from '@/components/Spacing/Spacing'
import { SpellbookCard } from '@/components/SpellbookCard/SpellbookCard'
import { useBiomeAtCurrentMapPosition } from '@/hooks/useBiomeAtCurrentMapPosition'
import { useCharacterLink } from '@/hooks/useCharacterLink'
import { useCharacterSheetDocumentTitle } from '@/hooks/useCharacterSheetDocumentTitle'
import { useCharacterSheetForm } from '@/hooks/useCharacterSheetForm'
import { useCharacterSheetTheme } from '@/hooks/useCharacterSheetTheme'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useOnFieldsChanged } from '@/hooks/useOnFieldsChanged'
import { Link } from '@/i18n/navigation'
import { getProtectorSummary } from '@/lib/character/getProtectorSummary'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { toFormValues } from '@/lib/character/toFormValues'

export function CharacterSheet({ characterId }: { characterId: string }) {
  const t = useTranslations()
  const { form, character, hydratedFromStore, saveForm, validationErrors } =
    useCharacterSheetForm({ characterId })
  const onFieldsChange = useOnFieldsChanged(form)
  const { theme, appearance } = useCharacterSheetTheme(form)
  const bannerBiome = useBiomeAtCurrentMapPosition(form)
  const getCharacterLink = useCharacterLink()
  const isDead = character ? isCharacterDead(character) : false

  useCharacterSheetDocumentTitle({ character })
  useKeyboardShortcuts({ form, isDead })

  if (!character) {
    return <CharacterSheetEmptyState loading={!hydratedFromStore} />
  }

  return (
    <ConfigProvider theme={theme}>
      <App>
        <Layout
          appearance={appearance}
          bannerBiome={bannerBiome}
          title={character.name || t('characters_list.unnamed')}
          breadcrumbs={[
            { title: t('nav.home'), path: '/' },
            { title: t('nav.characters'), path: '/characters' },
            { title: character.name, path: undefined },
          ]}
          headerActions={[
            <CopyDropdown
              key='sheet-copy'
              description={getProtectorSummary(character, t)}
              journalBrace={`{protector/${character.id}}`}
            />,
            ...(!isDead
              ? [
                  <Button
                    key='save'
                    type='primary'
                    htmlType='submit'
                    form={character.id}>
                    {t('common.actions.save')}
                  </Button>,
                ]
              : []),
          ]}>
          <Form
            id={character.id}
            key={`${character.id}-${character.updatedAt}`}
            form={form}
            onFieldsChange={onFieldsChange}
            scrollToFirstError
            initialValues={toFormValues(character)}
            onFinish={() => saveForm()}
            disabled={isDead}
            layout='vertical'
            colon={false}
            preserve>
            <CharacterSheetValidationErrors errors={validationErrors} />
            <CharacterProvider isDead={isDead} saveForm={saveForm}>
              <Spacing size='large'>
                {isDead ? (
                  <Alert
                    showIcon
                    type='warning'
                    title={t('characters.dead_readonly_title')}
                    description={t.rich(
                      'characters.dead_readonly_description',
                      {
                        gender: character.gender ?? 'indeterminate',
                        link: content => (
                          <Link href={getCharacterLink({ tabId: 'actions' })}>
                            {content}
                          </Link>
                        ),
                      }
                    )}
                  />
                ) : null}
                <CharacterStats />
                <IdentityCard isArchetypeReadonly />
                <CharacteristicsCard />
                <MapCard />
                <ClockCard />
                <JournalCard />
                <InventoryCard />
                <SpellbookCard />
                <Row gutter={[16, 16]} id='tools'>
                  <Col xs={24} md={12}>
                    <DiceRoll />
                  </Col>
                  <Col xs={24} md={12}>
                    <CardDraw />
                  </Col>
                </Row>
                <ActionsCard />
                <AudioCard biome={bannerBiome} />
              </Spacing>
            </CharacterProvider>
          </Form>
        </Layout>
      </App>
    </ConfigProvider>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/characters/\[id\]/CharacterSheet.tsx
git commit -m "feat: add CharacterSheet client component (replaces shell + all-page)"
```

---

## Task 6: Rewrite `page.tsx`, delete `layout.tsx` and sub-routes

**Files:**
- Rewrite: `src/app/[locale]/characters/[id]/page.tsx`
- Delete: `src/app/[locale]/characters/[id]/layout.tsx`
- Delete: `src/app/[locale]/characters/[id]/identity/page.tsx`
- Delete: `src/app/[locale]/characters/[id]/map/page.tsx`
- Delete: `src/app/[locale]/characters/[id]/journal/page.tsx`
- Delete: `src/app/[locale]/characters/[id]/inventory/page.tsx`
- Delete: `src/app/[locale]/characters/[id]/tools/page.tsx`
- Delete: `src/app/[locale]/characters/[id]/actions/page.tsx`

- [ ] **Step 1: Rewrite `page.tsx`**

The page is now a server component that exports metadata and delegates to the client component. Replace the entire file:

```tsx
import type { Metadata } from 'next'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterSheet } from './CharacterSheet'

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  return { title: t('characters.title') }
}

export default async function CharacterIdPage({ params }: Props) {
  const { id } = await params
  return <CharacterSheet characterId={id} />
}
```

- [ ] **Step 2: Delete `layout.tsx` and all sub-route pages**

```bash
rm src/app/\[locale\]/characters/\[id\]/layout.tsx
rm -r src/app/\[locale\]/characters/\[id\]/identity
rm -r src/app/\[locale\]/characters/\[id\]/map
rm -r src/app/\[locale\]/characters/\[id\]/journal
rm -r src/app/\[locale\]/characters/\[id\]/inventory
rm -r src/app/\[locale\]/characters/\[id\]/tools
rm -r src/app/\[locale\]/characters/\[id\]/actions
```

- [ ] **Step 3: Commit**

```bash
git add -A src/app/\[locale\]/characters/\[id\]/
git commit -m "feat: collapse character sheet to single route, delete sub-routes"
```

---

## Task 7: Delete old components and constants

**Files:**
- Delete: `src/components/CharacterSheetShell/CharacterSheetShell.tsx`
- Delete: `src/components/CharacterSheetTabNav/CharacterSheetTabNav.tsx`
- Delete: `src/constants/characterSheetRoutes.ts`

- [ ] **Step 1: Delete the files**

```bash
rm -r src/components/CharacterSheetShell
rm -r src/components/CharacterSheetTabNav
rm src/constants/characterSheetRoutes.ts
```

- [ ] **Step 2: Commit**

```bash
git add -A src/components/CharacterSheetShell src/components/CharacterSheetTabNav src/constants/characterSheetRoutes.ts
git commit -m "feat: delete CharacterSheetShell, CharacterSheetTabNav, characterSheetRoutes"
```

---

## Task 8: Verify build and tests

- [ ] **Step 1: Run all tests**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 2: Run the production build**

```bash
npm run build
```

Expected: build succeeds with no TypeScript or module-not-found errors. If there are import errors (e.g. something still importing from `@/constants/characterSheetRoutes` or `@/components/CharacterSheetShell`), fix them now.

- [ ] **Step 3: Run the linter**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit any fixes, then final commit**

If the build surfaced stray imports or type errors, fix them and commit:

```bash
git add <affected files>
git commit -m "fix: remove stray imports after character sheet simplification"
```
