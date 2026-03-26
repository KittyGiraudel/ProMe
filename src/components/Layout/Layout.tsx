'use client'

import { useMemo, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Layout as AntLayout, Typography, Menu } from 'antd'
import { usePathname } from '@/i18n/navigation'
import type { BiomeId } from '@/lib/character/types'
import { Banner } from '@/components/Banner/Banner'
import { BlockedLink } from '../Navigation/BlockedLink'
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs'
import './Layout.css'

type LayoutProps = {
  title: string
  headerActions?: ReactNode
  sheetNightChrome?: boolean
  /** Tints the page cover from map palette (character sheet). */
  bannerBiome?: BiomeId | 'unexplored'
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  children: ReactNode
}

export const Layout = ({
  title,
  breadcrumbs,
  children,
  headerActions,
  sheetNightChrome,
  bannerBiome,
}: LayoutProps) => {
  const pathname = usePathname()
  const t = useTranslations()
  const items = useMemo(
    () => [
      {
        key: '/',
        label: (
          <BlockedLink href='/' data-current={pathname === '/'}>
            {t('nav.home_link')}
          </BlockedLink>
        ),
      },
      {
        key: '/characters',
        label: (
          <BlockedLink
            href='/characters'
            data-current={pathname.startsWith('/characters')}>
            {t('nav.characters_link')}
          </BlockedLink>
        ),
      },
      {
        key: '/generators/npc',
        label: (
          <BlockedLink
            href='/generators/npc'
            data-current={pathname.startsWith('/generators/npc')}>
            {t('nav.inhabitant_generator_link')}
          </BlockedLink>
        ),
      },
      {
        key: '/generators/village',
        label: (
          <BlockedLink
            href='/generators/village'
            data-current={pathname.startsWith('/generators/village')}>
            {t('nav.village_generator_link')}
          </BlockedLink>
        ),
      },
      {
        key: '/settings',
        label: (
          <BlockedLink
            href='/settings'
            data-current={pathname.startsWith('/settings')}>
            {t('nav.settings_link')}
          </BlockedLink>
        ),
      },
    ],
    [pathname, t]
  )

  return (
    <AntLayout
      className={sheetNightChrome ? 'Layout Layout--dark' : 'Layout'}
      data-sheet-night={sheetNightChrome ? 'true' : undefined}>
      <AntLayout.Header style={{ display: 'flex', alignItems: 'center' }}>
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
      <AntLayout.Content style={{ padding: '16px 48px' }}>
        <Breadcrumbs breadcrumbs={breadcrumbs} title={title} />

        <div className='Layout__content'>
          <div className='Layout__title-row'>
            <Typography.Title level={1} className='Layout__title'>
              {title}
            </Typography.Title>
            {headerActions ? (
              <div className='Layout__header-actions'>{headerActions}</div>
            ) : null}
          </div>
          {children}
        </div>
      </AntLayout.Content>
      <AntLayout.Footer style={{ textAlign: 'center' }}>
        {t('footer.copyright')}
      </AntLayout.Footer>
    </AntLayout>
  )
}
