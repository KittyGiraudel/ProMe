# Character death state

This document describes the "dead Protector" behavior: status model, frozen sheet constraints, and library rendering.

## Scope

- Add a persistent `lifeStatus` on `Character` (`alive` or `dead`).
- Allow marking a Protector as dead from the sheet.
- Allow reviving a dead Protector from the sheet.
- Freeze dead Protectors in read-only mode.
- Keep dead Protectors visible in the library with a dedicated visual treatment.

## Domain and persistence

- `src/lib/character/types.ts` adds `lifeStatus`.
- `src/lib/character/model.ts` normalizes status with `alive` as fallback/default.
- `src/lib/character/lifeStatus.ts` centralizes:
  - status normalization,
  - dead checks,
  - update freeze rule (`canPersistCharacterUpdate`).
- `src/lib/character/store/localStorageStore.ts` blocks writes that mutate an existing dead character.
  - Idempotent saves for dead payloads are still accepted.

## Sheet behavior (`/characters/[id]`)

- Alive sheet:
  - regular editing remains available,
  - new action: **Mark as dead**.
- Dead sheet:
  - shows explicit readonly warning,
  - disables form editing and mutation actions,
  - hides save and mark-dead actions,
  - shows **Revive** action,
  - still allows export.

Mutation guards are enforced both at UI-action level and at store save level.

## Library behavior (`/characters`)

- Dead Protectors stay in the list.
- Dead cards show a skull symbol and muted styling.
- Dead status text is displayed in card actions/details.

## Tests

- `src/lib/character/model.test.ts`
  - default status is `alive`,
  - invalid legacy status normalizes to `alive`.
- `src/lib/character/store/localStorageStore.test.ts`
  - dead character mutation is rejected,
  - idempotent save for dead payload remains valid.
