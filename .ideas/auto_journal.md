# Auto journal

We need to create a new setting to automatically create a new journal entry when moving on the map. In a way, it’s a little similar to our existing setting to automatically advance the clock when moving on the map, but extended to the journal. I still think they need to be distinct settings though.

This should make the gameplay loop quite a bit simpler: you move on the map, the clock auto advances (if enabled), the journal gets auto-created (if enabled), and you just have to fill in the blanks.

When enabled, here is what should happen when the player moves on the map:

1. A new journal entry should be created. Its phase + slice should be prefilled with the current data + 1 slice. This is important: if the clock is currently on slice 1, then the new entry should be created for slice 2, since it marks a new moment of the day.
2. The content should be prefilled from a translation string template found below.

French:

> # De {curr} à {next}
>
> _Narrez les aventures de votre périple ici._

English:

> # From {curr} to {next}
>
> _Write down your adventures over here._

## Nice to have

As a nice-to-have, we could consider having a slightly different template when entering an unexplored cell, discovering a biome.

French:

> # De {curr} à {next}
>
> - Découverte du biome « {biomeName} »
>
> _Narrez le reste des aventures de votre périple ici._

English:

> # From {curr} to {next}
>
> - Discovered {biomeName}
>
> _Write down your other adventures over here._
