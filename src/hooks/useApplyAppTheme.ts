import { useContext, useEffect, useMemo } from 'react'
import { AppearanceContext } from '@/components/AppProviders/ThemeProvider'

export function useApplyAppTheme(appThemeOverride?: 'light' | 'dark') {
  const { appTheme } = useContext(AppearanceContext)
  const actualTheme = useMemo(
    () => appThemeOverride ?? appTheme,
    [appThemeOverride, appTheme]
  )

  useEffect(
    function applyAppTheme() {
      // The reason we do that with a `useEffect` instead of just placing the
      // `data-app-theme` attribute on `AntLayout` is because there are components
      // that get rendered outside of `AntLayout` (e.g. notifications, floating
      // editor, etc.).
      document.documentElement.dataset.appTheme = actualTheme
    },
    [actualTheme]
  )
}
