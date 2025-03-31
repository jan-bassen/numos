import {
  SidebarGroup,
  SidebarMenuButton,
  useSidebar,
} from '@repo/ui/components/sidebar'

import { PiHeartStroke, PiHomeDefaultStroke } from '@repo/ui/icons/pika'
import { SidebarMenu } from '@repo/ui/components/sidebar'
import { SidebarGroupLabel, SidebarMenuItem } from '@repo/ui/components/sidebar'
import { cn } from '@repo/ui/lib/utils'
import type { SidebarMenuItemType } from '@/app/collection/_components/sidebar/categories'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@repo/ui/components/tooltip'

export function Main({ items }: { items: SidebarMenuItemType[] }) {
  const { open } = useSidebar()
  return (
    <SidebarGroup className="sticky top-0 z-10 bg-sidebar-background">
      <SidebarMenu>
        {items.map((item) => (
          <TooltipProvider key={item.title} delayDuration={100}>
            <Tooltip>
              <SidebarMenuItem>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      item.isActive && 'bg-sidebar-accent font-semibold',
                      'items-center gap-2',
                    )}
                  >
                    {item.isActive ? (
                      <item.icons.fill className="size-5" />
                    ) : (
                      <item.icons.stroke className="size-5" />
                    )}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
              </SidebarMenuItem>
              <TooltipContent side="right" className={cn(open && 'hidden')}>
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
