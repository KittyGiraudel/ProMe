import { describe, expect, it } from 'vitest'
import { biomeIdToSlug, slugToBiomeId } from './biomeSlug'

describe('biomeIdToSlug', () => {
  it('returns English slugs by default', () => {
    expect(biomeIdToSlug('shadowWoods')).toBe('shadow-woods')
    expect(biomeIdToSlug('sunkenSavannah')).toBe('sunken-savannah')
    expect(biomeIdToSlug('mushroomJungle')).toBe('mushroom-jungle')
    expect(biomeIdToSlug('prairieSea')).toBe('prairie-sea')
    expect(biomeIdToSlug('silentWastes')).toBe('silent-wastes')
    expect(biomeIdToSlug('titanGarden')).toBe('titan-garden')
  })

  it('returns localized French slugs', () => {
    expect(biomeIdToSlug('shadowWoods', 'fr')).toBe('foret-des-ombres')
    expect(biomeIdToSlug('sunkenSavannah', 'fr')).toBe('plaines-inondees')
    expect(biomeIdToSlug('mushroomJungle', 'fr')).toBe('jungle-de-champignons')
    expect(biomeIdToSlug('prairieSea', 'fr')).toBe('mer-champetre')
    expect(biomeIdToSlug('silentWastes', 'fr')).toBe('desert-silencieux')
    expect(biomeIdToSlug('titanGarden', 'fr')).toBe('jardins-titanesques')
  })
})

describe('slugToBiomeId', () => {
  it('returns the matching BiomeId for a valid slug', () => {
    expect(slugToBiomeId('shadow-woods')).toBe('shadowWoods')
    expect(slugToBiomeId('titan-garden')).toBe('titanGarden')
    expect(slugToBiomeId('foret-des-ombres', 'fr')).toBe('shadowWoods')
    expect(slugToBiomeId('jardins-titanesques', 'fr')).toBe('titanGarden')
  })

  it('returns undefined for an unknown slug', () => {
    expect(slugToBiomeId('unknown-biome')).toBeUndefined()
    expect(slugToBiomeId('shadowWoods')).toBeUndefined()
  })
})
