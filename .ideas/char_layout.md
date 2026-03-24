## Goal

It’s important that the character sheet be fast and easy to use because it’s the one that’s always open and used throughout the game. The more friction there is, the less enjoyable the game will be to play.

I think it will be interesting to create some tabs within that page. Top of my head:

- Identité & Stats
- Cartographie (including the clock, because that’s how the game loop goes: move the clock + move on the map)
- Inventaire & Grimoire
- Journal (see `notes.md`)
- Outils (we’re going to move the dice roll/card draw here, because they’re not useful on the home page)

## Requirements

- It is important that the proper notes system gets built before doing this feature (see `notes.md`).
- Each tab should be its own React component.
- We shouldn’t lose content when switching tabs, and we shouldn’t need to save progress before switching tabs.

## Open questions

- I don’t know whether these tabs should be routes — I don’t think so. The reason I’m saying this is because the whole character sheet acts as a gigantic form, and we don’t want to manage sub-forms for individual sections, I think it would be complicated maybe? So perhaps it’s better if the tab navigation is strictly cosmetic.
