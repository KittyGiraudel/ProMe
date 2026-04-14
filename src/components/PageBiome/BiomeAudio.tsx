import { useTranslations } from 'next-intl'
import { BiomeId } from '@/lib/types'
import { AudioPlayer } from '../AudioPlayer/AudioPlayer'

export function BiomeAudio({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <section>
      <div className='BiomeContent__sectionHead'>
        <h2 className='BiomeContent__sectionLabel'>
          {t('audio_player.title')}
        </h2>
        <div className='BiomeContent__sectionRule' />
      </div>
      <div className='BiomeAudio'>
        <AudioPlayer biome={biome} />
      </div>
    </section>
  )
}
