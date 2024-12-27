'use client'

import DeleteButton from '@/components/forms/buttons/delete-button'
import { useRouter } from 'next/navigation'
import { useAttribute } from '@/app/collections/[collection]/attributes/[attribute]/attribute-context'
import { deleteAttribute } from '@/lib/supabase/db/attributes/delete'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import { removeAttributeFromLocalForm } from '@/app/collections/[collection]/attributes/(functions)/utils'

export function DeleteAttributeButton() {
  const router = useRouter()
  const {
    attribute: { id, locked, slug },
  } = useAttribute()
  const {
    collection: { slug: collection },
  } = useCollection()
  if (locked) return null
  return (
    <DeleteButton
      title="attribute"
      disabled={locked}
      onDelete={async () => {
        const res = await deleteAttribute(id)
        handleReturnInfo(res, () => {
          removeAttributeFromLocalForm(collection, slug)
          router.push(`/collections/${collection}/attributes`)
        })
      }}
    />
  )
}
