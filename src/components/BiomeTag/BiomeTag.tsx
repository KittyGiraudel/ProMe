import { Tag } from 'antd'
import { BiomeId } from '@/lib/character/types'
import { useLocalize } from '@/app/contexts/LocalizationContext'
import './BiomeTag.css'

export function BiomeTag({ biome }: { biome: BiomeId }) {
  const localize = useLocalize()

  return (
    <Tag data-biome={biome} className='biome-tag'>
      {localize.string(`biomes.${biome}`)}
    </Tag>
  )
}
