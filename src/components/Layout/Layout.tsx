'use client'

import { Layout as AntLayout, BreadcrumbProps, Typography } from 'antd'
import { type ReactNode } from 'react'
import { Banner } from '@/components/Banner/Banner'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Footer } from '@/components/Footer/Footer'
import { Navigation } from '@/components/Navigation/Navigation'
import { useSettings } from '@/components/PageSettings/SettingsContext'
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
  withBannerImage?: boolean
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
  withBannerImage = false,
  className = '',
  appThemeOverride,
}: LayoutProps) => {
  const { settings } = useSettings()

  // The only instance where we need to disable the theme picker is if we are
  // overriding the theme. We cannot just rely on the presence of the
  // `appThemeOverride` prop however, because it is *always* passed in the char-
  // acter sheet, even when the theme is not overridden.
  const disableThemeToggle = appThemeOverride !== settings.appearance.theme

  useApplyAppTheme(appThemeOverride)

  return (
    <AntLayout className={`Layout ${className}`}>
      <Navigation disableThemeToggle={disableThemeToggle} />
      <Banner biome={bannerBiome} withBannerImage={withBannerImage} />
      <AntLayout.Content className='Layout__wrapper' id='main'>
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
