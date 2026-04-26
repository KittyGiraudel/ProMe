import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { VillageGeneratorFallback } from '@/components/PageGeneratorVillage/Fallback'
import { VillageGenerator } from '@/components/PageGeneratorVillage/VillageGenerator'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('village.title'),
    alternates: {
      canonical: `/${locale}/generators/village`,
      languages: {
        en: '/en/generators/village',
        fr: '/fr/generators/village',
        'x-default': `/${routing.defaultLocale}/generators/village`,
      },
    },
    openGraph: {
      title: t('village.title'),
      url: `/${locale}/generators/village`,
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
