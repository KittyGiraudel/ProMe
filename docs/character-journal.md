# Character journal

This document describes the journal system that replaces the previous single free-text notes field on character sheets.

## Scope

- A character stores a `journalEntries` collection instead of `notes`.
- Entries are free-form and user-created (no enforced turn semantics).
- Entries render in read mode by default and can be switched to edit mode inline.
- Rich transforms (tile links, badges, character links) are intentionally deferred.

## Data model

`src/lib/character/types.ts`:

- `JournalEntry` includes `id`, `content`, `createdAt`, `updatedAt`.
- `Character` includes `journalEntries: JournalEntry[]`.

`src/lib/character/model.ts` normalization guarantees:

- Empty entries (blank `content`) are dropped.
- Missing `id`/timestamps are auto-filled.
- Legacy payloads with a `notes: string` field are migrated into a single journal entry when `journalEntries` is absent.

## UI architecture

Primary UI lives in `src/components/CharacterSheet/NotesCard.tsx`:

- `Form.List`-driven collection editing.
- Entries are displayed as a stacked readable document.
- Per-entry hover affordance enables inline edit mode for one entry.
- Markdown preview is the default presentation and uses the same renderer as saved read mode.
- New entries open directly in edit mode.
- Non-empty entry deletion requires confirmation.
- Read mode shows created/updated timestamps on one line for each entry.
- Each entry has a permalink anchor based on its entry ID.

State extraction:

- `useJournalEntryViewModes` keeps preview/edit state outside presentation markup.

## Markdown rendering and extension path

Renderer wrapper: `src/components/Markdown/JournalMarkdown.tsx`  
Configuration utilities: `src/lib/markdown/journalMarkdown.ts`

Current setup:

- Uses `react-markdown` with `remark-gfm`.
- Applies optional transform pipeline before rendering.

Extension path for future slices:

1. Add markdown transforms through `createJournalMarkdownRendererConfig({ transforms })`.
2. Add custom node renderers through `components`.
3. Add richer plugin stacks in config when map-link/tag transforms are ready.

This keeps renderer concerns isolated from form UI and makes incremental enhancements low-risk.
