'use client'

import type { ReactNode } from 'react'
import { useHash } from '@/components/Navigation/useHash'
import { Link, usePathname } from '@/i18n/navigation'

import './LinkTabNav.css'

export type LinkTabNavItem = {
  id: string
  href: string
  label: ReactNode
}

export function LinkTabNav({
  items,
  className,
}: {
  items: LinkTabNavItem[]
  className?: string
}) {
  const pathname = usePathname()
  const hash = useHash()

  return (
    <div className={['LinkTabNav', className].filter(Boolean).join(' ')}>
      <ul className='LinkTabNav__list'>
        {items.map(({ id, href, label }) => (
          <li key={id} className='LinkTabNav__item'>
            <Link
              href={href}
              className='LinkTabNav__link'
              data-active={
                pathname === href || (hash && href.includes('#' + hash))
              }
              scroll={Boolean(hash)}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
