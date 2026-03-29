import { describe, expect, it } from 'vitest'
import { genderCompactSymbol } from './genderSymbols'

describe('genderCompactSymbol', () => {
  it('matches the compact markers used in copy strings', () => {
    expect(genderCompactSymbol('man')).toBe('♂')
    expect(genderCompactSymbol('woman')).toBe('♀')
    expect(genderCompactSymbol('nonBinary')).toBe('⚥')
    expect(genderCompactSymbol('indeterminate')).toBe('☿')
  })
})
