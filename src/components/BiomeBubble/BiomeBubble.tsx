import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/character/types'
import { VisuallyHidden } from '@/components/VisuallyHidden/VisuallyHidden'
import './BiomeBubble.css'

export function BiomeBubble({ biome }: { biome: BiomeId | 'unexplored' }) {
  const t = useTranslations()

  return (
    <span
      className='biome-bubble'
      data-biome={biome}
      title={t(`common.biomes.${biome}`)}>
      <VisuallyHidden>{t(`common.biomes.${biome}`)}</VisuallyHidden>
    </span>
  )
}
