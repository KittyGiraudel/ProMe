import { getTranslations } from 'next-intl/server'
import { Footer } from '@/components/Footer/Footer'
import { LandingFeature } from './LandingFeature'
import { LandingFinalCta } from './LandingFinalCta'
import { LandingHero } from './LandingHero'
import { LandingNav } from './LandingNav'
import { CharacterSheetVisual } from './visuals/CharacterSheetVisual'
import { DiceVisual } from './visuals/DiceVisual'
import { GeneratorVisual } from './visuals/GeneratorVisual'
import { JournalVisual } from './visuals/JournalVisual'
import { MapVisual } from './visuals/MapVisual'
import { MusicVisual } from './visuals/MusicVisual'

import './LandingPage.css'

export async function LandingPage() {
  const t = await getTranslations()

  return (
    <div className='LandingPage'>
      <LandingNav />
      <LandingHero />
      <main className='LandingPage__main'>
        <LandingFeature
          number={t('landing.features.character.number')}
          title={t('landing.features.character.title')}
          body={t('landing.features.character.body')}
          tags={[
            t('landing.features.character.tags.1'),
            t('landing.features.character.tags.2'),
            t('landing.features.character.tags.3'),
            t('landing.features.character.tags.4'),
          ]}
          visual={<CharacterSheetVisual />}
          colorScheme='sage'
        />
        <LandingFeature
          number={t('landing.features.map.number')}
          title={t('landing.features.map.title')}
          body={t('landing.features.map.body')}
          tags={[
            t('landing.features.map.tags.1'),
            t('landing.features.map.tags.2'),
            t('landing.features.map.tags.3'),
            t('landing.features.map.tags.4'),
          ]}
          visual={<MapVisual />}
          colorScheme='purple-dark'
          reversed
        />
        <LandingFeature
          number={t('landing.features.journal.number')}
          title={t('landing.features.journal.title')}
          body={t('landing.features.journal.body')}
          tags={[
            t('landing.features.journal.tags.1'),
            t('landing.features.journal.tags.2'),
            t('landing.features.journal.tags.3'),
            t('landing.features.journal.tags.4'),
          ]}
          visual={<JournalVisual />}
          colorScheme='parchment'
        />
        <LandingFeature
          number={t('landing.features.dice.number')}
          title={t('landing.features.dice.title')}
          body={t('landing.features.dice.body')}
          tags={[
            t('landing.features.dice.tags.1'),
            t('landing.features.dice.tags.2'),
            t('landing.features.dice.tags.3'),
          ]}
          visual={<DiceVisual />}
          colorScheme='terracotta-dark'
          reversed
        />
        <LandingFeature
          number={t('landing.features.music.number')}
          title={t('landing.features.music.title')}
          body={t('landing.features.music.body')}
          tags={[
            t('landing.features.music.tags.1'),
            t('landing.features.music.tags.2'),
            t('landing.features.music.tags.3'),
          ]}
          visual={<MusicVisual />}
          colorScheme='teal'
        />
        <LandingFeature
          number={t('landing.features.generators.number')}
          title={t('landing.features.generators.title')}
          body={t('landing.features.generators.body')}
          tags={[
            t('landing.features.generators.tags.1'),
            t('landing.features.generators.tags.2'),
            t('landing.features.generators.tags.3'),
          ]}
          visual={<GeneratorVisual />}
          colorScheme='gold-dark'
          reversed
        />
      </main>
      <LandingFinalCta />
      <Footer />
    </div>
  )
}
