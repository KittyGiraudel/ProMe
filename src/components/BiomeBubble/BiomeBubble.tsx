import { useTranslations } from 'next-intl'
import { VisuallyHidden } from '@/components/VisuallyHidden/VisuallyHidden'
import type { BiomeId } from '@/lib/types'
import './BiomeBubble.css'

export function BiomeBubble({ biome }: { biome: BiomeId | 'unexplored' }) {
  const t = useTranslations()

  return (
    <span
      className='BiomeBubble'
      data-biome={biome}
      title={t(`common.biomes.${biome}`)}>
      <VisuallyHidden>{t(`common.biomes.${biome}`)}</VisuallyHidden>
    </span>
  )
}
