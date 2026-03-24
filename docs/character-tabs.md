# Character sheet tabs

This document describes the phase-4 tabbed layout of the character sheet in `/characters/[id]`.

## Scope

- Tabs are cosmetic (single route, no nested routes).
- The sheet keeps one shared Ant Design `Form` instance for all sections.
- Unsaved edits persist when switching tabs and continue to be protected by the unsaved-navigation guard.
- Tab sections are split into dedicated, atomic React components.

## Tab structure

`CharacterSheetClient` now renders five tabs:

1. **Identity/Stats**
   - `IdentityCard`
   - `CharacteristicsCard`
   - `Danger` block with lifecycle action (`mark dead`)
2. **Cartography**
   - `MapCard`
   - `ClockCard` (rendered below map)
3. **Inventory/Spellbook**
   - `InventoryCard` in `Form.List(name='inventory')`
   - `SpellbookCard` in `Form.List(name='spellbook')`
4. **Journal**
   - `NotesCard` in `Form.List(name='journalEntries')`
5. **Tools**
   - `DiceRoll`
   - `CardDraw`

Section components live under `src/app/characters/[id]/tabs/`.

## Persistence and navigation behavior

- Tabs use `destroyOnHidden={false}` and each pane uses `forceRender: true`, so field registration and in-memory values remain available across switches.
- The unsaved guard remains centralized in `useCharacterSheetForm` (`form.isFieldsTouched()`), so tab switches do not require a save.
- Hash targets for map cells (`#map-...`) switch the active tab to cartography, preserving journal-to-map navigation behavior.
- Save/export controls are exposed in the sheet header for quick access while editing.

## Implementation notes

- Dead-protector readonly behavior is unchanged: the form is disabled and mutation actions remain guarded.
- Active-tab synchronization logic is extracted from `CharacterSheetClient` into `useCharacterSheetActiveTab`.
- Inventory/spellbook/journal add/remove handlers stay colocated with their tab section components but share the same form state.
