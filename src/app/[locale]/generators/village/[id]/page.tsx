import { Typography } from 'antd'
import { notFound } from 'next/navigation'
import { AppConfig, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { VillageGenerator } from '@/components/PageGeneratorVillage/VillageGenerator'
import { decodeVillageIdParam } from '@/lib/village/villageIdCodec'

type Props = { params: Promise<{ locale: AppConfig['Locale']; id: string }> }

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
    <Layout
      title={t('village.title')}
      bannerBiome='shadowForest'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.village_generator'), path: '/generators/village' },
      ]}>
      <Typography.Paragraph>{t('common.loading')}</Typography.Paragraph>
    </Layout>
  )
}

export default async function VillageGeneratorIdPage({ params }: Props) {
  const { locale, id } = await params
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
