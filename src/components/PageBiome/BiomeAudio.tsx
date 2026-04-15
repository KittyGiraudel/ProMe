import { useTranslations } from 'next-intl'
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
import { useTrackSelector } from '@/components/AudioPlayer/useTrackSelector'
import { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeAudio.css'

export function BiomeAudio({ biome }: { biome: BiomeId }) {
  const t = useTranslations()
  const { url, name, goToPrev, goToNext } = useTrackSelector(biome)

  if (!url) return null

  return (
    <BiomeSection
      title={t('audio_player.title')}
      className='BiomeAudio'
      id='biome-audio'>
      <div className='BiomeAudio__wrapper'>
        <AudioPlayer
          biome={biome}
          name={name}
          url={url}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      </div>
    </BiomeSection>
  )
}
