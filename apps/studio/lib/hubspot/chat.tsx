'use client'

import { cn } from '@repo/ui/lib/utils'
import { useChatContext } from './context'
import { useEffect, useRef } from 'react'
import { useSidebar } from '@repo/ui/components/ui/sidebar'

export default function ChatWidget() {
  const { chatOpen, setChatOpen } = useChatContext()
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
  }, [chatOpen, setChatOpen])

  return (
    <div
      className={cn(
        'fixed bottom-[3.75rem] z-[1000] overflow-hidden rounded-lg border border-border bg-background shadow-lg',
        !chatOpen && 'hidden',
        sidebarOpen ? 'left-[14.5rem]' : 'left-[3.75rem]',
      )}
      ref={chatRef}
    >
      <div id="custom-chat-widget" />
    </div>
  )
}
