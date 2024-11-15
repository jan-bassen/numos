import NavBreadcrumbs from '@/components/navigation/nav-breadcrumbs'
import { Badge, type BadgeVariant } from '@repo/ui/components/ui/badge'
import { cn } from '@repo/ui/lib/utils'
import type { ReactNode } from 'react'
import { H1 } from './headings'
import Link from 'next/link'
import { TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs'

export type TabItems = {
  value: string
  label: string
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}

export default function Header({
  title,
  subtitle,
  badge,
  icon,
  tabs,
  children,
  className,
  showBreadcrumbs = true,
}: {
  title: string
  subtitle?: string | null
  badge?: { text: string; variant?: BadgeVariant; link?: string }
  icon?: ReactNode
  tabs?: TabItems[]
  children?: ReactNode
  className?: string
  showBreadcrumbs?: boolean
}) {
  return (
    <header
      className={cn(
        'flex h-fit w-full flex-col gap-4 border-border border-b p-6 lg:flex-col',
        tabs && 'pb-0',
        className,
      )}
    >
      <NavBreadcrumbs
        className={cn('hidden pl-1.5', showBreadcrumbs && 'md:flex')}
      />
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:gap-2">
        <div className="flex items-center gap-3">
          {icon && <div className="aspect-square h-full shrink-0">{icon}</div>}
          <H1 className="line-clamp-1 h-11 text-ellipsis border border-background px-1 pt-0.5 font-bold text-4xl">
            {title}
          </H1>
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
        <div className="flex w-fit items-end justify-start gap-2 md:justify-end">
          {children}
        </div>
      </div>
      {tabs && (
        <TabsList className="h-9 w-fit gap-0 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:!border-b-2 h-full gap-1.5 rounded-none border-0 border-primary data-[state=active]:shadow-none"
            >
              {tab.Icon({ className: 'my-auto h-4 w-4' })}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
    </header>
  )
}
