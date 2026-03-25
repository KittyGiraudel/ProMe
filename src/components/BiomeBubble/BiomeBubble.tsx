import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import type { BiomeId } from '@/lib/character/types'
import { useLocalize } from '@/app/contexts/LocalizationContext'
import './BiomeBubble.css'

export function BiomeBubble({ biome }: { biome: BiomeId | 'unexplored' }) {
  const localize = useLocalize()

  return (
    <span
      className='biome-bubble'
      data-biome={biome}
      title={localize.string(`biomes.${biome}`)}>
      <VisuallyHidden>{localize.string(`biomes.${biome}`)}</VisuallyHidden>
    </span>
  )
}
