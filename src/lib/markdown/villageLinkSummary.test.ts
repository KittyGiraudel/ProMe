import { describe, expect, it } from 'vitest'
import { getVillageJournalSummary } from './villageLinkSummary'
import { parseGeneratorLink } from './generatorLink'
import { testLocalize } from '@/lib/localization/testLocalize'

describe('markdown/villageLinkSummary', () => {
  it('returns village summary with faction when URL is valid', () => {
    const parsed = parseGeneratorLink(
      'https://example.com/generators/village/S2C3D4H5S6.X?f=bruja'
    )
    expect(parsed?.kind).toBe('village')
    const summary = getVillageJournalSummary(
      parsed!.encodedId,
      testLocalize,
      undefined,
      parsed!.faction
    )
    expect(summary).toBe('Village (Bruja), 5 établissements')
  })

  it('returns village summary without faction when f is absent', () => {
    const parsed = parseGeneratorLink(
      'https://example.com/generators/village/S2C3D4H5S6.X'
    )
    expect(parsed?.kind).toBe('village')
    const summary = getVillageJournalSummary(
      parsed!.encodedId,
      testLocalize,
      undefined,
      parsed!.faction
    )
    expect(summary).toBe('Village, 5 établissements')
  })

  /** Two red aces (HA, DA) share one establishment line; grouped count is 4 lines vs 5 rows. */
  it('uses merged establishment count when mergeDuplicateEstablishments is true', () => {
    const parsed = parseGeneratorLink(
      'https://example.com/generators/village/HADAC3S4H5.X'
    )
    expect(parsed?.kind).toBe('village')
    const id = parsed!.encodedId
    expect(
      getVillageJournalSummary(id, testLocalize, undefined, parsed!.faction)
    ).toBe('Village, 5 établissements')
    expect(
      getVillageJournalSummary(id, testLocalize, {
        mergeDuplicateEstablishments: true,
      })
    ).toBe('Village, 4 établissements')
  })

  it('returns null for invalid village URLs', () => {
    const parsed = parseGeneratorLink(
      'https://example.com/generators/village/bad.X'
    )
    expect(parsed?.kind).toBe('village')
    expect(getVillageJournalSummary(parsed!.encodedId, testLocalize)).toBeNull()
  })
})
