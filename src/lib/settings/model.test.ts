import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, normalizeSettings } from './model'

describe('settings/model', () => {
  it('normalizes unknown payload to defaults', () => {
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS)
  })

  it('keeps adaptiveNightMode when payload enables it', () => {
    expect(
      normalizeSettings({
        sheet: { adaptiveNightMode: true },
      }).sheet.adaptiveNightMode
    ).toBe(true)
  })

  it('keeps timelineReverseChronological when payload enables it', () => {
    expect(
      normalizeSettings({
        journal: { timelineReverseChronological: true },
      }).journal.timelineReverseChronological
    ).toBe(true)
  })

  it('keeps mergeDuplicateEstablishments when payload enables it', () => {
    expect(
      normalizeSettings({
        village: { mergeDuplicateEstablishments: true },
      }).village.mergeDuplicateEstablishments
    ).toBe(true)
  })

  it('keeps tickClockOnMove when payload enables it', () => {
    expect(
      normalizeSettings({
        map: { tickClockOnMove: true },
      }).map.tickClockOnMove
    ).toBe(true)
  })
})
