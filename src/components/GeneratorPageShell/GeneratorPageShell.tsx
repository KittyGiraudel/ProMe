'use client'

import { Typography } from 'antd'
import type { ReactNode } from 'react'
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
  const homeHref = backHref ?? '/'
  return (
    <div className='generator-page-shell'>
      <div className='generator-page-shell__inner'>
        {villageBackHref ? (
          <nav
            className='generator-page-shell__back-row'
            aria-label={copy.a11y.generatorBreadcrumb}>
            <BlockedLink
              href={villageBackHref}
              className='generator-page-shell__back'>
              {copy.nav.backToVillage}
            </BlockedLink>
            <span className='generator-page-shell__back-sep' aria-hidden='true'>
              {copy.nav.navMid}
            </span>
            <BlockedLink href={homeHref} className='generator-page-shell__back'>
              {copy.nav.homeLink}
            </BlockedLink>
          </nav>
        ) : backHref ? (
          <BlockedLink href={backHref} className='generator-page-shell__back'>
            {backLabel ?? '←'}
          </BlockedLink>
        ) : null}
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
