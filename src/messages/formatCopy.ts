import {
  type InhabitantRoll,
  getAgeBand,
  getPersonality,
  mapKindFromContextSevenDie,
} from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import type { VillageRoll } from '@/lib/village/generate'
import {
  ownerSlotIndexByEstablishmentIndex,
  resolveVillageDisplay,
} from '@/lib/village/resolveDisplay'
import { copy } from './fr'

/** One-line share text: `♀ Ada (Bruja), Adolescent·e Amical·e (https://…)`. */
export function formatInhabitantCopyOneLiner(
  roll: InhabitantRoll,
  shareUrl: string,
): string {
  const age = getAgeBand(roll)
  const personality = getPersonality(roll)
  const g = genderCompactSymbol(roll.gender)
  const parts = [
    `${g} ${roll.name} (${copy.races[roll.race]}), ${copy.ageBands[age]} ${copy.personalities[personality]}`,
  ]
  if (roll.contextCard.rank === '7' && roll.contextSevenDie != null) {
    const kind = mapKindFromContextSevenDie(roll.contextSevenDie)
    parts.push(
      kind === 'localisation'
        ? copy.inhabitant.contextSevenMapLocalisation
        : copy.inhabitant.contextSevenMapBiome,
    )
  }
  if (roll.contextCard.rank === '10' && roll.contextSpokenName) {
    parts.push(`${copy.inhabitant.contextSpokenNameLabel}: ${roll.contextSpokenName}`)
  }
  return `${parts.join(copy.common.emDashSpaced)} (${shareUrl})`
}

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
export function formatVillageCopyOneLiner(
  roll: VillageRoll,
  shareUrl: string,
  owners?: InhabitantRoll[] | null,
  options?: VillageCopyFormatOptions,
): string {
  const { traits, establishments } = resolveVillageDisplay(roll)
  const ownerSlots = ownerSlotIndexByEstablishmentIndex(establishments)
  const sections: string[] = []

  if (traits.length > 0) {
    const lines = traits.map((row) => `- ${stripBoldMarkers(row.text)}`)
    sections.push(`${copy.village.sectionTraits}\n${lines.join('\n')}`)
  }

  const ownersOk =
    owners &&
    owners.length === ownerSlots.filter((s): s is number => s !== null).length
  const establishmentLines = establishments.map((row, i) => {
    const ownerIdx = ownerSlots[i]!
    if (ownersOk && ownerIdx !== null && options?.inhabitantShareUrl) {
      const owner = owners[ownerIdx]!
      const oneLiner = formatInhabitantCopyOneLiner(
        owner,
        options.inhabitantShareUrl(owner),
      )
      return `- ${row.text}\n  - ${copy.village.ownerLabel} : ${oneLiner}`
    }
    if (ownersOk && ownerIdx !== null) {
      const owner = owners[ownerIdx]!
      const age = getAgeBand(owner)
      const personality = getPersonality(owner)
      const g = genderCompactSymbol(owner.gender)
      const detail = `${g} ${owner.name} (${copy.races[owner.race]}), ${copy.ageBands[age]} ${copy.personalities[personality]}`
      return `- ${row.text}\n  - ${copy.village.ownerLabel} : ${detail}`
    }
    return `- ${row.text}`
  })
  sections.push(
    `${copy.village.sectionEstablishments}\n${establishmentLines.join('\n')}`,
  )

  sections.push(shareUrl)
  return sections.join('\n\n')
}

export function formatVillageRulebookPagesJoined(pages: number[]): string {
  return [...new Set(pages)]
    .sort((a, b) => a - b)
    .map((p) => copy.rulebook.pageCitation(p))
    .join(' · ')
}
