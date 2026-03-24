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
})
