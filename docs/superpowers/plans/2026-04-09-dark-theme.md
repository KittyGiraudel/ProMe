# Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bare Ant Design dark mode with a warm amber-ochre dark theme that is the natural sibling of the existing light mode.

**Architecture:** Three targeted file edits — `DARK_TOKENS` added to `ThemeProvider.tsx` (mirrors `LIGHT_TOKENS` structure), CSS custom properties updated in `globals.css`, and dark-mode card/breadcrumb overrides added to `app-theme.css`. No new files, no structural changes.

**Tech Stack:** Ant Design 5 (`ConfigProvider` / `theme`), CSS custom properties, Next.js App Router.

---

### Task 1: Add DARK_TOKENS to ThemeProvider

No unit tests exist for this file (coverage excludes `src/components/**`). Verification is visual — switch to dark mode in Settings after each change.

**Files:**
- Modify: `src/components/AppProviders/ThemeProvider.tsx`

- [ ] **Step 1: Replace the file contents**

The current file only has `LIGHT_TOKENS` and spreads nothing in dark mode. Replace the entire file with the version below, which adds `DARK_TOKENS` and applies it via the existing `isDark` flag.

```typescript
'use client'

import { theme as antdTheme, ConfigProvider } from 'antd'
import { type ReactNode, useEffect, useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'

// Both palettes share the same warm amber-ochre hue (~38–42°).
// Light mode sits at the bright end (~95–99% lightness).
// Dark mode sits at the medium end (~18–25% lightness).
// To adjust both themes together, shift the hue; to adjust one, change its lightness values.

const LIGHT_TOKENS = {
  token: {
    colorPrimary: '#2d6a4f',
    colorBgContainer: '#fff9ee',
    colorBgLayout: '#faf8f3',
    colorBgElevated: '#fff9ee',
    colorBorder: '#c4b49a',
    colorBorderSecondary: '#d4c5a9',
    borderRadius: 10,
  },
  components: {
    Button: {
      borderRadius: 20,
      borderRadiusSM: 16,
      borderRadiusLG: 24,
    },
    Segmented: {
      trackBg: '#c8b89a',
      itemSelectedBg: '#fff9ee',
      itemSelectedColor: '#1f3a2a',
    },
  },
}

const DARK_TOKENS = {
  token: {
    colorPrimary: '#3d8a64',
    colorBgContainer: '#3a3020',
    colorBgLayout: '#2e2518',
    colorBgElevated: '#473b28',
    colorBorder: '#5a4c32',
    colorBorderSecondary: '#4a3e28',
    borderRadius: 10,
  },
  components: {
    Button: {
      borderRadius: 20,
      borderRadiusSM: 16,
      borderRadiusLG: 24,
    },
    Segmented: {
      trackBg: '#4a3e28',
      itemSelectedBg: '#3a3020',
      itemSelectedColor: '#f0e0b8',
    },
  },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const isDark = settings.appearance.theme === 'dark'
  const algorithm = isDark
    ? antdTheme.darkAlgorithm
    : antdTheme.defaultAlgorithm

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  }, [isDark])

  const theme = useMemo(
    () => ({
      algorithm,
      ...(isDark ? DARK_TOKENS : LIGHT_TOKENS),
    }),
    [algorithm, isDark]
  )

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>
}
```

- [ ] **Step 2: Verify no type errors**

```bash
npx tsc --noEmit
```

Expected: no output (clean).

---

### Task 2: Update dark-mode CSS custom properties

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the dark-mode variable block**

Find this block (lines 10–17):

```css
html[data-theme='dark'] {
  --prome-bg: #1f2d2a;
  --prome-surface: #2c3834;
  --prome-text: #f5ece0;
  --prome-muted: #a0a0a0;
  --prome-border: #404040;
  --prome-border-radius: 10px;
}
```

Replace with:

```css
html[data-theme='dark'] {
  --prome-bg: #2e2518;
  --prome-surface: #3a3020;
  --prome-text: #f0e0b8;
  --prome-muted: #aa9a78;
  --prome-border: #5a4c32;
  --prome-border-radius: 10px;
}
```

Key changes: green-tinted vars → warm amber. Muted text changes from flat grey `#a0a0a0` to amber-toned `#aa9a78`.

---

### Task 3: Add dark-mode overrides to app-theme.css

The light-mode card header gradient and breadcrumb tweaks live in `src/app/app-theme.css`. Add their dark counterparts.

**Files:**
- Modify: `src/app/app-theme.css`

- [ ] **Step 1: Append dark-mode rules**

Append to the end of `src/app/app-theme.css`:

```css
/* Card headers: warm amber gradient wash (dark mode) */
html[data-theme="dark"] .ant-card .ant-card-head {
  background: linear-gradient(135deg, #413a24 0%, #3a3020 100%);
  border-bottom-color: #5a4c32;
}

/* Breadcrumb: warm separator and active item (dark mode) */
html[data-theme="dark"] .ant-breadcrumb .ant-breadcrumb-separator {
  color: #5a4c32;
}
html[data-theme="dark"] .ant-breadcrumb li:last-child .ant-breadcrumb-link {
  color: #e0cfa0;
}
```

---

### Task 4: Visual verification and commit

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify dark mode**

1. Open http://localhost:3000 and navigate to Settings
2. Switch to dark mode
3. Check that:
   - Page background is a warm dark brown (not green, not black)
   - Card surfaces are slightly lighter than the page background
   - Card headers have a subtle warm gradient
   - Breadcrumb separator is a muted amber, active item is warm cream
   - Primary buttons use the brighter forest green
   - Muted text reads as warm amber-grey, not flat grey
4. Switch back to light mode — verify it is unchanged

- [ ] **Step 3: Run linter**

```bash
npm run format:check
```

Fix any formatting issues with `npm run format` if reported.

- [ ] **Step 4: Commit**

```bash
git add src/components/AppProviders/ThemeProvider.tsx \
        src/app/globals.css \
        src/app/app-theme.css \
        docs/superpowers/specs/2026-04-09-dark-theme-design.md \
        docs/superpowers/plans/2026-04-09-dark-theme.md
git commit -m "feat: warm amber dark theme to match light mode palette"
```
