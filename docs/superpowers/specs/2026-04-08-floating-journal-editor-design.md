# Floating Journal Editor — Design Spec

**Date:** 2026-04-08  
**Status:** Approved

## Problem

The journal is the primary activity in a ProMe session. Players write entries incrementally — scribble a hex move, look at the map, write the encounter outcome, check stats, write again. The current edit flow opens a full-width modal that blocks the page, forcing the player to close it each time they want to consult anything else on the sheet. A persistent, non-blocking floating editor would remove that friction.

## Scope

- Single-page mode only (multi-page mode may be removed in the future).
- The floating panel shows only a textarea + save/cancel. Phase/slice fields and the preview tab remain full-modal-only features.
- No PiP API involvement.

## Approach

A dedicated `JournalEntryFloatingEditor` component — a fixed-position panel anchored to the bottom-right of the viewport, Gmail compose-style. It renders via a React portal so it is never clipped by parent overflow or z-index stacking contexts.

The existing `JournalEntryEditModal` is unchanged and remains the "full editor." The floating panel promotes to it via an expand button.

## State Management

`useJournalEntryViewModes` gains a second tracker alongside the existing modal one:

```ts
// new additions
floatingFieldKey: number | null   // which entry is in floating mode
setFloatingMode(fieldKey: number | null): void
isFloating(fieldKey: number): boolean
```

`floatingFieldKey` is a single value (not a map) — only one entry can be in floating mode at a time. The existing `editingByFieldKey` map is unchanged.

Both `isFloating`/`setFloatingMode` and the existing `isEditing`/`setEditingMode` are threaded down:  
`JournalCardInner` → `Journal` → `JournalEntry`

## Component Structure

### `JournalEntryFloatingEditor`

```
JournalEntryFloatingEditor  (position: fixed, bottom-right, portal to document.body)
├── header bar
│   ├── label ("Journal")
│   ├── expand button ⤢  →  onExpand
│   └── collapse toggle −/+  →  local isCollapsed state (CSS only, no form impact)
├── Form.Item name={[fieldName, 'content']}
│   └── Input.TextArea
└── footer
    ├── Cancel button  →  onCancel
    └── Save button    →  onSave
```

Props: `open`, `fieldName`, `onSave`, `onCancel`, `onExpand`

Collapse is a local `useState` that hides the textarea and footer via a CSS class. The form field value is unaffected.

### Changes to `JournalEntry`

- Edit button calls `setFloatingMode(field.key)` instead of `setEditingMode(field.key, true)`.
- A second `useEffect` mirrors the existing one for the modal: captures `initialContentRef.current` when `isFloating` becomes `true`.
- The same `initialContentRef` is reused for both modes; they are mutually exclusive, so there is no conflict.
- `JournalEntryFloatingEditor` is rendered (open when `isFloating`) alongside the existing `JournalEntryEditModal`.

## Interaction Flows

**Open:** Click the edit button on a journal entry → floating panel opens for that entry. While the floating panel is open (or the full modal), all other entries' edit buttons are hidden so only one entry can be edited at a time.

**Auto-open on add:** The `editNewlyAddedEntry` effect in `useJournalEntryViewModes` currently calls `setEditingMode` (full modal). Change it to call `setFloatingMode` so newly added entries also open in the floating panel.

**Save:** `updateEntryField(field.name, 'updatedAt', new Date().toISOString())` + `setFloatingMode(null)`. Supports Cmd/Ctrl+Enter shortcut (same as the modal).

**Cancel:** `updateEntryField(field.name, 'content', initialContentRef.current)` + `setFloatingMode(null)`.

**Collapse:** Toggles local `isCollapsed` state. Panel title bar remains visible; textarea and footer hidden. Content preserved.

**Expand:** `setFloatingMode(null)` + `setEditingMode(field.key, true)`. Whatever was typed is already in the form field, so the modal opens with no data loss.

## CSS / Positioning

New CSS file `JournalEntryFloatingEditor.css`:

- `position: fixed; bottom: 1em; right: 1em` — stays anchored to the viewport.
- `z-index` above page content, below Ant Design modals (Ant Design modals use z-index 1000; target ~900).
- Width: fixed (e.g. `min(480px, calc(100vw - 2em))`) so it's usable on smaller screens.
- Collapse transition: `max-height` CSS transition on the body.
- `pointer-events: none` on the page is NOT applied — the panel is non-modal; the page behind it remains fully interactive.

## i18n

New keys needed under `characters.journal`:

| Key | FR value (proposed) |
|-----|---------------------|
| `floating_editor_title` | `Journal` |
| `floating_editor_expand` | `Ouvrir l'éditeur complet` |
| `floating_editor_collapse` | `Réduire` |
| `floating_editor_restore` | `Restaurer` |

## Out of Scope

- Multi-page mode support (single-page only).
- Picture-in-Picture API.
- Draggable/repositionable panel.
- Editing multiple entries simultaneously.
