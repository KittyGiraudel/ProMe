import type { PlayingCard, Rank, Suit } from './types'
import { RANKS, SUITS } from './constants/misc'
import { isFaceRank } from './suitGlyphs'

export function randomInt(rng: () => number, min: number, max: number): number {
  const lo = Math.ceil(min)
  const hi = Math.floor(max)
  return Math.floor(rng() * (hi - lo + 1)) + lo
}

export function rollD6(rng: () => number): number {
  return randomInt(rng, 1, 6)
}

export function roll2D6(rng: () => number): [number, number] {
  return [rollD6(rng), rollD6(rng)]
}

export function randomCard(rng: () => number): PlayingCard {
  const suits = Object.keys(SUITS)
  const suit = suits[randomInt(rng, 0, suits.length - 1)] as Suit
  const rank = RANKS[randomInt(rng, 0, RANKS.length - 1)] as Rank
  return { suit, rank }
}

export function pickRandom<T>(
  rng: () => number,
  values: readonly T[]
): T | undefined {
  if (values.length === 0) return undefined
  const index = randomInt(rng, 0, values.length - 1)
  return values[index]
}

/** Random card whose rank is A–10 (rulebook: redraw until numbered after a face). */
export function randomNumberedCard(rng: () => number): PlayingCard {
  let card: PlayingCard
  do {
    card = randomCard(rng)
  } while (isFaceRank(card.rank))
  return card
}

export function defaultRng(): () => number {
  return () => Math.random()
}
