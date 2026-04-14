import { AppearanceContext } from '@/components/AppProviders/ThemeProvider'
import { useContext, useEffect } from 'react'

export function useApplyAppTheme(appThemeOverride?: 'light' | 'dark') {
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
}