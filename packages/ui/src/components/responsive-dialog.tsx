'use client'

import { useBreakpoint } from '@repo/ui/hooks/media-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui/components/drawer'
import type { AnimationEventHandler, ComponentProps } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'

/* export function ResponsiveDialog({
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
  const isDesktop = useBreakpoint('sm', 'above')

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
        <div className="flex flex-col gap-4 px-4 py-2">{children}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
} */

export function ResponsiveDialog(
  props: ComponentProps<typeof Dialog | typeof Drawer>,
) {
  const isDesktop = useBreakpoint('sm', 'above')
  if (isDesktop) {
    return <Dialog {...props} />
  }
  return <Drawer {...props} />
}

export function ResponsiveDialogTrigger(
  props: ComponentProps<typeof DialogTrigger | typeof DrawerTrigger>,
) {
  const isDesktop = useBreakpoint('sm', 'above')
  if (isDesktop) {
    return <DialogTrigger {...props} />
  }
  return <DrawerTrigger {...props} />
}

export function ResponsiveDialogContent({
  onAnimationEnd,
  ...props
}: Omit<
  ComponentProps<typeof DialogContent | typeof DrawerContent>,
  'onAnimationEnd'
> & { onAnimationEnd?: AnimationEventHandler<HTMLDivElement> }) {
  const isDesktop = useBreakpoint('sm', 'above')
  if (isDesktop) {
    return <DialogContent {...props} onAnimationEnd={onAnimationEnd} />
  }
  return (
    <DrawerContent
      {...props}
      onAnimationEnd={(open) => {
        if (typeof open !== 'boolean') {
          onAnimationEnd?.(open)
        }
      }}
    />
  )
}

export function ResponsiveDialogHeader(
  props: ComponentProps<typeof DialogHeader | typeof DrawerHeader>,
) {
  const isDesktop = useBreakpoint('sm', 'above')
  if (isDesktop) {
    return <DialogHeader {...props} />
  }
  return <DrawerHeader {...props} />
}

export function ResponsiveDialogTitle(
  props: ComponentProps<typeof DialogTitle | typeof DrawerTitle>,
) {
  const isDesktop = useBreakpoint('sm', 'above')
  if (isDesktop) {
    return <DialogTitle {...props} />
  }
  return <DrawerTitle {...props} />
}

export function ResponsiveDialogDescription(
  props: ComponentProps<typeof DialogDescription | typeof DrawerDescription>,
) {
  const isDesktop = useBreakpoint('sm', 'above')
  if (isDesktop) {
    return <DialogDescription {...props} />
  }
  return <DrawerDescription {...props} />
}

export function ResponsiveDialogClose(
  props: ComponentProps<typeof DialogClose | typeof DrawerClose>,
) {
  const isDesktop = useBreakpoint('sm', 'above')
  if (isDesktop) {
    return <DialogClose {...props} />
  }
  return <DrawerClose {...props} />
}

export function ResponsiveDialogFooter(
  props: ComponentProps<typeof DialogFooter | typeof DrawerFooter>,
) {
  const isDesktop = useBreakpoint('sm', 'above')
  if (isDesktop) {
    return <DialogFooter {...props} />
  }
  return <DrawerFooter {...props} />
}
