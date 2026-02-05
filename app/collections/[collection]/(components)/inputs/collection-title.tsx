'use client'

import { HeaderTitleInput } from '@/components/page/header-title-input'
import { useCollection } from '@/app/collections/[collection]/collection-context'

export function CollectionTitle() {
  const {
    collection: { name, settingsLocked },
    updateCollection,
  } = useCollection()
  return (
    <HeaderTitleInput
      value={name || 'Unnamed Collection'}
      disabled={settingsLocked}
      onChange={(e) =>
        updateCollection({ name: e.target.value }, { debounce: true })
      }
    />
  )
}
