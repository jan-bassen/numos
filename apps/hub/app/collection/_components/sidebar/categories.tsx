'use client'

import {
  Collapsible,
  CollapsibleContent,
} from '@repo/ui/components/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemComponent,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/ui/components/sidebar'
import type { SVGProps, JSX } from 'react'
import { CollapsibleTrigger } from '@/app/collection/_components/sidebar/collapsible-trigger'
import { CollapsibleSubItem as CollapsibleSubItemComponent } from '@/app/collection/_components/sidebar/collapsible-subitem'
import type { LucideIcon } from '@repo/ui/icons/lucide'

export type SidebarMenuItemType = {
  title: string
  isActive?: boolean
  url: string
  icons: {
    stroke: (props: SVGProps<SVGSVGElement>) => JSX.Element
    fill: (props: SVGProps<SVGSVGElement>) => JSX.Element
  }
}

export type CollapsibleItem = SidebarMenuItemType & {
  items?: CollapsibleSubItem[]
}

export type CollapsibleSubItem = {
  icon: LucideIcon
  title: string
  slug: string
  isActive?: boolean
}

export function SidebarCategories({
  items,
}: {
  items: CollapsibleItem[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Categories</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItemComponent>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger item={item} />
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-2.5 gap-0 border-l-0 pl-0">
                      {item.items?.map((subItem) => (
                        <CollapsibleSubItemComponent
                          key={subItem.title}
                          item={subItem}
                        />
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItemComponent>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
