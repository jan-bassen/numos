'use client'

import { HeaderTitleInput } from '@/components/page/header-title-input'
import { useCollection } from '@/app/collections/[collection]/collection-context'

export function CollectionTitle() {
  const {
    collection: { name, settings_locked },
    updateCollection,
  } = useCollection()
  return (
    <HeaderTitleInput
      value={name || 'Unnamed Collection'}
      disabled={settings_locked}
      onChange={(e) =>
        updateCollection({ name: e.target.value }, { debounce: true })
      }
    />
  )
}
