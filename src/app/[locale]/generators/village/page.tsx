import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { buildAlternates } from '@/app/metadataRoute'
import { VillageGeneratorFallback } from '@/components/PageGeneratorVillage/Fallback'
import { VillageGenerator } from '@/components/PageGeneratorVillage/VillageGenerator'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('villageGenerator', locale)

  return {
    title: t('village.title'),
    alternates,
    openGraph: {
      title: t('village.title'),
      url: alternates.languages[locale],
    },
  }
}

export default function VillageGeneratorPage() {
  return (
    <Suspense fallback={<VillageGeneratorFallback />}>
      <VillageGenerator initialRoll={null} initialOwners={null} />
    </Suspense>
  )
}
