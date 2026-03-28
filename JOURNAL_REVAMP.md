LSDP being a solo TTRPG, the journal is important. It’s basically where the role playing happens, so it’s critical that it‘s both easy to write in the journal, _and_ pleasant to read.

This document gathers a series of improvement we need to make. Let’s do them one by one, and allow me to review, adjust and commit in between.

## Consolidate Markdown embellishment

A big part of the journal is that it gets automatically embellished to be more pleasant to read. I think the code for this evolved organically and is not very easy to maintain, so we should start with that.

My idea is that we should basically have one way to map regular expressions to React component. This way, we can say “match that, capture what is needed, and replace it with this component.” This should be flexible enough to handle all sorts of things (both aesthetic and functional), and should be unit tested.

Feel free to ignore everything that’s currently in place and rewrite that part from scratch.

## Replace tildes with hyphens in the village generator

I am unsure why we used tildes in the village generator identifier, but it’s not great because when pasting a link in Markdown, these tildes end up being interpretated as strikethrough. So I think we should just replace them with hyphens.

## Replace links with tokens

Right now, we support pasting complete links to the village or NPC generators. It’s not amazing because these URLs end up containing a locale, and also URLs could change or break, so having them hard-coded in journal entries is not good.

Instead, we should come up with a syntax for that. Here is my proposal:

- `{village/<id>}`
- `{npc/<id>}`

The advantage of curly braces is that they are not used in Markdown, so that will avoid any clash with Markdown syntax.

## Add support for protector links

Using the system above, it would be cool to support links to other protectors. It could use `{protector/<id>}` as a token, and replace it with a one liner like:
`{gender_symbol} {name} ({archetype})` the the link would go to the character sheet of that protector.

## Improve the UI

When editing a journal entry, I’d like it to be a in a full page (or almost full page) dialog. It would have room for a sidebar on the right side, that would contain the Markdown cheatsheet, with all the automatic replacements. This way it guides the user on how to create beautiful Journal entries.

The rest of the dialog would be largely taken by the textarea. And above it, we’d have 2 tabs: one to edit, and one to preview. And in the preview, we’d render the entry with all the embellishment.

The dialog would have actions at the bottom: save (to close), cancel (to undo edits), and delete (with confirm).
