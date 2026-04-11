'use client'

import { Button, Card, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth/context'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, oauthLogin } = useAuth()
  const t = useTranslations()

  // While auth state is resolving, render nothing to avoid a flash.
  if (loading) return null

  // Authenticated — render the protected content.
  if (user) return <>{children}</>

  // Not authenticated — render an inline OAuth sign-in prompt.
  return (
    <Space
      orientation='vertical'
      align='center'
      style={{ justifyContent: 'center', width: '100%' }}>
      <Card style={{ width: 360 }}>
        <Space orientation='vertical' style={{ width: '100%' }}>
          <Typography.Title
            level={4}
            style={{ textAlign: 'center', marginBottom: 0 }}>
            {t('auth.sign_in_required')}
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
