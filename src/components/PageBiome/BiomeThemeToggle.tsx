'use client'

import MoonFilled from '@ant-design/icons/lib/icons/MoonFilled'
import SunFilled from '@ant-design/icons/lib/icons/SunFilled'
import { useTranslations } from 'next-intl'
import './BiomeThemeToggle.css'

type Props = {
  biomeTheme: 'light' | 'dark'
  onToggle: () => void
}

export function BiomeThemeToggle({ biomeTheme, onToggle }: Props) {
  const t = useTranslations()
  const label =
    biomeTheme === 'dark'
      ? t('nav.theme.switchToLight')
      : t('nav.theme.switchToDark')

  return (
    <button
      className='BiomeThemeToggle'
      onClick={onToggle}
      aria-label={label}
      title={label}>
      {biomeTheme === 'dark' ? <SunFilled /> : <MoonFilled />}
    </button>
  )
}
