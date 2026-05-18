# ProMe

[![Netlify Status](https://api.netlify.com/api/v1/badges/729fa5ef-c1d4-42b8-a7ea-e2ee45b47d50/deploy-status)](https://app.netlify.com/projects/prome-game/deploys)

Companion app for the solo TTRPG _The Protector’s Memories_ / _Les Souvenirs du Protecteur_. Keep it open while you play as a reference, helper, and way to track progress. Owning and using the rulebook is still required — ProMe does not replace it.

## Features

- **NPC generator** — Create inhabitants following the rulebook, save and revisit them later.
- **Town generator** — Generate villages following the rulebook, save and revisit them later.
- **Protector manager** — Create, update, import, export, and delete playable characters.
- **Character sheet** — One sheet per Protector, with:
  - Identity and stats (health, stamina, and related values)
  - Interactive map to explore, annotate, and move through biomes (with gathering tables where the rules apply)
  - Inventory and spell book
  - Markdown journal with embedded dice rolls, card draws, and map references
  - Built-in tools (d6, playing card deck, game clock)
  - Administrative actions (export, kill, delete, and more)
- **Biome reference pages** — Rulebook-aligned descriptions and gathering hints per biome.
- **Adaptive soundtracks** — Optional biome-aware background music and ambience ([TableTopAudio](https://tabletopaudio.com/)).
- **Settings** — App-wide preferences (including sound options).
- **FAQ, About, and Privacy** pages.
- **Progressive Web App** — Install on your home screen for a full-screen experience and offline use after the first visit.
- **Optional cloud backup** — Sign in with Google to sync character data across browsers and devices.

## Usage

Clone the repository, install dependencies, and start the development server. Node.js 24 or newer is required.

```sh
git clone git@github.com:KittyGiraudel/ProMe.git
cd ProMe
npm install
npm run dev   # http://localhost:3000
```

The production site is deployed on [Netlify](https://app.netlify.com/projects/prome-game/deploys).

## Browser support

The app works on modern desktop and mobile browsers. The **map module** relies on recent CSS features (for example `corner-shape`); for the best map experience, **Chrome** is recommended. Other browsers may show a warning and a simplified map layout.

## Data storage

By default, settings and character sheets are stored in your browser’s **local storage**. You can export a character as JSON at any time.

**Cloud sync is optional.** Sign in with Google (Netlify Identity) to back up characters to a remote database and retrieve them on another browser or device. The app works fully offline and without an account; only character data is synced — app settings stay local to each browser.

## Localization

The app is available in **French** and **English**. Each locale follows the wording of its official rulebook.

To add a language:

1. Add a JSON file in `messages/` named after the locale (for example `de.json`).
2. Copy keys from `messages/fr.json` and translate them.
3. Register the locale in `src/i18n/routing.ts`.

## Development

```sh
npm run build         # Production build
npm run lint          # ESLint
npm run format        # Biome formatter (write)
npm run format:check  # Biome formatter (check only)
npm run test          # Vitest
npm run test:coverage # Coverage report
```

## Acknowledgements

The game was created and designed by [Enzo Salviato](https://bsky.app/profile/desesperenzo.bsky.social) — all credits go to him. Ambient audio is provided by [TableTopAudio](https://tabletopaudio.com/). ProMe is an unofficial companion for digital play.
