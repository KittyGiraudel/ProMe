export const SETTINGS_SCHEMA_VERSION = 1 as const

export type AppSettings = {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION
  sheet: {
    adaptiveNightMode: boolean
  }
}
