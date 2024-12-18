import NavBreadcrumbs from '@/components/navigation/nav-breadcrumbs'
import { Badge, type BadgeProps } from '@repo/ui/components/ui/badge'
import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps, JSX } from 'react'
import { H1 } from './headings'
import Link from 'next/link'
import {
  TabsList,
  type TabsListProps,
  TabsTrigger,
  type TabsTriggerProps,
} from '@repo/ui/components/ui/tabs'
import { Button } from '@repo/ui/components/ui/button'
import { PiThreeDotsHorizontal } from '@repo/ui/icons/pika'
import {
  DropdownMenu,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'

export function Header({
  children,
  className,
  hideBreadcrumbs,
  ...props
}: ComponentProps<'header'> & { hideBreadcrumbs?: boolean }) {
  return (
    <header
      className={cn(
        'flex h-fit w-full flex-col gap-4 border-border border-b p-6 has-[[role=tablist]]:pb-0 lg:flex-col',
        className,
      )}
      {...props}
    >
      <NavBreadcrumbs
        className={cn('pl-1.5 md:flex', hideBreadcrumbs && 'hidden md:hidden')}
      />
      {children}
    </header>
  )
}

export function HeaderContent({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between gap-4 sm:flex-row sm:gap-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function HeaderMain({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('flex w-full items-center gap-3', className)} {...props}>
      {children}
    </div>
  )
}

export function HeaderIcon({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('aspect-square size-10 shrink-0', className)} {...props}>
      {children}
    </div>
  )
}

export function HeaderTitle({
  children,
  className,
  ...props
}: ComponentProps<'h1'>) {
  return (
    <H1
      className={cn(
        'line-clamp-1 h-11 text-ellipsis border-0 px-1 pt-0.5 font-bold text-4xl',
        className,
      )}
      {...props}
    >
      {children}
    </H1>
  )
}

export function HeaderDropdown({
  children,
  className,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'ghost'}
          size={'iconMedium'}
          className="-translate-x-1 translate-y-0.5"
        >
          <PiThreeDotsHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className={cn('min-w-56 rounded-lg', className)}
        {...props}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function HeaderBadge({
  href,
  className,
  variant = 'secondary',
  ...props
}: BadgeProps & { href?: string }) {
  return href ? (
    <Link href={href}>
      <Badge className={cn('mt-1', className)} variant={variant} {...props}>
        {props.children}
      </Badge>
    </Link>
  ) : (
    <Badge className={cn('mt-1', className)} variant={variant} {...props}>
      {props.children}
    </Badge>
  )
}

export function HeaderDescription({
  children,
  className,
  ...props
}: ComponentProps<'p'>) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  )
}

export function HeaderTabBar({ className, children, ...props }: TabsListProps) {
  return (
    <TabsList
      className={cn('h-9 w-fit gap-0 bg-transparent p-0', className)}
      {...props}
    >
      {children}
    </TabsList>
  )
}

export function HeaderTabBarItem({
  className,
  children,
  icon,
  ...props
}: TabsTriggerProps & {
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}) {
  return (
    <TabsTrigger
      className={cn(
        'data-[state=active]:!border-b-2 h-full gap-1 rounded-none border-0 border-primary data-[state=active]:shadow-none',
        className,
      )}
      {...props}
    >
      {icon?.({ className: 'my-auto size-3.5' })}
      {children}
    </TabsTrigger>
  )
}

export function HeaderActions({ children, className }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-fit shrink-0 items-end justify-start gap-2 md:justify-end',
        className,
      )}
    >
      {children}
    </div>
  )
}
