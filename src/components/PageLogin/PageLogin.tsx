'use client'

import { oauthLogin } from '@netlify/identity'
import { Button, Card, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth/context'
import { Layout } from '../Layout/Layout'

export function PageLogin() {
  const { oauthLogin, loading } = useAuth()
  const t = useTranslations()

  return (
    <Layout
      title={t('auth.title')}
      bannerBiome='mushroomJungle'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.login'), path: '/login' },
      ]}>
      <Card
        title={t('auth.sign_in_with_google')}
        actions={[
          <Button onClick={() => oauthLogin()} loading={loading} type='primary'>
            {t('auth.sign_in_with_google')}
          </Button>,
        ]}>
        <Space orientation='vertical' style={{ width: '100%' }}>
          <Typography.Text>{t('auth.sign_in_prompt')}</Typography.Text>
        </Space>
      </Card>
    </Layout>
  )
}
