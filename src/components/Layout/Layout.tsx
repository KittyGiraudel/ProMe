'use client'

import { Breadcrumb, Layout as AntLayout, Typography, Menu } from 'antd'
import type { BreadcrumbProps } from 'antd'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { copy } from '@/messages/fr'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { PageCover } from '../PageCover/PageCover'
import './Layout.css'

type LayoutProps = {
  title: string
  headerActions?: ReactNode
  sheetNightChrome?: boolean
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
      const label =
        resolvedBackHref === '/' ? copy.nav.homeLink : copy.nav.backHome
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
  }, [breadcrumbs, title])

  return breadcrumbItems
}

export const Layout = ({
  title,
  breadcrumbs,
  children,
  headerActions,
  sheetNightChrome,
}: LayoutProps) => {
  const pathname = usePathname()
  const items = useMemo(
    () => [
      {
        key: '/',
        label: (
          <BlockedLink href='/' data-current={pathname === '/'}>
            {copy.nav.homeLink}
          </BlockedLink>
        ),
      },
      {
        key: '/characters',
        label: (
          <BlockedLink
            href='/characters'
            data-current={pathname.startsWith('/characters')}>
            {copy.nav.charactersLink}
          </BlockedLink>
        ),
      },
      {
        key: '/generators/inhabitant',
        label: (
          <BlockedLink
            href='/generators/inhabitant'
            data-current={pathname.startsWith('/generators/inhabitant')}>
            {copy.nav.inhabitantGeneratorLink}
          </BlockedLink>
        ),
      },
      {
        key: '/generators/village',
        label: (
          <BlockedLink
            href='/generators/village'
            data-current={pathname.startsWith('/generators/village')}>
            {copy.nav.villageGeneratorLink}
          </BlockedLink>
        ),
      },
      {
        key: '/settings',
        label: (
          <BlockedLink
            href='/settings'
            data-current={pathname.startsWith('/settings')}>
            {copy.nav.settingsLink}
          </BlockedLink>
        ),
      },
    ],
    [pathname]
  )
  const breadcrumbItems = useBreadcrumbs({ breadcrumbs, title })

  return (
    <AntLayout className={sheetNightChrome ? 'layout layout--dark' : 'layout'}>
      <AntLayout.Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </AntLayout.Header>
      <PageCover />
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
        © Les Souvenirs du Protecteur par Enzo Salviato — Application par Kitty
      </AntLayout.Footer>
    </AntLayout>
  )
}
