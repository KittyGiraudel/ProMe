'use client'

import { Layout as AntLayout, BreadcrumbProps, Typography } from 'antd'
import { type ReactNode, useContext, useEffect } from 'react'
import { AppearanceContext } from '@/components/AppProviders/ThemeProvider'
import { Banner } from '@/components/Banner/Banner'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Footer } from '@/components/Footer/Footer'
import { Navigation } from '@/components/Navigation/Navigation'
import { Spacing } from '@/components/Spacing/Spacing'
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
  const { appTheme } = useContext(AppearanceContext)

  useEffect(
    function applyAppTheme() {
      // The reason we do that with a `useEffect` instead of just placing the
      // `data-app-theme` attribute on `AntLayout` is because there are components
      // that get rendered outside of `AntLayout` (e.g. notifications, floating
      // editor, etc.).
      document.documentElement.dataset.appTheme = appThemeOverride ?? appTheme
    },
    [appThemeOverride, appTheme]
  )

  return (
    <AntLayout className={`Layout ${className}`}>
      <AntLayout.Header className='Layout__header'>
        <Navigation />
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
