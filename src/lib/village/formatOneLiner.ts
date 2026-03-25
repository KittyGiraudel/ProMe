import {
  type InhabitantRoll,
  getAgeBand,
  getPersonality,
} from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import type { VillageRoll } from '@/lib/village/generate'
import { Localize } from '@/lib/localization/localize'
import { ownerSlotIndexByEstablishmentIndex, resolveVillageDisplay } from '@/app/generators/village/useVillageGenerator'

function stripBoldMarkers(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '$1')
}

export type VillageCopyFormatOptions = {
  /** Same URL shape as the inhabitant generator copy (e.g. `…/generators/inhabitant?i=…`). */
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
  localize: Localize,
  owners?: InhabitantRoll[] | null,
  options?: VillageCopyFormatOptions,
): string {
  const { traits, establishments } = resolveVillageDisplay(roll, localize)
  const ownerSlots = ownerSlotIndexByEstablishmentIndex(establishments)
  const sections: string[] = []

  if (traits.length > 0) {
    const lines = traits.map((row) => `- ${stripBoldMarkers(row.text)}`)
    sections.push(`${localize.string('village.sectionTraits')}\n${lines.join('\n')}`)
  }

  const ownersOk =
    owners &&
    owners.length === ownerSlots.filter((s): s is number => s !== null).length
  const establishmentLines = establishments.map((row, i) => {
    const ownerIdx = ownerSlots[i]!
    if (ownersOk && ownerIdx !== null && options?.inhabitantShareUrl) {
      const owner = owners[ownerIdx]!
      const oneLiner = localize.string('inhabitant.oneLiner', {
        gender: genderCompactSymbol(owner.gender),
        name: owner.name,
        faction: localize.string(`factions.${owner.faction}`),
        age: localize.string(`ageBands.${getAgeBand(owner)}`),
        personality: localize.string(`personalities.${getPersonality(owner)}`),
      }) + ' ' + shareUrl
      return `- ${row.text}\n  - ${localize.string('village.ownerLabel')} ${oneLiner}`
    }
    if (ownersOk && ownerIdx !== null) {
      const owner = owners[ownerIdx]!
      const oneLiner = localize.string('inhabitant.oneLiner', {
        gender: genderCompactSymbol(owner.gender),
        name: owner.name,
        age: localize.string(`ageBands.${getAgeBand(owner)}`),
        personality: localize.string(`personalities.${getPersonality(owner)}`),
        faction: localize.string(`factions.${owner.faction}`)
      })
      return `- ${row.text}\n  - ${localize.string('village.ownerLabel')} ${oneLiner}`
    }
    return `- ${row.text}`
  })
  sections.push(
    `${localize.string('village.sectionEstablishments')}\n${establishmentLines.join('\n')}`,
  )

  sections.push(shareUrl)
  return sections.join('\n\n')
}
