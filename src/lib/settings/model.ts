import { type AppSettings, AppTheme, SETTINGS_SCHEMA_VERSION } from './types'

export const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  sheet: {
    adaptiveAppearanceTheme: false,
  },
  journal: {
    timelineReverseChronological: false,
    createEntryOnMove: false,
  },
  village: {
    mergeDuplicateEstablishments: false,
  },
  map: {
    tickClockOnMove: false,
    showBiomeBackground: true,
    coordinatesDisplay: 'both',
    style: 'flat',
  },
  sound: {
    enabled: false,
    variant: 'mix',
  },
  appearance: {
    theme: 'light',
  },
  shortcuts: {
    enabled: true,
  },
}

export function normalizeSettings(value: unknown): AppSettings {
  const source = value as Partial<AppSettings> | undefined
  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    sheet: {
      adaptiveAppearanceTheme: source?.sheet?.adaptiveAppearanceTheme === true,
    },
    journal: {
      timelineReverseChronological:
        source?.journal?.timelineReverseChronological === true,
      createEntryOnMove: source?.journal?.createEntryOnMove === true,
    },
    village: {
      mergeDuplicateEstablishments:
        source?.village?.mergeDuplicateEstablishments === true,
    },
    map: {
      tickClockOnMove: source?.map?.tickClockOnMove === true,
      showBiomeBackground: source?.map?.showBiomeBackground !== false,
      coordinatesDisplay: (['axes', 'cells', 'both'] as const).includes(
        source?.map?.coordinatesDisplay as 'axes' | 'cells' | 'both'
      )
        ? (source!.map!.coordinatesDisplay as 'axes' | 'cells' | 'both')
        : 'both',
      style: (['flat', 'tilted', 'tilting-on-hover'] as const).includes(
        source?.map?.style as 'flat' | 'tilted' | 'tilting-on-hover'
      )
        ? (source!.map!.style as 'flat' | 'tilted' | 'tilting-on-hover')
        : 'flat',
    },
    sound: {
      enabled: source?.sound?.enabled === true,
      variant: (['mix', 'music', 'ambiance'] as const).includes(
        source?.sound?.variant as 'mix' | 'music' | 'ambiance'
      )
        ? (source!.sound!.variant as 'mix' | 'music' | 'ambiance')
        : 'mix',
    },
    appearance: {
      theme: (['light', 'dark'] as const).includes(
        source?.appearance?.theme as AppTheme
      )
        ? (source!.appearance!.theme as AppTheme)
        : 'light',
    },
    shortcuts: {
      enabled: source?.shortcuts?.enabled !== false,
    },
  }
}
