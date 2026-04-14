'use client'

import './BiomeThemeToggle.css'

type Props = {
  biomeTheme: 'light' | 'dark'
  onToggle: () => void
}

export function BiomeThemeToggle({ biomeTheme, onToggle }: Props) {
  const label =
    biomeTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      className='BiomeThemeToggle'
      onClick={onToggle}
      aria-label={label}
      title={label}>
      {biomeTheme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
