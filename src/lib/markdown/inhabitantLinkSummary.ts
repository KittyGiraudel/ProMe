import { _Translator } from 'next-intl'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { getAgeBand, getPersonality } from '@/lib/inhabitant/generate'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'

/**
 * One-line summary for an NPC roll id (path segment after `/generators/npc/`, or `{npc/…}` payload).
 */
export function getNpcJournalSummary(
  encodedId: string,
  t: _Translator
): string | null {
  const roll = decodeInhabitantRollParam(encodedId.trim(), t)
  if (!roll) return null

  return t('inhabitant.one_liner', {
    gender: genderCompactSymbol(roll.gender),
    name: roll.name,
    faction: t(`common.factions.${roll.faction}`),
    age: t(`common.ages.${getAgeBand(roll)}`).toLowerCase(),
    personality: t(`common.personalities.${getPersonality(roll)}`, {
      gender: roll.gender,
    }).toLowerCase(),
  })
}
