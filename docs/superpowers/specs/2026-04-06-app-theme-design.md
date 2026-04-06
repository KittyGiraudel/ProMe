# App Theme (Light / Dark) — Design Spec

**Date:** 2026-04-06

## Goal

Add a persistent light/dark theme setting to ProMe. The default is light. The OS/browser `prefers-color-scheme` signal is intentionally ignored. The existing adaptive night mode for the character sheet bypasses the global theme entirely when enabled.

---

## Data Model

### New `appearance` group in `AppSettings`

```ts
appearance: {
  theme: 'light' | 'dark'
}
```

- **Default:** `'light'`
- **Normalization:** `normalizeSettings` validates `theme` against `['light', 'dark']`, falls back to `'light'` if missing or invalid.
- **Persistence:** stored as part of the existing `prome:settings:v1` localStorage key — no migration needed.

---

## Theme Application

### Problem

`SettingsProvider` is currently nested *inside* `ConfigProvider` in `AppProviders.tsx`, so the `ConfigProvider` cannot read settings from context.

### Solution: `ThemeProvider` child component

A new `ThemeProvider` component is added. It lives *inside* `SettingsProvider` and wraps `ConfigProvider`. It reads `useSettings()` and selects the correct Ant Design algorithm and tokens.

Structure:

```
AppProviders
  └── ConfigProvider (locale only, no theme)
        └── SettingsProvider
              └── ThemeProvider          ← new
                    └── ConfigProvider   ← now carries the theme
                          └── NavigationBlockerProvider
                                └── App
                                      └── {children}
```

The `ThemeProvider` passes either:
- **Light** (default): the existing token set with no `algorithm`
- **Dark**: `antdTheme.darkAlgorithm` + the same custom tokens already defined in `CHARACTER_SHEET_NIGHT_THEME`

The tokens from `CHARACTER_SHEET_NIGHT_THEME` are extracted into a shared constant (e.g. `DARK_THEME_TOKENS`) so both the global dark theme and the character sheet night theme reference it without duplication.

---

## Adaptive Night Mode Interaction

`useCharacterSheetTheme` returns a `configTheme` used by `CharacterSheetShell` in a nested `ConfigProvider`.

Behaviour:

| `adaptiveNightMode` | Clock phase | `configTheme` applied to sheet |
|---|---|---|
| off | any | `undefined` — sheet inherits global theme |
| on | night | `CHARACTER_SHEET_NIGHT_THEME` (dark, green-tinted) |
| on | day | Light override theme — resets sheet to light regardless of global theme |

The day override theme when adaptive is on just needs to neutralise any global dark algorithm for the sheet. It uses `antdTheme.defaultAlgorithm` with the base light tokens.

The help text for `adaptiveNightMode` in settings is updated to clarify it overrides the app theme for the character sheet.

---

## Settings UI

A new **"Appearance"** `Card` is added to the settings page. It contains a single `Select` field:

- **Label:** "Theme"
- **Options:** Light, Dark
- **Form field name:** `appTheme`
- **Position:** first card, before the existing sheet/map/etc. cards

The `SettingsFormValues` type, `initialValues`, `handleReset`, and `handleValuesChange` in `Settings.tsx` are all updated to include `appTheme`.

---

## i18n

New translation keys needed (both `en.json` and `fr.json`):

```
settings.section_appearance
settings.app_theme_label
settings.app_theme_light
settings.app_theme_dark
settings.adaptive_night_mode_help  ← updated to mention override behaviour
```

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/settings/types.ts` | Add `appearance: { theme: 'light' \| 'dark' }` |
| `src/lib/settings/model.ts` | Add to `DEFAULT_SETTINGS` and `normalizeSettings` |
| `src/lib/settings/model.test.ts` | Update normalization tests |
| `src/components/AppProviders/AppProviders.tsx` | Restructure to use `ThemeProvider`; outer `ConfigProvider` becomes locale-only |
| `src/components/AppProviders/ThemeProvider.tsx` | New component |
| `src/hooks/useCharacterSheetTheme.ts` | Add day-phase light override when adaptive is on |
| `src/components/PageSettings/Settings.tsx` | Add `appTheme` field; new Appearance card |
| `messages/en.json` | New keys |
| `messages/fr.json` | New keys |
