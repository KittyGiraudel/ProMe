## Goal

We have solved links _from_ the journal _to_ the map. Now, I’d like us to do the opposite. Have links _in_ the map, _to_ the journal.

I would also like this to be automatic, the same ways links from the journal to the map are. So for a given cell, I would like us to build a list of all the journal entries that mention it.

Then in the “Actions” section of the context menu, have a “Journal” item, which opens a sub-menu that lists the relevant journal entries. You can then click on any to open the journal at the right entry.

## Open questions

- Since entries are long and don’t have a title, knowing how to display them in that menu is a challenge. I think a combination of the first 20–30 chars + the creation date is probably a decent idea. We need to see how that looks.

- Should we limit the amount of entries listed? Maybe to last 5 or so. And if there are more, we can add “+ … X older entries” or something?

- If we’re concerned about performance building that index of cells -> journal entries (and vice versa?), we could maintain that in a context, and keep that automatically updated on journal updates.

- We need to consider map sheets, as usual, and this is difficult. For instance, if I’m on E13, and I look for all mentions of E13 in the journal, are they all about that sheet I’m on? I’d say we shouldn’t overthink it too much for now, but may need to revisit that later.
