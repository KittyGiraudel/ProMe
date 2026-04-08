# Inheritance Card Redesign

**Date:** 2026-04-08
**Status:** Approved

## Overview

Refine the `InheritanceCard` component on the character creation page to make the inheritance mechanic clearer and more visually polished. Three changes: a decorative image banner, a two-column inherited/not-inherited list, and general polish.

## Components Affected

- `src/components/InheritanceCard/InheritanceCard.tsx`
- `src/components/InheritanceCard/InheritanceCard.css` (new file)

## Design

### 1. Decorative image banner

Remove the `title` prop from the Ant Design `<Card>`. Use the `cover` prop to render the banner above the card body. The banner is a `<div>` with class `InheritanceCard__Banner`. It is:

- Full width of the card
- 80px tall
- Background: `url('/images/home-cover.avif')` positioned at `center 40%`, `cover`
- Gradient overlay: `linear-gradient(to bottom, transparent 20%, rgb(0 0 0 / 0.55) 100%)`
- The card title "Inheritance" is rendered as white text inside the banner, aligned to the bottom-left (via `padding: 0 1rem 0.65rem`)
- No separate card header section — the `cover` prop renders before the body, and the title is rendered as white text within the banner itself

### 2. Two-column inherited / not-inherited list

Always visible (not conditional on a Protector being selected). Separated from the select form item by a thin `<Divider />`.

**Left column — "Inherited" (green dots):**
- Map exploration and discovered biomes
- Journal entries and memories

**Right column — "Not inherited" (grey dots):**
- Soul, Courage & Stamina points
- Honor and Inspiration
- Gold and money
- Inventory items
- Spellbook entries

Each row is a dot + short sentence. Green dot (`#52c41a`) for inherited; grey dot (`#d9d9d9`) for not inherited. Column labels are small uppercase, green vs. light grey.

### 3. Layout and polish

- Card body padding: `1.25rem`
- Thin `<Divider />` between the select form item and the two-column list
- The existing contextual `<Alert>` stays as-is, appearing below the list only when a Protector is selected
- No inline styles — all styles go in `InheritanceCard.css` using PascalCase BEM class names

## i18n

The list item text is UI copy, not game content, so it does not need to be extracted to translation keys. It can be hardcoded in the component (same approach used elsewhere for static labels). If internationalisation of this copy is needed later it can be added then.

## What does NOT change

- The `Select` form item, its label, and help text
- The `Alert` component and its conditional display logic
- The `useInheritanceCandidates` hook
- The `CharacterCreate` parent — no changes needed there
