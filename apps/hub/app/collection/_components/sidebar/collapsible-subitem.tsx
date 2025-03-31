import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/ui/components/sidebar'
import type { CollapsibleSubItem as CollapsibleSubItemType } from './categories'
import { cn } from '@repo/ui/lib/utils'

export function CollapsibleSubItem({
  item,
}: {
  item: CollapsibleSubItemType
}) {
  return (
    <SidebarMenuSubItem key={item.title} className="group flex w-full gap-0.5">
      <div className="grid min-h-full w-4 grid-rows-7 pl-1">
        <div className="col-start-1 row-span-4 row-start-1 rounded-bl-sm border-b-2 border-l-2" />
        <div className="col-start-1 row-span-7 row-start-1 border-l-2 group-last:hidden" />
      </div>
      <SidebarMenuSubButton
        className={cn(
          ' !gap-[7px] !text-sm flex w-full py-0.5 text-muted-foreground ',
          item.isActive && 'bg-sidebar-accent text-foreground',
        )}
      >
        <item.icon
          className={cn(
            '!text-muted-foreground !size-3.5',
            item.isActive && '!text-foreground',
          )}
        />
        <span>{item.title}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}
