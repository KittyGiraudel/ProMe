'use client'

import type { ReactNode } from 'react'
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

  return (
    <div className={['LinkTabNav', className].filter(Boolean).join(' ')}>
      <ul className='LinkTabNav__list'>
        {items.map(({ id, href, label }) => (
          <li key={id} className='LinkTabNav__item'>
            <Link
              href={href}
              className='LinkTabNav__link'
              data-active={pathname === href}
              scroll={false}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
