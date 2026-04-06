'use client'

import { Layout as AntLayout, BreadcrumbProps, Menu, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { type ReactNode, useMemo } from 'react'
import { Banner } from '@/components/Banner/Banner'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Footer } from '@/components/Footer/Footer'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { Spacing } from '@/components/Spacing/Spacing'
import { usePathname } from '@/i18n/navigation'
import type { PossibleBiomeId } from '@/lib/types'

import './Layout.css'

type LayoutProps = {
  title: string
  headerActions?: ReactNode
  /** Tints the page cover from map palette (character sheet). */
  bannerBiome?: PossibleBiomeId
  breadcrumbs: BreadcrumbProps['items']
  children: ReactNode
  className?: string
  appearance?: 'light' | 'dark'
}

export const Layout = ({
  title,
  breadcrumbs,
  children,
  headerActions,
  bannerBiome,
  className = '',
  appearance,
}: LayoutProps) => {
  const pathname = usePathname()
  const t = useTranslations()
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
    <AntLayout className={`Layout ${className}`} data-appearance={appearance}>
      {' '}
      <AntLayout.Header className='Layout__header'>
        <span className='Layout__logo'>ProMe</span>
        <Menu
          data-biome={bannerBiome}
          className='Layout__menu'
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </AntLayout.Header>
      <Banner biome={bannerBiome} />
      <AntLayout.Content className='Layout__wrapper'>
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className='Layout__content'>
          <div className='Layout__title-row'>
            <Typography.Title level={1} className='Layout__title'>
              {title}
            </Typography.Title>
            {headerActions ? (
              <div className='Layout__header-actions'>{headerActions}</div>
            ) : null}
          </div>
          <Spacing>{children}</Spacing>
        </div>
      </AntLayout.Content>
      <AntLayout.Footer className='Layout__footer'>
        <Footer />
      </AntLayout.Footer>
    </AntLayout>
  )
}
