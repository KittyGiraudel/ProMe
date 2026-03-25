import { describe, expect, it } from 'vitest'
import { getInhabitantSummaryFromUrl } from './inhabitantLinkSummary'
import { testLocalize } from '@/lib/localization/testLocalize'

describe('markdown/inhabitantLinkSummary', () => {
  it('returns a summary label for valid inhabitant share URLs', () => {
    const url =
      'https://example.com/generators/inhabitant?i=1H2H2C3111'
    const summary = getInhabitantSummaryFromUrl(url, testLocalize)
    expect(summary).toBeTruthy()
    expect(summary).toContain('(')
  })

  it('returns null for non-inhabitant URLs', () => {
    const summary = getInhabitantSummaryFromUrl(
      'https://example.com/generators/village?v=abc',
      testLocalize,
    )
    expect(summary).toBeNull()
  })

  it('returns null for invalid or undecodable inhabitant URLs', () => {
    const summary = getInhabitantSummaryFromUrl(
      'https://example.com/generators/inhabitant?i=NOT_A_VALID_ROLL',
      testLocalize,
    )
    expect(summary).toBeNull()
  })
})
