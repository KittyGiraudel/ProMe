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
        { title: t('nav.home'), to: { route: 'home' } },
        { title: t('nav.inhabitant_generator'), to: { route: 'npcGenerator' } },
      ]}>
      <Skeleton active />
    </Layout>
  )
}
