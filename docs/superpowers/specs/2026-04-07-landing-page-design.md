# ProMe Landing Page — Design Spec

**Date:** 2026-04-07  
**Status:** Approved (visual mockup signed off)

---

## Overview

Replace the current home page (`HomeHub`) with a full marketing-style landing page. The goal is to make visitors — primarily people who already know *The Protector's Memories* TTRPG — immediately understand what ProMe offers and want to try it.

The existing `Layout` component is **not used** on this page. The home route gets its own custom layout so feature sections can span full-bleed.

---

## Visual Direction

**"The Wanderer's Welcome"** — warm, storybook, light fantasy. Directly inspired by the book cover aesthetic: soft teal sky, rolling green hills, sandy path, earthy palette. Not dark. Not cold. The feeling is solitude + wonder + invitation.

**Color system:** Each feature section uses a distinct palette drawn from the app's existing biome tokens. Sections alternate light and dark to create rhythm. All color values come from existing CSS custom properties where possible.

| Section | Tone | Background |
|---|---|---|
| Hero | Landscape image | MidJourney-generated |
| Character sheet | Light sage | `--biome-shadowForest-*` |
| Map | Deep purple/dark | `--biome-fieldSea-*` dark |
| Journal | Parchment warm | Warm cream |
| Dice & Cards | Dark terracotta | `--biome-mushroomJungle-*` dark |
| Music | Light teal | `--biome-floodedPlains-*` |
| Generators | Dark warm gold | `--biome-silentDesert-*` dark |
| Final CTA | Landscape echo | Same gradient as hero |

---

## Page Structure

### 1. Navigation

Same nav as the rest of the app (logo + menu links) but with one addition: a persistent **"Begin your journey →"** CTA button on the right side of the nav bar, linking to `/characters/new`. This button is only visible on the home page.

The nav stays dark (`#1a1a1a` background) and fixed at the top.

### 2. Hero Section

- **Height:** 100vh (full viewport height)
- **Background:** A landscape image (MidJourney-generated, similar aesthetic to the book cover — sky, rolling green hills, sandy path, natural light). Implemented as a CSS `background-image` on the section, `object-fit: cover`.
- **Overlay:** Subtle dark gradient overlay (top: near-transparent → bottom: ~35% opacity) to ensure text legibility without obscuring the landscape.
- **Content (centered, vertically and horizontally):**
  - Eyebrow: *"A companion app for The Protector's Memories"* — small, uppercase, spaced
  - Title: **ProMe** — large serif, white, ~5rem
  - Ornamental rule divider (thin line)
  - Tagline: *"Your journal, map, and toolkit for journeying through a forgotten world."* — italic, white, readable weight
  - Primary CTA button: **"Begin your journey"** → `/characters/new` — white pill button, dark green text
  - Sub-note below button: *"Free · No account required · Runs in your browser"* — small, muted white

### 3. Feature Sections

Six sections, stacked vertically, each alternating layout direction (text left / visual right, then text right / visual left). Each section is `min-height: 400px` with generous padding.

Each section contains:
- **Text side:** section number (e.g. `01 —`), feature title (serif, ~1.6rem), body copy (2–3 sentences), feature tags (small pill badges)
- **Visual side:** either a styled mini-mockup (CSS) or a screenshot image when available

#### Section 01 — Your Protector (light sage)
- **Title:** A living character sheet
- **Copy:** Track everything that matters — health, stamina, resources, inventory, spells — on a persistent sheet that remembers your Protector between sessions. No spreadsheets, no paper.
- **Tags:** Stats & Clock · Inventory · Spellbook · Notes
- **Visual:** CSS mini-mockup of the character sheet (stat grid + inventory list). No screenshot needed — the mockup reads well.
- **Layout:** text left, visual right

#### Section 02 — The World (dark purple)
- **Title:** An interactive map of every step
- **Copy:** Draw your journey hex by hex. Each cell holds its biome, encounters, and notes. The world grows as you explore — and stays exactly as you left it.
- **Tags:** 6 Biomes · Hex Grid · Encounters · Annotations
- **Visual:** **Screenshot of the real map** — this is the hero feature and deserves a real image. Displayed with a subtle border-radius and shadow. If no screenshot is available yet, the CSS hex grid mockup serves as a placeholder.
- **Layout:** text right, visual left (reversed)

#### Section 03 — Your Story (light parchment)
- **Title:** Markdown-powered journaling
- **Copy:** Write your memories in rich Markdown. Embed dice rolls, card draws, and map references directly in your entries. Your story, told in your words.
- **Tags:** Markdown · Embeds · Timeline
- **Visual:** CSS mini journal entry mockup (date, title, ruled lines, a highlighted embed line).
- **Layout:** text left, visual right

#### Section 04 — The Oracle (dark terracotta)
- **Title:** Dice rolls & card draws, built in
- **Copy:** Roll any die, draw from a standard deck — all within the app. Results feed directly into your journal and character sheet. No physical dice required.
- **Tags:** d4–d20 · Card Deck · Roll History
- **Visual:** CSS mockup of dice faces + a playing card.
- **Layout:** text right, visual left (reversed)

#### Section 05 — The Ambiance (light teal)
- **Title:** Atmospheric soundtracks, always ready
- **Copy:** Curated TableTopAudio playlists for every biome and mood — shadow forest, flooded plains, silent desert. Set the scene without leaving the app.
- **Tags:** TableTopAudio · Per-biome · Background play
- **Visual:** CSS mini audio player mockup (track name, progress bar, playlist).
- **Layout:** text left, visual right

#### Section 06 — The World's People (dark warm gold)
- **Title:** NPC & village generators
- **Copy:** Populate your world instantly. Generate named inhabitants with faction, age, personality, and backstory — or roll up an entire village with establishments and traits.
- **Tags:** NPC Generator · Village Generator · Factions
- **Visual:** CSS mini NPC card mockup (name, role, attributes).
- **Layout:** text right, visual left (reversed)

### 4. Final CTA Section

- Same landscape gradient as the hero (echoes the opening)
- Dark overlay
- Heading: *"Ready to begin your journey?"*
- Sub: *"Create your Protector and step into the world."*
- CTA button: **"Create your Protector"** → `/characters/new`

### 5. Footer

Same `Footer` component as the rest of the app. No changes needed.

---

## Animations

All animations must respect `prefers-reduced-motion`.

- **Fade-in on scroll:** Feature sections fade up gently as they enter the viewport (`IntersectionObserver`, `opacity: 0 → 1` + `translateY(20px → 0)`, ~400ms ease-out, 100ms delay stagger between text and visual sides)
- **Hero:** No parallax (keeps it simple and accessible). The image is static; the overlay and text are just centered.
- **Nav CTA:** No animation — it's always visible.

---

## Component Architecture

### New files

- `src/components/LandingPage/LandingPage.tsx` — top-level component, replaces `HomeHub` on the home route
- `src/components/LandingPage/LandingPage.css`
- `src/components/LandingPage/LandingHero.tsx` — hero section
- `src/components/LandingPage/LandingFeature.tsx` — reusable feature section (takes: number, title, body, tags, visual slot, reversed flag, colorScheme)
- `src/components/LandingPage/featureVisuals/` — one file per feature visual (CharacterSheetVisual, MapVisual, JournalVisual, DiceVisual, MusicVisual, GeneratorVisual)
- `src/components/LandingPage/LandingFinalCta.tsx`
- `src/components/LandingPage/useFadeIn.ts` — IntersectionObserver hook for scroll animations

### Modified files

- `src/app/[locale]/page.tsx` — swap `HomeHub` for `LandingPage`
- `messages/en.json` and `messages/fr.json` — add all landing page copy under a new `landing` key

Note: `Layout.tsx` does **not** need modification. The landing page renders its own nav (with the CTA button) internally, entirely separate from the shared `Layout` component used by all other pages.

### Deleted files

- `src/components/HomeHub/HomeHub.tsx` — replaced entirely

### Image asset

- `public/images/landing-hero.jpg` (or `.webp`) — the MidJourney-generated landscape. Placeholder can be a gradient or a temporary image until generated.

---

## i18n

All copy lives in the message files under a `landing` namespace. Both `en.json` and `fr.json` must be updated. The landing page uses `useTranslations('landing')`.

Key strings include: `hero.eyebrow`, `hero.title`, `hero.tagline`, `hero.cta`, `hero.sub`, `feature.N.number`, `feature.N.title`, `feature.N.body`, `feature.N.tags.*`, `finalCta.title`, `finalCta.sub`, `finalCta.cta`.

---

## Out of Scope

- The existing character manager (last characters list, links to `/characters`) is removed from the home page. Users reach character management via nav or the CTA.
- No locale switcher on this page — settings page handles that.
- No A/B testing infrastructure.
- Screenshots beyond the map section are not required at launch.
