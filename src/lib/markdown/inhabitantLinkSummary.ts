import { getAgeBand, getPersonality } from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'
import { parseGeneratorLink } from '@/lib/markdown/generatorLink'
import { _Translator } from 'next-intl'

/**
 * If `rawUrl` is a share URL for an NPC roll, return a human-friendly one-line summary
 * label suitable for rendering inline in markdown (journal link previews).
 *
 * Returns `null` when:
 * - the URL is not an NPC generator link
 * - the encoded id is missing
 * - decoding fails
 */
export function getInhabitantSummaryFromUrl(rawUrl: string, t: _Translator): string | null {
  const parsed = parseGeneratorLink(rawUrl)
  if (!parsed || parsed.kind !== 'npc') return null

  const roll = decodeInhabitantRollParam(parsed.encodedId, t)
  if (!roll) return null

  return t('inhabitant.one_liner', {
    gender: genderCompactSymbol(roll.gender),
    name: roll.name, 
    faction: t(`common.factions.${roll.faction}`),
    age: t(`common.age_bands.${getAgeBand(roll)}`),
    personality: t(`common.personalities.${getPersonality(roll)}`, { gender: roll.gender })
  })
}
