'use client'

import { Button, Card } from 'antd'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { useAuth } from '@/lib/auth/context'
import { RichText } from '../RichText/RichText'

export function PageLogin() {
  const { oauthLogin, loading, user, logout } = useAuth()
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
        title={t('auth.sign_in_title')}
        actions={
          user
            ? [
                <Button key='logout' onClick={logout} loading={loading}>
                  {t('nav.logout')}
                </Button>,
              ]
            : [
                <Button
                  key='login'
                  onClick={() => oauthLogin()}
                  loading={loading}
                  type='primary'>
                  {t('auth.sign_in_with_google')}
                </Button>,
              ]
        }>
        <RichText text={t('auth.sign_in_prompt')} />
      </Card>
    </Layout>
  )
}
