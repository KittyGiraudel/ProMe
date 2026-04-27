import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/app/metadataRoute'
import { BiomePage as Page } from '@/components/PageBiome/BiomePage'
import { BIOME_IDS } from '@/constants/misc'
import { routing } from '@/i18n/routing'
import { biomeIdToSlug, slugToBiomeId } from '@/lib/biomes/biomeSlug'

type Props = { params: Promise<{ locale: string; biome: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    BIOME_IDS.map(id => ({ locale, biome: biomeIdToSlug(id, locale) }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString, biome: slug } = await params
  const safeLocale = localeAsString as AppConfig['Locale']

  const biomeId = slugToBiomeId(slug, safeLocale)
  if (!biomeId) return {}

  const t = await getTranslations({ locale: safeLocale })
  const alternates = buildAlternates('biome', safeLocale, {
    biome: slug,
  })

  return {
    title: t(`biomes.${biomeId}.title`),
    description: t(`biomes.${biomeId}.teaser`),
    alternates,
    openGraph: {
      title: t(`biomes.${biomeId}.title`),
      description: t(`biomes.${biomeId}.teaser`),
      url: alternates.languages[safeLocale],
    },
  }
}

export default async function BiomePage({ params }: Props) {
  const { locale: localeAsString, biome: slug } = await params
  const safeLocale = localeAsString as AppConfig['Locale']

  const biomeId = slugToBiomeId(slug, safeLocale)
  if (!biomeId) notFound()

  return <Page biome={biomeId} />
}
