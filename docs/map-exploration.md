# Map Exploration UX

This document covers the map interaction behavior used in the character sheet map card.

## Interaction model

- **Select tile**: left click toggles tile selection.
- **Context menu**: right click opens the tile context menu.
- **Quick move**: double-click moves to that tile when it is adjacent to the current position.
- **Selection guard**: map cells disable text selection to avoid accidental highlight artifacts while navigating.

## Context menu groups

The tile menu is split into two groups:

- **Marquage**
  - biome submenu
  - random biome roll (`1D6`)
  - icon picker / icon clear
- **Actions**
  - move to tile (adjacent only)
  - clear tile (disabled when tile is pristine)

## Random biome roll

Random biome uses a fixed roll table aligned with game notes:

1. `shadowForest` (3 tiles)
2. `floodedPlains` (3 tiles)
3. `mushroomJungle` (2 tiles)
4. `fieldSea` (3 tiles)
5. `silentDesert` (2 tiles)
6. `giganticGardens` (3 tiles)

After rolling from the tile menu:

- the tile is assigned the rolled biome immediately
- a notification explains which biome was discovered
- the notification includes guidance about how many additional tiles must be marked for that biome shape

Implementation is centralized in `src/lib/map/randomBiome.ts`, with:

- rulebook data in `src/lib/constants/biomeRollTable.ts`
- random selection via shared RNG helper `pickRandom` in `src/lib/rng.ts`
