'use client'

import DeleteButton from '@/components/forms/buttons/delete-button'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { deleteAction } from '@/lib/supabase/db/actions/delete'

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
      title="attribute"
      disabled={locked}
      onDelete={async () => {
        await deleteAction(id, `/collections/${collection}/actions`)
      }}
    />
  )
}
