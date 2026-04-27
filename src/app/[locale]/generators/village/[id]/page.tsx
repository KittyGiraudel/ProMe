import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { buildAlternates } from '@/app/metadataRoute'
import { VillageGeneratorFallback } from '@/components/PageGeneratorVillage/Fallback'
import { VillageGenerator } from '@/components/PageGeneratorVillage/VillageGenerator'
import { decodeVillageIdParam } from '@/lib/village/villageIdCodec'

type Props = { params: Promise<{ locale: string; id: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString, id } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('village', locale, { id })

  return {
    title: t('village.title'),
    alternates,
    openGraph: {
      title: t('village.title'),
      url: alternates.languages[locale],
    },
    robots: { index: false },
  }
}

export default async function VillageGeneratorIdPage({ params }: Props) {
  const { locale: localeAsString, id } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })

  const decoded = decodeVillageIdParam(id, t)
  if (!decoded) notFound()

  return (
    <Suspense fallback={<VillageGeneratorFallback />}>
      <VillageGenerator
        initialRoll={decoded.roll}
        initialOwners={decoded.owners}
      />
    </Suspense>
  )
}
