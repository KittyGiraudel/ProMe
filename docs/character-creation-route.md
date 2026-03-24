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

`IdentityCard` is reused for those fields, with archetype-power hint hidden for the create page to keep UI focused.

Create submit flow:

1. Build a `Character` from identity values (`createCharacterFromIdentity`).
2. Persist through `store.save`.
3. Navigate to `/characters/<id>`.

Cancel flow:

- Return to `/characters` without persisting.

## Notes for future phases

- Keep create-only logic in `src/app/characters/new/` hooks/utilities.
- Avoid importing sheet cards/logic in creation screens unless they remain strictly identity-level.
- If inheritance/backstory steps are added later, extend create route internals before touching sheet editor flow.
