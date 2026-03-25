'use client'

import { Breadcrumb, Layout as AntLayout, Typography, Menu } from 'antd'
import type { BreadcrumbProps } from 'antd'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { usePathname } from '@/i18n/navigation'
import type { BiomeId } from '@/lib/character/types'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { PageCover } from '../PageCover/PageCover'
import { useTranslations } from 'next-intl'
import './Layout.css'

type LayoutProps = {
  title: string
  headerActions?: ReactNode
  sheetNightChrome?: boolean
  /** Tints the page cover from map palette (character sheet). */
  pageCoverBiome?: BiomeId | 'unexplored'
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  children: ReactNode
}

const useBreadcrumbs = ({
  breadcrumbs,
  title,
}: Pick<LayoutProps, 'breadcrumbs' | 'title'>) => {
  const t = useTranslations()
  const breadcrumbItems = useMemo<BreadcrumbProps['items']>(() => {
    const items: NonNullable<BreadcrumbProps['items']> = breadcrumbs
      ? breadcrumbs.map(item => ({
          title: item.href ? (
            <BlockedLink href={item.href} className='layout__breadcrumb-link'>
              {item.label.replace(/^←\s*/, '')}
            </BlockedLink>
          ) : (
            <span>{item.label.replace(/^←\s*/, '')}</span>
          ),
        }))
      : []

    if (!breadcrumbs) {
      const resolvedBackHref = '/'
      const label = t('nav.home_link')
      items.push({
        title: (
          <BlockedLink
            href={resolvedBackHref}
            className='layout__breadcrumb-link'>
            {label.replace(/^←\s*/, '')}
          </BlockedLink>
        ),
      })
    }

    if (breadcrumbs?.length !== 0) items.push({ title: <span>{title}</span> })

    return items
  }, [breadcrumbs, t, title])

  return breadcrumbItems
}

export const Layout = ({
  title,
  breadcrumbs,
  children,
  headerActions,
  sheetNightChrome,
  pageCoverBiome,
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
  const breadcrumbItems = useBreadcrumbs({ breadcrumbs, title })

  return (
    <AntLayout
      className={sheetNightChrome ? 'layout layout--dark' : 'layout'}
      data-sheet-night={sheetNightChrome ? 'true' : undefined}>
      <AntLayout.Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </AntLayout.Header>
      <PageCover biome={pageCoverBiome} />
      <AntLayout.Content style={{ padding: '16px 48px' }}>
        <Breadcrumb items={breadcrumbItems} />

        <div className='layout__content'>
          <div className='layout__title-row'>
            <Typography.Title level={1} className='layout__title'>
              {title}
            </Typography.Title>
            {headerActions ? (
              <div className='layout__header-actions'>{headerActions}</div>
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
