'use client'

import InputDeleteDialogContent from '@repo/ui/blocks/dialogs/input-delete-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog'
import {
  Button,
  type ButtonProps,
  buttonVariants,
} from '@repo/ui/components/button'
import { PiDeleteDustbin01Stroke } from '@repo/ui/icons/pika'
import { cn, type ReturnInfo } from '@repo/ui/lib/utils'

export type DeleteButtonProps = ButtonProps & {
  title: string
  onDelete: () => Promise<void>
  secure?: boolean
}

export default function DeleteButton({
  className,
  title,
  onDelete,
  secure,
  key,
  ...props
}: DeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={'outline'}
          {...props}
          className={cn('gap-2', className)}
        >
          <PiDeleteDustbin01Stroke className="size-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      {secure ? (
        <InputDeleteDialogContent title={title} onDelete={() => onDelete()} />
      ) : (
        <AlertDialogContent className="gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to delete this {title}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              entire {title} and remove all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={(e) => {
                onDelete()
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  )
}
