import type { _Translator } from 'next-intl'
import type { Character } from '@/lib/character/types'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'

/**
 * One-line label for `{protector/<id>}` tokens: gender symbol, name, localized archetype.
 */
export function getProtectorJournalSummary(
  character: Character,
  t: _Translator
): string {
  const gender = character.gender ?? 'indeterminate'
  const genderSym = genderCompactSymbol(gender)
  const arch = t(`common.archetypes.name.${character.archetype}`, { gender })
  return `${genderSym} ${character.name} (${arch})`
}
