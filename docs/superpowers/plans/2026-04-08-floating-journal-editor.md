# Floating Journal Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fixed-position floating panel that lets players keep writing a journal entry while scrolling and consulting other sections of the character sheet.

**Architecture:** A new `JournalEntryFloatingEditor` component renders via a React portal to `document.body` so it is never clipped by parent overflow. Editing state (which entry is in floating mode) is tracked in `useJournalEntryViewModes` and threaded down through `JournalCardInner` → `Journal` → `JournalEntry`. The existing `JournalEntryEditModal` is unchanged; the floating panel's expand button promotes to it.

**Tech Stack:** React 18 (`createPortal`), Ant Design (`Form.Item`, `Input.TextArea`, `Button`), next-intl, TypeScript, CSS custom properties from the Ant Design theme.

---

## File Map

| Action | Path |
|--------|------|
| Modify | `messages/fr.json` |
| Modify | `messages/en.json` |
| Modify | `src/hooks/useJournalEntryViewModes.ts` |
| Modify | `src/components/Journal/Journal.tsx` |
| Modify | `src/components/JournalCard/JournalCard.tsx` |
| Modify | `src/components/Journal/JournalEntry.tsx` |
| Create | `src/components/Journal/JournalEntryFloatingEditor.css` |
| Create | `src/components/Journal/JournalEntryFloatingEditor.tsx` |

---

## Task 1: Add i18n keys

**Files:**
- Modify: `messages/fr.json:132`
- Modify: `messages/en.json:132`

- [ ] **Step 1: Add keys to `fr.json`**

After line 132 (`"entry_empty": "Cette entrée est vide.",`), insert:

```json
      "floating_editor_title": "Journal",
      "floating_editor_expand": "Ouvrir l'éditeur complet",
      "floating_editor_collapse": "Réduire",
      "floating_editor_restore": "Restaurer",
```

- [ ] **Step 2: Add keys to `en.json`**

After line 132 (`"entry_empty": "This entry is empty.",`), insert:

```json
      "floating_editor_title": "Journal",
      "floating_editor_expand": "Open full editor",
      "floating_editor_collapse": "Collapse",
      "floating_editor_restore": "Restore",
```

- [ ] **Step 3: Verify format**

```bash
npm run format:check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "feat: add i18n keys for floating journal editor"
```

---

## Task 2: Extend `useJournalEntryViewModes`

**Files:**
- Modify: `src/hooks/useJournalEntryViewModes.ts`

- [ ] **Step 1: Replace the file contents**

```ts
'use client'

import { FormListFieldData } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useJournalEntryViewModes(fields: FormListFieldData[]) {
  const [editingByFieldKey, setEditingByFieldKey] = useState<
    Record<number, boolean>
  >({})
  const [floatingFieldKey, setFloatingFieldKey] = useState<number | null>(null)
  const previousFieldCountRef = useRef(fields.length)

  const setEditingMode = useCallback((fieldKey: number, isEditing: boolean) => {
    setEditingByFieldKey(previous => ({
      ...previous,
      [fieldKey]: isEditing,
    }))
  }, [])

  const isEditing = useCallback(
    (fieldKey: number) => Boolean(editingByFieldKey[fieldKey]),
    [editingByFieldKey]
  )

  const setFloatingMode = useCallback((fieldKey: number | null) => {
    setFloatingFieldKey(fieldKey)
  }, [])

  const isFloating = useCallback(
    (fieldKey: number) => floatingFieldKey === fieldKey,
    [floatingFieldKey]
  )

  const anyEditingActive = useMemo(
    () =>
      floatingFieldKey !== null ||
      Object.values(editingByFieldKey).some(Boolean),
    [floatingFieldKey, editingByFieldKey]
  )

  useEffect(
    function editNewlyAddedEntry() {
      if (fields.length > previousFieldCountRef.current) {
        const latest = fields[fields.length - 1]
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (latest) setFloatingMode(latest.key)
      }
      previousFieldCountRef.current = fields.length
    },
    [fields, setFloatingMode]
  )

  return useMemo(
    () => ({
      isEditing,
      setEditingMode,
      isFloating,
      setFloatingMode,
      anyEditingActive,
    }),
    [isEditing, setEditingMode, isFloating, setFloatingMode, anyEditingActive]
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run build 2>&1 | head -30
```

Expected: type errors only about the new props not yet consumed downstream (Journal, JournalCardInner). That is fine — we fix those in Task 3.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useJournalEntryViewModes.ts
git commit -m "feat: add floating editing state to useJournalEntryViewModes"
```

---

## Task 3: Thread new props through `Journal` and `JournalCardInner`

**Files:**
- Modify: `src/components/Journal/Journal.tsx`
- Modify: `src/components/JournalCard/JournalCard.tsx`

- [ ] **Step 1: Update `Journal.tsx`**

Replace the entire file:

```tsx
'use client'

import { Timeline } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useMemo } from 'react'
import { JournalEntry } from '@/components/Journal/JournalEntry'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { TimelineIcon } from '@/components/TimelineIcon/TimelineIcon'
import { useWatchedJournal } from '@/hooks/useCharacterSheetDerived'
import type { JournalEntryPhase } from '@/lib/character/types'

import './Journal.css'

export function Journal({
  fields,
  deleteEntry,
  isEditing,
  setEditingMode,
  isFloating,
  setFloatingMode,
  anyEditingActive,
}: {
  fields: FormListFieldData[]
  deleteEntry: (entryIndex: number) => void
  isEditing: (fieldKey: number) => boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
  isFloating: (fieldKey: number) => boolean
  setFloatingMode: (fieldKey: number | null) => void
  anyEditingActive: boolean
}) {
  const { settings } = useSettings()
  const { getEntry } = useWatchedJournal()

  const items = useMemo(
    () =>
      fields.map(field => {
        const entry = getEntry(field.name)

        return {
          key: String(field.key),
          icon: entry?.phase ? (
            <TimelineIcon
              phase={entry.phase as JournalEntryPhase}
              slice={entry?.slice as number}
            />
          ) : undefined,
          content: (
            <JournalEntry
              field={field}
              editing={isEditing(field.key)}
              setEditingMode={setEditingMode}
              deleteEntry={deleteEntry}
              isFloating={isFloating(field.key)}
              setFloatingMode={setFloatingMode}
              anyEditingActive={anyEditingActive}
            />
          ),
        }
      }),
    [
      fields,
      isEditing,
      setEditingMode,
      deleteEntry,
      isFloating,
      setFloatingMode,
      anyEditingActive,
      getEntry,
    ]
  )

  return (
    <Timeline
      className='Journal'
      reverse={settings.journal.timelineReverseChronological}
      items={items}
    />
  )
}
```

- [ ] **Step 2: Update `JournalCard.tsx`**

In `JournalCardInner`, destructure the new values from the hook and pass them to `Journal`. Replace the `JournalCardInner` function (the `JournalCard` wrapper is unchanged):

```tsx
export function JournalCardInner({
  fields,
  onAddEntry,
  onRemoveEntry,
}: {
  fields: FormListFieldData[]
  onAddEntry: () => void
  onRemoveEntry: (index: number | number[]) => void
}) {
  const { isDead } = useCharacterContext()
  const { componentDisabled } = ConfigProvider.useConfig()
  const { settings } = useSettings()
  const t = useTranslations()
  const [currentPage, setCurrentPage] = useState(1)
  const totalCount = fields.length

  const { isEditing, setEditingMode, isFloating, setFloatingMode, anyEditingActive } =
    useJournalEntryViewModes(fields)
  const { addEntry, removeEntry } = useJournalActions({
    count: totalCount,
    setCurrentPage,
    onAddEntry,
    onRemoveEntry,
  })
  const {
    searchTerm,
    setSearchTerm,
    fields: filteredFields,
  } = useJournalSearch(fields)

  const buttonInHeader = settings.journal.timelineReverseChronological
  const buttonInFooter = !buttonInHeader
  const canAddEntry = !componentDisabled

  useEffect(
    function resetPageOnSearch() {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(1)
    },
    [searchTerm]
  )

  const pagedFields = useMemo(() => {
    if (buttonInHeader) {
      const total = filteredFields.length
      const start = Math.max(0, total - currentPage * PAGE_SIZE)
      const end = total - (currentPage - 1) * PAGE_SIZE
      return filteredFields.slice(start, end)
    }
    return filteredFields.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    )
  }, [filteredFields, currentPage, buttonInHeader])

  const addEntryButton = (
    <Button onClick={addEntry} htmlType='button'>
      {t('characters.journal.add_journal_entry')}
    </Button>
  )

  return (
    <>
      <Card
        title={t('characters.journal.notes_section')}
        extra={canAddEntry && buttonInHeader ? addEntryButton : undefined}
        actions={canAddEntry && buttonInFooter ? [addEntryButton] : undefined}
        id='journal'>
        {totalCount === 0 ? (
          <Empty description={t('characters.journal.empty')} />
        ) : (
          <>
            <Input.Search
              allowClear
              aria-label={t('characters.journal.search_placeholder')}
              placeholder={t('characters.journal.search_placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
              style={{ marginBottom: 24 }}
            />

            {filteredFields.length === 0 ? (
              <Empty description={t('characters.journal.search_empty')} />
            ) : (
              <>
                <Journal
                  fields={pagedFields}
                  deleteEntry={removeEntry}
                  isEditing={isEditing}
                  setEditingMode={setEditingMode}
                  isFloating={isFloating}
                  setFloatingMode={setFloatingMode}
                  anyEditingActive={anyEditingActive}
                />

                {filteredFields.length > PAGE_SIZE && (
                  <div className='Journal__pagination'>
                    <Pagination
                      current={currentPage}
                      total={filteredFields.length}
                      pageSize={PAGE_SIZE}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>
      {!isDead && <SettingsHint hintId='journal' />}
    </>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npm run build 2>&1 | head -30
```

Expected: type errors only about the new props not yet consumed in `JournalEntry`. That is fine — we fix those in Task 5.

- [ ] **Step 4: Commit**

```bash
git add src/components/Journal/Journal.tsx src/components/JournalCard/JournalCard.tsx
git commit -m "feat: thread floating editor props through Journal and JournalCardInner"
```

---

## Task 4: Create `JournalEntryFloatingEditor` CSS

**Files:**
- Create: `src/components/Journal/JournalEntryFloatingEditor.css`

- [ ] **Step 1: Create the stylesheet**

```css
.JournalFloatingEditor {
  position: fixed;
  bottom: 1em;
  right: 1em;
  width: min(480px, calc(100vw - 2em));
  z-index: 900;
  background: var(--ant-color-bg-container);
  border: 1px solid var(--ant-color-border);
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--ant-box-shadow-secondary);
  overflow: hidden;
}

.JournalFloatingEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 0.5em 0.5em 0.75em;
  background: var(--ant-color-bg-elevated);
  border-bottom: 1px solid var(--ant-color-border-secondary);
  cursor: pointer;
  user-select: none;
}

.JournalFloatingEditor__title {
  font-weight: 600;
  font-size: 0.85em;
  color: var(--ant-color-text-secondary);
}

.JournalFloatingEditor__actions {
  display: flex;
  gap: 0.1em;
}

.JournalFloatingEditor__body {
  padding: 0.75em 0.75em 0;
}

.JournalFloatingEditor__body--collapsed {
  display: none;
}

.JournalFloatingEditor__field.JournalFloatingEditor__field {
  margin-bottom: 0;
}

.JournalFloatingEditor__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5em;
  padding: 0.5em 0.75em 0.75em;
}

.JournalFloatingEditor__footer--collapsed {
  display: none;
}
```

- [ ] **Step 2: Verify format**

```bash
npm run format:check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Journal/JournalEntryFloatingEditor.css
git commit -m "feat: add JournalEntryFloatingEditor styles"
```

---

## Task 5: Create `JournalEntryFloatingEditor` component

**Files:**
- Create: `src/components/Journal/JournalEntryFloatingEditor.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { Form, Input } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/Button/Button'

import './JournalEntryFloatingEditor.css'

type JournalEntryFloatingEditorProps = {
  open: boolean
  fieldName: number
  onSave: () => void
  onCancel: () => void
  onExpand: () => void
}

export function JournalEntryFloatingEditor({
  open,
  fieldName,
  onSave,
  onCancel,
  onExpand,
}: JournalEntryFloatingEditorProps) {
  const t = useTranslations()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (!e.metaKey && !e.ctrlKey) return
      e.preventDefault()
      onSave()
    },
    [onSave]
  )

  if (!isMounted || !open) return null

  const bodyClass = `JournalFloatingEditor__body${isCollapsed ? ' JournalFloatingEditor__body--collapsed' : ''}`
  const footerClass = `JournalFloatingEditor__footer${isCollapsed ? ' JournalFloatingEditor__footer--collapsed' : ''}`

  return createPortal(
    <div className='JournalFloatingEditor' role='dialog' aria-label={t('characters.journal.floating_editor_title')}>
      <div
        className='JournalFloatingEditor__header'
        onClick={() => setIsCollapsed(c => !c)}>
        <span className='JournalFloatingEditor__title'>
          {t('characters.journal.floating_editor_title')}
        </span>
        <span className='JournalFloatingEditor__actions'>
          <Button
            type='text'
            size='small'
            htmlType='button'
            title={t('characters.journal.floating_editor_expand')}
            aria-label={t('characters.journal.floating_editor_expand')}
            onClick={e => {
              e.stopPropagation()
              onExpand()
            }}>
            ⤢
          </Button>
          <Button
            type='text'
            size='small'
            htmlType='button'
            title={
              isCollapsed
                ? t('characters.journal.floating_editor_restore')
                : t('characters.journal.floating_editor_collapse')
            }
            aria-label={
              isCollapsed
                ? t('characters.journal.floating_editor_restore')
                : t('characters.journal.floating_editor_collapse')
            }
            onClick={e => {
              e.stopPropagation()
              setIsCollapsed(c => !c)
            }}>
            {isCollapsed ? '+' : '−'}
          </Button>
        </span>
      </div>
      <div className={bodyClass}>
        <Form.Item
          name={[fieldName, 'content']}
          className='JournalFloatingEditor__field'>
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 8 }}
            placeholder={t('characters.journal.entry_content_placeholder')}
            onKeyDown={handleKeyDown}
          />
        </Form.Item>
      </div>
      <div className={footerClass}>
        <Button htmlType='button' onClick={onCancel}>
          {t('common.actions.cancel')}
        </Button>
        <Button type='primary' htmlType='button' onClick={onSave}>
          {t('common.actions.finish')}
        </Button>
      </div>
    </div>,
    document.body
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run build 2>&1 | head -30
```

Expected: clean (or only pre-existing errors). The component is not yet used anywhere so no import errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Journal/JournalEntryFloatingEditor.tsx
git commit -m "feat: add JournalEntryFloatingEditor component"
```

---

## Task 6: Wire `JournalEntry` to use the floating editor

**Files:**
- Modify: `src/components/Journal/JournalEntry.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
'use client'

import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import { ConfigProvider, Form } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/Button/Button'
import { JournalEntryBodyPreview } from '@/components/Journal/JournalEntryBodyPreview'
import { JournalEntryEditModal } from '@/components/Journal/JournalEntryEditModal'
import { JournalEntryFloatingEditor } from '@/components/Journal/JournalEntryFloatingEditor'
import { useWatchedJournal } from '@/hooks/useCharacterSheetDerived'

type JournalEntryProps = {
  field: FormListFieldData
  editing: boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
  deleteEntry: (entryIndex: number) => void
  isFloating: boolean
  setFloatingMode: (fieldKey: number | null) => void
  anyEditingActive: boolean
}

/**
 * One timeline journal row: preview, edit affordance, floating editor, and modal
 * editor wired to the character form.
 */
export function JournalEntry({
  field,
  editing,
  setEditingMode,
  deleteEntry,
  isFloating,
  setFloatingMode,
  anyEditingActive,
}: JournalEntryProps) {
  const form = Form.useFormInstance()
  const { componentDisabled } = ConfigProvider.useConfig()
  const initialContentRef = useRef<string | undefined>(undefined)
  const t = useTranslations()

  const content = form.getFieldValue([
    'journalEntries',
    field.name,
    'content',
  ]) as string | undefined
  const createdAt = form.getFieldValue([
    'journalEntries',
    field.name,
    'createdAt',
  ]) as string | undefined
  const updatedAt = form.getFieldValue([
    'journalEntries',
    field.name,
    'updatedAt',
  ]) as string | undefined
  const entryId = form.getFieldValue(['journalEntries', field.name, 'id']) as
    | string
    | undefined

  const { getEntry, updateEntryField } = useWatchedJournal()
  const draftContent = getEntry(field.name)?.content
  const entryAnchor = entryId ? `journal-${entryId}` : undefined

  useEffect(
    function storeInitialContentOnEdit() {
      if (editing) {
        initialContentRef.current = form.getFieldValue([
          'journalEntries',
          field.name,
          'content',
        ]) as string | undefined
      }
    },
    [editing, field.name, form]
  )

  useEffect(
    function storeInitialContentOnFloatingEdit() {
      if (isFloating) {
        initialContentRef.current = form.getFieldValue([
          'journalEntries',
          field.name,
          'content',
        ]) as string | undefined
      }
    },
    [isFloating, field.name, form]
  )

  const handleModalSave = useCallback(() => {
    if (!componentDisabled) {
      updateEntryField(field.name, 'updatedAt', new Date().toISOString())
      setEditingMode(field.key, false)
    }
  }, [
    componentDisabled,
    field.key,
    field.name,
    updateEntryField,
    setEditingMode,
  ])

  const handleModalCancel = useCallback(() => {
    updateEntryField(field.name, 'content', initialContentRef.current)
    setEditingMode(field.key, false)
  }, [field.key, field.name, updateEntryField, setEditingMode])

  const handleFloatingSave = useCallback(() => {
    if (!componentDisabled) {
      updateEntryField(field.name, 'updatedAt', new Date().toISOString())
      setFloatingMode(null)
    }
  }, [componentDisabled, field.name, updateEntryField, setFloatingMode])

  const handleFloatingCancel = useCallback(() => {
    updateEntryField(field.name, 'content', initialContentRef.current)
    setFloatingMode(null)
  }, [field.name, updateEntryField, setFloatingMode])

  const handleFloatingExpand = useCallback(() => {
    setFloatingMode(null)
    setEditingMode(field.key, true)
  }, [field.key, setFloatingMode, setEditingMode])

  return (
    <div id={entryAnchor} className='Journal__entry'>
      {!componentDisabled && !anyEditingActive ? (
        <Button
          className='Journal__edit'
          htmlType='button'
          type='link'
          icon={<EditOutlined />}
          onClick={() => setFloatingMode(field.key)}>
          <span className='Journal__edit-label'>
            {t('common.actions.edit')}
          </span>
        </Button>
      ) : null}

      <JournalEntryBodyPreview
        content={content ?? ''}
        entryAnchor={entryAnchor}
        createdAt={createdAt}
        updatedAt={updatedAt}
      />

      <JournalEntryFloatingEditor
        open={isFloating}
        fieldName={field.name}
        onSave={handleFloatingSave}
        onCancel={handleFloatingCancel}
        onExpand={handleFloatingExpand}
      />

      <JournalEntryEditModal
        open={editing}
        fieldName={field.name}
        draftContent={draftContent}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
        onDelete={() => deleteEntry(field.name)}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify the build is clean**

```bash
npm run build 2>&1 | head -40
```

Expected: no type errors.

- [ ] **Step 3: Verify formatting**

```bash
npm run format:check
```

Expected: no errors. If there are any, run `npm run format` and re-check.

- [ ] **Step 4: Smoke test in the browser**

Start the dev server (`npm run dev`) and verify:

1. Clicking the edit pencil on a journal entry opens the floating panel in the bottom-right corner.
2. Other entries' edit buttons disappear while the panel is open.
3. Typing in the panel updates the entry (visible in the journal on save).
4. Cancel restores the original content.
5. Cmd/Ctrl+Enter saves.
6. The collapse toggle hides the textarea and footer, leaving only the header bar.
7. The expand button (⤢) closes the floating panel and opens the full modal with the content intact.
8. Adding a new entry opens the floating panel (not the full modal).
9. Scrolling the page while the floating panel is open works freely.

- [ ] **Step 5: Commit**

```bash
git add src/components/Journal/JournalEntry.tsx
git commit -m "feat: wire JournalEntry to floating editor"
```
