# Self-hosted Biome Title Fonts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace runtime Google Fonts CDN loading for biome title fonts with committed WOFF2 subsets served locally, so biome pages work offline and have no external font dependency.

**Architecture:** A Node generator script downloads minimal character-subsetted WOFF2 files from the Google Fonts API (using `&text=` subsetting) and writes a `@font-face` CSS file alongside them. Per-biome `font-family` declarations move from dynamic JS injection in `page.tsx` to static rules in `BiomePage.css`. The biome page server component is simplified to just render the page component.

**Tech Stack:** Node (built-in `fetch`, `fs`), WOFF2 (via Google Fonts CSS API), CSS `@font-face`, Next.js App Router.

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `scripts/subset-biome-fonts.mjs` | Generator: downloads WOFF2 subsets, writes CSS |
| Create (generated) | `public/fonts/biomes/caesar-dressing.woff2` | Subset for shadowForest |
| Create (generated) | `public/fonts/biomes/shizuru.woff2` | Subset for mushroomJungle |
| Create (generated) | `public/fonts/biomes/rubik-marker-hatch.woff2` | Subset for floodedPlains |
| Create (generated) | `public/fonts/biomes/mountains-of-christmas.woff2` | Subset for titanGardens |
| Create (generated) | `public/fonts/biomes/mystery-quest.woff2` | Subset for fieldSea |
| Create (generated) | `public/fonts/biomes/fredericka-the-great.woff2` | Subset for silentDesert |
| Create (generated) | `src/components/PageBiome/biome-fonts.css` | `@font-face` declarations for all 6 fonts |
| Modify | `src/components/PageBiome/BiomePage.css` | Add static per-biome `font-family` rules |
| Modify | `src/components/PageBiome/BiomeHero.css` | Replace CSS custom property with plain `serif` default |
| Modify | `src/components/PageBiome/BiomePage.tsx` | Import `biome-fonts.css` |
| Modify | `src/app/[locale]/biomes/[biome]/page.tsx` | Remove Google Fonts links and inline `<style>` |
| Modify | `src/constants/misc.ts` | Delete `BIOME_FONTS` (no more callers) |

---

## Task 1: Write the generator script

**Files:**
- Create: `scripts/subset-biome-fonts.mjs`

- [ ] **Step 1: Create the script**

Create `scripts/subset-biome-fonts.mjs` with this exact content:

```js
#!/usr/bin/env node
// scripts/subset-biome-fonts.mjs
// Downloads minimal WOFF2 subsets for biome title fonts from Google Fonts.
// Re-run whenever biome titles or font choices change.
//
// Usage: node scripts/subset-biome-fonts.mjs
//
// To add a new biome font:
//   1. Add an entry to FONTS below (biome id, family, kebab file name, FR+EN titles).
//   2. Run this script.
//   3. Add a font-family rule for the biome in BiomePage.css.
//   4. Commit the new .woff2, updated biome-fonts.css, and the updated script.

import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// One entry per biome. `text` is the union of FR + EN titles — the script
// deduplicates characters before sending the request.
const FONTS = [
  {
    family: 'Caesar Dressing',
    file: 'caesar-dressing',
    text: 'La Forêt des OmbresThe Shadow Forest',
  },
  {
    family: 'Shizuru',
    file: 'shizuru',
    text: 'La Jungle de ChampignonsThe Mushroom Jungle',
  },
  {
    family: 'Rubik Marker Hatch',
    file: 'rubik-marker-hatch',
    text: 'Les Plaines InondéesThe Flooded Plains',
  },
  {
    family: 'Mountains of Christmas',
    file: 'mountains-of-christmas',
    text: 'Les Jardins TitanesquesThe Titan Gardens',
  },
  {
    family: 'Mystery Quest',
    file: 'mystery-quest',
    text: 'La Mer ChampêtreThe Sea of Fields',
  },
  {
    family: 'Fredericka the Great',
    file: 'fredericka-the-great',
    text: 'Le Désert SilencieuxThe Silent Desert',
  },
]

// A modern UA is required — Google Fonts returns WOFF2 only for modern browsers.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

function dedupeChars(str) {
  return [...new Set(str)].join('')
}

async function fetchGoogleFontsCSS(family, text) {
  const url = new URL('https://fonts.googleapis.com/css2')
  url.searchParams.set('family', family)
  url.searchParams.set('text', dedupeChars(text))
  url.searchParams.set('display', 'swap')

  const res = await fetch(url.toString(), { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`Failed to fetch CSS for ${family}: ${res.status}`)
  return res.text()
}

function extractWoff2Url(css, family) {
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/)
  if (!match) throw new Error(`No WOFF2 URL found in CSS response for ${family}`)
  return match[1]
}

async function downloadWoff2(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download WOFF2 from ${url}: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

const outDir = join(ROOT, 'public', 'fonts', 'biomes')
mkdirSync(outDir, { recursive: true })

const faceParts = []

for (const font of FONTS) {
  process.stdout.write(`Fetching ${font.family}... `)
  const css = await fetchGoogleFontsCSS(font.family, font.text)
  const woff2Url = extractWoff2Url(css, font.family)
  const woff2 = await downloadWoff2(woff2Url)
  const outPath = join(outDir, `${font.file}.woff2`)
  writeFileSync(outPath, woff2)
  console.log(`${woff2.length.toLocaleString()} bytes → public/fonts/biomes/${font.file}.woff2`)

  faceParts.push(`@font-face {
  font-family: '${font.family}';
  src: url('/fonts/biomes/${font.file}.woff2') format('woff2');
  font-display: swap;
  font-style: normal;
  font-weight: 400;
}`)
}

const cssOut = `/* Auto-generated by scripts/subset-biome-fonts.mjs — do not edit manually.
   Re-run the script whenever biome titles or font choices change. */

${faceParts.join('\n\n')}
`

const cssPath = join(ROOT, 'src', 'components', 'PageBiome', 'biome-fonts.css')
writeFileSync(cssPath, cssOut)
console.log('\nWrote src/components/PageBiome/biome-fonts.css')
```

- [ ] **Step 2: Commit the script**

```bash
git add scripts/subset-biome-fonts.mjs
git commit -m "feat: add biome font subset generator script"
```

---

## Task 2: Run the generator script

**Files:**
- Create (generated): `public/fonts/biomes/*.woff2` (6 files)
- Create (generated): `src/components/PageBiome/biome-fonts.css`

- [ ] **Step 1: Run the script**

```bash
node scripts/subset-biome-fonts.mjs
```

Expected output (byte counts will vary slightly):

```
Fetching Caesar Dressing... 3,456 bytes → public/fonts/biomes/caesar-dressing.woff2
Fetching Shizuru... 4,120 bytes → public/fonts/biomes/shizuru.woff2
Fetching Rubik Marker Hatch... 3,890 bytes → public/fonts/biomes/rubik-marker-hatch.woff2
Fetching Mountains of Christmas... 3,200 bytes → public/fonts/biomes/mountains-of-christmas.woff2
Fetching Mystery Quest... 2,980 bytes → public/fonts/biomes/mystery-quest.woff2
Fetching Fredericka the Great... 5,100 bytes → public/fonts/biomes/fredericka-the-great.woff2

Wrote src/components/PageBiome/biome-fonts.css
```

- [ ] **Step 2: Verify the output**

```bash
ls public/fonts/biomes/
```

Expected: 6 `.woff2` files. Then:

```bash
cat src/components/PageBiome/biome-fonts.css
```

Expected: 6 `@font-face` blocks with `url('/fonts/biomes/...')` paths, a `font-display: swap` line, and the auto-generated header comment.

- [ ] **Step 3: Commit the generated files**

```bash
git add public/fonts/biomes/ src/components/PageBiome/biome-fonts.css
git commit -m "feat: add self-hosted WOFF2 subsets and @font-face declarations for biome fonts"
```

---

## Task 3: Wire up CSS and remove the CSS custom property

**Files:**
- Modify: `src/components/PageBiome/BiomePage.css`
- Modify: `src/components/PageBiome/BiomeHero.css`
- Modify: `src/components/PageBiome/BiomePage.tsx`

- [ ] **Step 1: Add static per-biome font-family rules to `BiomePage.css`**

Append this block to the end of `src/components/PageBiome/BiomePage.css`:

```css
/* ── Per-biome title fonts ───────────────────────────────────── */

.BiomePage[data-biome='shadowForest'] .BiomeHero__title { font-family: 'Caesar Dressing', serif; }
.BiomePage[data-biome='mushroomJungle'] .BiomeHero__title { font-family: 'Shizuru', serif; word-spacing: -40px; }
.BiomePage[data-biome='floodedPlains'] .BiomeHero__title { font-family: 'Rubik Marker Hatch', serif; }
.BiomePage[data-biome='titanGardens'] .BiomeHero__title { font-family: 'Mountains of Christmas', serif; }
.BiomePage[data-biome='fieldSea'] .BiomeHero__title { font-family: 'Mystery Quest', serif; }
.BiomePage[data-biome='silentDesert'] .BiomeHero__title { font-family: 'Fredericka the Great', serif; }
```

- [ ] **Step 2: Update `.BiomeHero__title` in `BiomeHero.css`**

In `src/components/PageBiome/BiomeHero.css`, find these two lines inside `.BiomeHero__title` (lines 50–51):

```css
  /* Custom per-biome font loaded by page.tsx — falls back to serif */
  font-family: var(--biome-title-font, serif);
```

Replace with:

```css
  font-family: serif;
```

(The per-biome overrides in `BiomePage.css` take precedence via specificity; the base falls back to serif for biomes without a custom font.)

- [ ] **Step 3: Import `biome-fonts.css` in `BiomePage.tsx`**

In `src/components/PageBiome/BiomePage.tsx`, find the existing CSS import:

```tsx
import './BiomePage.css'
```

Add the new import directly below it:

```tsx
import './BiomePage.css'
import './biome-fonts.css'
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PageBiome/BiomePage.css src/components/PageBiome/BiomeHero.css src/components/PageBiome/BiomePage.tsx
git commit -m "feat: load biome title fonts from local @font-face declarations"
```

---

## Task 4: Remove Google Fonts from page.tsx and delete BIOME_FONTS

**Files:**
- Modify: `src/app/[locale]/biomes/[biome]/page.tsx`
- Modify: `src/constants/misc.ts`

- [ ] **Step 1: Simplify `page.tsx`**

Replace the entire `export default async function BiomePage` in `src/app/[locale]/biomes/[biome]/page.tsx` with:

```tsx
export default async function BiomePage({ params }: Props) {
  const { biome: slug } = await params

  const biomeId = slugToBiomeId(slug)
  if (!biomeId) notFound()

  return <Page biome={biomeId} />
}
```

Also remove the now-unused imports at the top of the file. The final import list should be:

```tsx
import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { BiomePage as Page } from '@/components/PageBiome/BiomePage'
import { BIOME_IDS } from '@/constants/misc'
import { routing } from '@/i18n/routing'
import { biomeIdToSlug, slugToBiomeId } from '@/lib/biomes/biomeSlug'
```

(Remove the `BIOME_FONTS` import and the `getTranslations` call is still needed for `generateMetadata`, so keep it.)

Wait — `getTranslations` is still needed for `generateMetadata`. Double-check the final file should look exactly like this:

```tsx
import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { BiomePage as Page } from '@/components/PageBiome/BiomePage'
import { BIOME_IDS } from '@/constants/misc'
import { routing } from '@/i18n/routing'
import { biomeIdToSlug, slugToBiomeId } from '@/lib/biomes/biomeSlug'

type Props = { params: Promise<{ locale: string; biome: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    BIOME_IDS.map(id => ({ locale, biome: biomeIdToSlug(id) }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { locale, biome: slug } = await params

  const biomeId = slugToBiomeId(slug)
  if (!biomeId) return {}

  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  return { title: t(`biomes.${biomeId}.title`) }
}

export default async function BiomePage({ params }: Props) {
  const { locale, biome: slug } = await params

  const biomeId = slugToBiomeId(slug)
  if (!biomeId) notFound()

  return <Page biome={biomeId} />
}
```

- [ ] **Step 2: Delete `BIOME_FONTS` from `misc.ts`**

In `src/constants/misc.ts`, delete these lines (approximately lines 65–94):

```ts
/** Add one entry per biome once fonts are chosen.
 *  Biomes with no entry fall back to the serif stack in BiomePage.css. */
export const BIOME_FONTS: Partial<
  Record<
    BiomeId,
    {
      /** CSS font-family value, used in the title's font-family declaration. */
      family: string
      /** Exact Google Fonts family name for the URL, e.g. "Caesar+Dressing". */
      googleFamily: string
    }
  >
> = {
  // Example — replace with final choices:
  shadowForest: { family: 'Caesar Dressing', googleFamily: 'Caesar+Dressing' },
  mushroomJungle: { family: 'Shizuru', googleFamily: 'Shizuru' },
  floodedPlains: {
    family: 'Rubik Marker Hatch',
    googleFamily: 'Rubik+Marker+Hatch',
  },
  titanGardens: {
    family: 'Mountains of Christmas',
    googleFamily: 'Mountains+of+Christmas',
  },
  fieldSea: { family: 'Mystery Quest', googleFamily: 'Mystery+Quest' },
  silentDesert: {
    family: 'Fredericka the Great',
    googleFamily: 'Fredericka+the+Great',
  },
}
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
npm run lint
```

Expected: no errors. If there are unused-import errors from `misc.ts`, they will have been cleaned up already. If TypeScript complains about a missing `BIOME_FONTS` import anywhere, search for it and remove the import.

- [ ] **Step 4: Run tests**

```bash
npm test -- --run
```

Expected: all 203 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/biomes/[biome]/page.tsx src/constants/misc.ts
git commit -m "feat: remove Google Fonts CDN dependency from biome pages"
```
