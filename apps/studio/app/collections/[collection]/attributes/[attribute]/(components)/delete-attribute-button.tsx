'use client'

import DeleteButton from '@/components/forms/buttons/delete-button'
import { useRouter } from 'next/navigation'
import { useAttribute } from '../attribute-context'
import { deleteAttribute } from '@/lib/supabase/db/attributes'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { removeAttributeFromLocalForm } from '../../(functions)/utils'
import { useCollection } from '../../../context'

export function DeleteAttributeButton() {
  const router = useRouter()
  const {
    attribute: { id, locked, slug, version },
  } = useAttribute()
  const { slug: collection } = useCollection()
  if (locked) return null
  return (
    <DeleteButton
      title="attribute"
      disabled={locked}
      onDelete={async () => {
        const res = await deleteAttribute(id, version, slug)
        handleReturnInfo(res, () => {
          removeAttributeFromLocalForm(collection, slug)
          router.push(`/collections/${collection}/attributes`)
        })
      }}
    />
  )
}
