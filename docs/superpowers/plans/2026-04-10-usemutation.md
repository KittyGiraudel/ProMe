# useMutation Storage Hook API — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a `useMutation`-style hook API (Apollo pattern: `[mutate, { data, loading, error }]`) that replaces the current ad-hoc save/create/delete hooks.

**Architecture:** A generic internal `useMutation<TData, TVariables>` hook lives in `src/hooks/useMutation.ts` alongside typed domain hooks (`useCharacterSave`, `useCharacterCreate`, `useCharacterDelete`, `useSettingsSave`). Existing hook files are deleted. Call sites take over feedback (toasts, navigation). `SaveForm`/`SaveCharacterOptions` types move to `useCharacterSheetForm.ts`.

**Tech Stack:** React (hooks), TypeScript, Ant Design (App.useApp for toasts at call sites), next-intl, Vitest (node env — no React hook testing available)

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Create | `src/hooks/useMutation.ts` | Generic hook + all typed mutation hooks |
| Rewrite | `src/hooks/useCharacterSheetForm.ts` | Compose new `useCharacterSave`, export `SaveForm` types |
| Update | `src/components/CharacterSheet/CharacterSheet.tsx` | `loading` instead of `hydratedFromStore` |
| Update | `src/components/ActionsCard/ActionsCard.tsx` | New delete API, fix imports |
| Update | `src/components/CharacteristicsCard/CharacteristicsCard.tsx` | Fix `SaveForm` import path |
| Update | `src/hooks/useCharacterLifeStatusActions.tsx` | Fix `SaveForm` import path |
| Update | `src/components/PageCharacterCreate/CharacterCreate.tsx` | New create API |
| Delete | `src/hooks/useCharacterSave.ts` | Superseded by `useMutation.ts` |
| Delete | `src/hooks/useCharacterCreate.ts` | Superseded by `useMutation.ts` |
| Delete | `src/hooks/useCharacterDelete.ts` | Superseded by `useMutation.ts` |
| Delete | `src/hooks/useCharactersQuery.ts` | Consolidated into `useQuery.ts` |
| Delete | `src/hooks/useCharacterQuery.ts` | Consolidated into `useQuery.ts` |
| Delete | `src/hooks/useSettingsQuery.ts` | Consolidated into `useQuery.ts` |

---

### Task 1: Create `useMutation.ts`

**Files:**
- Create: `src/hooks/useMutation.ts`

- [ ] **Step 1: Create the file**

```ts
'use client'

import { useCallback, useRef, useState } from 'react'
import { createCharacterFromIdentity } from '@/lib/character/createFromIdentity'
import { getCharacterStore } from '@/lib/character/store'
import { saveSettings } from '@/lib/settings/storage'
import type { AppSettings } from '@/lib/settings/types'
import type { Archetype, Character } from '@/lib/character/types'
import type { Gender } from '@/lib/types'

export type MutationResult<TData> = {
  data: TData | null
  loading: boolean
  error: Error | null
}

export type MutationOptions<TData> = {
  onCompleted?: (data: TData) => void
  onError?: (error: Error) => void
}

export function useMutation<TData, TVariables>(
  fn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData>
): [mutate: (variables: TVariables) => Promise<void>, result: MutationResult<TData>] {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn
  const optionsRef = useRef(options)
  optionsRef.current = options

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true)
    try {
      const result = await fnRef.current(variables)
      setData(result)
      setError(null)
      optionsRef.current?.onCompleted?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      optionsRef.current?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return [mutate, { data, loading, error }]
}

export function useCharacterSave(options?: MutationOptions<Character>) {
  return useMutation(
    (character: Character) => Promise.resolve(getCharacterStore().save(character)),
    options
  )
}

export type CharacterCreateValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function useCharacterCreate(options?: MutationOptions<Character>) {
  return useMutation(
    (values: CharacterCreateValues) => {
      const source = values.inheritFromCharacterId
        ? getCharacterStore().get(values.inheritFromCharacterId)
        : null
      const created = createCharacterFromIdentity(
        {
          name: values.name,
          archetype: values.archetype,
          gender: values.gender,
        },
        source ?? undefined
      )
      return Promise.resolve(getCharacterStore().save(created))
    },
    options
  )
}

export function useCharacterDelete(options?: MutationOptions<boolean>) {
  return useMutation(
    ({ id }: { id: string }) => Promise.resolve(getCharacterStore().delete(id)),
    options
  )
}

export function useSettingsSave(options?: MutationOptions<void>) {
  return useMutation(
    (settings: AppSettings) => {
      saveSettings(settings)
      return Promise.resolve()
    },
    options
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep useMutation`
Expected: no output (no errors in this file)

---

### Task 2: Rewrite `useCharacterSheetForm.ts`

**Files:**
- Modify: `src/hooks/useCharacterSheetForm.ts`

This rewrite:
- Imports `useCharacterSave` from `./useMutation` instead of `./useCharacterSave`
- Builds `saveForm` locally (merges form values + character + optional overload, then calls `save`)
- Exports `SaveForm` and `SaveCharacterOptions` types (previously lived in `useCharacterSave.ts`, now needed by `ActionsCard`, `CharacteristicsCard`, `useCharacterLifeStatusActions`)
- Owns `validationErrors` state and error feedback via `onError`
- Uses a `successKeyRef` to pass the dynamic success translation key into the `onCompleted` callback

- [ ] **Step 1: Replace the file contents**

```ts
'use client'

import { App, Form } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ValidationError,
  ValidationErrorCollection,
} from '@/lib/character/store/localStorageStore'
import { SheetFormValues } from '@/lib/character/toFormValues'
import type { Character } from '@/lib/character/types'
import type { TranslationKey } from '@/lib/types'
import { useCharacterSave } from './useMutation'
import { useCharacterQuery } from './useQuery'
import { useCharacterSaveGuard } from './useCharacterSaveGuard'

export type SaveCharacterOptions = { successKey?: TranslationKey }
export type SaveForm = (
  overload?: Partial<Character>,
  options?: SaveCharacterOptions
) => void

export function useCharacterSheetForm({
  characterId,
}: {
  characterId: string
}) {
  const [form] = Form.useForm<SheetFormValues>()
  const { data: character, loading, refetch } = useCharacterQuery({
    id: characterId,
  })
  const { message } = App.useApp()
  const t = useTranslations()
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  )
  const successKeyRef = useRef<TranslationKey>('characters.actions.save.success')

  const [save] = useCharacterSave({
    onCompleted: () => {
      refetch()
      message.success(t(successKeyRef.current))
    },
    onError: err => {
      if (err instanceof ValidationErrorCollection) {
        setValidationErrors(err.errors)
        message.warning(t('characters.actions.save.validation_error'))
      } else if (err.message === 'DEAD_CHARACTER') {
        message.error(t('characters.actions.save.dead_error'))
      } else {
        message.error(t('common.generic_error'))
      }
    },
  })

  const saveForm: SaveForm = useCallback(
    (overload?: Partial<Character>, options?: SaveCharacterOptions) => {
      setValidationErrors([])
      successKeyRef.current =
        options?.successKey ?? 'characters.actions.save.success'
      void save({
        ...character,
        ...form.getFieldsValue(true),
        ...overload,
      } as Character)
    },
    [character, form, save]
  )

  useCharacterSaveGuard({ form, character })

  return useMemo(
    () => ({ form, character, loading, saveForm, validationErrors }),
    [form, character, loading, saveForm, validationErrors]
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep -E "useCharacterSheetForm|useMutation"`
Expected: no output

---

### Task 3: Update `CharacterSheet.tsx`

**Files:**
- Modify: `src/components/CharacterSheet/CharacterSheet.tsx:35-46`

`useCharacterSheetForm` now returns `loading` (not `hydratedFromStore`). Update the destructure and the empty state prop.

- [ ] **Step 1: Update destructure and prop**

In `src/components/CharacterSheet/CharacterSheet.tsx`, change line 35:
```tsx
  const { form, character, hydratedFromStore, saveForm, validationErrors } =
    useCharacterSheetForm({ characterId })
```
to:
```tsx
  const { form, character, loading, saveForm, validationErrors } =
    useCharacterSheetForm({ characterId })
```

And change line 46:
```tsx
    return <CharacterSheetEmptyState loading={!hydratedFromStore} />
```
to:
```tsx
    return <CharacterSheetEmptyState loading={loading} />
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep CharacterSheet`
Expected: no output

---

### Task 4: Update `ActionsCard.tsx`

**Files:**
- Modify: `src/components/ActionsCard/ActionsCard.tsx`

Changes:
- Import `useCharacterDelete` from `@/hooks/useMutation` (not `@/hooks/useCharacterDelete`)
- Import `SaveForm` from `@/hooks/useCharacterSheetForm` (not `@/hooks/useCharacterSave`)
- Add `useRouter` from `@/i18n/navigation` for post-delete navigation
- Rewrite `useCharacterDelete` usage to new tuple API

- [ ] **Step 1: Replace the imports block**

```tsx
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import FrownOutlined from '@ant-design/icons/lib/icons/FrownOutlined'
import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined'
import { App, Avatar, Card, Form, List, Popconfirm } from 'antd'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { Button } from '@/components/Button/Button'
import { useCharacterLifeStatusActions } from '@/hooks/useCharacterLifeStatusActions'
import { useCharacterDelete } from '@/hooks/useMutation'
import { SaveForm } from '@/hooks/useCharacterSheetForm'
import { useRouter } from '@/i18n/navigation'
import { getCharacterStore } from '@/lib/character/store'
import { stringifyCharacters } from '@/lib/character/store/migrations'
import {
  buildCharacterExportFileName,
  downloadJsonFile,
} from '@/lib/download/downloadJsonFile'

import './ActionsCard.css'
```

- [ ] **Step 2: Replace the hook usage inside the component body**

Replace:
```tsx
  const { delete: onDelete } = useCharacterDelete(characterId as string)
```
with:
```tsx
  const router = useRouter()
  const [deleteCharacter] = useCharacterDelete({
    onCompleted: () => {
      message.success(t('characters.actions.delete_success'))
      router.push('/characters')
    },
    onError: () => message.error(t('common.generic_error')),
  })
```

- [ ] **Step 3: Update the delete Popconfirm's `onConfirm`**

Replace:
```tsx
          onConfirm={onDelete}
```
with:
```tsx
          onConfirm={() => deleteCharacter({ id: characterId as string })}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep ActionsCard`
Expected: no output

---

### Task 5: Fix `SaveForm` import in `CharacteristicsCard.tsx`

**Files:**
- Modify: `src/components/CharacteristicsCard/CharacteristicsCard.tsx:22`

- [ ] **Step 1: Update the import**

Replace:
```tsx
import { SaveForm } from '@/hooks/useCharacterSave'
```
with:
```tsx
import { SaveForm } from '@/hooks/useCharacterSheetForm'
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep CharacteristicsCard`
Expected: no output

---

### Task 6: Fix `SaveForm` import in `useCharacterLifeStatusActions.tsx`

**Files:**
- Modify: `src/hooks/useCharacterLifeStatusActions.tsx:6`

- [ ] **Step 1: Update the import**

Replace:
```tsx
import { SaveForm } from './useCharacterSave'
```
with:
```tsx
import { SaveForm } from './useCharacterSheetForm'
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep useCharacterLifeStatus`
Expected: no output

---

### Task 7: Update `CharacterCreate.tsx`

**Files:**
- Modify: `src/components/PageCharacterCreate/CharacterCreate.tsx`

Old `useCharacterCreate()` returned a single callback. New API is `[create, { loading }]`. Navigation and success toast move into the component via `onCompleted`. The form values type stays local (`CharacterCreateFormValues`) — it matches `CharacterCreateValues` from `useMutation.ts` and no import of that type is needed.

- [ ] **Step 1: Replace the import block and component body**

```tsx
'use client'

import { App, Card, Col, Form, Input, Row, Select } from 'antd'
import { useTranslations } from 'next-intl'
import { ArchetypeSelector } from '@/components/ArchetypeSelector/ArchetypeSelector'
import { Button } from '@/components/Button/Button'
import { InheritanceCard } from '@/components/InheritanceCard/InheritanceCard'
import { Layout } from '@/components/Layout/Layout'
import { Spacing } from '@/components/Spacing/Spacing'
import { useCharacterCreate } from '@/hooks/useMutation'
import { useInheritanceCandidates } from '@/hooks/useInheritanceCandidates'
import { useRouter } from '@/i18n/navigation'
import type { Archetype } from '@/lib/character/types'
import { GENDERS } from '@/lib/constants/misc'
import type { Gender } from '@/lib/types'
import './CharacterCreate.css'

type CharacterCreateFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function CharacterCreate() {
  const t = useTranslations()
  const router = useRouter()
  const { message } = App.useApp()
  const [form] = Form.useForm<CharacterCreateFormValues>()
  const [create] = useCharacterCreate({
    onCompleted: character => {
      message.success(t('new_character.create_success'))
      router.push(`/characters/${character.id}`)
    },
    onError: () => message.error(t('common.generic_error')),
  })
  const candidates = useInheritanceCandidates()
  const gender = Form.useWatch('gender', form)

  return (
    <Layout
      title={t('new_character.title')}
      bannerBiome='floodedPlains'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.characters'), path: '/characters' },
        { title: t('nav.new_character'), path: '/characters/new' },
      ]}>
      <Form<CharacterCreateFormValues>
        form={form}
        layout='vertical'
        colon={false}
        initialValues={{
          name: '',
          archetype: 'warrior',
          gender: undefined,
          inheritFromCharacterId: undefined,
        }}
        onFinish={values => { void create(values) }}>
        <Spacing size='large'>
          <Card title={t('characters.identity.identity_section')} id='identity'>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Form.Item
                  rules={[{ required: true }]}
                  name='name'
                  label={t('characters.identity.name_label')}
                  className='CharacterCreate__FormItem'>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name='gender'
                  label={t('characters.identity.gender_label')}
                  className='CharacterCreate__FormItem'>
                  <Select
                    allowClear
                    className='CharacterCreate__GenderSelect'
                    options={GENDERS.map(gender => ({
                      value: gender,
                      label: t(`common.genders.${gender}`),
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={t('characters.identity.archetype_label')}
            noStyle>
            <ArchetypeSelector gender={gender} />
          </Form.Item>

          <InheritanceCard candidates={candidates} />

          <Spacing orientation='horizontal' wrap>
            <Button type='primary' htmlType='submit'>
              {t('new_character.create')}
            </Button>
            <Button htmlType='button' type='link' href='/characters'>
              {t('common.actions.cancel')}
            </Button>
          </Spacing>
        </Spacing>
      </Form>
    </Layout>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep CharacterCreate`
Expected: no output

---

### Task 8: Delete dead files and commit

**Files:**
- Delete: `src/hooks/useCharacterSave.ts`
- Delete: `src/hooks/useCharacterCreate.ts`
- Delete: `src/hooks/useCharacterDelete.ts`
- Delete: `src/hooks/useCharactersQuery.ts`
- Delete: `src/hooks/useCharacterQuery.ts`
- Delete: `src/hooks/useSettingsQuery.ts`

- [ ] **Step 1: Run tests**

Run: `npm test`
Expected: all 180 tests pass

- [ ] **Step 2: Full TypeScript check**

Run: `npx tsc --noEmit 2>&1 | grep -v villageLinkSummary`
Expected: no output (only the pre-existing `villageLinkSummary` errors remain)

- [ ] **Step 3: Delete dead files**

```bash
git rm src/hooks/useCharacterSave.ts src/hooks/useCharacterCreate.ts src/hooks/useCharacterDelete.ts src/hooks/useCharactersQuery.ts src/hooks/useCharacterQuery.ts src/hooks/useSettingsQuery.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useMutation.ts src/hooks/useCharacterSheetForm.ts src/components/CharacterSheet/CharacterSheet.tsx src/components/ActionsCard/ActionsCard.tsx src/components/CharacteristicsCard/CharacteristicsCard.tsx src/hooks/useCharacterLifeStatusActions.tsx src/components/PageCharacterCreate/CharacterCreate.tsx
git commit -m "feat: add useMutation hook API for storage layer"
```
