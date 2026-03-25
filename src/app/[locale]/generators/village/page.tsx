import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { VillageGeneratorClient } from './VillageGeneratorClient'
import { getTranslations } from 'next-intl/server'
import { AppConfig, useTranslations } from 'next-intl'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('village.title'),
  }
}

function VillageGeneratorFallback() {
  const t = useTranslations()
  return (
    <Layout title={t('village.title')} pageCoverBiome='shadowForest'>
      <p>{t('common.loading')}</p>
    </Layout>
  )
}

export default function VillageGeneratorPage() {
  return (
    <Suspense fallback={<VillageGeneratorFallback />}>
      <VillageGeneratorClient />
    </Suspense>
  )
}
