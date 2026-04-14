# Header Theme Toggle — Design Spec

**Date:** 2026-04-14  
**Status:** Approved

## Overview

Add a persistent light/dark theme toggle to the global navigation header, replacing the page-local floating toggle on biome pages. The toggle writes to `settings.appearance.theme` via `SettingsContext`, so it persists to localStorage just like the settings page control.

## New component: `ThemeToggleButton`

**Location:** `src/components/Navigation/ThemeToggleButton.tsx` + `ThemeToggleButton.css`

A small circular `<button>` displaying `SunFilled` or `MoonFilled` (from `@ant-design/icons`), identical icon choice to the existing `BiomeThemeToggle`. Props:

```ts
type Props = {
  theme: 'light' | 'dark'
  onToggle: () => void
}
```

- `aria-label` and `title` use `nav.theme.switchToLight` / `nav.theme.switchToDark` translation keys.
- Styled to be subtle: small, circular, no background by default, inherits nav text color. Slight highlight on hover/focus-visible. No fixed positioning.

## Navigation changes

**File:** `src/components/Navigation/Navigation.tsx`

- Destructure `updateSettings` from `useSettings()` (already called).
- Add a new menu item with `key: '/theme-toggle'` placed between Settings and AuthButton.
- Its label is `<ThemeToggleButton theme={settings.appearance.theme} onToggle={() => updateSettings(prev => ({ ...prev, appearance: { ...prev.appearance, theme: prev.appearance.theme === 'dark' ? 'light' : 'dark' } }))} />`.
- Exclude `'/theme-toggle'` from `selectedKeys` logic (no `pathname` match needed).

## Biome page cleanup

### `BiomePage.tsx`
- Remove local `biomeTheme` state, `overridden` ref, and the `useEffect` that synced them from settings.
- Replace all `biomeTheme` usages with `settings.appearance.theme` directly — including the `useEffect` dependency array that sets `document.documentElement.dataset.appTheme`.
- Remove `<BiomeThemeToggle>` usage and its import.

### `BiomeHeader.tsx`
- Remove the `biomeTheme` prop entirely.
- `Navigation` no longer needs `themeOverride` — remove the prop pass.

### Deleted files
- `src/components/PageBiome/BiomeThemeToggle.tsx`
- `src/components/PageBiome/BiomeThemeToggle.css`

## i18n

Rename translation keys in both `fr` and `en` message files:

| Old key | New key |
|---|---|
| `biomes.theme.switchToLight` | `nav.theme.switchToLight` |
| `biomes.theme.switchToDark` | `nav.theme.switchToDark` |

The old keys are removed. No other consumers exist.

## What stays unchanged

- `useApplyAppTheme` and the `document.documentElement.dataset.appTheme` effect in `BiomePage` — these handle CSS variable scoping for biome-specific theming and are unrelated to theme state management.
- The `Segmented` control on the settings page — it remains as-is, both controls write to the same setting.
- `ThemeProvider` and `SettingsContext` — no changes needed.
