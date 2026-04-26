import { Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'

export function NpcGeneratorFallback() {
  const t = useTranslations()

  return (
    <Layout
      title={t('inhabitant.title')}
      bannerBiome='shadowWoods'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.inhabitant_generator'), path: '/generators/npc' },
      ]}>
      <Skeleton active />
    </Layout>
  )
}
