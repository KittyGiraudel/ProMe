import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, normalizeSettings } from './model'

describe('settings/model', () => {
  it('normalizes unknown payload to defaults', () => {
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS)
  })

  it('keeps adaptiveAppearanceTheme when payload enables it', () => {
    expect(
      normalizeSettings({
        sheet: { adaptiveAppearanceTheme: true },
      }).sheet.adaptiveAppearanceTheme
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

  it('keeps createEntryOnMove when payload enables it', () => {
    expect(
      normalizeSettings({
        journal: { createEntryOnMove: true },
      }).journal.createEntryOnMove
    ).toBe(true)
  })

  it('defaults sound to disabled with mix variant', () => {
    expect(normalizeSettings(undefined).sound).toEqual({
      enabled: false,
      variant: 'mix',
    })
  })

  it('keeps sound.enabled when true', () => {
    expect(normalizeSettings({ sound: { enabled: true } }).sound.enabled).toBe(
      true
    )
  })

  it('keeps sound.variant when valid', () => {
    expect(
      normalizeSettings({ sound: { variant: 'music' } }).sound.variant
    ).toBe('music')
    expect(
      normalizeSettings({ sound: { variant: 'ambiance' } }).sound.variant
    ).toBe('ambiance')
  })

  it('defaults invalid sound.variant to mix', () => {
    expect(
      normalizeSettings({ sound: { variant: 'invalid' } }).sound.variant
    ).toBe('mix')
  })

  it('defaults appearance.theme to light', () => {
    expect(normalizeSettings(undefined).appearance.theme).toBe('light')
  })

  it('keeps appearance.theme when dark', () => {
    expect(
      normalizeSettings({ appearance: { theme: 'dark' } }).appearance.theme
    ).toBe('dark')
  })

  it('defaults invalid appearance.theme to light', () => {
    expect(
      normalizeSettings({ appearance: { theme: 'midnight' } }).appearance.theme
    ).toBe('light')
  })
})
