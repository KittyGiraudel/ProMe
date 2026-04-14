'use client'

import MoonFilled from '@ant-design/icons/lib/icons/MoonFilled'
import SunFilled from '@ant-design/icons/lib/icons/SunFilled'
import { useTranslations } from 'next-intl'
import './ThemeToggleButton.css'

type Props = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggleButton({ theme, onToggle }: Props) {
  const t = useTranslations()
  const label =
    theme === 'dark'
      ? t('nav.theme.switchToLight')
      : t('nav.theme.switchToDark')

  return (
    <button
      className='ThemeToggleButton'
      onClick={onToggle}
      aria-label={label}
      title={label}>
      {theme === 'dark' ? <SunFilled /> : <MoonFilled />}
    </button>
  )
}
