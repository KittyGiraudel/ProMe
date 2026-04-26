'use client'

import { Empty, Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { Link } from '@/i18n/navigation'

export function CharacterSheetEmptyState({
  loading = false,
}: {
  loading?: boolean
}) {
  const t = useTranslations()

  return (
    <Layout
      title={t('characters.title')}
      bannerBiome='sunkenSavanna'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.characters'), path: '/characters' },
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
          <Link href='/characters'>{t('characters.back_to_library')}</Link>
        </Empty>
      )}
    </Layout>
  )
}
