# Header Theme Toggle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent sun/moon icon toggle to the global navigation header that writes to `settings.appearance.theme`, and remove the now-redundant page-local toggle from biome pages.

**Architecture:** A new `ThemeToggleButton` component slots into `Navigation` as a menu item, calling `updateSettings` from the already-present `useSettings()` hook. Biome pages are simplified to read `settings.appearance.theme` directly, and `BiomeThemeToggle` is deleted.

**Tech Stack:** React, TypeScript, Ant Design (`@ant-design/icons`), `next-intl`, CSS Modules (plain CSS with BEM-style classes)

---

## File Map

| Action | Path |
|--------|------|
| Create | `src/components/Navigation/ThemeToggleButton.tsx` |
| Create | `src/components/Navigation/ThemeToggleButton.css` |
| Modify | `src/components/Navigation/Navigation.tsx` |
| Modify | `src/components/PageBiome/BiomePage.tsx` |
| Modify | `src/components/PageBiome/BiomeHeader.tsx` |
| Delete | `src/components/PageBiome/BiomeThemeToggle.tsx` |
| Delete | `src/components/PageBiome/BiomeThemeToggle.css` |
| Modify | `messages/fr.json` |
| Modify | `messages/en.json` |

---

## Task 1: Rename i18n keys

Move `biomes.theme.switchToLight` / `biomes.theme.switchToDark` to `nav.theme.switchToLight` / `nav.theme.switchToDark` in both message files. The concept is now app-wide, not biome-specific.

**Files:**
- Modify: `messages/fr.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Update French messages**

In `messages/fr.json`, find the `biomes` object. It contains a `theme` key:

```json
"theme": {
  "switchToLight": "Passer en mode clair",
  "switchToDark": "Passer en mode sombre"
}
```

Remove it from `biomes`. Then find the `nav` object and add the same keys there:

```json
"nav": {
  "characters": "Protecteurs",
  "faq": "FAQ",
  "home": "Accueil",
  "inhabitant_generator": "Générateur d'habitant",
  "login": "Connexion",
  "logout": "Déconnexion",
  "biomes": "Biomes",
  "new_character": "Nouveau Protecteur",
  "settings": "Paramètres",
  "village_generator": "Générateur de village",
  "theme": {
    "switchToLight": "Passer en mode clair",
    "switchToDark": "Passer en mode sombre"
  }
}
```

- [ ] **Step 2: Update English messages**

In `messages/en.json`, do the same. Remove `theme` from `biomes`:

```json
"theme": {
  "switchToLight": "Switch to light mode",
  "switchToDark": "Switch to dark mode"
}
```

Add to `nav`:

```json
"nav": {
  ...existing keys...,
  "theme": {
    "switchToLight": "Switch to light mode",
    "switchToDark": "Switch to dark mode"
  }
}
```

- [ ] **Step 3: Verify build still compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds (or only pre-existing warnings).

- [ ] **Step 4: Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "refactor: move theme toggle i18n keys from biomes to nav"
```

---

## Task 2: Create `ThemeToggleButton` component

A small circular button showing a sun or moon icon. Subtle — transparent background, inherits nav text color, circular hover highlight.

**Files:**
- Create: `src/components/Navigation/ThemeToggleButton.tsx`
- Create: `src/components/Navigation/ThemeToggleButton.css`

- [ ] **Step 1: Create the CSS**

Create `src/components/Navigation/ThemeToggleButton.css`:

```css
.ThemeToggleButton {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
  line-height: 1;
  padding: 0;
}

.ThemeToggleButton:hover,
.ThemeToggleButton:focus-visible {
  border-color: currentColor;
  background: rgb(128 128 128 / 0.15);
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

- [ ] **Step 2: Create the component**

Create `src/components/Navigation/ThemeToggleButton.tsx`:

```tsx
'use client'

import MoonFilled from '@ant-design/icons/lib/icons/MoonFilled'
import SunFilled from '@ant-design/icons/lib/icons/SunFilled'
import { useTranslations } from 'next-intl'
import './ThemeToggleButton.css'

type Props = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggleButton({ theme, onToggle }: Props) {
  const t = useTranslations()
  const label =
    theme === 'dark'
      ? t('nav.theme.switchToLight')
      : t('nav.theme.switchToDark')

  return (
    <button
      className='ThemeToggleButton'
      onClick={onToggle}
      aria-label={label}
      title={label}>
      {theme === 'dark' ? <SunFilled /> : <MoonFilled />}
    </button>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors in the new files.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation/ThemeToggleButton.tsx src/components/Navigation/ThemeToggleButton.css
git commit -m "feat: add ThemeToggleButton component"
```

---

## Task 3: Wire toggle into Navigation

Add `ThemeToggleButton` as a menu item in `Navigation`, between the Settings link and the AuthButton. Update `useMemo` deps accordingly.

**Files:**
- Modify: `src/components/Navigation/Navigation.tsx`

- [ ] **Step 1: Update imports and destructuring**

At the top of `Navigation.tsx`, add the import:

```tsx
import { ThemeToggleButton } from './ThemeToggleButton'
```

In the component body, update the `useSettings` destructure to also get `updateSettings`:

```tsx
const { settings, updateSettings } = useSettings()
```

- [ ] **Step 2: Add the menu item**

In the `items` array (inside `useMemo`), add a new entry just before the `'/authentication'` item:

```tsx
{
  key: '/theme-toggle',
  label: (
    <ThemeToggleButton
      theme={settings.appearance.theme}
      onToggle={() =>
        updateSettings(prev => ({
          ...prev,
          appearance: {
            ...prev.appearance,
            theme: prev.appearance.theme === 'dark' ? 'light' : 'dark',
          },
        }))
      }
    />
  ),
},
```

- [ ] **Step 3: Update useMemo dependency array**

The `items` memo now depends on `settings.appearance.theme` and `updateSettings`. Update:

```tsx
const items = useMemo(
  () => [...],
  [t, settings.appearance.theme, updateSettings]
)
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 5: Smoke test in browser**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- The sun/moon icon appears in the nav bar to the left of the auth button.
- Clicking it toggles the theme (page switches light ↔ dark).
- Refreshing the page preserves the selected theme.
- The settings page Appearance toggle is in sync with the header toggle.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navigation/Navigation.tsx
git commit -m "feat: add theme toggle to navigation header"
```

---

## Task 4: Simplify BiomePage

Remove the page-local theme state and use `settings.appearance.theme` directly. The global header toggle now handles persistence.

**Files:**
- Modify: `src/components/PageBiome/BiomePage.tsx`

- [ ] **Step 1: Rewrite BiomePage**

Replace the entire file content with:

```tsx
'use client'

import { ConfigProvider, Layout } from 'antd'
import { useEffect } from 'react'
import { useAntPalette } from '@/components/AppProviders/ThemeProvider'
import { Footer } from '@/components/Footer/Footer'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { BIOME_IDS } from '@/constants/misc'
import type { BiomeId } from '@/lib/types'
import { BiomeAudio } from './BiomeAudio'
import { BiomeDescription } from './BiomeDescription'
import { BiomeEncounters } from './BiomeEncounters'
import { BiomeGathering } from './BiomeGathering'
import { BiomeHeader } from './BiomeHeader'
import { BiomeHero } from './BiomeHero'
import { BiomeMagic } from './BiomeMagic'
import { BiomeMap } from './BiomeMap'

import './BiomePage.css'

type Props = { biome: BiomeId }

export function BiomePage({ biome }: Props) {
  const index = BIOME_IDS.indexOf(biome)
  const { settings } = useSettings()
  const theme = settings.appearance.theme

  useEffect(() => {
    const prev = document.documentElement.dataset.appTheme
    document.documentElement.dataset.appTheme = theme
    document.body.dataset.biome = biome
    return () => {
      document.documentElement.dataset.appTheme = prev ?? ''
      document.body.dataset.biome = ''
    }
  }, [biome, theme])

  const antTheme = useAntPalette(theme)

  return (
    <ConfigProvider theme={antTheme}>
      <Layout
        className='BiomePage'
        data-biome={biome}
        data-biome-theme={theme}>
        <BiomeHeader />
        <BiomeHero biome={biome} index={index} />
        <Layout.Content className='BiomePage__content'>
          <BiomeDescription biome={biome} />
          <BiomeMagic biome={biome} />
          <BiomeAudio biome={biome} />
          <BiomeEncounters biome={biome} />
          <BiomeGathering biome={biome} />
          <BiomeMap biome={biome} />
        </Layout.Content>
        <Layout.Footer className='BiomePage__footer'>
          <Footer />
        </Layout.Footer>
      </Layout>
    </ConfigProvider>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: one error — `BiomeHeader` still requires `biomeTheme` prop. Proceed to Task 5 before committing; both files are committed together.

---

## Task 5: Simplify BiomeHeader

Remove the `biomeTheme` prop — `Navigation` now reads theme from settings directly.

**Files:**
- Modify: `src/components/PageBiome/BiomeHeader.tsx`

- [ ] **Step 1: Rewrite BiomeHeader**

Replace the entire file content with:

```tsx
'use client'

import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation/Navigation'

import './BiomeHeader.css'

export function BiomeHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Layout.Header className='BiomeHeader' data-scrolled={scrolled}>
      <Navigation />
    </Layout.Header>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit Tasks 4 and 5 together**

```bash
git add src/components/PageBiome/BiomePage.tsx src/components/PageBiome/BiomeHeader.tsx
git commit -m "refactor: remove local biome theme state, use global settings"
```

- [ ] **Step 4: Smoke test biome pages**

Navigate to any biome page (e.g. http://localhost:3000/biomes/silentDesert). Verify:
- Page renders correctly.
- The nav header shows the sun/moon toggle.
- Toggling theme on a biome page persists (refresh keeps the theme).
- There is no floating toggle button in the bottom-right corner.


---

## Task 6: Delete BiomeThemeToggle

Remove the now-unused component and stylesheet.

**Files:**
- Delete: `src/components/PageBiome/BiomeThemeToggle.tsx`
- Delete: `src/components/PageBiome/BiomeThemeToggle.css`

- [ ] **Step 1: Delete the files**

```bash
rm src/components/PageBiome/BiomeThemeToggle.tsx src/components/PageBiome/BiomeThemeToggle.css
```

- [ ] **Step 2: Verify no remaining references**

```bash
grep -r "BiomeThemeToggle" src/
```

Expected: no output.

- [ ] **Step 3: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 4: Run linter**

```bash
npm run lint 2>&1 | tail -20
```

Expected: no errors related to BiomeThemeToggle or the new files.

- [ ] **Step 5: Final smoke test**

Open http://localhost:3000 and verify:
- Header toggle works on all pages (home, characters, settings, biome pages, generators).
- Theme persists across page navigation and refresh.
- Settings page Appearance toggle stays in sync with header toggle.
- No floating button appears on biome pages.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: delete BiomeThemeToggle (replaced by header toggle)"
```
