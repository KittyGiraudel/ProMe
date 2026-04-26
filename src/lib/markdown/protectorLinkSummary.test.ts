import { describe, expect, it } from 'vitest'
import { testLocalize } from '@/lib/localization/testLocalize'
import { getProtectorJournalSummary } from './protectorLinkSummary'

describe('markdown/protectorLinkSummary', () => {
  it('formats protector journal label', () => {
    const label = getProtectorJournalSummary(
      {
        id: 'x',
        schemaVersion: 1,
        createdAt: '',
        updatedAt: '',
        name: 'Asha',
        archetype: 'troubadour',
        gender: 'woman',
        honor: 0,
        inspiration: 0,
        money: 0,
        health: { current: 5, max: 5 },
        courage: { current: 5, max: 5 },
        stamina: { current: 5, max: 5 },
        clock: 0,
        map: { currentPosition: { q: 0, r: 0 }, cells: [] },
        inventory: [],
        spellbook: [],
        journalEntries: [],
        lifeStatus: 'alive',
      },
      testLocalize
    )
    expect(label).toContain('Asha')
    expect(label).toContain('♀')
  })
})
