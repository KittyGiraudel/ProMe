'use client'

import { Menu } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Button } from '@/components/Button/Button'
import { Logo } from '@/components/Logo/Logo'
import { Link, usePathname } from '@/i18n/navigation'
import { useAuth } from '@/lib/auth/context'

import './Navigation.css'

export function Navigation() {
  const t = useTranslations()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const items = useMemo(
    () => [
      {
        key: '/',
        label: (
          <Link href='/'>
            <Logo />
          </Link>
        ),
      },
      {
        key: '/characters',
        label: <Link href='/characters'>{t('nav.characters')}</Link>,
      },
      {
        key: 'generators',
        label: <span>{t('home.generators_title')}</span>,
        children: [
          {
            key: '/generators/npc',
            label: (
              <Link href='/generators/npc'>
                {t('nav.inhabitant_generator')}
              </Link>
            ),
          },
          {
            key: '/generators/village',
            label: (
              <Link href='/generators/village'>
                {t('nav.village_generator')}
              </Link>
            ),
          },
        ],
      },
      {
        key: '/faq',
        label: (
          <Link href='/faq' data-position='right'>
            {t('nav.faq')}
          </Link>
        ),
      },
      {
        key: '/settings',
        label: <Link href='/settings'>{t('nav.settings')}</Link>,
      },
      {
        key: user ? '/logout' : '/login',
        label: user ? (
          <Button onClick={logout} type='link'>
            {t('nav.logout')}
          </Button>
        ) : (
          <Link href='/login'>{t('nav.login')}</Link>
        ),
      },
    ],
    [t]
  )

  const selected = useMemo(() => {
    if (pathname.startsWith('/generators/npc'))
      return ['/generators', '/generators/npc']
    if (pathname.startsWith('/generators/village'))
      return ['/generators', '/generators/village']
    if (pathname.startsWith('/faq')) return ['/faq']
    if (pathname.startsWith('/settings')) return ['/settings']
    if (pathname.startsWith('/characters')) return ['/characters']
    if (pathname.startsWith('/login')) return ['/login']
    if (pathname === '/') return ['/']
    return []
  }, [pathname])

  return (
    <Menu
      className='Navigation'
      theme='dark'
      mode='horizontal'
      items={items}
      selectedKeys={selected}
    />
  )
}
