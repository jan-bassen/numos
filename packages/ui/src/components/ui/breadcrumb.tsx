import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

type BreadcrumbProps = ComponentProps<'nav'> & {
  separator?: React.ReactNode
}
const Breadcrumb = ({ ...props }: BreadcrumbProps) => (
  <nav aria-label="breadcrumb" {...props} />
)
Breadcrumb.displayName = 'Breadcrumb'

type BreadcrumbListProps = ComponentProps<'ol'>
const BreadcrumbList = ({ className, ...props }: BreadcrumbListProps) => (
  <ol
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm sm:gap-2.5',
      className,
    )}
    {...props}
  />
)
BreadcrumbList.displayName = 'BreadcrumbList'

type BreadcrumbItemProps = ComponentProps<'li'>
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => (
  <li
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

type BreadcrumbLinkProps = ComponentProps<'a'> & {
  asChild?: boolean
}
const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: BreadcrumbLinkProps) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  )
}
BreadcrumbLink.displayName = 'BreadcrumbLink'

type BreadcrumbPageProps = ComponentProps<'span'>
const BreadcrumbPage = ({ className, ...props }: BreadcrumbPageProps) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
