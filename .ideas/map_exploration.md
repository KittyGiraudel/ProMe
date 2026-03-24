## Context

From a gameplay perspective, when entering an unexplored tile, you roll 1D6 to determine what biome this tile is from:

1. Forêt des Ombres (3)
2. Plaines Inondées (3)
3. Jungle de Champignon (2)
4. Mer Champêtre (3)
5. Désert Silencieux (2)
6. Jardins Titanesques (3)

Once done, the player needs to determine the shape of the whole biome. Some biomes use 2 tiles, some 3 (indicated in parentheses in the list above).

## Goal

### Random biome

There should be an additional item menu in the biome context menu of a tile to roll at random. This way you can enter a new tile and randomize the biome selection.

This should inject a notification saying the player discovered biome XYZ, and that they need to mark the additional X tiles from this biome.

### Mouse actions

I think to make the map easier to navigate, we should:

- Move on double-click (if possible)
- Open context menu on right click
- Prevent text selection on cells (can happen, it looks odd)
- Disable “Effacer la case” if already pristine
- Organize the context menu in 2 sections: one for marking (biome/icone), and one for actions (move/reset)
