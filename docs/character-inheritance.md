# Character inheritance (creation memories)

This document describes the phase 7 inheritance behavior added to character creation.

## Goal

When creating a new Protector on `/characters/new`, the player can optionally choose an existing Protector as a memory source. The new Protector then starts with inherited memories.

## Scope

- Inheritance is configured during creation only.
- Eligible source list is currently broad: any existing Protector.
- Selected source copies:
  - full `map` state (`currentPosition` and all `cells`),
  - full `journalEntries` collection.
- Other character fields are not inherited.

## Architecture

Creation route files:

- `src/app/characters/new/CharacterCreateClient.tsx`
  - Includes identity form + inheritance card.
- `src/app/characters/new/useInheritanceCandidates.ts`
  - Loads existing Protectors from the store and maps to select options.
- `src/app/characters/new/useCharacterCreate.ts`
  - Resolves selected source id and passes source character to creation utility.
- `src/app/characters/new/InheritanceCard.tsx`
  - Presentation-only card for inheritance field.

Domain utility:

- `src/lib/character/createFromIdentity.ts`
  - `createCharacterFromIdentity(identity, inheritedMemories?)` clones inherited map/journal data before passing to `createCharacter`.

## Behavior contract

- If no inheritance source is selected:
  - map defaults remain empty/default.
  - journal entries remain empty.
- If a source is selected:
  - source map/journal are copied as-is, entirely.
  - copied structures are cloned (no shared object/array references with source).

## Notes for future phases

- Dead-only eligibility is deferred to a future settings-driven policy.
- If more memory types are introduced, extend cloning in `createFromIdentity.ts` and keep creation UI optional.
