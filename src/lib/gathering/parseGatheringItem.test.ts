import { describe, expect, it } from 'vitest'
import { parseGatheringItem } from './parseGatheringItem'

describe('parseGatheringItem', () => {
  it('extracts quantity and label from a matching string', () => {
    expect(parseGatheringItem('2 potatoes', /^(\d+)\s+(.+)$/)).toEqual({
      quantity: 2,
      label: 'Potatoes',
    })
  })

  it('capitalizes the first character of the label', () => {
    expect(parseGatheringItem('1 apple', /^(\d+)\s+(.+)$/)).toEqual({
      quantity: 1,
      label: 'Apple',
    })
  })

  it('handles multi-word labels', () => {
    expect(parseGatheringItem('3 wild mushrooms', /^(\d+)\s+(.+)$/)).toEqual({
      quantity: 3,
      label: 'Wild mushrooms',
    })
  })

  it('handles comma-separated quantities', () => {
    expect(parseGatheringItem('1,000 coins', /^([\d,]+)\s+(.+)$/)).toEqual({
      quantity: 1000,
      label: 'Coins',
    })
  })

  it('falls back to quantity 1 and full text (capitalized) when no match', () => {
    expect(parseGatheringItem('some herb', /^(\d+)\s+(.+)$/)).toEqual({
      quantity: 1,
      label: 'Some herb',
    })
  })
})
