'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import './LinkTabNav.css'

export type LinkTabNavItem = {
  id: string
  href: string
  label: ReactNode
}

function normalizePath(value: string): string {
  return value.replace(/\/+$/, '') || '/'
}

export function LinkTabNav({
  items,
  className,
}: {
  items: LinkTabNavItem[]
  className?: string
}) {
  const pathname = usePathname()
  const normalizedPath = normalizePath(pathname)

  return (
    <div className={['link-tab-nav', className].filter(Boolean).join(' ')}>
      <ul className='link-tab-nav__list'>
        {items.map(({ id, href, label }) => {
          const normalizedHref = normalizePath(href)
          const isActive = normalizedPath === normalizedHref
          return (
            <li key={id} className='link-tab-nav__item'>
              <Link
                href={href}
                className='link-tab-nav__link'
                data-active={isActive ? 'true' : undefined}
                scroll={false}>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
