import { Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'

export function VillageGeneratorFallback() {
  const t = useTranslations()
  return (
    <Layout
      title={t('village.title')}
      bannerBiome='titanGarden'
      breadcrumbs={[
        { title: t('nav.home'), to: { route: 'home' } },
        {
          title: t('nav.village_generator'),
          to: { route: 'villageGenerator' },
        },
      ]}>
      <Skeleton active />
    </Layout>
  )
}
