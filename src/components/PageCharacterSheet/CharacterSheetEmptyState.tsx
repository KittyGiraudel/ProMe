'use client'

import { useTranslations } from 'next-intl'
import { Empty } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'

export function CharacterSheetEmptyState() {
  const t = useTranslations()

  return (
    <Layout
      title={t('characters.title')}
      bannerBiome='floodedPlains'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.characters'), path: '/characters' },
      ]}>
      <Empty
        description={
          <>
            <strong>{t('characters.not_found_title')}</strong>
            <br /> {t('characters.not_found_description')}
          </>
        }>
        <BlockedLink href='/characters'>
          {t('characters.back_to_library')}
        </BlockedLink>
      </Empty>
    </Layout>
  )
}
