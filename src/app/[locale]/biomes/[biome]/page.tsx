import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { BiomePage as Page } from '@/components/PageBiome/BiomePage'
import { BIOME_FONTS, BIOME_IDS } from '@/constants/misc'
import { slugToBiomeId } from '@/lib/biomes/biomeSlug'

type Props = { params: Promise<{ locale: string; biome: string }> }

export function generateStaticParams() {
  const locales = ['fr', 'en']

  return locales.flatMap(locale =>
    BIOME_IDS.map(id => ({
      locale,
      biome: id.replace(/([A-Z])/g, '-$1').toLowerCase(),
    }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { locale, biome: slug } = await params
  const biomeId = slugToBiomeId(slug)
  if (!biomeId) return {}
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  return { title: t(`biomes.${biomeId}.title`) }
}

export default async function BiomePage({ params }: Props) {
  const { locale, biome: slug } = await params
  const biomeId = slugToBiomeId(slug)
  if (!biomeId) notFound()

  const t = await getTranslations({
    locale: locale as AppConfig['Locale'],
  })
  const biomeName = t(`biomes.${biomeId}.title`)
  const fontConfig = BIOME_FONTS[biomeId]

  return (
    <>
      {fontConfig && (
        <>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='stylesheet'
            href={`https://fonts.googleapis.com/css2?family=${fontConfig.googleFamily}&text=${encodeURIComponent(biomeName)}&display=swap`}
          />
          <style>{`
            .BiomePage[data-biome='${biomeId}'] .BiomeHero__title {
              --biome-title-font: '${fontConfig.family}';
              font-family: '${fontConfig.family}', sans-serif;
              ${biomeId === 'mushroomJungle' ? 'word-spacing: -40px;' : ''}
            }
          `}</style>
        </>
      )}
      <Page biome={biomeId} />
    </>
  )
}
