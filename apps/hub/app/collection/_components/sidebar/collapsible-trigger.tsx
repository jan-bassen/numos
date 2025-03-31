import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'
import { SidebarMenuButton, useSidebar } from '@repo/ui/components/sidebar'
import { CollapsibleTrigger as CollapsibleTriggerBase } from '@repo/ui/components/collapsible'
import { useEffect, useState, type ComponentProps } from 'react'
import type { CollapsibleItem } from '@/app/collection/_components/sidebar/categories'
import { PiChevronBigRightStroke } from '@repo/ui/icons/pika'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@repo/ui/components/dropdown-menu'

export function CollapsibleTrigger({
  item,
  className,
  ...props
}: ComponentProps<'div'> & {
  item: CollapsibleItem
}) {
  const { open } = useSidebar()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (!item) return null

  if (!open)
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className={cn(
                    (item.isActive || dropdownOpen) && 'bg-sidebar-accent',
                    className,
                  )}
                >
                  {item.isActive ? (
                    <item.icons.fill className="size-5" />
                  ) : (
                    <item.icons.stroke className="size-5" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <DropdownMenuContent
              side="right"
              align="start"
              className="-translate-y-1"
            >
              <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {item.items?.map((subItem) => (
                <DropdownMenuItem key={subItem.title}>
                  <Link
                    href={`/categories/${subItem.slug}`}
                    className="flex items-center gap-2"
                  >
                    <subItem.icon className="size-3.5" />
                    <p className="text-sm">{subItem.title}</p>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipContent side="right">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  return (
    <SidebarMenuButton asChild>
      <div
        className={cn(
          'group/collapsible-trigger flex items-center group-data-[state=expanded]:pl-2',
          item.isActive && 'bg-sidebar-accent',
          className,
        )}
        {...props}
      >
        <CollapsibleTriggerBase className="shrink-0 rounded-xs hover:text-sidebar-accent-foreground group-data-[state=expanded]:size-5 group-data-[state=expanded]:hover:bg-sidebar-accent-foreground/10">
          {item.isActive ? (
            <item.icons.fill className="size-4 group-data-[state=expanded]:group-hover/collapsible-trigger:hidden " />
          ) : (
            <item.icons.stroke className="size-4 group-data-[state=expanded]:group-hover/collapsible-trigger:hidden" />
          )}
          <PiChevronBigRightStroke className="mx-auto hidden size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[state=expanded]:group-hover/collapsible-trigger:block" />
        </CollapsibleTriggerBase>
        <Link
          className={cn('w-full', item.isActive && 'font-semibold')}
          href={item.url}
        >
          <span>{item.title}</span>
        </Link>
      </div>
    </SidebarMenuButton>
  )
}
