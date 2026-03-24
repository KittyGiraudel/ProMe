import { BiomeId } from '@/lib/character/types'
import { Tag } from 'antd'
import './BiomeTag.css'
import { copy } from '@/messages/fr'

export function BiomeTag({ biome }: { biome: BiomeId }) {
  return (
    <Tag data-biome={biome} className='biome-tag'>
      {copy.characters.mapBiomes[biome]}
    </Tag>
  )
}
