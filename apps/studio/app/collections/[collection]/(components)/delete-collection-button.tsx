'use client'

import DeleteButton from '@/components/forms/buttons/delete-button'
import { deleteCollection } from '@/lib/data/collections'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { useCollection } from '../collection-context'

export default function DeleteCollectionButton() {
  const {
    collection: { id },
  } = useCollection()
  return (
    <DeleteButton
      title="collection"
      secure
      onDelete={async () => {
        const res = await deleteCollection(id)
        handleReturnInfo(res)
      }}
    />
  )
}
