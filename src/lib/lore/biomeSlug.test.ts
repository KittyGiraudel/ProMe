import { describe, expect, it } from 'vitest'
import { biomeIdToSlug, slugToBiomeId } from './biomeSlug'

describe('biomeIdToSlug', () => {
  it('converts camelCase to kebab-case', () => {
    expect(biomeIdToSlug('shadowForest')).toBe('shadow-forest')
    expect(biomeIdToSlug('floodedPlains')).toBe('flooded-plains')
    expect(biomeIdToSlug('mushroomJungle')).toBe('mushroom-jungle')
    expect(biomeIdToSlug('fieldSea')).toBe('field-sea')
    expect(biomeIdToSlug('silentDesert')).toBe('silent-desert')
    expect(biomeIdToSlug('titanGardens')).toBe('titan-gardens')
  })
})

describe('slugToBiomeId', () => {
  it('returns the matching BiomeId for a valid slug', () => {
    expect(slugToBiomeId('shadow-forest')).toBe('shadowForest')
    expect(slugToBiomeId('titan-gardens')).toBe('titanGardens')
  })

  it('returns undefined for an unknown slug', () => {
    expect(slugToBiomeId('unknown-biome')).toBeUndefined()
    expect(slugToBiomeId('shadowForest')).toBeUndefined()
  })
})
