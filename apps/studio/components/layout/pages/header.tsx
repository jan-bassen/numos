import NavBreadcrumbs from '@/components/nav/nav-breadcrumbs'
import { Badge, type BadgeVariant } from '@repo/ui/components/ui/badge'
import { cn } from '@repo/ui/lib/utils'
import type { ReactNode } from 'react'
import { H1 } from './headings'
import Link from 'next/link'

export default function Header({
  title,
  subtitle,
  badge,
  icon,
  children,
  className,
  showBreadcrumbs = true,
}: {
  title: string
  subtitle?: string
  badge?: { text: string; variant?: BadgeVariant; link?: string }
  icon?: ReactNode
  children?: ReactNode
  className?: string
  showBreadcrumbs?: boolean
}) {
  return (
    <header
      className={cn(
        'flex w-full flex-col gap-6 lg:flex-col xl:gap-2',
        !showBreadcrumbs && 'pt-6',
        className,
      )}
    >
      <div className={cn('hidden', showBreadcrumbs && 'md:block')}>
        <NavBreadcrumbs />
      </div>
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:gap-2">
        <div className="flex w-fit max-w-1/2 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="aspect-square h-full shrink-0">{icon}</div>
              )}
              <H1 className="line-clamp-1 h-11 text-ellipsis border border-background px-1 pt-0.5 font-bold text-4xl">
                {title}
              </H1>
            </div>
            {badge ? (
              badge.link ? (
                <Link href={badge.link}>
                  <Badge variant={badge?.variant} className="mt-1">
                    {badge?.text}
                  </Badge>
                </Link>
              ) : (
                <Badge variant={badge?.variant} className="mt-1">
                  {badge?.text}
                </Badge>
              )
            ) : null}
          </div>
          <h3
            className={cn(
              'line-clamp-2 max-w-[40rem] text-balance border border-background px-1 py-0.5 font-normal text-muted-foreground text-sm',
              /*  subtitle ? '!min-h-12 h-12' : */ '!min-h-7',
            )}
          >
            {subtitle}
          </h3>
        </div>
        <div className="flex w-fit items-start gap-2 pt-1 pb-2 md:justify-end">
          {children}
        </div>
      </div>
    </header>
  )
}
