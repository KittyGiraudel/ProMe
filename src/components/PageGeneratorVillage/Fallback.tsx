import { Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'

export function VillageGeneratorFallback() {
  const t = useTranslations()
  return (
    <Layout
      title={t('village.title')}
      bannerBiome='titanGardens'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.village_generator'), path: '/generators/village' },
      ]}>
      <Skeleton active />
    </Layout>
  )
}
