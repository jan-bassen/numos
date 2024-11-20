'use client'

import InputDeleteDialogContent from '@repo/ui/components/dialogs/input-delete-dialog'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@repo/ui/components/ui/alert-dialog'
import { Button } from '@repo/ui/components/ui/button'
import { PiDeleteDustbin02Stroke } from '@repo/ui/icons/pika'

export function DeleteKeyButton({ key }: { key: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'ghost'} size={'iconMedium'}>
          <PiDeleteDustbin02Stroke className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <InputDeleteDialogContent
        title="key"
        onDelete={() => {
          //TODO: Delete key
          console.log('Delete key')
        }}
      />
    </AlertDialog>
  )
}
