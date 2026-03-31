# Journal Pagination Design

**Date:** 2026-03-31
**Status:** Approved

## Overview

Add page-based pagination to the journal timeline so that characters with many entries don't render them all at once. Shows 10 entries per page with Ant Design `Pagination` controls below the timeline.

## Architecture

All pagination logic lives in `JournalCardInner` (`src/components/PageCharacterSheet/JournalCard.tsx`). `Journal` remains a pure renderer — it receives a pre-sliced `fields` array and requires no changes.

### Data flow

1. `JournalCardInner` holds `currentPage` state (default `1`).
2. Before rendering, it derives `pagedFields`:
   - If `settings.journal.timelineReverseChronological` is `true`, reverse a copy of `fields` so page 1 shows the visually-first (newest) entries.
   - Slice: `fields.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)`.
3. `pagedFields` is passed to `Journal` in place of the full `fields` array.
4. `<Pagination>` is rendered below `<Journal>` with `total={fields.length}`, `pageSize={PAGE_SIZE}`, `current={currentPage}`, `onChange={setCurrentPage}`.

`PAGE_SIZE = 10` is a module-level constant in `JournalCard.tsx`.

## Component changes

### `JournalCard.tsx`

- Add `PAGE_SIZE = 10` constant at module level.
- Add `currentPage` / `setCurrentPage` state to `JournalCardInner`.
- Derive `pagedFields` from `fields` using the reverse + slice logic above.
- Pass `pagedFields` to `<Journal>` instead of `fields`.
- `onAddEntry`: call `add(...)`, then `setCurrentPage(1)`.
- `onRemoveEntry`: after calling `remove(index)`, clamp `currentPage` to `max(1, newTotalPages)` where `newTotalPages = Math.ceil((fields.length - 1) / PAGE_SIZE)`.
- Render `<Pagination>` below `<Journal>` inside a wrapper `div.Journal__pagination`. Hide it when `fields.length <= PAGE_SIZE`.

### `Journal.tsx`

No changes.

### `Journal.css`

Add `.Journal__pagination` with a top margin to space the controls from the timeline.

## Edge cases

| Scenario | Behaviour |
|---|---|
| Fewer than 10 entries | `Pagination` hidden; behaviour identical to today |
| New entry added | Page resets to `1`; new entry is visible on page 1 regardless of chronological setting |
| Delete last entry on a page | `currentPage` is clamped to the new last page |
| Reverse-chronological enabled | `fields` is reversed before slicing; page 1 always shows the visually-first entries |
| Permalink anchor links | Only work if the target entry is on the current page — known limitation, acceptable for now |

## Out of scope

- Configurable page size (fixed at 10).
- URL-based page persistence.
- Any changes to `Journal.tsx` or `JournalEntryEditModal.tsx`.
