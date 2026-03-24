import { SETTINGS_SCHEMA_VERSION, type AppSettings } from './types'

export const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  sheet: {
    adaptiveNightMode: false,
  },
}

export function normalizeSettings(value: unknown): AppSettings {
  const source = value as Partial<AppSettings> | undefined
  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    sheet: {
      adaptiveNightMode: source?.sheet?.adaptiveNightMode === true,
    },
  }
}
