export const SETTINGS_SCHEMA_VERSION = 1 as const

export type AppSettings = {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION
  sheet: {
    adaptiveNightMode: boolean
    /** When true, the character sheet is rendered as a single scrollable page instead of tabs. */
    singlePageMode: boolean
  }
  journal: {
    /** When true, journal timeline is reverse chronological (newest first). */
    timelineReverseChronological: boolean
  }
  village: {
    /**
     * When true, duplicate establishment rows are merged in the village generator
     * summary and in journal link labels for village URLs.
     */
    mergeDuplicateEstablishments: boolean
  }
  map: {
    /** When true, moving to an adjacent cell on the character map advances the clock one slice. */
    tickClockOnMove: boolean
    /** When true, biome background patterns are rendered inside each cell. */
    showBiomeBackground: boolean
    /** Controls how cell coordinates are displayed: on the axes, inside cells, or both. */
    coordinatesDisplay: 'axes' | 'hexagons' | 'both'
  }
}
