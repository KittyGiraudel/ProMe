import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { BlockedLink } from '../Navigation/BlockedLink'
import { Breadcrumb, BreadcrumbProps } from 'antd'
import './Breadcrumbs.css'

type BreadcrumbsProps = {
  title: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export function Breadcrumbs({ breadcrumbs, title }: BreadcrumbsProps) {
  const t = useTranslations()
  const breadcrumbItems = useMemo<BreadcrumbProps['items']>(() => {
    const items: NonNullable<BreadcrumbProps['items']> = breadcrumbs
      ? breadcrumbs.map(item => ({
          title: item.href ? (
            <BlockedLink href={item.href} className='layout__breadcrumb-link'>
              {item.label.replace(/^←\s*/, '')}
            </BlockedLink>
          ) : (
            <span>{item.label.replace(/^←\s*/, '')}</span>
          ),
        }))
      : []

    if (!breadcrumbs) {
      const resolvedBackHref = '/'
      const label = t('nav.home_link')
      items.push({
        title: (
          <BlockedLink
            href={resolvedBackHref}
            className='layout__breadcrumb-link'>
            {label.replace(/^←\s*/, '')}
          </BlockedLink>
        ),
      })
    }

    if (breadcrumbs?.length !== 0) items.push({ title: <span>{title}</span> })

    return items
  }, [breadcrumbs, t, title])

  return <Breadcrumb items={breadcrumbItems} />
}
