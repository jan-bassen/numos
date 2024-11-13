'use client'

import { LifeBuoy, MessagesSquare } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/ui/components/ui/sidebar'
import { type ComponentProps, useEffect, useRef, useState } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { useChatContext } from '@/lib/hubspot/context'

export function NavSupport(props: ComponentProps<typeof SidebarGroup>) {
  const { chatOpen, setChatOpen } = useChatContext()
  const [disabled, setDisabled] = useState(false)
  useEffect(() => {
    if (chatOpen) {
      setDisabled(true)
    } else {
      setTimeout(() => {
        setDisabled(false)
      }, 100)
    }
  }, [chatOpen])
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <a href={'https://calendly.com/maloha'}>
                <LifeBuoy />
                <span>Book a free demo</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              className={cn(
                'disabled:opacity-100',
                chatOpen && 'bg-sidebar-accent',
              )}
              disabled={disabled}
              onClick={() => {
                setChatOpen(!chatOpen)
              }}
            >
              <MessagesSquare />
              <span>Live chat with team</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
