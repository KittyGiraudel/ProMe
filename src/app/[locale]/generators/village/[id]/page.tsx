import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { VillageGeneratorFallback } from '@/components/PageGeneratorVillage/Fallback'
import { VillageGenerator } from '@/components/PageGeneratorVillage/VillageGenerator'
import { decodeVillageIdParam } from '@/lib/village/villageIdCodec'

type Props = { params: Promise<{ locale: string; id: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  return {
    title: t('village.title'),
  }
}

export default async function VillageGeneratorIdPage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

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
