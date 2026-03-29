import { Tag } from 'antd'
import { useTranslations } from 'next-intl'
import { BiomeId } from '@/lib/types'
import './BiomeTag.css'

export function BiomeTag({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <Tag data-biome={biome} className='BiomeTag'>
      {t(`common.biomes.${biome}`)}
    </Tag>
  )
}
