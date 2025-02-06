'use client'

import { Button } from '@repo/ui/components/ui/button'
import { useSidebar } from '@repo/ui/components/ui/sidebar'
import {
  PiBurgerMenuThreeStroke,
  PiCrossCross,
  PiSidebarMenuSolid,
} from '@repo/ui/icons/pika'

export function CollapseButton() {
  const { open, setOpen, isMobile, setOpenMobile, openMobile } = useSidebar()
  return (
    <Button
      variant="ghost"
      className="!w-12 h-12 items-center justify-center px-0"
      onClick={() => {
        if (isMobile) {
          setOpenMobile(!openMobile)
        } else {
          setOpen(!open)
        }
      }}
    >
      {isMobile ? (
        <PiCrossCross className="size-5 text-muted-foreground" />
      ) : (
        <PiSidebarMenuSolid className="size-5 text-muted-foreground" />
      )}
    </Button>
  )
}

export function MobileCollapseButton() {
  const { openMobile, setOpenMobile, isMobile } = useSidebar()
  if (!isMobile) return null
  return (
    <Button
      variant="ghost"
      className="!w-12 h-12 items-center justify-center px-0"
      onClick={() => setOpenMobile(!openMobile)}
    >
      <PiBurgerMenuThreeStroke className="size-5 text-muted-foreground" />
    </Button>
  )
}
