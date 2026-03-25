import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { InhabitantGeneratorClient } from './InhabitantGeneratorClient'
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('inhabitant.page_title'),
  }
}

function InhabitantGeneratorFallback() {
  const t = useTranslations()
  return (
    <Layout title={t('inhabitant.page_title')} pageCoverBiome='fieldSea'>
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
