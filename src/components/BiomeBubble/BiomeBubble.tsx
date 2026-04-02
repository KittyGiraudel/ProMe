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
      className={withPattern ? 'BiomeBubble Pattern' : 'BiomeBubble'}
      data-biome={biome}
      title={t(`common.biomes.${biome}`)}
      style={style}>
      <VisuallyHidden>{t(`common.biomes.${biome}`)}</VisuallyHidden>
    </span>
  )
}
