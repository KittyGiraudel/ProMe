import { BlockedLink } from '../Navigation/BlockedLink'
import { Breadcrumb, BreadcrumbProps } from 'antd'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import './Breadcrumbs.css'

type BreadcrumbsProps = {
  breadcrumbs: BreadcrumbProps['items']
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <Breadcrumb
      items={breadcrumbs}
      itemRender={function itemRender(currentRoute: ItemType) {
        const to = currentRoute.path ?? currentRoute.href
        return !to ? (
          <span>{currentRoute.title}</span>
        ) : (
          <BlockedLink href={to}>{currentRoute.title}</BlockedLink>
        )
      }}
    />
  )
}
