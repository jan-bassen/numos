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

export function NavSupport(props: ComponentProps<typeof SidebarGroup>) {
  const [chatOpen, setChatOpen] = useState(false)
  const { open: sidebarOpen } = useSidebar()
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setChatOpen(false)
      }
    }

    if (chatOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [chatOpen])

  return (
    <>
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
            <SidebarMenuItem className={cn(chatOpen && 'bg-sidebar-accent')}>
              <SidebarMenuButton
                size="sm"
                onClick={() => setChatOpen(!chatOpen)}
              >
                <MessagesSquare />
                <span>Live chat with team</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div
        ref={chatRef}
        id="custom-chat-widget"
        className={cn(
          'absolute bottom-[3.75rem] z-[1000] overflow-hidden rounded-lg border border-border shadow-lg',
          chatOpen ? 'block' : 'hidden',
          sidebarOpen ? 'left-[14.5rem]' : 'left-[3.75rem]',
        )}
      />
    </>
  )
}
