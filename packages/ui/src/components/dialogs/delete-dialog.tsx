'use client'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/ui/alert-dialog'
import { buttonVariants } from '@repo/ui/components/ui/button'

export default function DeleteDialogContent({
  onDelete,
  title,
}: {
  onDelete: () => Promise<void>
  title?: string
}) {
  return (
    <AlertDialogContent className="gap-6">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure to delete this {title}?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the entire{' '}
          {title} and remove all the data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: 'destructive' })}
          onClick={async () => {
            await onDelete()
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
