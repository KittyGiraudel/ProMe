import { describe, expect, it } from 'vitest'
import {
  tokenizeJournalEmbellishUiRules,
  journalLiteralRule,
  journalRegexRule,
  type JournalEmbellishUiRule,
} from './journalEmbellishText'

const noopRender: JournalEmbellishUiRule['render'] = () => null

function tokenIds(
  segments: ReturnType<typeof tokenizeJournalEmbellishUiRules>,
  rules: readonly JournalEmbellishUiRule[],
) {
  return segments.map(s =>
    s.type === 'text'
      ? s
      : {
          type: 'token' as const,
          id: rules[s.ruleIndex]!.id,
          slice: s.slice,
          refId: s.refId,
        },
  )
}

describe('markdown/journalEmbellishText', () => {
  it('matches tokens case-insensitively', () => {
    const rules: JournalEmbellishUiRule[] = [
      journalLiteralRule('success', 'succès', true, noopRender),
      journalLiteralRule('failure', 'échec', true, noopRender),
    ]
    const result = tokenizeJournalEmbellishUiRules('SUCCÈS puis ÉCHEC', rules)
    expect(tokenIds(result, rules)).toEqual([
      { type: 'token', id: 'success', slice: 'SUCCÈS' },
      { type: 'text', value: ' puis ' },
      { type: 'token', id: 'failure', slice: 'ÉCHEC' },
    ])
  })

  it('supports unicode word boundaries for accented words', () => {
    const rules: JournalEmbellishUiRule[] = [
      journalLiteralRule('failure', 'échec', true, noopRender),
    ]
    const result = tokenizeJournalEmbellishUiRules('Récolte : échec.', rules)
    expect(tokenIds(result, rules)).toEqual([
      { type: 'text', value: 'Récolte : ' },
      { type: 'token', id: 'failure', slice: 'échec' },
      { type: 'text', value: '.' },
    ])
  })

  it('does not match word-boundary tokens inside larger words', () => {
    const rules: JournalEmbellishUiRule[] = [
      journalLiteralRule('failure', 'échec', true, noopRender),
      journalLiteralRule('success', 'succès', true, noopRender),
    ]
    const result = tokenizeJournalEmbellishUiRules('prééchec postsuccès', rules)
    expect(result).toEqual([{ type: 'text', value: 'prééchec postsuccès' }])
  })

  it('prefers the longest matching token at a position', () => {
    const rules: JournalEmbellishUiRule[] = [
      journalLiteralRule('forest-short', 'Forêt', true, noopRender),
      journalLiteralRule('forest-full', 'Forêt des ombres', true, noopRender),
    ]
    const result = tokenizeJournalEmbellishUiRules('Forêt des ombres', rules)
    expect(tokenIds(result, rules)).toEqual([
      { type: 'token', id: 'forest-full', slice: 'Forêt des ombres' },
    ])
  })

  it('matches non-word symbols without boundary checks', () => {
    const rules: JournalEmbellishUiRule[] = [
      journalLiteralRule('sun', '☼', undefined, noopRender),
    ]
    const result = tokenizeJournalEmbellishUiRules('Jour ☼ Nuit', rules)
    expect(tokenIds(result, rules)).toEqual([
      { type: 'text', value: 'Jour ' },
      { type: 'token', id: 'sun', slice: '☼' },
      { type: 'text', value: ' Nuit' },
    ])
  })

  it('matches brace-based symbol aliases', () => {
    const rules: JournalEmbellishUiRule[] = [
      journalLiteralRule('dice:1', '{1}', undefined, noopRender),
      journalLiteralRule('spade', '{S}', undefined, noopRender),
      journalLiteralRule('heart', '{H}', undefined, noopRender),
      journalLiteralRule('diamond', '{D}', undefined, noopRender),
      journalLiteralRule('club', '{C}', undefined, noopRender),
    ]
    const result = tokenizeJournalEmbellishUiRules('{1} {S} {H} {D} {C}', rules)
    expect(tokenIds(result, rules)).toEqual([
      { type: 'token', id: 'dice:1', slice: '{1}' },
      { type: 'text', value: ' ' },
      { type: 'token', id: 'spade', slice: '{S}' },
      { type: 'text', value: ' ' },
      { type: 'token', id: 'heart', slice: '{H}' },
      { type: 'text', value: ' ' },
      { type: 'token', id: 'diamond', slice: '{D}' },
      { type: 'text', value: ' ' },
      { type: 'token', id: 'club', slice: '{C}' },
    ])
  })

  it('returns plain text when no rules match', () => {
    expect(tokenizeJournalEmbellishUiRules('plain', [])).toEqual([
      { type: 'text', value: 'plain' },
    ])
    const rules = [journalLiteralRule('x', 'nope', true, noopRender)]
    expect(tokenizeJournalEmbellishUiRules('plain', rules)).toEqual([
      { type: 'text', value: 'plain' },
    ])
  })

  it('parses journal reference tokens with refId', () => {
    const rules: JournalEmbellishUiRule[] = [
      journalRegexRule(
        'journalRef:village',
        String.raw`\{village\/([^}]+)\}`,
        undefined,
        1,
        noopRender,
      ),
      journalRegexRule(
        'journalRef:npc',
        String.raw`\{npc\/([^}]+)\}`,
        undefined,
        1,
        noopRender,
      ),
    ]
    const result = tokenizeJournalEmbellishUiRules(
      'See {village/R.X} and {npc/abc}',
      rules,
    )
    expect(tokenIds(result, rules)).toEqual([
      { type: 'text', value: 'See ' },
      {
        type: 'token',
        id: 'journalRef:village',
        slice: '{village/R.X}',
        refId: 'R.X',
      },
      { type: 'text', value: ' and ' },
      {
        type: 'token',
        id: 'journalRef:npc',
        slice: '{npc/abc}',
        refId: 'abc',
      },
    ])
  })

  it('prefers longer journal token over brace dice alias at same position', () => {
    const rules: JournalEmbellishUiRule[] = [
      journalLiteralRule('dice:1', '{1}', undefined, noopRender),
      journalRegexRule(
        'journalRef:npc',
        String.raw`\{npc\/([^}]+)\}`,
        undefined,
        1,
        noopRender,
      ),
    ]
    const result = tokenizeJournalEmbellishUiRules('{npc/12}', rules)
    expect(tokenIds(result, rules)).toEqual([
      {
        type: 'token',
        id: 'journalRef:npc',
        slice: '{npc/12}',
        refId: '12',
      },
    ])
  })
})
