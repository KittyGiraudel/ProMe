import {
  type InhabitantRoll,
  getAgeBand,
  getPersonality,
} from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import type { VillageRoll } from '@/lib/village/generate'
import { ownerSlotIndexByEstablishmentIndex, resolveVillageDisplay } from '@/app/[locale]/generators/village/useVillageGenerator'
import { _Translator } from 'next-intl'

function stripBoldMarkers(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '$1')
}

export type VillageCopyFormatOptions = {
  inhabitantShareUrl: (roll: InhabitantRoll) => string
}

/**
 * Texte multi-lignes pour le presse-papiers : traits (puce), puis établissements
 * avec sous-liste « Propriétaire » + même ligne que le copier du générateur d’habitant
 * (résumé + lien), puis URL du village seule sur la dernière ligne.
 */
export function formatVillageOneLiner(
  roll: VillageRoll,
  shareUrl: string,
  t: _Translator,
  owners?: InhabitantRoll[] | null,
  options?: VillageCopyFormatOptions,
): string {
  const { traits, establishments } = resolveVillageDisplay(roll, t)
  const ownerSlots = ownerSlotIndexByEstablishmentIndex(establishments)
  const sections: string[] = []

  if (traits.length > 0) {
    const lines = traits.map((row) => `- ${stripBoldMarkers(row.text)}`)
    sections.push(`${t('village.sectionTraits')}\n${lines.join('\n')}`)
  }

  const ownersOk =
    owners &&
    owners.length === ownerSlots.filter((s): s is number => s !== null).length
  const establishmentLines = establishments.map((row, i) => {
    const ownerIdx = ownerSlots[i]!
    if (ownersOk && ownerIdx !== null && options?.inhabitantShareUrl) {
      const owner = owners[ownerIdx]!
      const oneLiner = t('inhabitant.one_liner', {
        gender: genderCompactSymbol(owner.gender),
        name: owner.name,
        faction: t(`common.factions.${owner.faction}`),
        age: t(`common.ageBands.${getAgeBand(owner)}`),
        personality: t(`common.personalities.${getPersonality(owner)}`),
      }) + ' ' + shareUrl
      return `- ${row.text}\n  - ${t('village.owner_label')} ${oneLiner}`
    }
    if (ownersOk && ownerIdx !== null) {
      const owner = owners[ownerIdx]!
      const oneLiner = t('inhabitant.one_liner', {
        gender: genderCompactSymbol(owner.gender),
        name: owner.name,
        age: t(`common.age_bands.${getAgeBand(owner)}`),
        personality: t(`common.personalities.${getPersonality(owner)}`),
        faction: t(`common.factions.${owner.faction}`)
      })
      return `- ${row.text}\n  - ${t('village.owner_label')} ${oneLiner}`
    }
    return `- ${row.text}`
  })
  sections.push(
    `${t('village.sectionEstablishments')}\n${establishmentLines.join('\n')}`,
  )

  sections.push(shareUrl)
  return sections.join('\n\n')
}
