<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## LSDP project docs

- **[Inhabitant builder](docs/inhabitant-builder.md)** — Inhabitant generator: book-aligned rolls, `InhabitantRoll`, URL query `i`, rerolls, and UI wiring. Read this before changing `src/lib/inhabitant/` or the generator route.
- **[Village builder](docs/village-builder.md)** — Village generator: `VillageRoll` card resolution, `v`/`o`/`f` URL state, owners, duplicate grouping, and rerolls. Read this before changing `src/lib/village/`, `src/components/VillageSummary/`, or the village generator route.
- **[Character manager](docs/character-manager.md)** — Character lifecycle and storage: draft vs saved modes, `character` model/store, import/export, and unsaved-navigation guards. Read this before changing `src/app/characters/` or `src/lib/character/`.
- **[Character creation route](docs/character-creation-route.md)** — Dedicated `/characters/new` flow, minimal identity form, and separation from sheet editing concerns. Read this before changing `src/app/characters/new/` or create navigation in `src/app/characters/`.
- **[Map exploration UX](docs/map-exploration.md)** — Map tile interactions: right-click context menu, double-click movement, random biome roll guidance, and map menu grouping. Read this before changing `src/components/MapDisplay/` or map behavior in `src/components/CharacterSheet/MapCard.tsx`.
- **[Settings](docs/settings.md)** — Global app settings (`/settings`), local storage schema, provider/hook wiring, and adaptive sheet night-mode preference. Read this before changing `src/app/settings/`, `src/app/contexts/SettingsContext.tsx`, or `src/lib/settings/`.
