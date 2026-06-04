'use client'

import DeleteButton from '@/components/forms/buttons/delete-button'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import { useLayer } from '@/app/collections/[collection]/image/[layer]/context'
import { deleteLayer } from '@/lib/data/layers/delete'

export function DeleteLayerButton() {
  const {
    layer: { id, locked },
  } = useLayer()
  const {
    collection: { slug: collection },
  } = useCollection()
  if (locked) return null
  return (
    <DeleteButton
      title="layer"
      disabled={locked}
      onDelete={async () => {
        await deleteLayer(id, {
          redirect: `/collections/${collection}/image`,
        })
      }}
    />
  )
}
