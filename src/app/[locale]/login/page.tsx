'use client'

import { Button, Card, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth/context'

export default function LoginPage() {
  const t = useTranslations()
  const { oauthLogin, loading } = useAuth()

  if (loading) return null

  return (
    <Space
      orientation='vertical'
      align='center'
      style={{ minHeight: '100dvh', justifyContent: 'center', width: '100%' }}>
      <Card style={{ width: 360 }}>
        <Space orientation='vertical' style={{ width: '100%' }}>
          <Typography.Title
            level={3}
            style={{ textAlign: 'center', marginBottom: 0 }}>
            ProMe
          </Typography.Title>
          <Typography.Text
            type='secondary'
            style={{
              display: 'block',
              textAlign: 'center',
              marginBottom: '1em',
            }}>
            {t('auth.sign_in_prompt')}
          </Typography.Text>
          <Button block onClick={() => oauthLogin()}>
            {t('auth.sign_in_with_google')}
          </Button>
        </Space>
      </Card>
    </Space>
  )
}
