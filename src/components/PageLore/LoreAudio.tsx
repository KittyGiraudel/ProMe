import { useTranslations } from 'next-intl'
import { BiomeId } from '@/lib/types'
import { AudioPlayer } from '../AudioPlayer/AudioPlayer'

export function LoreAudio({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <section>
      <div className='LoreContent__sectionHead'>
        <h2 className='LoreContent__sectionLabel'>{t('audio_player.title')}</h2>
        <div className='LoreContent__sectionRule' />
      </div>
      <div className='LoreAudio'>
        <AudioPlayer biome={biome} />
      </div>
    </section>
  )
}
