'use client'

import { useCollection } from '@/app/collections/[collection]/collection-context'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { deleteAction } from '@/lib/data/actions/delete'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import DeleteButton from '@/components/forms/buttons/delete-button'

export function DeleteActionButton() {
  const {
    action: { id, locked },
  } = useAction()
  const {
    collection: { slug: collection },
  } = useCollection()
  if (locked) return null
  return (
    <DeleteButton
      title="action"
      disabled={locked}
      onDelete={async () => {
        await deleteAction(id, `/collections/${collection}/actions`)
      }}
    />
  )
}
