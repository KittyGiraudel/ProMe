import { describe, expect, it } from 'vitest'
import type { PlayingCard } from '@/lib/types'
import { toVillagePrimaryTuple } from './primaryTuple'
import {
  buildExpansionForPrimary,
  countRedJacksInPrimary,
  generateVillageRoll,
  isValidExpansionCard,
  rerollVillagePrimarySlot,
} from './generate'

const c = (
  rank: PlayingCard['rank'],
  suit: PlayingCard['suit']
): PlayingCard => ({ rank, suit })

describe('village/generate', () => {
  it('countRedJacksInPrimary counts only red jacks', () => {
    const primary = toVillagePrimaryTuple([
      c('J', 'hearts'),
      c('J', 'clubs'),
      c('2', 'diamonds'),
      c('3', 'spades'),
      c('4', 'hearts'),
    ])!
    expect(countRedJacksInPrimary(primary)).toBe(1)
  })

  it('buildExpansionForPrimary draws 3 numbered cards per red jack', () => {
    const primary = toVillagePrimaryTuple([
      c('J', 'hearts'),
      c('2', 'clubs'),
      c('3', 'diamonds'),
      c('4', 'spades'),
      c('5', 'hearts'),
    ])!
    let n = 0
    const rng = () => {
      n += 0.07
      return n % 1
    }
    const exp = buildExpansionForPrimary(primary, rng)
    expect(exp).toHaveLength(3)
    for (const card of exp) {
      expect(isValidExpansionCard(card)).toBe(true)
    }
  })

  it('isValidExpansionCard rejects J/Q/K', () => {
    expect(isValidExpansionCard(c('10', 'hearts'))).toBe(true)
    expect(isValidExpansionCard(c('A', 'spades'))).toBe(true)
    expect(isValidExpansionCard(c('J', 'hearts'))).toBe(false)
    expect(isValidExpansionCard(c('Q', 'clubs'))).toBe(false)
    expect(isValidExpansionCard(c('K', 'diamonds'))).toBe(false)
  })

  it('generateVillageRoll returns five primary cards and matching expansion', () => {
    const rng = () => 0.11
    const roll = generateVillageRoll(rng)
    expect(roll.primary).toHaveLength(5)
    expect(roll.expansion).toHaveLength(
      countRedJacksInPrimary(roll.primary) * 3
    )
  })

  it('rerollVillagePrimarySlot ignores out-of-range index', () => {
    const roll = generateVillageRoll(() => 0.22)
    expect(rerollVillagePrimarySlot(roll, -1)).toBe(roll)
    expect(rerollVillagePrimarySlot(roll, 5)).toBe(roll)
  })

  it('rerollVillagePrimarySlot replaces one slot and rebuilds expansion', () => {
    const roll = generateVillageRoll(() => 0.33)
    const next = rerollVillagePrimarySlot(roll, 2, () => 0.44)
    expect(next.primary).toHaveLength(5)
    expect(next.primary[0]).toEqual(roll.primary[0])
    expect(next.primary[1]).toEqual(roll.primary[1])
    expect(next.expansion).toHaveLength(
      countRedJacksInPrimary(next.primary) * 3
    )
  })
})
