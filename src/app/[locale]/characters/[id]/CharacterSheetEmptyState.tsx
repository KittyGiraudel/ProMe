'use client'

import { Alert, Space, Typography } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { useTranslations } from 'next-intl'

export function CharacterSheetEmptyState() {
  const t = useTranslations()

  return (
    <Layout
      title={t('characters.sheet_title')}
      pageCoverBiome='floodedPlains'
      breadcrumbs={[
        { label: t('nav.home_link'), href: '/' },
        { label: t('characters.page_title'), href: '/characters' },
      ]}>
      <Alert
        type='warning'
        title={t('characters.not_found_title')}
        description={
          <Space orientation='vertical'>
            <Typography.Text>
              {t('characters.not_found_description')}
            </Typography.Text>
            <BlockedLink href='/characters'>
              {t('characters.back_to_library')}
            </BlockedLink>
          </Space>
        }
      />
    </Layout>
  )
}
