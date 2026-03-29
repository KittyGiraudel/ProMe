import { describe, expect, it } from 'vitest'
import type { PlayingCard } from '@/lib/types'
import { toVillagePrimaryTuple } from './primaryTuple'

const c = (
  rank: PlayingCard['rank'],
  suit: PlayingCard['suit']
): PlayingCard => ({ rank, suit })

describe('toVillagePrimaryTuple', () => {
  it('returns null when length is not five', () => {
    expect(toVillagePrimaryTuple([])).toBeNull()
    expect(toVillagePrimaryTuple([c('2', 'hearts')])).toBeNull()
    expect(
      toVillagePrimaryTuple([
        c('2', 'hearts'),
        c('3', 'hearts'),
        c('4', 'hearts'),
        c('5', 'hearts'),
      ])
    ).toBeNull()
  })

  it('narrows five cards', () => {
    const five = [
      c('2', 'hearts'),
      c('3', 'clubs'),
      c('4', 'diamonds'),
      c('5', 'spades'),
      c('6', 'hearts'),
    ]
    const tuple = toVillagePrimaryTuple(five)
    expect(tuple).not.toBeNull()
    expect(tuple!.length).toBe(5)
  })
})
