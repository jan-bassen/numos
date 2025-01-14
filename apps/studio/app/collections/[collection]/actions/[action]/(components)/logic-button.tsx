'use client'

import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import { LogicButton } from '@/components/forms/buttons/logic-button'

export function ActionLogicButton() {
  const {
    action: { slug, locked },
  } = useAction()
  const {
    collection: { slug: collectionSlug },
  } = useCollection()
  return (
    <LogicButton href={`/collections/${collectionSlug}/actions/${slug}/logic`}>
      {locked ? 'View Logic' : 'Edit Logic'}
    </LogicButton>
  )
}
