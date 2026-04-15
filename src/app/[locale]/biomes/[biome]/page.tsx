import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { BiomePage as Page } from '@/components/PageBiome/BiomePage'
import { BIOME_IDS } from '@/constants/misc'
import { routing } from '@/i18n/routing'
import { biomeIdToSlug, slugToBiomeId } from '@/lib/biomes/biomeSlug'

type Props = { params: Promise<{ locale: string; biome: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    BIOME_IDS.map(id => ({ locale, biome: biomeIdToSlug(id) }))
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
  const { biome: slug } = await params

  const biomeId = slugToBiomeId(slug)
  if (!biomeId) notFound()

  return <Page biome={biomeId} />
}
