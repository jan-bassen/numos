'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '@repo/ui/lib/utils'
import { buttonVariants } from '@repo/ui/components/ui/button'
import type { ComponentProps } from 'react'
import { Alert } from './alert'

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

type AlertDialogOverlayProps = ComponentProps<
  typeof AlertDialogPrimitive.Overlay
>
const AlertDialogOverlay = ({
  className,
  ...props
}: AlertDialogOverlayProps) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    {...props}
  />
)
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

type AlertDialogContentProps = ComponentProps<
  typeof AlertDialogPrimitive.Content
>
const AlertDialogContent = ({
  className,
  ...props
}: AlertDialogContentProps) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg',
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
)
AlertDialogContent.displayName = 'AlertDialogContent'

type AlertDialogHeaderProps = ComponentProps<typeof AlertDialogPrimitive.Title>
const AlertDialogHeader = ({ className, ...props }: AlertDialogHeaderProps) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

type AlertDialogFooterProps = ComponentProps<
  typeof AlertDialogPrimitive.Description
>
const AlertDialogFooter = ({ className, ...props }: AlertDialogFooterProps) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

type AlertDialogTitleProps = ComponentProps<typeof AlertDialogPrimitive.Title>
const AlertDialogTitle = ({ className, ...props }: AlertDialogTitleProps) => (
  <AlertDialogPrimitive.Title
    className={cn('font-semibold text-lg', className)}
    {...props}
  />
)
AlertDialogTitle.displayName = 'AlertDialogTitle'

type AlertDialogDescriptionProps = ComponentProps<
  typeof AlertDialogPrimitive.Description
>
const AlertDialogDescription = ({
  className,
  ...props
}: AlertDialogDescriptionProps) => (
  <AlertDialogPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
)
AlertDialogDescription.displayName = 'AlertDialogDescription'

type AlertDialogActionProps = ComponentProps<typeof AlertDialogPrimitive.Action>

const AlertDialogAction = ({ className, ...props }: AlertDialogActionProps) => (
  <AlertDialogPrimitive.Action
    className={cn(buttonVariants(), className)}
    {...props}
  />
)
AlertDialogAction.displayName = 'AlertDialogAction'

type AlertDialogCancelProps = ComponentProps<typeof AlertDialogPrimitive.Cancel>

const AlertDialogCancel = ({ className, ...props }: AlertDialogCancelProps) => (
  <AlertDialogPrimitive.Cancel
    className={cn(
      buttonVariants({ variant: 'outline' }),
      'mt-2 sm:mt-0',
      className,
    )}
    {...props}
  />
)
AlertDialogCancel.displayName = 'AlertDialogCancel'

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
