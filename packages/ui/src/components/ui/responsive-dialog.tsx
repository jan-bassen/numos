'use client'

import { useMediaQuery } from '@/hooks/media-query'
import { Button } from '@repo/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui/components/ui/drawer'
import { useState } from 'react'

export function ResponsiveDialog({
  button,
  title,
  description,
  children,
  open,
  setOpen,
}: {
  button: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  open?: boolean
  setOpen?: (open: boolean) => void
}) {
  if (
    (open === undefined && setOpen !== undefined) ||
    (open !== undefined && setOpen === undefined)
  )
    throw new Error('open and onOpenChange must both or neither be defined')
  const [_open, _setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog
        open={open ? open : _open}
        onOpenChange={setOpen ? setOpen : _setOpen}
      >
        <DialogTrigger asChild>{button}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-3">
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open ? open : _open}
      onOpenChange={setOpen ? setOpen : _setOpen}
    >
      <DrawerTrigger asChild>{button}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="px-4 py-2 flex flex-col gap-4">{children}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
