import { useTranslations } from 'next-intl'
import { VisuallyHidden } from '@/components/VisuallyHidden/VisuallyHidden'
import type { PossibleBiomeId } from '@/lib/types'

import './BiomeBubble.css'

export function BiomeBubble({
  biome,
  style,
  withPattern = false,
}: {
  biome: PossibleBiomeId
  style?: React.CSSProperties
  withPattern?: boolean
}) {
  const t = useTranslations()

  return (
    <span
      className='BiomeBubble'
      data-pattern={withPattern}
      data-biome={biome}
      title={t(`biomes.${biome}.name`)}
      style={style}>
      <VisuallyHidden>{t(`biomes.${biome}.name`)}</VisuallyHidden>
    </span>
  )
}
