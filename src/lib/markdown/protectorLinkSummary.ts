import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import type { Character } from '@/lib/character/types'
import type { _Translator } from 'next-intl'

/**
 * One-line label for `{protector/<id>}` tokens: gender symbol, name, localized archetype.
 */
export function getProtectorJournalSummary(
  character: Character,
  t: _Translator,
): string {
  const gender = character.gender ?? 'indeterminate'
  const genderSym = genderCompactSymbol(gender)
  const arch = t(`common.archetypes.${character.archetype}`, { gender })
  return `${genderSym} ${character.name} (${arch})`
}
