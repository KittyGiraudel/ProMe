# Biome Light Mode Design

**Date:** 2026-04-14
**Status:** Approved

## Overview

Add a per-page light/dark theme toggle to biome pages. The toggle is local state only (not persisted), defaults to the global app theme, and switches between a purpose-built dark palette (the existing one) and a fully immersive biome-tinted light palette. Contrasts must pass WCAG AA (4.5:1 for body text, 3:1 for muted/decorative text).

## Decisions

| Topic | Decision |
|---|---|
| Toggle placement | Floating button, fixed bottom-right |
| Toggle persistence | Local React state only — not stored |
| Default theme | Follows `settings.appearance.theme` |
| Light palette feel | Strongly biome-tinted (not neutral/parchment) |
| Implementation approach | `data-biome-theme` attribute on `.BiomePage` + parallel CSS blocks |

## State & Initialisation

`BiomePage` gains a `biomeTheme: 'light' | 'dark'` state initialised from `useSettings().settings.appearance.theme`.

The existing `useEffect` currently forces `document.documentElement.dataset.appTheme = 'dark'` unconditionally. It is updated to set `data-app-theme` to `biomeTheme` instead, so Ant Design components in the nav (BiomeHeader) follow the local biome theme. Cleanup restores the previous value as before.

## CSS Architecture

### Selector pattern

Existing dark-mode token blocks are qualified with `[data-biome-theme="dark"]`:

```css
/* was: body:has(.BiomePage[data-biome="shadowForest"]) */
body:has(.BiomePage[data-biome-theme="dark"][data-biome="shadowForest"]) { … }
```

New light-mode blocks are added alongside:

```css
body:has(.BiomePage[data-biome-theme="light"][data-biome="shadowForest"]) { … }
```

`data-biome-theme` is always set (it's part of React state), so there is no ambiguous unqualified state.

### New CSS tokens

Four hardcoded colour values in the existing CSS are promoted to tokens to support both modes. Three of these (`--biome-hero-text`, `--biome-hero-scrim`, `--biome-hint-bg`) are theme-level constants — not biome-specific — so they live in two shared blocks rather than being repeated in all six biome blocks:

```css
body:has(.BiomePage[data-biome-theme="dark"]) {
  --biome-hero-text: rgb(255 255 255 / 0.8);
  --biome-hero-scrim: rgb(0 0 0 / 0.7);
  --biome-hint-bg: rgb(255 255 255 / 0.03);
}
body:has(.BiomePage[data-biome-theme="light"]) {
  --biome-hero-text: var(--biome-text); /* resolved per-biome */
  --biome-hero-scrim: rgb(255 255 255 / 0.6);
  --biome-hint-bg: rgb(0 0 0 / 0.04);
}
```

| Token | Used in | Replaces |
|---|---|---|
| `--biome-hero-text` | `.BiomeHero__title` | hardcoded `rgb(255 255 255 / 0.8)` |
| `--biome-hero-scrim` | `.BiomeHero__overlay` gradient mid-stop | hardcoded `rgb(0 0 0 / 0.7)` |
| `--biome-hint-bg` | `.BiomeGathering__hint` background | hardcoded `rgb(255 255 255 / 0.03)` |
| `--biome-text-muted` (existing) | `.BiomeHero__scrollHint` | hardcoded `rgb(255 255 255 / 0.3)` |

The scroll hint (`--biome-text-muted`) already exists per biome — it just needs to be wired up in `BiomeHero.css` instead of using a hardcoded white.

### Light palette token values

All light values verified to pass WCAG AA.

| Biome | `--biome-bg` | `--biome-surface` | `--biome-border` | `--biome-accent` | `--biome-text` | `--biome-text-muted` |
|---|---|---|---|---|---|---|
| shadowForest | `#ede8f5` | `#ddd4f0` | `rgba(106 78 155 / 0.22)` | `#5a3d99` | `#1a1228` | `#5a4f7a` |
| floodedPlains | `#e4f3fb` | `#d0e8f8` | `rgba(20 120 170 / 0.20)` | `#1464a0` | `#0d1e28` | `#3a6e90` |
| mushroomJungle | `#f0e8de` | `#e2d4c4` | `rgba(130 95 65 / 0.20)` | `#7a5038` | `#1e150f` | `#7a6050` |
| fieldSea | `#e4f5ec` | `#cce8d8` | `rgba(30 110 65 / 0.20)` | `#1a6840` | `#0d2018` | `#3a7055` |
| silentDesert | `#f5e8c8` | `#ead4a0` | `rgba(160 120 20 / 0.20)` | `#8a6410` | `#1e1808` | `#7a6030` |
| titanGardens | `#f5e0dc` | `#e8cac4` | `rgba(160 50 36 / 0.20)` | `#943020` | `#1e0d0a` | `#7a4038` |

### Light hero gradients

Hero gradients are inverted to bright/washed versions of the biome hue family:

| Biome | `--biome-hero-gradient` (light) |
|---|---|
| shadowForest | `linear-gradient(165deg, #d0c0ec 0%, #c0a8e0 35%, #b090d8 65%, #9870c8 100%)` |
| floodedPlains | `linear-gradient(165deg, #b8dcf4 0%, #90c4e8 35%, #6aaad8 65%, #4890c8 100%)` |
| mushroomJungle | `linear-gradient(165deg, #d8c0a0 0%, #c4a080 35%, #b08060 65%, #9a6848 100%)` |
| fieldSea | `linear-gradient(165deg, #a8e0c0 0%, #80c8a0 35%, #58b080 65%, #389860 100%)` |
| silentDesert | `linear-gradient(165deg, #e8cc88 0%, #d8b860 35%, #c8a040 65%, #b88820 100%)` |
| titanGardens | `linear-gradient(165deg, #e8b0a0 0%, #d89080 35%, #c87060 65%, #b85048 100%)` |

## BiomeThemeToggle Component

New file: `src/components/PageBiome/BiomeThemeToggle.tsx` (+ `.css`).

- Renders a `<button>` with `position: fixed; bottom: 1.5em; right: 1.5em; z-index: 50`
- In dark mode: displays ☀ (click → light)
- In light mode: displays ☾ (click → dark)
- Styled with `--biome-surface`, `--biome-border`, `--biome-accent` so it adapts automatically
- Receives `biomeTheme: 'light' | 'dark'` and `onToggle: () => void` as props
- Rendered inside `BiomePage`, below the `<Layout.Content>` tree so it sits above content but below the fixed header (z-index 100)

## Files Changed

| File | Change |
|---|---|
| `src/components/PageBiome/BiomePage.tsx` | Add `biomeTheme` state, update `useEffect`, render `BiomeThemeToggle` |
| `src/components/PageBiome/BiomePage.css` | Add `[data-biome-theme]` qualifiers to all existing selectors; add light token blocks for all 6 biomes |
| `src/components/PageBiome/BiomeHero.css` | Replace hardcoded `rgb(255 255 255 / 0.8)` with `var(--biome-hero-text)`; replace hardcoded overlay mid-stop with `var(--biome-hero-scrim)`; replace hardcoded scroll-hint white with `var(--biome-text-muted)` |
| `src/components/PageBiome/BiomeGathering.css` | Replace hardcoded hint background with `var(--biome-hint-bg)` |
| `src/components/PageBiome/BiomeThemeToggle.tsx` | New component |
| `src/components/PageBiome/BiomeThemeToggle.css` | New stylesheet |

## Out of Scope

- Persisting the biome theme preference
- Affecting any page outside of `BiomePage`
- Changing the global app theme switcher
