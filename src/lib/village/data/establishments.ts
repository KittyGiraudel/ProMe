import type { PlayingCard, Rank } from '@/lib/types'
import { suitIsRed } from '@/lib/suitGlyphs'
import { _Translator } from 'next-intl'

/** Ranks 2–8: establishment type has three size tiers in the rulebook. */
const ESTABLISHMENT_SIZE_TIER_RANKS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
] as const satisfies readonly Rank[]

export function rankUsesEstablishmentSizeTiers(rank: Rank): boolean {
  return (ESTABLISHMENT_SIZE_TIER_RANKS as readonly Rank[]).includes(rank)
}

/** Label for an establishment card (A–10 only). */
export function establishmentLine(card: PlayingCard, t: _Translator): string {
  const { suit, rank } = card
  if (rank === 'J' || rank === 'Q' || rank === 'K') {
    throw new Error('establishmentLine: face card')
  }
  if (rankUsesEstablishmentSizeTiers(rank)) {
    return t(`village.establishments.${rank}`, {
      size: suitIsRed(suit) ? 1 : 0,
    })
  }
  return lineForRankOther(rank, suitIsRed(suit), t)
}

function lineForRankOther(rank: Rank, red: boolean, t: _Translator): string {
  switch (rank) {
    case 'A':
    case '9':
      return t(`village.establishments.${rank}`, {
        color: red ? 'red' : 'black',
      })
    case '10':
      return t(`village.establishments.${rank}`)
    default:
      throw new Error(`establishmentLine: unexpected rank ${rank}`)
  }
}
