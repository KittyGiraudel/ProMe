import type { SoundVariant } from '@/lib/sounds/catalog'

export const SETTINGS_SCHEMA_VERSION = 1 as const

export type AppSettings = {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION
  sheet: {
    adaptiveAppearanceTheme: boolean
    /** When true, the character sheet is rendered as a single scrollable page instead of tabs. */
    singlePageMode: boolean
  }
  journal: {
    /** When true, journal timeline is reverse chronological (newest first). */
    timelineReverseChronological: boolean
    /** When true, moving on the map appends a prefilled journal entry (next clock slice). */
    createEntryOnMove: boolean
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
    coordinatesDisplay: 'axes' | 'cells' | 'both'
    /** Controls the perspective style of the map display. */
    style: 'flat' | 'tilted' | 'tilting-on-hover'
  }
  sound: {
    /** When true, ambient music plays based on the current biome. Defaults to false. */
    enabled: boolean
    /** Which variant of the soundtrack to play. Defaults to 'mix'. */
    variant: SoundVariant
  }
  appearance: {
    /** Controls the theme (light or dark mode). Defaults to 'light'. */
    theme: 'light' | 'dark'
  }
}
