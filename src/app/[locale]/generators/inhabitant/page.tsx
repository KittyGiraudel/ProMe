import { Suspense } from 'react'
import { AppConfig, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Layout } from '@/components/Layout/Layout'
import { InhabitantGeneratorClient } from './InhabitantGeneratorClient'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('inhabitant.title'),
  }
}

function InhabitantGeneratorFallback() {
  const t = useTranslations()
  return (
    <Layout title={t('inhabitant.title')} pageCoverBiome='fieldSea'>
      <p>{t('common.loading')}</p>
    </Layout>
  )
}

export default function InhabitantGeneratorPage() {
  return (
    <Suspense fallback={<InhabitantGeneratorFallback />}>
      <InhabitantGeneratorClient />
    </Suspense>
  )
}
