import { Typography } from 'antd'
import { AppConfig, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { NpcGenerator } from '@/components/PageGeneratorNpc/NpcGenerator'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('inhabitant.title'),
  }
}

function NpcGeneratorFallback() {
  const t = useTranslations()
  return (
    <Layout
      title={t('inhabitant.title')}
      bannerBiome='shadowForest'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.inhabitant_generator'), path: '/generators/npc' },
      ]}>
      <Typography.Paragraph>{t('common.loading')}</Typography.Paragraph>
    </Layout>
  )
}

export default function NpcGeneratorPage() {
  return (
    <Suspense fallback={<NpcGeneratorFallback />}>
      <NpcGenerator initialRoll={null} />
    </Suspense>
  )
}
