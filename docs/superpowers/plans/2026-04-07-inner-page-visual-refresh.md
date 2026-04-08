# Inner Page Visual Refresh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Forest & Parchment theme to all inner pages: warm parchment surfaces, forest green primary, pill buttons, tinted card headers — light mode only.

**Architecture:** Three changes in concert — CSS custom property updates in `globals.css`, Ant Design token overrides in `ThemeProvider`, and a new `app-theme.css` for overrides that tokens can't express (card header gradient, breadcrumb colours). Dark mode is untouched: token overrides are conditional on the light algorithm.

**Tech Stack:** Next.js App Router, Ant Design 5.x (ConfigProvider token API), CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-04-07-inner-page-visual-refresh-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/app/globals.css` | Modify | CSS custom properties used across the codebase |
| `src/components/AppProviders/ThemeProvider.tsx` | Modify | Ant Design ConfigProvider token overrides |
| `src/app/app-theme.css` | Create | Ant Design selector overrides (card header gradient, breadcrumbs) |
| `src/app/layout.tsx` | Modify | Import the new stylesheet |

---

## Task 1: Update CSS custom properties

**Files:**
- Modify: `src/app/globals.css`

These variables are used in Layout.css, Banner.css, Footer.css, and various component stylesheets. `--prome-border-radius` is newly defined here — `Layout.css` already references it but it was never declared (silently fell back to 0).

- [ ] **Step 1: Open and read the current `:root` block**

Read `src/app/globals.css` lines 1–7. The current values are:
```css
--prome-bg: #f6f9f7;
--prome-surface: #ffffff;
--prome-text: #1f2d2a;
--prome-muted: #5c726b;
--prome-border: #d8e5df;
```

- [ ] **Step 2: Replace the `:root` custom properties block**

Replace lines 1–7 of `src/app/globals.css`:

```css
:root {
  --prome-bg: #faf8f3;
  --prome-surface: #fff9ee;
  --prome-text: #1f2d2a;
  --prome-muted: #5c726b;
  --prome-border: #e2d9c4;
  --prome-border-radius: 10px;
}
```

- [ ] **Step 3: Verify the file looks correct**

Run: `npm run format:check`
Expected: no errors on globals.css (Biome formatter check — no semis, single quotes).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: update CSS custom properties for parchment theme"
```

---

## Task 2: Add Ant Design token overrides to ThemeProvider

**Files:**
- Modify: `src/components/AppProviders/ThemeProvider.tsx`

The current ThemeProvider only passes `algorithm` — no token customisation. Token overrides must only apply to the light algorithm so dark mode is unaffected.

- [ ] **Step 1: Read the current file**

Read `src/components/AppProviders/ThemeProvider.tsx`. Current content:

```tsx
'use client'

import { theme as antdTheme, ConfigProvider } from 'antd'
import { type ReactNode, useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const algorithm =
    settings.appearance.theme === 'dark'
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm
  const theme = useMemo(() => ({ algorithm }), [algorithm])

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>
}
```

- [ ] **Step 2: Replace the file with token-aware version**

```tsx
'use client'

import { theme as antdTheme, ConfigProvider } from 'antd'
import { type ReactNode, useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'

const LIGHT_TOKENS = {
  token: {
    colorPrimary: '#2d6a4f',
    colorBgContainer: '#fff9ee',
    colorBgLayout: '#faf8f3',
    colorBgElevated: '#fff9ee',
    colorBorder: '#e2d9c4',
    borderRadius: 10,
  },
  components: {
    Button: {
      borderRadius: 20,
      borderRadiusSM: 16,
      borderRadiusLG: 24,
    },
  },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const isDark = settings.appearance.theme === 'dark'
  const algorithm = isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm

  const theme = useMemo(
    () => ({
      algorithm,
      ...(isDark ? {} : LIGHT_TOKENS),
    }),
    [algorithm, isDark]
  )

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>
}
```

- [ ] **Step 3: Format and lint**

```bash
npm run format
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AppProviders/ThemeProvider.tsx
git commit -m "style: add Forest & Parchment token overrides for light theme"
```

---

## Task 3: Create app-theme.css and wire it up

**Files:**
- Create: `src/app/app-theme.css`
- Modify: `src/app/layout.tsx`

This file contains Ant Design selector overrides that can't be expressed as tokens. All rules are scoped to avoid dark mode bleed — they apply globally, but since `colorBgContainer` etc. are set per-algorithm in `ThemeProvider`, the dark mode override from Ant Design's dark algorithm will take precedence for its own component backgrounds. The card header gradient is the only risk; dark mode cards use a dark background and won't be affected by a `background` override because Ant Design's dark theme injects its own higher-specificity rules via `[data-theme="dark"]` or CSS-in-JS. Verify this during dev server testing (step 5).

- [ ] **Step 1: Create src/app/app-theme.css**

```css
/* Card headers: green-to-parchment gradient wash */
.ant-card .ant-card-head {
  background: linear-gradient(135deg, #e2f0e8 0%, #f5f0e4 100%);
  border-bottom-color: #d8cfbe;
}

/* Breadcrumb: warm separator and active item */
.ant-breadcrumb .ant-breadcrumb-separator {
  color: #c4b89a;
}
.ant-breadcrumb li:last-child .ant-breadcrumb-link {
  color: #4a4036;
}
```

- [ ] **Step 2: Read layout.tsx to find the import location**

Read `src/app/layout.tsx`. The current import is:

```tsx
import './globals.css'
```

- [ ] **Step 3: Add the import for app-theme.css**

Add immediately after `import './globals.css'`:

```tsx
import './globals.css'
import './app-theme.css'
```

- [ ] **Step 4: Format and lint**

```bash
npm run format
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Start dev server and visually verify**

```bash
npm run dev
```

Open http://localhost:3000 and check the following:

**Light mode:**
- [ ] Page background is warm parchment (not bright white)
- [ ] Cards have a warm surface (#fff9ee) and a green→parchment gradient on their title bar
- [ ] Buttons are pill-shaped (high border radius) with forest green primary
- [ ] Outlined/ghost buttons show green border and text
- [ ] Modals (open one) have parchment background, not pure white
- [ ] A popconfirm (if available) shows parchment background
- [ ] Breadcrumb separator is a warm beige, last item is dark warm brown
- [ ] The content area in Layout has rounded corners (border-radius applied from --prome-border-radius)

**Dark mode** (toggle in settings):
- [ ] Card headers do NOT show the green gradient (should be dark)
- [ ] Buttons use the dark algorithm colours, not forest green
- [ ] Page background is dark, not parchment

- [ ] **Step 6: Commit**

```bash
git add src/app/app-theme.css src/app/layout.tsx
git commit -m "style: add app-theme.css with card header gradient and breadcrumb styles"
```
