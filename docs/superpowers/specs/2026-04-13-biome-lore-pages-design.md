# Biome Lore Pages — Design Spec

**Date:** 2026-04-13  
**Status:** Approved

## Overview

One lore page per biome, surfacing the book content (description, encounter table, gathering table) alongside the biome's audio tracks. The page has a cinematic full-viewport hero, with all content living below the fold.

Six biomes: `shadowForest`, `floodedPlains`, `mushroomJungle`, `fieldSea`, `silentDesert`, `titanGardens`.

## Routing

Pages live at `/[locale]/lore/[biomeId]`, e.g. `/fr/lore/shadow-forest`. The slug is the `BiomeId` value converted to kebab-case (e.g. `mushroomJungle` → `mushroom-jungle`) — English, consistent with the rest of the app's routing convention.

## Hero Section (full viewport height)

- **Background:** the existing `banner-{biome}.avif` image as a full-bleed background. Note: `titanGardens` has no banner image yet — a fallback (CSS gradient using the biome palette) is used until one is added.
- **Overlay:** a dark gradient over the image to ensure title legibility.
- **Biome name:** rendered in a custom font specific to that biome. The font is subset to only the characters present in the biome's localised name for performance. The position/alignment of the title may vary per biome (bottom-left default, adjustable via config).
- **Teaser:** the first sentence of the biome description, in italic serif, below the title. Muted opacity.
- **Scroll hint:** a small "Explorer ↓" label at bottom-right, very subtle.

### Per-biome custom fonts

Each biome gets its own typeface. The font is loaded with `unicode-range` subsetting (or build-time subsetting) restricted to the exact characters of the biome name in each locale. This keeps the font payload minimal (typically < 5 KB per biome).

Font selection is left to the author — the implementation just needs to support a `font` config entry per biome.

## Content Section (below the fold)

### Colour palette

The content section is always dark and immersive — it does **not** follow the app's light/dark theme toggle. The `LorePage` component sets `data-app-theme="dark"` on mount (via the existing `appThemeOverride` mechanism on `Layout`, or directly on the element) so Ant Design tokens don't interfere. All lore-specific colours are scoped under a `.LorePage` class and hardcoded independently of `--ant-*` tokens.

Each biome's content section derives a small palette of CSS custom properties from its `--biome-{id}-dark` token. These are defined in `src/components/PageLore/LorePage.css` under `[data-biome="…"]` selectors, following the existing pattern in `globals.css`:

| Token | Role | Example (shadowForest `#57446f`) |
|---|---|---|
| `--lore-bg` | Page background | `#130e1a` (dark token darkened ~60%) |
| `--lore-surface` | Cards, audio player, gather items | `#1e1528` (dark token darkened ~50%) |
| `--lore-border` | Subtle borders | `rgba(biome-light, 0.18)` |
| `--lore-accent` | Section labels, die numbers, border-left | `rgba(biome-light, 0.55)` |
| `--lore-text` | Body text | `rgba(255 255 255 / 0.72)` |
| `--lore-text-muted` | Teaser, hints, secondary | `rgba(255 255 255 / 0.45)` |

**WCAG 2.2:** `--lore-text` at 0.72 opacity on `--lore-bg` must achieve at least 4.5:1 contrast (AA for normal text). Verify each biome's palette at implementation time — adjust opacity or lightness if any fail. `--lore-text-muted` is used only for decorative / non-essential text (teaser, hints) and is exempt from the body-text threshold, but should still clear 3:1 for large text (AA Large).

Each section is separated by a labelled rule (`font-size: 12px`, `letter-spacing: .2em`, uppercase, `--lore-accent` colour).

### Description

Full prose from the book, split into paragraphs. Rendered in italic Georgia/serif at ~19px with generous line-height (1.9). Max-width ~720px. Source: `common.biomes.{biomeId}_description` translation key.

### Audio

Reuses the existing `AudioPlayer` component as-is. Wrapped in a lightly bordered container sized to fit (max-width ~480px). Layout: play/pause + restart buttons left, track name centred, volume slider right; progress bar row below. The biome prop is passed directly — track selection follows the existing `useBiomeTrack` logic.

### Encounters

A full-width table. Each row: die result (monospace, muted biome colour, fixed ~52px column) + full encounter text. Row separator is a very faint horizontal rule. Text uses `strong` for the bolded lead sentence (matching the markdown bold in translations) and `em` for italic asides.

Source: `common.encounters.{biomeId}` translation keys (`"1"`, `"2"`, `"3|4"`, etc.).

### Gathering

A 3-column grid of cards, each showing the die result and the item. Below the grid, a hint or warning paragraph (italic, border-left accent) when `common.gathering.{biomeId}.hint` or `.warning` exists. `floodedPlains` has no gathering table (null in `GATHERING_SCHEMA`) — the section is omitted for that biome.

Source: `common.gathering.{biomeId}` translation keys (`"1"`–`"6"`, `"hint"`, `"warning"`).

## What's Excluded (for now)

- **Theme badge** — intentionally deferred; no data source defined yet.
- **Navigation between biomes** — not in scope for this iteration.

## Existing Assets Reused

| Asset | Location |
|---|---|
| Banner images | `public/images/banner-{biome}.avif` |
| Biome colour tokens | `--biome-{biomeId}-light/dark` in `src/app/globals.css` |
| `AudioPlayer` component | `src/components/AudioPlayer/AudioPlayer.tsx` |
| Translation content | `messages/{locale}.json` → `common.biomes`, `common.encounters`, `common.gathering` |
| `Layout` component | `src/components/Layout/Layout.tsx` (nav + footer, but hero replaces the standard `Banner`) |

## Page Structure (component sketch)

```
<LorePage biome={biomeId}>
  <LoreHero />          ← full-viewport, banner image + title + teaser
  <LoreContent>
    <LoreDescription />
    <AudioPlayer biome={biomeId} />
    <LoreEncounters />
    <LoreGathering />   ← omitted for floodedPlains
  </LoreContent>
</LorePage>
```

The page is a new `src/app/[locale]/lore/[biome]/page.tsx` with a matching `src/components/PageLore/` component directory.
