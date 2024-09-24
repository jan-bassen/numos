import { useState } from 'react'
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
} from '@repo/ui/components/ui/alert-dialog'
import { Input } from '@repo/ui/components/ui/input'

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
          {title} and remove all the data from our servers.
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
            onDelete()
          }}
          disabled={deleteConfirm !== 'Delete'}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
