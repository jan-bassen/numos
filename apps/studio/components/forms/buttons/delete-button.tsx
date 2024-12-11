'use client'
import DeleteDialogContent from '@repo/ui/components/dialogs/delete-dialog'
import InputDeleteDialogContent from '@repo/ui/components/dialogs/input-delete-dialog'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@repo/ui/components/ui/alert-dialog'
import { Button, type ButtonProps } from '@repo/ui/components/ui/button'
import { PiDeleteDustbin01Stroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'

export type DeleteButtonProps = ButtonProps & {
  title: string
  onDelete: () => void
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
        <InputDeleteDialogContent title={title} onDelete={onDelete} />
      ) : (
        <DeleteDialogContent title={title} onDelete={onDelete} />
      )}
    </AlertDialog>
  )
}
