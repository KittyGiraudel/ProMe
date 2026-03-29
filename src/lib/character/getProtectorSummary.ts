import type { _Translator } from 'next-intl'
import type { Character } from '@/lib/character/types'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'

/**
 * Plain-text line: optional gender symbol, name (or “unnamed”), comma, localized archetype —
 * same shape as recent-character cards on the home hub.
 */
export function getProtectorSummary(
  data: Character | null,
  t: _Translator
): string {
  if (!data) {
    return t('character_list.unknown')
  }

  const genderPrefix = data.gender ? `${genderCompactSymbol(data.gender)} ` : ''
  const displayName = data.name?.trim() ?? t('characters_list.unnamed')
  const archetypeLabel = t(`common.archetypes.name.${data.archetype}`, {
    gender: data.gender ?? 'indeterminate',
  })
  return `${genderPrefix}${displayName}, ${archetypeLabel}`
}
