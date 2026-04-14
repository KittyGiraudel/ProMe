'use client'

import { Layout as AntLayout, BreadcrumbProps, Typography } from 'antd'
import { type ReactNode } from 'react'
import { Banner } from '@/components/Banner/Banner'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Footer } from '@/components/Footer/Footer'
import { Navigation } from '@/components/Navigation/Navigation'
import { Spacing } from '@/components/Spacing/Spacing'
import { useApplyAppTheme } from '@/hooks/useApplyAppTheme'
import { AppTheme } from '@/lib/settings/types'
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
  appThemeOverride?: AppTheme
}

export const Layout = ({
  title,
  breadcrumbs,
  children,
  headerActions,
  bannerBiome,
  className = '',
  appThemeOverride,
}: LayoutProps) => {
  useApplyAppTheme(appThemeOverride)

  return (
    <AntLayout className={`Layout ${className}`}>
      <AntLayout.Header className='Layout__header'>
        <Navigation themeOverride={appThemeOverride} />
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
