import type * as React from 'react'
import type { SVGProps } from 'react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/ui/components/sidebar'
import { TooltipProvider, TooltipTrigger } from '@repo/ui/components/tooltip'
import { TooltipContent } from '@repo/ui/components/tooltip'
import { cn } from '@repo/ui/lib/utils'
import { Tooltip } from '@repo/ui/components/tooltip'

export function Socials({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { open } = useSidebar()
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <TooltipProvider delayDuration={100} key={item.title}>
              <Tooltip>
                <SidebarMenuItem key={item.title}>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild size="sm">
                      <a href={item.url}>
                        {item.icon({ className: 'size-4' })}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={cn(open && 'hidden')}>
                    <p>{item.title}</p>
                  </TooltipContent>
                </SidebarMenuItem>
              </Tooltip>
            </TooltipProvider>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
