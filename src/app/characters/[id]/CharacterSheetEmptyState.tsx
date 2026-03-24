'use client'

import { Alert, Space, Typography } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { copy } from '@/messages/fr'

export function CharacterSheetEmptyState() {
  return (
    <Layout
      title={copy.characters.sheetTitle}
      description={copy.characters.sheetDescription}
      breadcrumbs={[
        { label: copy.nav.homeLink, href: '/' },
        { label: copy.characters.pageTitle, href: '/characters' },
      ]}>
      <Alert
        type='warning'
        title={copy.characters.notFoundTitle}
        description={
          <Space orientation='vertical'>
            <Typography.Text>
              {copy.characters.notFoundDescription}
            </Typography.Text>
            <BlockedLink href='/characters'>
              {copy.characters.backToLibrary}
            </BlockedLink>
          </Space>
        }
      />
    </Layout>
  )
}
