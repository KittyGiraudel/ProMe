# Biome Lore Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one lore page per biome at `/[locale]/lore/[biome]`, featuring a full-viewport hero with banner image + custom font title, and content below (description, audio player, encounter table, gathering table) styled with a per-biome dark palette.

**Architecture:** Six static pages (one per BiomeId), each sharing the same `PageLore` component family. The page is custom-layout (not using the `Layout` wrapper) — a transparent sticky nav transitions to an opaque dark bar on scroll. The hero uses the existing `banner-{biome}.avif` image. Content uses per-biome CSS palette tokens. The existing `AudioPlayer` component is reused as-is.

**Tech Stack:** Next.js App Router (server + client components), next-intl, Ant Design, CSS custom properties, Google Fonts with `?text=` subsetting.

> ⚠️ **Next.js caveat:** APIs may differ from common training data. Check `node_modules/next/dist/docs/` if anything seems off.

---

## File Map

**Create:**
- `src/lib/lore/biomeSlug.ts` — BiomeId ↔ kebab-case slug conversion
- `src/lib/lore/biomeSlug.test.ts` — tests for slug conversion
- `src/lib/lore/encounterSchema.ts` — ordered encounter keys per biome
- `src/lib/lore/biomeFonts.ts` — per-biome font config (family + Google Fonts URL)
- `src/components/PageLore/LorePage.tsx` — assembly: shell, theme isolation, sub-components
- `src/components/PageLore/LorePage.css` — biome palette tokens + all lore styles
- `src/components/PageLore/LoreHeader.tsx` — sticky nav, transparent → opaque on scroll
- `src/components/PageLore/LoreHero.tsx` — full-viewport hero with banner image + title
- `src/components/PageLore/LoreDescription.tsx` — prose description section
- `src/components/PageLore/LoreEncounters.tsx` — encounter table
- `src/components/PageLore/LoreGathering.tsx` — gathering grid + hint/warning
- `src/app/[locale]/lore/[biome]/page.tsx` — route: params → validate → render

**No new translation keys needed.** All content comes from existing `common.biomes.*`, `common.encounters.*`, `common.gathering.*` keys.

---

### Task 1: Slug utilities

**Files:**
- Create: `src/lib/lore/biomeSlug.ts`
- Create: `src/lib/lore/biomeSlug.test.ts`

- [ ] **Write the failing tests**

```ts
// src/lib/lore/biomeSlug.test.ts
import { describe, expect, it } from 'vitest'
import { biomeIdToSlug, slugToBiomeId } from './biomeSlug'

describe('biomeIdToSlug', () => {
  it('converts camelCase to kebab-case', () => {
    expect(biomeIdToSlug('shadowForest')).toBe('shadow-forest')
    expect(biomeIdToSlug('floodedPlains')).toBe('flooded-plains')
    expect(biomeIdToSlug('mushroomJungle')).toBe('mushroom-jungle')
    expect(biomeIdToSlug('fieldSea')).toBe('field-sea')
    expect(biomeIdToSlug('silentDesert')).toBe('silent-desert')
    expect(biomeIdToSlug('titanGardens')).toBe('titan-gardens')
  })
})

describe('slugToBiomeId', () => {
  it('returns the matching BiomeId for a valid slug', () => {
    expect(slugToBiomeId('shadow-forest')).toBe('shadowForest')
    expect(slugToBiomeId('titan-gardens')).toBe('titanGardens')
  })

  it('returns undefined for an unknown slug', () => {
    expect(slugToBiomeId('unknown-biome')).toBeUndefined()
    expect(slugToBiomeId('shadowForest')).toBeUndefined()
  })
})
```

- [ ] **Run tests to verify they fail**

```bash
npx vitest run src/lib/lore/biomeSlug.test.ts
```
Expected: FAIL — module not found.

- [ ] **Write the implementation**

```ts
// src/lib/lore/biomeSlug.ts
import type { BiomeId } from '@/lib/types'

const BIOME_IDS: BiomeId[] = [
  'shadowForest',
  'floodedPlains',
  'mushroomJungle',
  'fieldSea',
  'silentDesert',
  'titanGardens',
]

export function biomeIdToSlug(biome: BiomeId): string {
  return biome.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export function slugToBiomeId(slug: string): BiomeId | undefined {
  return BIOME_IDS.find(id => biomeIdToSlug(id) === slug)
}
```

- [ ] **Run tests to verify they pass**

```bash
npx vitest run src/lib/lore/biomeSlug.test.ts
```
Expected: PASS — 6 tests.

- [ ] **Commit**

```bash
git add src/lib/lore/biomeSlug.ts src/lib/lore/biomeSlug.test.ts
git commit -m "feat(lore): add biome slug utilities"
```

---

### Task 2: Encounter schema

**Files:**
- Create: `src/lib/lore/encounterSchema.ts`

- [ ] **Write the file**

```ts
// src/lib/lore/encounterSchema.ts
import type { BiomeId } from '@/lib/types'

/** Ordered list of die-result keys for each biome's encounter table.
 *  Keys match the shape in messages/{locale}.json → common.encounters.{biomeId}.
 *  Pipe-separated keys (e.g. "3|4") represent combined results displayed as "3–4". */
export const ENCOUNTER_SCHEMA: Record<BiomeId, string[]> = {
  shadowForest:   ['1', '2|3', '4', '5|6'],
  floodedPlains:  ['1', '2', '3|4', '5', '6'],
  mushroomJungle: ['1', '2', '3|4', '5', '6'],
  fieldSea:       ['1', '2', '3', '4|5', '6'],
  silentDesert:   ['1', '2', '3|4', '5|6'],
  titanGardens:   ['1', '2|3', '4', '5', '6'],
}

/** Converts an encounter key to a display label: "3|4" → "3–4", "1" → "1". */
export function encounterKeyToLabel(key: string): string {
  return key.replace('|', '–')
}
```

- [ ] **Commit**

```bash
git add src/lib/lore/encounterSchema.ts
git commit -m "feat(lore): add encounter schema"
```

---

### Task 3: Font config

**Files:**
- Create: `src/lib/lore/biomeFonts.ts`

The author will supply real font choices. For now the config has one placeholder entry to prove the infrastructure works. Each entry has `family` (the CSS font-family value) and `googleFamily` (the exact name passed to Google Fonts `?family=`). The page uses `?text=` subsetting — it passes the biome's localised name, keeping the font payload tiny.

- [ ] **Write the file**

```ts
// src/lib/lore/biomeFonts.ts
import type { BiomeId } from '@/lib/types'

export type BiomeFontConfig = {
  /** CSS font-family value, used in the title's font-family declaration. */
  family: string
  /** Exact Google Fonts family name for the URL, e.g. "Caesar+Dressing". */
  googleFamily: string
}

/** Add one entry per biome once fonts are chosen.
 *  Biomes with no entry fall back to the serif stack in LorePage.css. */
export const BIOME_FONTS: Partial<Record<BiomeId, BiomeFontConfig>> = {
  // Example — replace with final choices:
  // shadowForest: { family: 'Caesar Dressing', googleFamily: 'Caesar+Dressing' },
}
```

- [ ] **Commit**

```bash
git add src/lib/lore/biomeFonts.ts
git commit -m "feat(lore): add per-biome font config scaffold"
```

---

### Task 4: LorePage CSS

**Files:**
- Create: `src/components/PageLore/LorePage.css`

This file owns all visual styling for the lore pages. It is isolated from Ant Design theme tokens — the page always renders in its own dark palette regardless of the app theme setting.

- [ ] **Write the file**

```css
/* src/components/PageLore/LorePage.css */

/* ── Shell ──────────────────────────────────────────────────── */
.LorePage {
  min-height: 100vh;
  font-size: 16px; /* em base for all children */
  display: flex;
  flex-direction: column;
}

/* ── Per-biome palette tokens ───────────────────────────────── */
/*
  --lore-bg        Page/content background
  --lore-surface   Cards, audio player, gather items
  --lore-border    Subtle borders
  --lore-accent    Section labels, die numbers, rule lines, border-left
  --lore-text      Body text — MUST clear WCAG AA 4.5:1 against --lore-bg
  --lore-text-muted  Decorative text only (teaser, hints) — 3:1 target
*/

.LorePage[data-biome='shadowForest'] {
  --lore-bg:         rgb(14 9 25);
  --lore-surface:    rgb(26 16 40);
  --lore-border:     rgb(167 147 195 / 0.18);
  --lore-accent:     rgb(167 147 195 / 0.65);
  --lore-text:       rgb(255 255 255 / 0.82);
  --lore-text-muted: rgb(255 255 255 / 0.5);
  --lore-hero-gradient: linear-gradient(165deg,
    rgb(30 18 45) 0%, rgb(50 28 70) 35%, rgb(72 46 100) 65%, rgb(100 68 130) 100%);
}

.LorePage[data-biome='floodedPlains'] {
  --lore-bg:         rgb(6 14 20);
  --lore-surface:    rgb(12 26 38);
  --lore-border:     rgb(94 196 232 / 0.18);
  --lore-accent:     rgb(94 196 232 / 0.6);
  --lore-text:       rgb(255 255 255 / 0.82);
  --lore-text-muted: rgb(255 255 255 / 0.5);
  --lore-hero-gradient: linear-gradient(165deg,
    rgb(8 20 32) 0%, rgb(15 40 60) 35%, rgb(22 70 95) 65%, rgb(30 100 130) 100%);
}

.LorePage[data-biome='mushroomJungle'] {
  --lore-bg:         rgb(17 11 8);
  --lore-surface:    rgb(30 19 14);
  --lore-border:     rgb(174 145 120 / 0.18);
  --lore-accent:     rgb(174 145 120 / 0.6);
  --lore-text:       rgb(255 255 255 / 0.82);
  --lore-text-muted: rgb(255 255 255 / 0.5);
  --lore-hero-gradient: linear-gradient(165deg,
    rgb(22 14 10) 0%, rgb(42 28 20) 35%, rgb(70 45 32) 65%, rgb(98 68 50) 100%);
}

.LorePage[data-biome='fieldSea'] {
  --lore-bg:         rgb(9 20 14);
  --lore-surface:    rgb(16 32 23);
  --lore-border:     rgb(125 200 160 / 0.18);
  --lore-accent:     rgb(125 200 160 / 0.6);
  --lore-text:       rgb(255 255 255 / 0.82);
  --lore-text-muted: rgb(255 255 255 / 0.5);
  --lore-hero-gradient: linear-gradient(165deg,
    rgb(10 22 15) 0%, rgb(20 45 30) 35%, rgb(35 80 55) 65%, rgb(55 120 80) 100%);
}

.LorePage[data-biome='silentDesert'] {
  --lore-bg:         rgb(23 18 7);
  --lore-surface:    rgb(36 28 12);
  --lore-border:     rgb(243 213 142 / 0.18);
  --lore-accent:     rgb(243 213 142 / 0.55);
  --lore-text:       rgb(255 255 255 / 0.82);
  --lore-text-muted: rgb(255 255 255 / 0.5);
  --lore-hero-gradient: linear-gradient(165deg,
    rgb(28 22 8) 0%, rgb(55 42 15) 35%, rgb(90 68 25) 65%, rgb(130 100 40) 100%);
}

.LorePage[data-biome='titanGardens'] {
  --lore-bg:         rgb(22 8 6);
  --lore-surface:    rgb(34 16 13);
  --lore-border:     rgb(255 179 167 / 0.18);
  --lore-accent:     rgb(255 179 167 / 0.55);
  --lore-text:       rgb(255 255 255 / 0.82);
  --lore-text-muted: rgb(255 255 255 / 0.5);
  --lore-hero-gradient: linear-gradient(165deg,
    rgb(26 10 8) 0%, rgb(55 20 16) 35%, rgb(90 35 28) 65%, rgb(140 60 48) 100%);
}

/* ── Header ─────────────────────────────────────────────────── */
.LoreHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  background: transparent;
}

.LoreHeader--scrolled {
  background: rgb(0 0 0 / 0.85);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 0 rgb(255 255 255 / 0.06);
}

/* Ant Design Menu inside the header — always dark, transparent bg by default */
.LoreHeader .Navigation {
  background: transparent !important;
}

.LoreHeader--scrolled .Navigation {
  background: transparent !important; /* parent handles the bg */
}

/* ── Hero ────────────────────────────────────────────────────── */
.LoreHero {
  position: relative;
  height: 100vh;
  min-height: 500px;
  overflow: hidden;
  background: var(--lore-hero-gradient);
  display: flex;
  align-items: flex-end;
}

.LoreHero__image {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.LoreHero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0) 30%,
    rgb(0 0 0 / 0.7) 75%,
    rgb(0 0 0 / 0.92) 100%
  );
}

.LoreHero__content {
  position: relative;
  z-index: 2;
  padding: 0 3em 3.5em;
  max-width: 44em;
}

.LoreHero__eyebrow {
  font-size: 0.8em;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--lore-text-muted);
  margin-bottom: 0.9em;
}

.LoreHero__title {
  /* Custom per-biome font loaded by page.tsx — falls back to serif */
  font-family: var(--lore-title-font, 'Palatino Linotype', Palatino, Georgia, serif);
  font-size: 5.5em;
  font-weight: 400;
  line-height: 1;
  color: rgb(255 255 255 / 0.95);
  text-shadow: 0 4px 32px rgb(0 0 0 / 0.6);
  margin-bottom: 1em;
}

.LoreHero__teaser {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.2em;
  line-height: 1.65;
  font-style: italic;
  color: var(--lore-text-muted);
  max-width: 32em;
}

.LoreHero__scrollHint {
  position: absolute;
  bottom: 1.4em;
  right: 2.5em;
  z-index: 2;
  font-size: 0.75em;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.3);
  display: flex;
  align-items: center;
  gap: 0.4em;
}

/* ── Content ─────────────────────────────────────────────────── */
.LoreContent {
  background: var(--lore-bg);
  padding: 4em 3em;
  display: flex;
  flex-direction: column;
  gap: 4em;
  flex: 1;
}

.LoreContent__sectionHead {
  display: flex;
  align-items: center;
  gap: 0.75em;
  margin-bottom: 1.5em;
}

.LoreContent__sectionLabel {
  font-size: 0.75em;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--lore-accent);
  white-space: nowrap;
}

.LoreContent__sectionRule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--lore-border) 0%, transparent 100%);
}

/* ── Description ────────────────────────────────────────────── */
.LoreDescription__text {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.2em;
  line-height: 1.9;
  font-style: italic;
  color: var(--lore-text);
  max-width: 44em;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

/* ── Audio ───────────────────────────────────────────────────── */
.LoreAudio {
  background: var(--lore-surface);
  border: 1px solid var(--lore-border);
  border-radius: 0.6em;
  padding: 1em 1.2em;
  max-width: 30em;
}

/* ── Encounter table ─────────────────────────────────────────── */
.LoreEncounters__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1em;
}

.LoreEncounters__table tr {
  border-bottom: 1px solid var(--lore-border);
}

.LoreEncounters__table tr:last-child {
  border-bottom: none;
}

.LoreEncounters__table td {
  padding: 1.4em 0;
  vertical-align: top;
  line-height: 1.7;
}

.LoreEncounters__die {
  width: 3.5em;
  padding-right: 1.5em !important;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  font-weight: 700;
  color: var(--lore-accent);
  white-space: nowrap;
}

.LoreEncounters__text {
  color: var(--lore-text);
}

.LoreEncounters__text strong {
  color: rgb(255 255 255 / 0.95);
  font-weight: 600;
}

/* ── Gathering ───────────────────────────────────────────────── */
.LoreGathering__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5em;
}

.LoreGathering__item {
  padding: 0.7em 0.9em;
  background: var(--lore-surface);
  border: 1px solid var(--lore-border);
  border-radius: 0.45em;
  display: flex;
  gap: 0.65em;
  align-items: center;
}

.LoreGathering__die {
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  font-weight: 700;
  color: var(--lore-accent);
  flex-shrink: 0;
  min-width: 1.1em;
}

.LoreGathering__value {
  font-size: 0.95em;
  color: var(--lore-text);
}

.LoreGathering__hint {
  margin-top: 1.1em;
  padding: 1em 1.4em;
  background: rgb(255 255 255 / 0.03);
  border-left: 2px solid var(--lore-accent);
  font-family: Georgia, serif;
  font-size: 0.95em;
  font-style: italic;
  line-height: 1.75;
  color: var(--lore-text-muted);
}
```

- [ ] **Commit**

```bash
git add src/components/PageLore/LorePage.css
git commit -m "feat(lore): add page CSS with per-biome palette tokens"
```

---

### Task 5: LoreHeader — transparent sticky nav

**Files:**
- Create: `src/components/PageLore/LoreHeader.tsx`

- [ ] **Write the component**

```tsx
// src/components/PageLore/LoreHeader.tsx
'use client'

import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation/Navigation'

export function LoreHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Layout.Header
      className={`LoreHeader${scrolled ? ' LoreHeader--scrolled' : ''}`}>
      <Navigation />
    </Layout.Header>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/PageLore/LoreHeader.tsx
git commit -m "feat(lore): add transparent sticky header"
```

---

### Task 6: LoreHero

**Files:**
- Create: `src/components/PageLore/LoreHero.tsx`

The hero expects a `bannerSrc` prop (the `/images/banner-{biome}.avif` path, or `null` for `titanGardens` until its banner is added). When `null`, the CSS gradient fallback via `--lore-hero-gradient` is used automatically.

- [ ] **Write the component**

```tsx
// src/components/PageLore/LoreHero.tsx
'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'

type Props = {
  biome: BiomeId
  bannerSrc: string | null
}

export function LoreHero({ biome, bannerSrc }: Props) {
  const t = useTranslations('common.biomes')
  const name = t(biome as any)
  const description = t(`${biome}_description` as any)
  // Use only the first sentence as the teaser.
  const teaser = description.split(/[.!?]\s/)[0] + '.'

  return (
    <div className='LoreHero'>
      {bannerSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bannerSrc}
          alt=''
          role='presentation'
          className='LoreHero__image'
        />
      )}
      <div className='LoreHero__overlay' aria-hidden='true' />
      <div className='LoreHero__content'>
        <p className='LoreHero__eyebrow'>Biome</p>
        <h1 className='LoreHero__title'>{name}</h1>
        <p className='LoreHero__teaser'>{teaser}</p>
      </div>
      <p className='LoreHero__scrollHint' aria-hidden='true'>
        Explorer ↓
      </p>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/PageLore/LoreHero.tsx
git commit -m "feat(lore): add LoreHero component"
```

---

### Task 7: LoreDescription

**Files:**
- Create: `src/components/PageLore/LoreDescription.tsx`

The description in the translations is a single continuous paragraph. Render it as prose with light wrapping — no artificial paragraph splitting.

- [ ] **Write the component**

```tsx
// src/components/PageLore/LoreDescription.tsx
'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'

type Props = { biome: BiomeId }

export function LoreDescription({ biome }: Props) {
  const t = useTranslations('common.biomes')

  return (
    <section aria-labelledby='lore-description-heading'>
      <div className='LoreContent__sectionHead'>
        <span
          id='lore-description-heading'
          className='LoreContent__sectionLabel'>
          Description
        </span>
        <div className='LoreContent__sectionRule' aria-hidden='true' />
      </div>
      <div className='LoreDescription__text'>
        <p>{t(`${biome}_description` as any)}</p>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/PageLore/LoreDescription.tsx
git commit -m "feat(lore): add LoreDescription component"
```

---

### Task 8: LoreEncounters

**Files:**
- Create: `src/components/PageLore/LoreEncounters.tsx`

Encounter text contains markdown (`**bold**`, `_italic_`, `[links](url)`). Use the existing `RichText` component to render it.

- [ ] **Write the component**

```tsx
// src/components/PageLore/LoreEncounters.tsx
'use client'

import { useTranslations } from 'next-intl'
import { RichText } from '@/components/RichText/RichText'
import { ENCOUNTER_SCHEMA, encounterKeyToLabel } from '@/lib/lore/encounterSchema'
import type { BiomeId } from '@/lib/types'

type Props = { biome: BiomeId }

export function LoreEncounters({ biome }: Props) {
  const t = useTranslations('common.encounters')
  const keys = ENCOUNTER_SCHEMA[biome]

  return (
    <section aria-labelledby='lore-encounters-heading'>
      <div className='LoreContent__sectionHead'>
        <span
          id='lore-encounters-heading'
          className='LoreContent__sectionLabel'>
          Rencontres
        </span>
        <div className='LoreContent__sectionRule' aria-hidden='true' />
      </div>
      <table className='LoreEncounters__table'>
        <tbody>
          {keys.map(key => (
            <tr key={key}>
              <td className='LoreEncounters__die'>
                {encounterKeyToLabel(key)}
              </td>
              <td className='LoreEncounters__text'>
                <RichText text={t(`${biome}.${key}` as any)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/PageLore/LoreEncounters.tsx
git commit -m "feat(lore): add LoreEncounters component"
```

---

### Task 9: LoreGathering

**Files:**
- Create: `src/components/PageLore/LoreGathering.tsx`

`floodedPlains` has no gathering table (`GATHERING_SCHEMA[biome] === null`). The component returns `null` for that biome. Some biomes have a `hint`, others a `warning` — both render as the styled hint block.

- [ ] **Write the component**

```tsx
// src/components/PageLore/LoreGathering.tsx
'use client'

import { useTranslations } from 'next-intl'
import { GATHERING_SCHEMA } from '@/lib/gathering/schema'
import type { BiomeId } from '@/lib/types'

type Props = { biome: BiomeId }

const GATHER_KEYS = ['1', '2', '3', '4', '5', '6'] as const

export function LoreGathering({ biome }: Props) {
  const t = useTranslations('common.gathering')

  if (GATHERING_SCHEMA[biome] === null) return null

  // t.raw() returns the raw messages object for the namespace,
  // letting us check for optional hint/warning keys without throwing.
  const gatherMessages = t.raw(biome as any) as Record<string, string> | undefined
  const hint: string | undefined = gatherMessages?.hint ?? gatherMessages?.warning

  return (
    <section aria-labelledby='lore-gathering-heading'>
      <div className='LoreContent__sectionHead'>
        <span
          id='lore-gathering-heading'
          className='LoreContent__sectionLabel'>
          Collecte
        </span>
        <div className='LoreContent__sectionRule' aria-hidden='true' />
      </div>
      <div className='LoreGathering__grid'>
        {GATHER_KEYS.map(key => (
          <div key={key} className='LoreGathering__item'>
            <span className='LoreGathering__die'>{key}</span>
            <span className='LoreGathering__value'>
              {t(`${biome}.${key}` as any)}
            </span>
          </div>
        ))}
      </div>
      {hint && <p className='LoreGathering__hint'>{hint}</p>}
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/PageLore/LoreGathering.tsx
git commit -m "feat(lore): add LoreGathering component"
```

---

### Task 10: LorePage assembly

**Files:**
- Create: `src/components/PageLore/LorePage.tsx`

This is the top-level client component. It:
- Applies `data-biome` and forces dark app theme via `document.documentElement.dataset.appTheme`
- Passes `bannerSrc` to `LoreHero` — a lookup from the existing `/images/banner-*.avif` files
- Uses `AudioPlayer` directly (not `AudioCard`) — lore pages always show the player regardless of the character's sound settings

```
Banner images that exist: shadowForest, floodedPlains, mushroomJungle, fieldSea, silentDesert.
titanGardens has no banner yet → null → CSS gradient fallback.
```

- [ ] **Write the component**

```tsx
// src/components/PageLore/LorePage.tsx
'use client'

import { Layout } from 'antd'
import { useEffect } from 'react'
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
import { Footer } from '@/components/Footer/Footer'
import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'
import { LoreDescription } from './LoreDescription'
import { LoreEncounters } from './LoreEncounters'
import { LoreGathering } from './LoreGathering'
import { LoreHeader } from './LoreHeader'
import { LoreHero } from './LoreHero'

import './LorePage.css'

const BANNER_SRCS: Partial<Record<BiomeId, string>> = {
  shadowForest:   '/images/banner-shadowForest.avif',
  floodedPlains:  '/images/banner-floodedPlains.avif',
  mushroomJungle: '/images/banner-mushroomJungle.avif',
  fieldSea:       '/images/banner-fieldSea.avif',
  silentDesert:   '/images/banner-silentDesert.avif',
  // titanGardens: no banner yet — hero uses CSS gradient fallback
}

type Props = { biome: BiomeId }

export function LorePage({ biome }: Props) {
  const t = useTranslations('common.biomes')

  useEffect(() => {
    const prev = document.documentElement.dataset.appTheme
    document.documentElement.dataset.appTheme = 'dark'
    return () => {
      document.documentElement.dataset.appTheme = prev ?? ''
    }
  }, [])

  return (
    <Layout className='LorePage' data-biome={biome}>
      <LoreHeader />
      <LoreHero biome={biome} bannerSrc={BANNER_SRCS[biome] ?? null} />
      <main className='LoreContent'>
        <LoreDescription biome={biome} />
        <section aria-label='Ambiance sonore'>
          <div className='LoreContent__sectionHead'>
            <span className='LoreContent__sectionLabel'>Ambiance sonore</span>
            <div className='LoreContent__sectionRule' aria-hidden='true' />
          </div>
          <div className='LoreAudio'>
            <AudioPlayer biome={biome} />
          </div>
        </section>
        <LoreEncounters biome={biome} />
        <LoreGathering biome={biome} />
      </main>
      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/PageLore/LorePage.tsx
git commit -m "feat(lore): add LorePage assembly component"
```

---

### Task 11: Route page

**Files:**
- Create: `src/app/[locale]/lore/[biome]/page.tsx`

This is a server component. It validates the `[biome]` slug, injects the Google Font `<link>` for the biome's custom font (using `?text=` subsetting scoped to the localised biome name), and renders `LorePage`.

- [ ] **Write the page**

```tsx
// src/app/[locale]/lore/[biome]/page.tsx
import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { LorePage } from '@/components/PageLore/LorePage'
import { BIOME_FONTS } from '@/lib/lore/biomeFonts'
import { slugToBiomeId } from '@/lib/lore/biomeSlug'
import type { BiomeId } from '@/lib/types'

type Props = { params: Promise<{ locale: string; biome: string }> }

const BIOME_IDS: BiomeId[] = [
  'shadowForest',
  'floodedPlains',
  'mushroomJungle',
  'fieldSea',
  'silentDesert',
  'titanGardens',
]

export function generateStaticParams() {
  const locales = ['fr', 'en']
  return locales.flatMap(locale =>
    BIOME_IDS.map(id => ({
      locale,
      biome: id.replace(/([A-Z])/g, '-$1').toLowerCase(),
    }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { locale, biome: slug } = await params
  const biomeId = slugToBiomeId(slug)
  if (!biomeId) return {}
  const t = await getTranslations({
    locale: locale as AppConfig['Locale'],
    namespace: 'common.biomes',
  })
  return { title: t(biomeId as any) }
}

export default async function LoreBiomePage({ params }: Props) {
  const { locale, biome: slug } = await params
  const biomeId = slugToBiomeId(slug)
  if (!biomeId) notFound()

  const t = await getTranslations({
    locale: locale as AppConfig['Locale'],
    namespace: 'common.biomes',
  })
  const biomeName = t(biomeId as any)
  const fontConfig = BIOME_FONTS[biomeId]

  return (
    <>
      {fontConfig && (
        <>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='stylesheet'
            href={`https://fonts.googleapis.com/css2?family=${fontConfig.googleFamily}&text=${encodeURIComponent(biomeName)}&display=swap`}
          />
          <style>{`
            .LorePage[data-biome='${biomeId}'] .LoreHero__title {
              --lore-title-font: '${fontConfig.family}';
              font-family: '${fontConfig.family}', Palatino, Georgia, serif;
            }
          `}</style>
        </>
      )}
      <LorePage biome={biomeId} />
    </>
  )
}
```

- [ ] **Start the dev server and verify each biome loads**

```bash
npm run dev
```

Visit in browser:
- `http://localhost:3000/fr/lore/shadow-forest` — purple hero, purple content
- `http://localhost:3000/fr/lore/flooded-plains` — blue tones
- `http://localhost:3000/fr/lore/mushroom-jungle` — brown tones
- `http://localhost:3000/fr/lore/field-sea` — green tones
- `http://localhost:3000/fr/lore/silent-desert` — amber tones
- `http://localhost:3000/fr/lore/titan-gardens` — red tones (no banner image → gradient fallback)

Check on each:
- Header is transparent at top, turns dark on scroll
- Hero fills viewport, content begins below the fold
- Encounter table has readable text, rows are well-spaced
- Gathering grid shows 6 items, hint/warning appears for biomes that have one
- Audio player is visible and play button works
- `http://localhost:3000/fr/lore/fake-biome` → 404

- [ ] **Run the linter**

```bash
npm run lint
```
Fix any errors before committing.

- [ ] **Commit**

```bash
git add src/app/\[locale\]/lore/\[biome\]/page.tsx
git commit -m "feat(lore): add biome lore route pages"
```
