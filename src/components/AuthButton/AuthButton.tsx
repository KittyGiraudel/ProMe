import { Button } from 'antd'
import { useTranslations } from 'next-intl'
import { AppLink } from '@/components/Navigation/AppLink'
import { useAuth } from '@/lib/auth/context'

export function AuthButton({ className }: { className?: string }) {
  const { user, logout, loading } = useAuth()
  const t = useTranslations()

  if (loading) return null

  return user ? (
    <Button onClick={logout} type='text' className={className}>
      {t('nav.logout')}
    </Button>
  ) : (
    <AppLink to={{ route: 'login' }} block className={className}>
      {t('nav.login')}
    </AppLink>
  )
}
