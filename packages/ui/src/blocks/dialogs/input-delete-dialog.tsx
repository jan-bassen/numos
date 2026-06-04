'use client'

import { useState } from 'react'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/alert-dialog'
import { Input } from '@repo/ui/components/input'
import { buttonVariants } from '@repo/ui/components/button'

export default function InputDeleteDialogContent({
  onDelete,
  title,
}: {
  onDelete: () => void
  title?: string
}) {
  const [deleteConfirm, setDeleteConfirm] = useState('')
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure to delete this {title}?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the entire{' '}
          {title} and remove all of its data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Input
        type="text"
        className="mt-2 w-full"
        onChange={(e) => setDeleteConfirm(e.target.value)}
        placeholder="Type 'Delete' to confirm"
      />
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            if (deleteConfirm !== 'Delete') return
            await onDelete()
          }}
          disabled={deleteConfirm !== 'Delete'}
          className={buttonVariants({ variant: 'destructive' })}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
