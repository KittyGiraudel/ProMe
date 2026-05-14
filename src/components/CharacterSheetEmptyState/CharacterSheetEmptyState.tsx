'use client'

import { Empty, Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { AppLink } from '@/components/Navigation/AppLink'

export function CharacterSheetEmptyState({
  loading = false,
}: {
  loading?: boolean
}) {
  const t = useTranslations()

  return (
    <Layout
      title={t('characters.title')}
      bannerBiome='sunkenSavannah'
      breadcrumbs={[
        { title: t('nav.home'), to: { route: 'home' } },
        { title: t('nav.characters'), to: { route: 'characters' } },
      ]}>
      {loading ? (
        <Skeleton active />
      ) : (
        <Empty
          description={
            <>
              <strong>{t('characters.not_found_title')}</strong>
              <br /> {t('characters.not_found_description')}
            </>
          }>
          <AppLink to={{ route: 'characters' }}>
            {t('characters.back_to_library')}
          </AppLink>
        </Empty>
      )}
    </Layout>
  )
}
