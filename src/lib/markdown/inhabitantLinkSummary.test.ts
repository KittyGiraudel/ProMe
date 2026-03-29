import { describe, expect, it } from 'vitest'
import { getNpcJournalSummary } from './inhabitantLinkSummary'
import { parseGeneratorLink } from './generatorLink'
import { testLocalize } from '@/lib/localization/testLocalize'

describe('markdown/inhabitantLinkSummary', () => {
  it('returns a summary label for valid NPC share URLs', () => {
    const url = 'https://example.com/generators/npc/1H2H2C3111'
    const parsed = parseGeneratorLink(url)
    expect(parsed?.kind).toBe('npc')
    const summary = getNpcJournalSummary(parsed!.encodedId, testLocalize)
    expect(summary).toBeTruthy()
    expect(summary).toContain('(')
  })

  it('returns null for invalid NPC URLs', () => {
    const parsed = parseGeneratorLink(
      'https://example.com/generators/npc/NOT_A_VALID_ROLL'
    )
    expect(parsed?.kind).toBe('npc')
    expect(getNpcJournalSummary(parsed!.encodedId, testLocalize)).toBeNull()
  })
})
