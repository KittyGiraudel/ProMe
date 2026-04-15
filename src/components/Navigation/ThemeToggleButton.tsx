'use client'

import MoonFilled from '@ant-design/icons/lib/icons/MoonFilled'
import SunFilled from '@ant-design/icons/lib/icons/SunFilled'
import { Tooltip } from 'antd'
import { useTranslations } from 'next-intl'

import './ThemeToggleButton.css'

type Props = {
  theme: 'light' | 'dark'
  onToggle: () => void
  disabled?: boolean
  className?: string
}

export function ThemeToggleButton({
  theme,
  onToggle,
  disabled,
  className,
}: Props) {
  const t = useTranslations()
  const label =
    theme === 'dark'
      ? t('nav.theme.switchToLight')
      : t('nav.theme.switchToDark')

  return (
    <Tooltip title={disabled ? t('nav.theme.switchDisabled') : label}>
      <button
        className={`ThemeToggleButton ${className ?? ''}`}
        onClick={onToggle}
        disabled={disabled}
        aria-label={label}
        title={label}>
        {theme === 'dark' ? <SunFilled /> : <MoonFilled />}
      </button>
    </Tooltip>
  )
}
