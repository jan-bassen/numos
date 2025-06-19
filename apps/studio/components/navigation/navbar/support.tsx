'use client'

import { LifeBuoy, MessagesSquare } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar'
import { type ComponentProps, useEffect, useState } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { useChatContext } from '@/lib/hubspot/chat-context'

export function Support(props: ComponentProps<typeof SidebarGroup>) {
  const { chatOpen, setChatOpen, unreadMessages } = useChatContext()
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
                'disabled:opacity-100 ',
                chatOpen && 'bg-sidebar-accent',
              )}
              disabled={disabled}
              onClick={() => {
                setChatOpen(!chatOpen)
              }}
            >
              <MessagesSquare />
              <span>Live chat with team</span>
              {unreadMessages && (
                <div className="flex size-2 animate-pulse rounded-full bg-destructive" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
