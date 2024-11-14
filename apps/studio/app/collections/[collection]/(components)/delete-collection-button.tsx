'use client'

import DeleteButton from '@/components/forms/buttons/delete-button'
import { deleteCollection } from '@/lib/supabase/db/collections'
import { handleReturnInfo } from '@repo/ui/lib/utils'

export default function DeleteCollectionButton({
  collection,
}: { collection: string }) {
  return (
    <DeleteButton
      title="collection"
      secure
      onDelete={async () => {
        const res = await deleteCollection(collection)
        handleReturnInfo(res)
      }}
    />
  )
}
