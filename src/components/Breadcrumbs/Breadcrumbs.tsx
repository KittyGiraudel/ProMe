import { Breadcrumb } from 'antd'
import type { ReactNode } from 'react'
import type { AppRouteTo } from '@/i18n/navigation'
import { AppLink } from '../Navigation/AppLink'

import './Breadcrumbs.css'

type BreadcrumbsProps = {
  breadcrumbs: BreadcrumbItem[]
}

export type BreadcrumbItem = {
  title: ReactNode
  to?: AppRouteTo
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <Breadcrumb
      items={breadcrumbs.map(({ title, to }) => ({
        title: to ? (
          <AppLink to={to} block>
            {title}
          </AppLink>
        ) : (
          <span>{title}</span>
        ),
      }))}
    />
  )
}
