# Dark Theme Design

**Date:** 2026-04-09  
**Status:** Approved

## Overview

ProMe's light mode uses a warm earthy palette (forest green + parchment/eggshell). The dark mode was previously bare — just Ant Design's `darkAlgorithm` with no token customisation, producing a generic, too-dark, uninviting result.

This spec defines a dark theme that is the natural sibling of the light mode: same forest-green hue family, medium darkness (comfortable in a dark room, not pitch black), and structured identically to the existing light token setup so both themes are easy to maintain together. The primary green (`#2d6a4f`) is identical in both modes.

## Palette

Both modes share the same forest-green hue. Light mode sits at the bright end (~95–99% lightness); dark mode sits at the medium end (~15–20% lightness).

| Role | Light | Dark |
|------|-------|------|
| Page background | `#faf8f3` | `#1a2420` |
| Surface (cards, panels) | `#fff9ee` | `#243028` |
| Elevated (modals, dropdowns) | `#fff9ee` | `#2e3c32` |
| Border | `#c4b49a` | `#3a4e44` |
| Border secondary | `#d4c5a9` | `#2e4438` |
| Primary action | `#2d6a4f` | `#2d6a4f` |
| Body text | `#1f2d2a` | `#c8ddd0` |
| Muted text | `#5c726b` | `#7a9e88` |

## Files Changed

### `src/components/AppProviders/ThemeProvider.tsx`

Add a `DARK_TOKENS` const that mirrors `LIGHT_TOKENS` in structure:

```ts
const DARK_TOKENS = {
  token: {
    colorPrimary: '#2d6a4f',
    colorBgContainer: '#243028',
    colorBgLayout: '#1a2420',
    colorBgElevated: '#2e3c32',
    colorBorder: '#3a4e44',
    colorBorderSecondary: '#2e4438',
    borderRadius: 10,
  },
  components: {
    Button: {
      borderRadius: 20,
      borderRadiusSM: 16,
      borderRadiusLG: 24,
    },
    Segmented: {
      trackBg: '#2e4438',
      itemSelectedBg: '#243028',
      itemSelectedColor: '#c8ddd0',
    },
  },
}
```

Apply it in the `theme` memo:

```ts
const theme = useMemo(
  () => ({
    algorithm,
    ...(isDark ? DARK_TOKENS : LIGHT_TOKENS),
  }),
  [algorithm, isDark]
)
```

### `src/app/globals.css`

Update the `html[data-theme='dark']` block:

```css
html[data-theme="dark"] {
  --prome-bg: #1a2420;
  --prome-surface: #243028;
  --prome-text: #c8ddd0;
  --prome-muted: #7a9e88;
  --prome-border: #3a4e44;
  --prome-border-radius: 10px;
}
```

### `src/app/app-theme.css`

Add dark-mode equivalents of the existing light-mode card and breadcrumb overrides:

```css
/* Card headers: forest green gradient wash (dark mode) */
html[data-theme="dark"] .ant-card .ant-card-head {
  background: linear-gradient(135deg, #2a3a30 0%, #243028 100%);
  border-bottom-color: #3a4e44;
}

/* Breadcrumb: forest separator and active item (dark mode) */
html[data-theme="dark"] .ant-breadcrumb .ant-breadcrumb-separator {
  color: #3a4e44;
}
html[data-theme="dark"] .ant-breadcrumb li:last-child .ant-breadcrumb-link {
  color: #c8ddd0;
}
```

## Out of Scope

- Biome pattern colours (already have `[data-appearance="dark"]` handling)
- Landing page visuals (not shown in dark mode)
- Per-component dark overrides beyond cards and breadcrumbs (added only if visible issues arise during implementation)
