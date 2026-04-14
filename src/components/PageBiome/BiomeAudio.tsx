import { useTranslations } from 'next-intl'
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
import { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeAudio.css'

export function BiomeAudio({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <BiomeSection
      title={t('audio_player.title')}
      className='BiomeAudio'
      id='biome-audio'>
      <div className='BiomeAudio__wrapper'>
        <AudioPlayer biome={biome} />
      </div>
    </BiomeSection>
  )
}
