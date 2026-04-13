import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { VillageGeneratorFallback } from '@/components/PageGeneratorVillage/Fallback'
import { VillageGenerator } from '@/components/PageGeneratorVillage/VillageGenerator'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('village.title'),
  }
}

export default function VillageGeneratorPage() {
  return (
    <Suspense fallback={<VillageGeneratorFallback />}>
      <VillageGenerator initialRoll={null} initialOwners={null} />
    </Suspense>
  )
}
