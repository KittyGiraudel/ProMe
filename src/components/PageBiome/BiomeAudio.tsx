import { useTranslations } from 'next-intl'
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
import { useBiomeTrack } from '@/components/AudioPlayer/useBiomeTrack'
import { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeAudio.css'

export function BiomeAudio({ biome }: { biome: BiomeId }) {
  const t = useTranslations()
  const firstTrack = useBiomeTrack(biome, '1')
  const secondTrack = useBiomeTrack(biome, '2')

  if (!firstTrack.url || !secondTrack.url) return null

  return (
    <BiomeSection
      title={t('audio_player.title')}
      className='BiomeAudio'
      id='biome-audio'>
      <div className='BiomeAudio__grid'>
        <div className='BiomeAudio__wrapper'>
          <AudioPlayer
            biome={biome}
            name={firstTrack.name}
            url={firstTrack.url}
          />
        </div>
        <div className='BiomeAudio__wrapper'>
          <AudioPlayer
            biome={biome}
            name={secondTrack.name}
            url={secondTrack.url}
          />
        </div>
      </div>
    </BiomeSection>
  )
}
