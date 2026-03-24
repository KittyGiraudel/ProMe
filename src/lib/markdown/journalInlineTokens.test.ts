import { describe, expect, it } from 'vitest'
import {
  tokenizeJournalInlineText,
  type JournalInlineTokenRule,
} from './journalInlineTokens'

describe('markdown/journalInlineTokens', () => {
  const rules: JournalInlineTokenRule[] = [
    { key: 'biome', match: 'Forêt des ombres', wordBoundary: true },
    { key: 'success', match: 'succès', wordBoundary: true },
    { key: 'failure', match: 'échec', wordBoundary: true },
    { key: 'sun', match: '☼' },
  ]

  it('matches tokens case-insensitively', () => {
    const result = tokenizeJournalInlineText('SUCCÈS puis ÉCHEC', rules)
    expect(result).toEqual([
      { type: 'token', key: 'success', value: 'SUCCÈS' },
      { type: 'text', value: ' puis ' },
      { type: 'token', key: 'failure', value: 'ÉCHEC' },
    ])
  })

  it('supports unicode word boundaries for accented words', () => {
    const result = tokenizeJournalInlineText('Récolte : échec.', rules)
    expect(result).toEqual([
      { type: 'text', value: 'Récolte : ' },
      { type: 'token', key: 'failure', value: 'échec' },
      { type: 'text', value: '.' },
    ])
  })

  it('does not match word-boundary tokens inside larger words', () => {
    const result = tokenizeJournalInlineText('prééchec postsuccès', rules)
    expect(result).toEqual([{ type: 'text', value: 'prééchec postsuccès' }])
  })

  it('prefers the longest matching token first', () => {
    const overlapRules: JournalInlineTokenRule[] = [
      { key: 'forest-short', match: 'Forêt', wordBoundary: true },
      { key: 'forest-full', match: 'Forêt des ombres', wordBoundary: true },
    ]
    const result = tokenizeJournalInlineText('Forêt des ombres', overlapRules)
    expect(result).toEqual([
      { type: 'token', key: 'forest-full', value: 'Forêt des ombres' },
    ])
  })

  it('matches non-word symbols without boundary checks', () => {
    const result = tokenizeJournalInlineText('Jour ☼ Nuit', rules)
    expect(result).toEqual([
      { type: 'text', value: 'Jour ' },
      { type: 'token', key: 'sun', value: '☼' },
      { type: 'text', value: ' Nuit' },
    ])
  })
})
