<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## LSDP project docs

- **[Inhabitant builder](docs/inhabitant-builder.md)** — Inhabitant generator: book-aligned rolls, `InhabitantRoll`, URL query `i`, rerolls, and UI wiring. Read this before changing `src/lib/inhabitant/` or the generator route.
- **[Village builder](docs/village-builder.md)** — Village generator: `VillageRoll` card resolution, `v`/`o`/`race` URL state, owners, duplicate grouping, and rerolls. Read this before changing `src/lib/village/`, `src/components/VillageSummary/`, or the village generator route.
- **[Character manager](docs/character-manager.md)** — Character lifecycle and storage: draft vs saved modes, `character` model/store, import/export, and unsaved-navigation guards. Read this before changing `src/app/characters/` or `src/lib/character/`.
