# Journal Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add page-based pagination (10 entries/page, Ant Design `Pagination`) to the journal timeline, keeping `Journal.tsx` unchanged.

**Architecture:** All pagination state and slicing lives in `JournalCardInner`. It derives `pagedFields` (a reversed + sliced copy of `fields`) and passes it to `Journal` in place of the full list. `Pagination` renders below `Journal` and is hidden when total entries ≤ 10.

**Tech Stack:** React `useState`/`useMemo`/`useCallback`, Ant Design `Pagination`, Vitest (no component tests — not in project's testing pattern)

---

### Task 1: Add CSS for the pagination controls

**Files:**
- Modify: `src/components/Journal/Journal.css`

- [ ] **Step 1: Add the `.Journal__pagination` rule**

Append to the bottom of `src/components/Journal/Journal.css`:

```css
.Journal__pagination {
  margin-top: 1em;
  text-align: center;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Journal/Journal.css
git commit -m "style: add Journal__pagination spacing"
```

---

### Task 2: Add pagination state and sliced fields to `JournalCardInner`

**Files:**
- Modify: `src/components/PageCharacterSheet/JournalCard.tsx`

- [ ] **Step 1: Add imports and the PAGE_SIZE constant**

At the top of `src/components/PageCharacterSheet/JournalCard.tsx`, update the imports and add the constant:

```tsx
'use client'

import { Card, ConfigProvider, Empty, Form, FormListFieldData, Pagination } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { Journal } from '@/components/Journal/Journal'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { randomId } from '@/lib/character/model'

const PAGE_SIZE = 10
```

- [ ] **Step 2: Add `currentPage` state and `pagedFields` to `JournalCardInner`**

Inside `JournalCardInner`, after the existing `const` declarations, add:

```tsx
const [currentPage, setCurrentPage] = useState(1)

const pagedFields = useMemo(() => {
  const ordered = settings.journal.timelineReverseChronological
    ? [...fields].reverse()
    : fields
  return ordered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
}, [fields, currentPage, settings.journal.timelineReverseChronological])
```

- [ ] **Step 3: Wrap `onAddEntry` to reset page on new entry**

Replace the existing `addEntryButton` onClick with a wrapped handler:

```tsx
const handleAddEntry = useCallback(() => {
  onAddEntry()
  setCurrentPage(1)
}, [onAddEntry])
```

Update `addEntryButton` to use `handleAddEntry`:

```tsx
const addEntryButton = (
  <Button onClick={handleAddEntry} htmlType='button'>
    {t('characters.journal.add_journal_entry')}
  </Button>
)
```

- [ ] **Step 4: Wrap `onRemoveEntry` to clamp page after deletion**

```tsx
const handleRemoveEntry = useCallback(
  (index: number | number[]) => {
    onRemoveEntry(index)
    const removedCount = Array.isArray(index) ? index.length : 1
    const newLength = fields.length - removedCount
    const newTotalPages = Math.max(1, Math.ceil(newLength / PAGE_SIZE))
    setCurrentPage(prev => Math.min(prev, newTotalPages))
  },
  [onRemoveEntry, fields.length]
)
```

- [ ] **Step 5: Pass `pagedFields` and `handleRemoveEntry` to `Journal`**

Update the `<Journal>` render call:

```tsx
<Journal fields={pagedFields} form={form} deleteEntry={handleRemoveEntry} />
```

- [ ] **Step 6: Commit**

```bash
git add src/components/PageCharacterSheet/JournalCard.tsx
git commit -m "feat: add pagination state and field slicing to JournalCardInner"
```

---

### Task 3: Render the `Pagination` component

**Files:**
- Modify: `src/components/PageCharacterSheet/JournalCard.tsx`

- [ ] **Step 1: Add `Pagination` below `Journal` in the card body**

In `JournalCardInner`, update the JSX that renders the journal inside the `<Card>`. Replace:

```tsx
{fields.length === 0 ? (
  <Empty description={t('characters.journal.empty')} />
) : (
  <Journal fields={pagedFields} form={form} deleteEntry={handleRemoveEntry} />
)}
```

with:

```tsx
{fields.length === 0 ? (
  <Empty description={t('characters.journal.empty')} />
) : (
  <>
    <Journal fields={pagedFields} form={form} deleteEntry={handleRemoveEntry} />
    {fields.length > PAGE_SIZE && (
      <div className='Journal__pagination'>
        <Pagination
          current={currentPage}
          total={fields.length}
          pageSize={PAGE_SIZE}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>
    )}
  </>
)}
```

- [ ] **Step 2: Verify the full updated `JournalCardInner` function looks correct**

The complete `JournalCardInner` should read:

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
  const { componentDisabled } = ConfigProvider.useConfig()
  const { settings } = useSettings()
  const t = useTranslations()
  const form = Form.useFormInstance()
  const buttonInHeader = settings.journal.timelineReverseChronological
  const buttonInFooter = !buttonInHeader
  const canAddEntry = !componentDisabled

  const [currentPage, setCurrentPage] = useState(1)

  const pagedFields = useMemo(() => {
    const ordered = settings.journal.timelineReverseChronological
      ? [...fields].reverse()
      : fields
    return ordered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  }, [fields, currentPage, settings.journal.timelineReverseChronological])

  const handleAddEntry = useCallback(() => {
    onAddEntry()
    setCurrentPage(1)
  }, [onAddEntry])

  const handleRemoveEntry = useCallback(
    (index: number | number[]) => {
      onRemoveEntry(index)
      const removedCount = Array.isArray(index) ? index.length : 1
      const newLength = fields.length - removedCount
      const newTotalPages = Math.max(1, Math.ceil(newLength / PAGE_SIZE))
      setCurrentPage(prev => Math.min(prev, newTotalPages))
    },
    [onRemoveEntry, fields.length]
  )

  const addEntryButton = (
    <Button onClick={handleAddEntry} htmlType='button'>
      {t('characters.journal.add_journal_entry')}
    </Button>
  )

  return (
    <>
      <Card
        title={t('characters.journal.notes_section')}
        extra={canAddEntry && buttonInHeader ? addEntryButton : undefined}
        actions={canAddEntry && buttonInFooter ? [addEntryButton] : undefined}>
        {fields.length === 0 ? (
          <Empty description={t('characters.journal.empty')} />
        ) : (
          <>
            <Journal fields={pagedFields} form={form} deleteEntry={handleRemoveEntry} />
            {fields.length > PAGE_SIZE && (
              <div className='Journal__pagination'>
                <Pagination
                  current={currentPage}
                  total={fields.length}
                  pageSize={PAGE_SIZE}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </Card>
      <SettingsHint hintId='journal' />
    </>
  )
}
```

- [ ] **Step 3: Run the test suite to confirm nothing regressed**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/PageCharacterSheet/JournalCard.tsx
git commit -m "feat: render Pagination below journal timeline"
```
