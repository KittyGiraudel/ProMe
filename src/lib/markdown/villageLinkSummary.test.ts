import { describe, expect, it } from 'vitest'
import { getVillageSummaryFromUrl } from './villageLinkSummary'

describe('markdown/villageLinkSummary', () => {
  it('returns village summary with faction when URL is valid', () => {
    const summary = getVillageSummaryFromUrl(
      'https://example.com/generators/village?v=S2C3D4H5S6&f=bruja'
    )
    expect(summary).toBe('Village (Bruja), 5 établissements')
  })

  it('returns village summary without faction when f is absent', () => {
    const summary = getVillageSummaryFromUrl(
      'https://example.com/generators/village?v=S2C3D4H5S6'
    )
    expect(summary).toBe('Village, 5 établissements')
  })

  /** Two red aces (HA, DA) share one establishment line; grouped count is 4 lines vs 5 rows. */
  it('uses merged establishment count when mergeDuplicateEstablishments is true', () => {
    const url = 'https://example.com/generators/village?v=HADAC3S4H5'
    expect(getVillageSummaryFromUrl(url)).toBe('Village, 5 établissements')
    expect(
      getVillageSummaryFromUrl(url, { mergeDuplicateEstablishments: true })
    ).toBe('Village, 4 établissements')
  })

  it('returns null for invalid village URLs', () => {
    expect(
      getVillageSummaryFromUrl('https://example.com/generators/village?v=bad')
    ).toBeNull()
    expect(
      getVillageSummaryFromUrl(
        'https://example.com/generators/inhabitant?i=1H2H2C3111'
      )
    ).toBeNull()
  })
})
