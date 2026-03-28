import { getAgeBand, getPersonality } from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'
import { _Translator } from 'next-intl'

/**
 * One-line summary for an NPC roll id (path segment after `/generators/npc/`, or `{npc/…}` payload).
 */
export function getNpcJournalSummary(
  encodedId: string,
  t: _Translator,
): string | null {
  const roll = decodeInhabitantRollParam(encodedId.trim(), t)
  if (!roll) return null

  return t('inhabitant.one_liner', {
    gender: genderCompactSymbol(roll.gender),
    name: roll.name,
    faction: t(`common.factions.${roll.faction}`),
    age: t(`common.age_bands.${getAgeBand(roll)}`),
    personality: t(`common.personalities.${getPersonality(roll)}`, {
      gender: roll.gender,
    }),
  })
}
