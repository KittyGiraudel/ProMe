# Biome Light Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating light/dark toggle to biome pages, with a fully immersive biome-tinted light palette for each of the six biomes.

**Architecture:** All biome tokens live in `BiomePage.css` scoped under `body:has(.BiomePage[data-biome-theme="dark|light"][data-biome="X"])` selectors. `BiomePage` holds a `biomeTheme` local state (initialised from the global app theme), passes it as a `data-biome-theme` attribute to the root `<Layout>`, and syncs `data-app-theme` on `<html>` so Ant Design nav components follow suit. A new `BiomeThemeToggle` floating button toggles the state.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS custom properties, Ant Design Layout

---

### Task 1: Qualify existing dark blocks in BiomePage.css

The six existing `body:has(.BiomePage[data-biome="X"])` blocks need `[data-biome-theme="dark"]` added to their selectors. Also add a shared `[data-biome-theme="dark"]` block (for theme-level tokens) and a shared `[data-biome-theme="light"]` block.

**Files:**
- Modify: `src/components/PageBiome/BiomePage.css`

- [ ] **Step 1: Add `[data-biome-theme="dark"]` to all six dark selectors**

In `src/components/PageBiome/BiomePage.css`, replace each selector at lines 11, 27, 43, 59, 75, 91:

```css
/* shadowForest — was: body:has(.BiomePage[data-biome="shadowForest"]) */
body:has(.BiomePage[data-biome-theme="dark"][data-biome="shadowForest"]) {

/* floodedPlains — was: body:has(.BiomePage[data-biome="floodedPlains"]) */
body:has(.BiomePage[data-biome-theme="dark"][data-biome="floodedPlains"]) {

/* mushroomJungle — was: body:has(.BiomePage[data-biome="mushroomJungle"]) */
body:has(.BiomePage[data-biome-theme="dark"][data-biome="mushroomJungle"]) {

/* fieldSea — was: body:has(.BiomePage[data-biome="fieldSea"]) */
body:has(.BiomePage[data-biome-theme="dark"][data-biome="fieldSea"]) {

/* silentDesert — was: body:has(.BiomePage[data-biome="silentDesert"]) */
body:has(.BiomePage[data-biome-theme="dark"][data-biome="silentDesert"]) {

/* titanGardens — was: body:has(.BiomePage[data-biome="titanGardens"]) */
body:has(.BiomePage[data-biome-theme="dark"][data-biome="titanGardens"]) {
```

- [ ] **Step 2: Add shared theme-level token blocks after the six dark blocks, before `body:has(.BiomePage)`**

Insert after the titanGardens block and before `body:has(.BiomePage) {`:

```css
/* ── Shared theme-level tokens ───────────────────────────────── */

body:has(.BiomePage[data-biome-theme="dark"]) {
  --biome-hero-text: rgb(255 255 255 / 0.8);
  --biome-hero-scrim: rgb(0 0 0 / 0.7);
  --biome-hint-bg: rgb(255 255 255 / 0.03);
}

body:has(.BiomePage[data-biome-theme="light"]) {
  --biome-hero-text: var(--biome-text);
  --biome-hero-scrim: rgb(255 255 255 / 0.6);
  --biome-hint-bg: rgb(0 0 0 / 0.04);
}
```

- [ ] **Step 3: Verify the page still renders correctly in dark mode**

Start the dev server (`npm run dev`) and open any biome page (e.g. `http://localhost:3000/en/biomes/shadow-forest`). The page should look identical to before — all dark biome tokens still applied. Dark mode is working.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/PageBiome/BiomePage.css
git commit -m "refactor(biome): qualify dark token selectors with data-biome-theme"
```

---

### Task 2: Add light palette blocks to BiomePage.css

**Files:**
- Modify: `src/components/PageBiome/BiomePage.css`

- [ ] **Step 1: Append the six light biome blocks to BiomePage.css**

Add the following after the shared `[data-biome-theme="light"]` block (still before `body:has(.BiomePage)`):

```css
/* ── Per-biome light palette tokens ─────────────────────────── */

body:has(.BiomePage[data-biome-theme="light"][data-biome="shadowForest"]) {
  --biome-bg: #ede8f5;
  --biome-surface: #ddd4f0;
  --biome-border: rgb(106 78 155 / 0.22);
  --biome-accent: #5a3d99;
  --biome-text: #1a1228;
  --biome-text-muted: #5a4f7a;
  --biome-hero-gradient: linear-gradient(
    165deg,
    #d0c0ec 0%,
    #c0a8e0 35%,
    #b090d8 65%,
    #9870c8 100%
  );
}

body:has(.BiomePage[data-biome-theme="light"][data-biome="floodedPlains"]) {
  --biome-bg: #e4f3fb;
  --biome-surface: #d0e8f8;
  --biome-border: rgb(20 120 170 / 0.20);
  --biome-accent: #1464a0;
  --biome-text: #0d1e28;
  --biome-text-muted: #3a6e90;
  --biome-hero-gradient: linear-gradient(
    165deg,
    #b8dcf4 0%,
    #90c4e8 35%,
    #6aaad8 65%,
    #4890c8 100%
  );
}

body:has(.BiomePage[data-biome-theme="light"][data-biome="mushroomJungle"]) {
  --biome-bg: #f0e8de;
  --biome-surface: #e2d4c4;
  --biome-border: rgb(130 95 65 / 0.20);
  --biome-accent: #7a5038;
  --biome-text: #1e150f;
  --biome-text-muted: #7a6050;
  --biome-hero-gradient: linear-gradient(
    165deg,
    #d8c0a0 0%,
    #c4a080 35%,
    #b08060 65%,
    #9a6848 100%
  );
}

body:has(.BiomePage[data-biome-theme="light"][data-biome="fieldSea"]) {
  --biome-bg: #e4f5ec;
  --biome-surface: #cce8d8;
  --biome-border: rgb(30 110 65 / 0.20);
  --biome-accent: #1a6840;
  --biome-text: #0d2018;
  --biome-text-muted: #3a7055;
  --biome-hero-gradient: linear-gradient(
    165deg,
    #a8e0c0 0%,
    #80c8a0 35%,
    #58b080 65%,
    #389860 100%
  );
}

body:has(.BiomePage[data-biome-theme="light"][data-biome="silentDesert"]) {
  --biome-bg: #f5e8c8;
  --biome-surface: #ead4a0;
  --biome-border: rgb(160 120 20 / 0.20);
  --biome-accent: #8a6410;
  --biome-text: #1e1808;
  --biome-text-muted: #7a6030;
  --biome-hero-gradient: linear-gradient(
    165deg,
    #e8cc88 0%,
    #d8b860 35%,
    #c8a040 65%,
    #b88820 100%
  );
}

body:has(.BiomePage[data-biome-theme="light"][data-biome="titanGardens"]) {
  --biome-bg: #f5e0dc;
  --biome-surface: #e8cac4;
  --biome-border: rgb(160 50 36 / 0.20);
  --biome-accent: #943020;
  --biome-text: #1e0d0a;
  --biome-text-muted: #7a4038;
  --biome-hero-gradient: linear-gradient(
    165deg,
    #e8b0a0 0%,
    #d89080 35%,
    #c87060 65%,
    #b85048 100%
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PageBiome/BiomePage.css
git commit -m "feat(biome): add light palette token blocks for all six biomes"
```

---

### Task 3: Update BiomeHero.css to use tokens

Replace three hardcoded colour values that break in light mode.

**Files:**
- Modify: `src/components/PageBiome/BiomeHero.css`

- [ ] **Step 1: Replace hardcoded white title colour**

In `.BiomeHero__title`, replace:
```css
  color: rgb(255 255 255 / 0.8);
```
with:
```css
  color: var(--biome-hero-text);
```

- [ ] **Step 2: Replace hardcoded black scrim in the overlay gradient**

In `.BiomeHero__overlay`, the `background` currently is:
```css
  background: linear-gradient(
    180deg,
    transparent 30%,
    rgb(0 0 0 / 0.7) 75%,
    var(--biome-bg) 97%
  );
```
Replace the mid-stop:
```css
  background: linear-gradient(
    180deg,
    transparent 30%,
    var(--biome-hero-scrim) 75%,
    var(--biome-bg) 97%
  );
```

- [ ] **Step 3: Replace hardcoded white scroll-hint colour**

In `.BiomeHero__scrollHint`, replace:
```css
  color: rgb(255 255 255 / 0.3);
```
with:
```css
  color: var(--biome-text-muted);
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PageBiome/BiomeHero.css
git commit -m "refactor(biome): replace hardcoded hero colours with CSS tokens"
```

---

### Task 4: Update BiomeGathering.css to use `--biome-hint-bg`

**Files:**
- Modify: `src/components/PageBiome/BiomeGathering.css`

- [ ] **Step 1: Replace hardcoded hint background**

In `.BiomeGathering__hint`, replace:
```css
  background: rgb(255 255 255 / 0.03);
```
with:
```css
  background: var(--biome-hint-bg);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PageBiome/BiomeGathering.css
git commit -m "refactor(biome): replace hardcoded hint background with CSS token"
```

---

### Task 5: Create the BiomeThemeToggle component

A small floating button that shows ☀ in dark mode (click → light) and ☾ in light mode (click → dark). Styled with biome tokens so it adapts automatically.

**Files:**
- Create: `src/components/PageBiome/BiomeThemeToggle.tsx`
- Create: `src/components/PageBiome/BiomeThemeToggle.css`

- [ ] **Step 1: Create BiomeThemeToggle.css**

```css
.BiomeThemeToggle {
  position: fixed;
  bottom: 1.5em;
  right: 1.5em;
  z-index: 50;
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  border: 1px solid var(--biome-border);
  background: var(--biome-surface);
  color: var(--biome-accent);
  cursor: pointer;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  line-height: 1;
}

.BiomeThemeToggle:hover,
.BiomeThemeToggle:focus-visible {
  background: var(--biome-bg);
  border-color: var(--biome-accent);
  outline: 2px solid var(--biome-accent);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Create BiomeThemeToggle.tsx**

```tsx
'use client'

import './BiomeThemeToggle.css'

type Props = {
  biomeTheme: 'light' | 'dark'
  onToggle: () => void
}

export function BiomeThemeToggle({ biomeTheme, onToggle }: Props) {
  const label =
    biomeTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      className='BiomeThemeToggle'
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      {biomeTheme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PageBiome/BiomeThemeToggle.tsx src/components/PageBiome/BiomeThemeToggle.css
git commit -m "feat(biome): add BiomeThemeToggle floating button component"
```

---

### Task 6: Wire everything together in BiomePage.tsx

Add `biomeTheme` state, update the `useEffect`, pass `data-biome-theme` to the Layout, and render `BiomeThemeToggle`.

**Files:**
- Modify: `src/components/PageBiome/BiomePage.tsx`

- [ ] **Step 1: Add the import for `useSettings` and `BiomeThemeToggle`**

Add two imports after the existing imports, before `import './BiomePage.css'`:

```tsx
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { BiomeThemeToggle } from './BiomeThemeToggle'
```

- [ ] **Step 2: Add `biomeTheme` state inside the component**

Inside `BiomePage`, add after `const index = BIOME_IDS.indexOf(biome)`:

```tsx
const { settings } = useSettings()
const [biomeTheme, setBiomeTheme] = useState<'light' | 'dark'>(
  settings.appearance.theme
)
```

Add `useState` to the existing React import: `import { useEffect, useState } from 'react'`

- [ ] **Step 3: Update the useEffect to sync `data-app-theme` from `biomeTheme`**

Replace the existing `useEffect`:

```tsx
useEffect(() => {
  const prev = document.documentElement.dataset.appTheme
  document.documentElement.dataset.appTheme = biomeTheme
  document.body.dataset.biome = biome
  return () => {
    document.documentElement.dataset.appTheme = prev ?? ''
    document.body.dataset.biome = ''
  }
}, [biome, biomeTheme])
```

- [ ] **Step 4: Pass `data-biome-theme` to the Layout and render `BiomeThemeToggle`**

Replace the opening `<Layout>` line:

```tsx
// was:
<Layout className='BiomePage' data-biome={biome}>
// becomes:
<Layout className='BiomePage' data-biome={biome} data-biome-theme={biomeTheme}>
```

Add `<BiomeThemeToggle>` as the last child of the `<Layout>`, after `<Layout.Footer>`:

```tsx
      <Layout.Footer className='BiomePage__footer'>
        <Footer />
      </Layout.Footer>
      <BiomeThemeToggle
        biomeTheme={biomeTheme}
        onToggle={() => setBiomeTheme(t => (t === 'dark' ? 'light' : 'dark'))}
      />
    </Layout>
```

- [ ] **Step 5: Verify in the browser**

Run `npm run dev`. Open a biome page (e.g. `http://localhost:3000/en/biomes/shadow-forest`).

Check:
- Page loads in dark mode by default (if global theme is dark)
- The ☀ button is visible bottom-right
- Clicking it switches the page to light mode with the biome-tinted palette
- The ☾ button is now visible; clicking it switches back to dark
- Try all six biome pages — each should have its own tinted light palette
- No console errors

Stop the dev server.

- [ ] **Step 6: Run lint and format**

```bash
npm run lint && npm run format
```

Fix any errors reported. Re-run until both pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/PageBiome/BiomePage.tsx
git commit -m "feat(biome): wire light/dark toggle state and BiomeThemeToggle into BiomePage"
```
