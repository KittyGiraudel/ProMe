'use client'

import { Breadcrumb, Typography } from 'antd'
import type { BreadcrumbProps } from 'antd'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { copy } from '@/messages/fr'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import './Layout.css'

type LayoutProps = {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  children: ReactNode
}

export function Layout({
  title,
  description,
  backHref,
  backLabel,
  breadcrumbs,
  children,
}: LayoutProps) {
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
      const resolvedBackHref = backHref ?? '/'
      const label =
        resolvedBackHref === '/'
          ? copy.nav.homeLink
          : (backLabel ?? copy.nav.backHome)
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

    items.push({
      title: <span>{title}</span>,
    })
    return items
  }, [backHref, backLabel, breadcrumbs, title])

  return (
    <div className='layout'>
      <div className='layout__inner'>
        <Breadcrumb
          aria-label={copy.a11y.generatorBreadcrumb}
          items={breadcrumbItems}
        />
        <Typography.Title level={2} className='layout__title'>
          {title}
        </Typography.Title>
        {description ? (
          <p className='layout__description'>{description}</p>
        ) : null}
        <div className='layout__body'>{children}</div>
      </div>
    </div>
  )
}
