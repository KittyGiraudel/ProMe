'use client'

import { Layout, Menu } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { usePathname } from '@/i18n/navigation'
import './LandingNav.css'

export function LandingNav() {
  const t = useTranslations()
  const pathname = usePathname()

  const items = useMemo(
    () => [
      {
        key: '/',
        label: (
          <BlockedLink href='/' data-current={pathname === '/'}>
            {t('nav.home')}
          </BlockedLink>
        ),
      },
      {
        key: '/characters',
        label: (
          <BlockedLink
            href='/characters'
            data-current={pathname.startsWith('/characters')}>
            {t('nav.characters')}
          </BlockedLink>
        ),
      },
      {
        key: '/generators/npc',
        label: (
          <BlockedLink
            href='/generators/npc'
            data-current={pathname.startsWith('/generators/npc')}>
            {t('nav.inhabitant_generator')}
          </BlockedLink>
        ),
      },
      {
        key: '/generators/village',
        label: (
          <BlockedLink
            href='/generators/village'
            data-current={pathname.startsWith('/generators/village')}>
            {t('nav.village_generator')}
          </BlockedLink>
        ),
      },
      {
        key: '/faq',
        label: (
          <BlockedLink
            href='/faq'
            data-current={pathname.startsWith('/faq')}
            data-position='right'>
            {t('nav.faq')}
          </BlockedLink>
        ),
      },
      {
        key: '/settings',
        label: (
          <BlockedLink
            href='/settings'
            data-current={pathname.startsWith('/settings')}>
            {t('nav.settings')}
          </BlockedLink>
        ),
      },
    ],
    [pathname, t]
  )

  return (
    <Layout.Header className='LandingNav'>
      <span className='LandingNav__logo'>ProMe</span>
      <Menu
        className='LandingNav__menu'
        theme='dark'
        mode='horizontal'
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
      <BlockedLink href='/characters/new' className='LandingNav__cta'>
        {t('landing.nav.cta')}
      </BlockedLink>
    </Layout.Header>
  )
}
