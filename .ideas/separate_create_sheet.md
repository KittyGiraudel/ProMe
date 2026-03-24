## Context

Right now creating a new Protector character goes through the same path as the character sheet editing. It generates a unique ID in the URL, uses the same component, and everything.

## Goal

Have a separate path + component for the creation page (`/characters/new`). That’s going to be better as the character sheet page will be complicated, while the new character creation will be very simple (couple fields + inheritance — see `inheritance.md`). They don’t have to be in the same components (I’d argue they shouldn’t be).

The identity card component can be reused of course, since it’s shared between create and edit, but that should basically be the only one.
