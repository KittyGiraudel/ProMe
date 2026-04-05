# Picture-in-picture journal

It could be pretty cool to use the Picture-in-Picture API (when supported) to maintain the journal textarea in the bottom-right of the screen. The reason it would be nice is that you could then scroll through the page and look at the map, the stats, the inventory and whatnot (or even change pages in multi-page mode) while still editing the journal entry.

## Open questions

- How do we scope that to PiP supported browsers only?
- How do we render React inside a PiP window?
- How do we have a clean little UI that works well in PiP (probably need the textarea + save button inside it)?
