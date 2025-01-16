'use client'

import { Button } from '@repo/ui/components/ui/button'
import { useSidebar } from '@repo/ui/components/ui/sidebar'
import { PiSidebarMenuSolid } from '@repo/ui/icons/pika'

export function CollapseButton() {
  const { open, setOpen } = useSidebar()
  return (
    <Button
      variant="ghost"
      className="!w-12 h-12 items-center justify-center px-0"
      onClick={() => setOpen(!open)}
    >
      <PiSidebarMenuSolid className="size-5 text-sidebar-ring" />
    </Button>
  )
}
