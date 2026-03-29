import { Typography } from 'antd'
import { notFound } from 'next/navigation'
import { AppConfig, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { NpcGenerator } from '@/components/PageGeneratorNpc/NpcGenerator'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'

type Props = { params: Promise<{ locale: AppConfig['Locale']; id: string }> }

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
      <Typography.Paragraph>{t('common.loading')}</Typography.Paragraph>
    </Layout>
  )
}

export default async function NpcGeneratorIdPage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations({ locale })

  const roll = decodeInhabitantRollParam(id, t)
  if (!roll) notFound()

  return (
    <Suspense fallback={<NpcGeneratorFallback />}>
      <NpcGenerator initialRoll={roll} />
    </Suspense>
  )
}
