## Context

LSDP is a role playing game. There is a rulebook, and there is some guidance as to how to play, but at its core, it’s about world building, adventure, and creating a canonical lore. As such, it relies a lot on taking notes, as the Protector would, as they wonder the world.

This is doubly important when you consider that the future Protector — whomever they may be — will inherit their memories which are essentially the notes made by the player during the game (see death.md).

## Goal

I would like to consolidate the concept of notes from the game. Right now we have free text, which is a bit too vague and unappealing. So far, I have been writing in Google Docs, but it can be frustrating: I’m just fighting formatting, I have to keep applying various styles manually, etc.

I don’t have this fully formed in my head, but I think:

- We should use Markdown. It’s simple enough to write, and it can be rendered nicely and be extended with custom syntax which may be something we want. Therefore we should pick a Markdown renderer we can extend[^2].
- Notes should be a collection, where each turn in the game will map to one note entry[^1]. Think of it as a journal (I think we may want to call it like this actually).
- From a UI standpoint, you want to be able to switch between editing a note and viewing it, because the rendered version will be nicer, with little badges, links, formatting and more.

Nice to have:

- I think it could be cool to replace biome names mentioned in the notes with colored badges to make it nicer.
- It would be nice to automatically link map coordinates to the map section (maybe also select the cell in question).
- Links to the character builder could also be replaced with a little summary of the character (still as a link), this way you can easily reference someone just by dropping a link to the character builder and the renderer will make that tidy.
- I was thinking it could be cool to have a “zen mode” full screen editor for the notes. It doesn’t have to be its own page, it can just be a dialog that expand to cover the whole page.

## Open questions

- This may be tricky (from a UI perspective at least): I think it could be cool to be able to associate a journal entry to a map tile (or maybe even multiple actually). So that when browsing the map, you can click on a tile and jump to the journal entry where something happened. This would connect the map and the notes nicely.

[^1]: It may be tempting to ask “strictly one entry per turn, or allow free extra entries?” but the question is moot because the application doesn’t have a concept of “turns” per se. So the player can just create entries whenever.

[^2]: I am not sure what is the best Markdown library for that, so I would welcome suggestions.
