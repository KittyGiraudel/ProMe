'use client'

import { Breadcrumb, Typography } from 'antd'
import type { BreadcrumbProps } from 'antd'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { copy } from '@/messages/fr'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import './GeneratorPageShell.css'

type GeneratorPageShellProps = {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  /** When set (e.g. inhabitant opened from village), show village + home links. */
  villageBackHref?: string
  children: ReactNode
}

export function GeneratorPageShell({
  title,
  description,
  backHref,
  backLabel,
  villageBackHref,
  children,
}: GeneratorPageShellProps) {
  const breadcrumbItems = useMemo<BreadcrumbProps['items']>(() => {
    const items: NonNullable<BreadcrumbProps['items']> = []

    if (villageBackHref) {
      items.push({
        title: (
          <BlockedLink
            href='/'
            className='generator-page-shell__breadcrumb-link'>
            {copy.nav.homeLink}
          </BlockedLink>
        ),
      })
      items.push({
        title: (
          <BlockedLink
            href={villageBackHref}
            className='generator-page-shell__breadcrumb-link'>
            {copy.nav.backToVillage.replace(/^←\s*/, '')}
          </BlockedLink>
        ),
      })
    } else if (backHref) {
      const label =
        backHref === '/' ? copy.nav.homeLink : (backLabel ?? copy.nav.backHome)
      items.push({
        title: (
          <BlockedLink
            href={backHref}
            className='generator-page-shell__breadcrumb-link'>
            {label.replace(/^←\s*/, '')}
          </BlockedLink>
        ),
      })
    }

    items.push({
      title: <span>{title}</span>,
    })
    return items
  }, [backHref, backLabel, title, villageBackHref])

  return (
    <div className='generator-page-shell'>
      <div className='generator-page-shell__inner'>
        <Breadcrumb
          className='generator-page-shell__breadcrumb'
          aria-label={copy.a11y.generatorBreadcrumb}
          items={breadcrumbItems}
        />
        <Typography.Title level={2} className='generator-page-shell__title'>
          {title}
        </Typography.Title>
        {description ? (
          <p className='generator-page-shell__description'>{description}</p>
        ) : null}
        <div className='generator-page-shell__body'>{children}</div>
      </div>
    </div>
  )
}
