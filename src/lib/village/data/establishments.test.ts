import { describe, expect, it } from 'vitest'
import { testLocalize } from '@/lib/localization/testLocalize'
import {
  establishmentLine,
  rankUsesEstablishmentSizeTiers,
} from './establishments'

describe('establishments', () => {
  it('rankUsesEstablishmentSizeTiers is true for ranks 2–8 only', () => {
    expect(rankUsesEstablishmentSizeTiers('2')).toBe(true)
    expect(rankUsesEstablishmentSizeTiers('8')).toBe(true)
    expect(rankUsesEstablishmentSizeTiers('9')).toBe(false)
    expect(rankUsesEstablishmentSizeTiers('A')).toBe(false)
    expect(rankUsesEstablishmentSizeTiers('10')).toBe(false)
  })

  it('establishmentLine resolves A, 9, and 10 from the non-tier copy table', () => {
    expect(
      establishmentLine({ rank: 'A', suit: 'hearts' }, testLocalize)
    ).toBeTruthy()
    expect(
      establishmentLine({ rank: 'A', suit: 'clubs' }, testLocalize)
    ).toBeTruthy()
    expect(
      establishmentLine({ rank: '9', suit: 'hearts' }, testLocalize)
    ).toBeTruthy()
    expect(
      establishmentLine({ rank: '9', suit: 'clubs' }, testLocalize)
    ).toBeTruthy()
    expect(
      establishmentLine({ rank: '10', suit: 'spades' }, testLocalize)
    ).toBeTruthy()
  })

  it('establishmentLine rejects face establishment ranks', () => {
    expect(() =>
      establishmentLine({ rank: 'J', suit: 'hearts' }, testLocalize)
    ).toThrow(/face card/)
  })
})
