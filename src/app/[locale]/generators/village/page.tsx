import { Typography } from 'antd'
import { AppConfig, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { VillageGenerator } from '@/components/PageGeneratorVillage/VillageGenerator'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('village.title'),
  }
}

function VillageGeneratorFallback() {
  const t = useTranslations()
  return (
    <Layout
      title={t('village.title')}
      bannerBiome='giganticGardens'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.village_generator'), path: '/generators/village' },
      ]}>
      <Typography.Paragraph>{t('common.loading')}</Typography.Paragraph>
    </Layout>
  )
}

export default function VillageGeneratorPage() {
  return (
    <Suspense fallback={<VillageGeneratorFallback />}>
      <VillageGenerator initialRoll={null} initialOwners={null} />
    </Suspense>
  )
}
