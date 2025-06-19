'use client'

import InputDeleteDialogContent from '@repo/ui/blocks/dialogs/input-delete-dialog'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog'
import { Button } from '@repo/ui/components/button'
import { PiDeleteDustbin02Stroke } from '@repo/ui/icons/pika'

export function DeleteKeyButton() {
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
