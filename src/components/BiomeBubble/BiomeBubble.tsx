import { copy } from '@/messages/fr'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import type { BiomeId } from '@/lib/character/types'
import './BiomeBubble.css'

export function BiomeBubble({ biome }: { biome: BiomeId | 'unexplored' }) {
  return (
    <span
      className='biome-bubble'
      data-biome={biome}
      title={copy.characters.mapBiomes[biome]}>
      <VisuallyHidden>{copy.characters.mapBiomes[biome]}</VisuallyHidden>
    </span>
  )
}
