'use client'

import { LockButton } from '@/components/forms/buttons/lock-button'
import { useCollection } from '../collection-context'

export function LockCollectionButton() {
  const {
    updateCollection,
    collection: { settingsLocked },
  } = useCollection()
  return (
    <LockButton
      locked={settingsLocked}
      setLocked={async (l) => {
        await updateCollection({ settingsLocked: l })
      }}
      unlock_text="Unlock Settings"
      lock_text="Lock Settings"
    />
  )
}
