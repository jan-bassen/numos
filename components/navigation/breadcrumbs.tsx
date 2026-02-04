import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@repo/ui/components/breadcrumb'
import Link from 'next/link'
import { Fragment, type JSX } from 'react'

export type BreadcrumbObject =
  | {
      type: 'link'
      label: string
      href: string
    }
  | {
      type: 'element'
      key: string
      element: JSX.Element
    }

export default function Breadcrumbs({
  items,
  className,
  divider,
}: {
  items: BreadcrumbObject[]
  className?: string
  divider?: JSX.Element
}) {
  if (items.length === 0) return null
  return (
    <Breadcrumb>
      <BreadcrumbList className={className}>
        {items.map((item, index) => {
          return (
            <Fragment key={item.type === 'element' ? item.key : item.href}>
              {item.type === 'link' ? (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : (
                item.element
              )}
              {index !== items.length - 1 && (
                <BreadcrumbSeparator>{divider}</BreadcrumbSeparator>
              )}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
