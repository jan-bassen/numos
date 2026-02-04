'use client'

import { useLayer } from '@/app/collections/[collection]/image/[layer]/context'
import { LogicButton } from '@/components/forms/buttons/logic-button'
import { useCollection } from '@/app/collections/[collection]/collection-context'

export function LayerLogicButton() {
  const {
    layer: { slug, locked },
  } = useLayer()
  const {
    collection: { slug: collectionSlug },
  } = useCollection()
  return (
    <LogicButton href={`/collections/${collectionSlug}/image/${slug}/logic`}>
      {locked ? 'View Logic' : 'Edit Logic'}
    </LogicButton>
  )
}
