'use client'

import { Button, Card } from 'antd'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { RichText } from '@/components/RichText/RichText'
import { useAuth } from '@/lib/auth/context'

export function PageLogin() {
  const { oauthLogin, loading, user, logout } = useAuth()
  const t = useTranslations()

  return (
    <Layout
      title={t('auth.title')}
      bannerBiome='mushroomJungle'
      breadcrumbs={[
        { title: t('nav.home'), to: { route: 'home' } },
        { title: t('nav.login'), to: { route: 'login' } },
      ]}>
      <Card
        title={<h2>{t('auth.sign_in_title')}</h2>}
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
