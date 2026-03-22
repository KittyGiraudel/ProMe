import {
  type CharacterRoll,
  getAgeBand,
  getPersonality,
  mapKindFromContextSevenDie,
} from '@/lib/character/generate'
import { genderCompactSymbol } from '@/lib/character/genderSymbols'
import type { VillageRoll } from '@/lib/village/generate'
import { resolveVillageDisplay } from '@/lib/village/resolveDisplay'
import { copy } from './fr'

/** One-line share text: `♀ Ada (Bruja), Adolescent·e Amical·e (https://…)`. */
export function formatCharacterCopyOneLiner(
  roll: CharacterRoll,
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
        ? copy.character.contextSevenMapLocalisation
        : copy.character.contextSevenMapBiome,
    )
  }
  if (roll.contextCard.rank === '10' && roll.contextSpokenName) {
    parts.push(`${copy.character.contextSpokenNameLabel}: ${roll.contextSpokenName}`)
  }
  return `${parts.join(copy.common.emDashSpaced)} (${shareUrl})`
}

function stripBoldMarkers(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '$1')
}

export type VillageCopyFormatOptions = {
  /** Same URL shape as the inhabitant generator copy (e.g. `…/generators/character?c=…`). */
  characterShareUrl: (roll: CharacterRoll) => string
}

/**
 * Texte multi-lignes pour le presse-papiers : traits (puce), puis établissements
 * avec sous-liste « Propriétaire » + même ligne que le copier du générateur d’habitant
 * (résumé + lien), puis URL du village seule sur la dernière ligne.
 */
export function formatVillageCopyOneLiner(
  roll: VillageRoll,
  shareUrl: string,
  owners?: CharacterRoll[] | null,
  options?: VillageCopyFormatOptions,
): string {
  const { traits, establishments } = resolveVillageDisplay(roll)
  const sections: string[] = []

  if (traits.length > 0) {
    const lines = traits.map((row) => `- ${stripBoldMarkers(row.text)}`)
    sections.push(`${copy.village.sectionTraits}\n${lines.join('\n')}`)
  }

  const ownersOk = owners && owners.length === establishments.length
  const establishmentLines = establishments.map((row, i) => {
    if (ownersOk && options?.characterShareUrl) {
      const owner = owners[i]!
      const oneLiner = formatCharacterCopyOneLiner(
        owner,
        options.characterShareUrl(owner),
      )
      return `- ${row.text}\n  - ${copy.village.ownerLabel} : ${oneLiner}`
    }
    if (ownersOk) {
      const owner = owners[i]!
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
