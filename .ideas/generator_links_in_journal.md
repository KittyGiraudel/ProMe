## Context

Right now, pasting a link to a village/NPC generator in a journal entry enriches the link with a summary of the data. This is great, but it leaves a lot of data out, especially for villages.

## Goal

A link to a village/NPC generator should be transformed into a button styled as a link that opens a modal. That modal contains a read-only view of the generator (or a similar view, displaying all the data about the NPC/village) + a link to open it in the generator (maybe in a new tab).

This way, we can click these links while browsing the journal, get the info in dialogs, and if needed open it in the generator. This should help not switching context too much.

Maybe we could make good use of the `Descriptions` component from Ant Design that looks quite neat.
