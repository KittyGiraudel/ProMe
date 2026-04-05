import { type AppSettings, SETTINGS_SCHEMA_VERSION } from './types'

export const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  sheet: {
    adaptiveNightMode: false,
    singlePageMode: true,
  },
  journal: {
    timelineReverseChronological: false,
  },
  village: {
    mergeDuplicateEstablishments: false,
  },
  map: {
    tickClockOnMove: false,
    showBiomeBackground: true,
    coordinatesDisplay: 'both',
  },
  sound: {
    enabled: false,
    variant: 'mix',
  },
}

export function normalizeSettings(value: unknown): AppSettings {
  const source = value as Partial<AppSettings> | undefined
  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    sheet: {
      adaptiveNightMode: source?.sheet?.adaptiveNightMode === true,
      singlePageMode: source?.sheet?.singlePageMode !== false,
    },
    journal: {
      timelineReverseChronological:
        source?.journal?.timelineReverseChronological === true,
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
    },
    sound: {
      enabled: source?.sound?.enabled === true,
      variant: (['mix', 'music', 'ambiance'] as const).includes(
        source?.sound?.variant as 'mix' | 'music' | 'ambiance'
      )
        ? (source!.sound!.variant as 'mix' | 'music' | 'ambiance')
        : 'mix',
    },
  }
}
