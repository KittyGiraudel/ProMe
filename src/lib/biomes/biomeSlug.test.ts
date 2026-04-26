import { describe, expect, it } from 'vitest'
import { biomeIdToSlug, slugToBiomeId } from './biomeSlug'

describe('biomeIdToSlug', () => {
  it('converts camelCase to kebab-case', () => {
    expect(biomeIdToSlug('shadowWoods')).toBe('shadow-woods')
    expect(biomeIdToSlug('sunkenSavanna')).toBe('sunken-savanna')
    expect(biomeIdToSlug('mushroomJungle')).toBe('mushroom-jungle')
    expect(biomeIdToSlug('prairieSea')).toBe('prairie-sea')
    expect(biomeIdToSlug('silentWastes')).toBe('silent-wastes')
    expect(biomeIdToSlug('titanGarden')).toBe('titan-garden')
  })
})

describe('slugToBiomeId', () => {
  it('returns the matching BiomeId for a valid slug', () => {
    expect(slugToBiomeId('shadow-woods')).toBe('shadowWoods')
    expect(slugToBiomeId('titan-garden')).toBe('titanGarden')
  })

  it('returns undefined for an unknown slug', () => {
    expect(slugToBiomeId('unknown-biome')).toBeUndefined()
    expect(slugToBiomeId('shadowWoods')).toBeUndefined()
  })
})
