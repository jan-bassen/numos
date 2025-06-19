import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'
import { SidebarMenuButton } from '@repo/ui/components/sidebar'
import type { SidebarItem } from './collection-items'
import { CollapsibleTrigger } from '@repo/ui/components/collapsible'
import { ChevronRight } from 'lucide-react'
import type { ComponentProps } from 'react'

type CollapsibleItemProps = {
  item: SidebarItem
  href: string
  isActive: boolean
}

export function CollapsibleItem({
  item,
  href,
  isActive,
  className,
  ...props
}: CollapsibleItemProps & ComponentProps<'div'>) {
  return (
    <SidebarMenuButton asChild>
      <div
        className={cn(
          'group/collapsible-trigger flex items-center pl-2',
          isActive && 'bg-sidebar-accent',
          className,
        )}
        {...props}
      >
        <CollapsibleTrigger className="shrink-0 rounded-xs hover:text-sidebar-accent-foreground group-data-[state=expanded]:size-5 group-data-[state=expanded]:hover:bg-sidebar-accent-foreground/10">
          {isActive ? (
            <item.icons.fill className="size-4 group-data-[state=expanded]:group-hover/collapsible-trigger:hidden " />
          ) : (
            <item.icons.stroke className="size-4 group-data-[state=expanded]:group-hover/collapsible-trigger:hidden" />
          )}
          <ChevronRight className="mx-auto hidden size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[state=expanded]:group-hover/collapsible-trigger:block" />
        </CollapsibleTrigger>
        <Link className={cn('w-full', isActive && 'font-semibold')} href={href}>
          <span>{item.title}</span>
        </Link>
      </div>
    </SidebarMenuButton>
  )
}
