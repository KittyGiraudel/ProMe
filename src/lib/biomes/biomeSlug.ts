import { BIOME_IDS } from '@/constants/misc'
import type { BiomeId } from '@/lib/types'

type Locale = 'en' | 'fr'

const BIOME_SLUGS: Record<Locale, Record<BiomeId, string>> = {
  en: {
    shadowWoods: 'shadow-woods',
    sunkenSavannah: 'sunken-savannah',
    mushroomJungle: 'mushroom-jungle',
    prairieSea: 'prairie-sea',
    silentWastes: 'silent-wastes',
    titanGarden: 'titan-garden',
  },
  fr: {
    shadowWoods: 'foret-des-ombres',
    sunkenSavannah: 'plaines-inondees',
    mushroomJungle: 'jungle-de-champignons',
    prairieSea: 'mer-champetre',
    silentWastes: 'desert-silencieux',
    titanGarden: 'jardins-titanesques',
  },
}

export function biomeIdToSlug(biome: BiomeId, locale: Locale = 'en'): string {
  return BIOME_SLUGS[locale][biome]
}

export function slugToBiomeId(
  slug: string,
  locale: Locale = 'en'
): BiomeId | undefined {
  return BIOME_IDS.find(id => BIOME_SLUGS[locale][id] === slug)
}
