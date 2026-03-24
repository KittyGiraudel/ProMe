# Settings

This document describes the application-level settings foundation introduced in Phase 1 of the ideas roadmap.

## 1. Scope

- Route: `/settings`
- Persistence: local browser storage (`localStorage`)
- Provider: top-level React context available to all app routes/components
- First shipped setting: adaptive character-sheet night mode

Character payloads no longer store adaptive sheet/night preference.

## 2. Architecture

### 2.1 Module map

| Path                                      | Role                                              |
| ----------------------------------------- | ------------------------------------------------- |
| `src/lib/settings/types.ts`               | Settings schema and future-facing typed sections  |
| `src/lib/settings/model.ts`               | Defaults and normalization for persisted payloads |
| `src/lib/settings/storage.ts`             | LocalStorage read/write (`lsdp:settings:v1`)      |
| `src/app/contexts/SettingsContext.tsx`    | Global provider + `useSettings()` hook            |
| `src/app/settings/page.tsx`               | Route entrypoint                                  |
| `src/app/settings/SettingsPageClient.tsx` | Settings UI                                       |

### 2.2 Storage contract

- Storage key: `lsdp:settings:v1`
- Stored shape:
  - `schemaVersion` (currently `1`)
  - `sheet` section (`adaptiveNightMode`)

Unknown/malformed payloads normalize back to defaults.

## 3. Adaptive sheet behavior

- The setting is edited on `/settings`.
- Character sheets consume the setting through `useSettings()`.
- Night chrome still depends on clock phase, but preference is global:
  - sheet dark mode active only when both:
    - clock phase is night
    - global `settings.sheet.adaptiveNightMode` is enabled
- The old character-level field `clock.sheetDarkWithClockNight` is removed from domain types/normalization.

## 4. Extension notes

- Add new toggles later by extending `AppSettings` in `src/lib/settings/types.ts`.
- Keep migration behavior centralized in `normalizeSettings`.
- Keep route components dumb: put persistence and update logic in settings hooks/context.
