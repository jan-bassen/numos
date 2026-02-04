'use client'

import { LockButton } from '@/components/forms/buttons/lock-button'
import { useCollection } from '../collection-context'

export function LockCollectionButton() {
  const {
    updateCollection,
    collection: { settings_locked },
  } = useCollection()
  return (
    <LockButton
      locked={settings_locked}
      setLocked={async (l) => {
        await updateCollection({ settings_locked: l })
      }}
      unlock_text="Unlock Settings"
      lock_text="Lock Settings"
    />
  )
}
