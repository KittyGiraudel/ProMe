'use client'

import { Alert, Space, Typography } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export function CharacterSheetEmptyState() {
  const localize = useLocalize()
  return (
    <Layout
      title={localize.string('characters.sheetTitle')}
      pageCoverBiome='floodedPlains'
      breadcrumbs={[
        { label: localize.string('nav.homeLink'), href: '/' },
        { label: localize.string('characters.pageTitle'), href: '/characters' },
      ]}>
      <Alert
        type='warning'
        title={localize.string('characters.notFoundTitle')}
        description={
          <Space orientation='vertical'>
            <Typography.Text>
              {localize.string('characters.notFoundDescription')}
            </Typography.Text>
            <BlockedLink href='/characters'>
              {localize.string('characters.backToLibrary')}
            </BlockedLink>
          </Space>
        }
      />
    </Layout>
  )
}
