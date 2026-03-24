export const SETTINGS_SCHEMA_VERSION = 1 as const

export type AppSettings = {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION
  sheet: {
    adaptiveNightMode: boolean
  }
  journal: {
    /** When true, journal timeline is reverse chronological (newest first). */
    timelineReverseChronological: boolean
  }
}
