import { describe, expect, it } from 'vitest'
import { getInhabitantSummaryFromUrl } from './inhabitantLinkSummary'
import { testLocalize } from '@/lib/localization/testLocalize'

describe('markdown/inhabitantLinkSummary', () => {

  it('returns a summary label for valid NPC share URLs', () => {
    const url = 'https://example.com/generators/npc/1H2H2C3111'
    const summary = getInhabitantSummaryFromUrl(url, testLocalize)
    expect(summary).toBeTruthy()
    expect(summary).toContain('(')
  })

  it('returns null for invalid NPC URLs', () => {
    const summary = getInhabitantSummaryFromUrl(
      'https://example.com/generators/npc/NOT_A_VALID_ROLL',
      testLocalize,
    )
    expect(summary).toBeNull()
  })
})
