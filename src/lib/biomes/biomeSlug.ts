import { BIOME_IDS } from '@/constants/misc'
import type { BiomeId } from '@/lib/types'

export function biomeIdToSlug(biome: BiomeId): string {
  return biome.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export function slugToBiomeId(slug: string): BiomeId | undefined {
  return BIOME_IDS.find(id => biomeIdToSlug(id) === slug)
}
