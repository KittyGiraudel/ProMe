# Character creation route (`/characters/new`)

This document covers the dedicated character-creation flow introduced in phase 6 of the roadmap.

## Goal

Keep character creation simple and isolated from full sheet editing:

- creation now happens on `/characters/new`,
- editing remains on `/characters/[id]`,
- create UI only collects identity fields,
- sheet-only concerns (map, inventory, clocks, unsaved-navigation logic) stay out of creation.

## Routing and UI split

- `src/app/characters/page.tsx` renders the library.
- `src/app/characters/CharacterLibraryClient.tsx` now sends "Créer un personnage" to `/characters/new`.
- `src/app/characters/new/page.tsx` renders `CharacterCreateClient`.
- `src/app/characters/new/CharacterCreateClient.tsx` owns the minimal creation form.
- `src/app/characters/[id]/CharacterSheetClient.tsx` is now edit-only.

## Create form contract

Creation currently collects:

- `name`,
- `archetype`,
- optional `gender`.
- optional `inheritFromCharacterId` (existing Protector to inherit memories from).

`IdentityCard` is reused for identity fields, and a dedicated inheritance card handles optional memory source selection.

Create submit flow:

1. Resolve the optional inheritance source by id from the character store.
2. Build a `Character` from identity values (`createCharacterFromIdentity`), and if a source is selected, copy:
   - full `map` state (position + all cells),
   - full `journalEntries` collection.
3. Persist through `store.save`.
4. Navigate to `/characters/<id>`.

Notes:

- Inheritance eligibility is currently broad (`any protector`).
- Dead-only filtering is intentionally deferred to a future settings slice.

Cancel flow:

- Return to `/characters` without persisting.

## Notes for future phases

- Keep create-only logic in `src/app/characters/new/` hooks/utilities.
- Avoid importing sheet cards/logic in creation screens unless they remain strictly identity-level.
- If inheritance/backstory steps are added later, extend create route internals before touching sheet editor flow.
