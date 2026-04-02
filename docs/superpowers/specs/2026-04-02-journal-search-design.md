# Journal Search — Design Spec

**Date:** 2026-04-02

## Overview

Add a text search/filter to the journal card. Players can type a keyword to narrow down which journal entries are displayed. Pagination applies to the filtered set.

## Scope

- Filter by entry text content only (no phase, slice, or date filtering for now)
- Clearing the input restores the full paginated view
- No matches shows an empty state with a distinct message from "no entries yet"
- Pagination operates on the filtered set, not the full set

## Data & Filtering Logic

A new `useJournalSearch(fields, journal)` hook in `src/components/PageCharacterSheet/` owns the search state and filtering.

- **Inputs:** `fields: FormListFieldData[]`, `journal: JournalEntry[]` (from `useWatchedJournal`)
- **Returns:** `{ searchTerm, setSearchTerm, filteredFields }`
- **Filtering:** case-insensitive substring match on `entry.content`
- When `searchTerm` is empty, `filteredFields === fields` (no filtering, no overhead)

`JournalCardInner` calls the hook, passes `filteredFields` to all pagination logic (replacing `fields`). It resets `currentPage` to 1 whenever `searchTerm` changes.

## UI

An Ant Design `Input.Search` component with `allowClear` prop, rendered as the first element inside the card body — above the timeline and empty state, below the card header. Position is fixed regardless of the chronological mode setting.

The add-entry button placement (header extra or footer actions) is unchanged.

## Empty States

Two distinct translation keys:

- `characters.journal.empty` — existing, for when there are no entries at all
- `characters.journal.search_empty` — new, for when search yields no matches (e.g. "No entries match your search")

## Translations

New keys needed in `messages/fr.json` and `messages/en.json`:

- `characters.journal.search_placeholder` — input placeholder text
- `characters.journal.search_empty` — no-results empty state message

## Testing

Unit tests for `useJournalSearch`:
- Empty search returns all fields
- Non-empty search filters correctly (case-insensitive)
- Search with no matches returns empty array
