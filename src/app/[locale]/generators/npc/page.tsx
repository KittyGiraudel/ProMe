import { Suspense } from 'react'
import { AppConfig, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Layout } from '@/components/Layout/Layout'
import { NpcGenerator } from '@/components/PageGeneratorNpc/NpcGenerator'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('inhabitant.title'),
  }
}

function NpcGeneratorFallback() {
  const t = useTranslations()
  return (
    <Layout
      title={t('inhabitant.title')}
      bannerBiome='fieldSea'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.inhabitant_generator'), path: '/generators/npc' },
      ]}>
      <p>{t('common.loading')}</p>
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
