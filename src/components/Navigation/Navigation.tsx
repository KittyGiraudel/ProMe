'use client'

import { Layout, Menu } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { Logo } from '../Logo/Logo'

import './Navigation.css'

export function Navigation() {
  const t = useTranslations()
  const pathname = usePathname()

  const items = useMemo(
    () => [
      {
        key: '/',
        label: (
          <Link href='/' data-current={pathname === '/'}>
            <Logo />
          </Link>
        ),
      },
      {
        key: '/characters',
        label: (
          <Link
            href='/characters'
            data-current={pathname.startsWith('/characters')}>
            {t('nav.characters')}
          </Link>
        ),
      },
      {
        key: '/generators/npc',
        label: (
          <Link
            href='/generators/npc'
            data-current={pathname.startsWith('/generators/npc')}>
            {t('nav.inhabitant_generator')}
          </Link>
        ),
      },
      {
        key: '/generators/village',
        label: (
          <Link
            href='/generators/village'
            data-current={pathname.startsWith('/generators/village')}>
            {t('nav.village_generator')}
          </Link>
        ),
      },
      {
        key: '/faq',
        label: (
          <Link
            href='/faq'
            data-current={pathname.startsWith('/faq')}
            data-position='right'>
            {t('nav.faq')}
          </Link>
        ),
      },
      {
        key: '/settings',
        label: (
          <Link
            href='/settings'
            data-current={pathname.startsWith('/settings')}>
            {t('nav.settings')}
          </Link>
        ),
      },
    ],
    [pathname, t]
  )

  return (
    <Menu className='Navigation' theme='dark' mode='horizontal' items={items} />
  )
}
