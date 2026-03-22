import type { PlayingCard, Rank, Suit } from "./types";
import { isFaceRank, RANKS, SUITS } from "./types";

export function randomInt(rng: () => number, min: number, max: number): number {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

export function rollD6(rng: () => number): number {
  return randomInt(rng, 1, 6);
}

export function roll2D6(rng: () => number): [number, number] {
  return [rollD6(rng), rollD6(rng)];
}

export function randomCard(rng: () => number): PlayingCard {
  const suit = SUITS[randomInt(rng, 0, SUITS.length - 1)] as Suit;
  const rank = RANKS[randomInt(rng, 0, RANKS.length - 1)] as Rank;
  return { suit, rank };
}

/** Random card whose rank is A–10 (rulebook: redraw until numbered after a face). */
export function randomNumberedCard(rng: () => number): PlayingCard {
  let card: PlayingCard;
  do {
    card = randomCard(rng);
  } while (isFaceRank(card.rank));
  return card;
}

export function defaultRng(): () => number {
  return () => Math.random();
}
