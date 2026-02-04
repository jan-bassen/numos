'use client'

import { LockButton } from '@/components/forms/buttons/lock-button'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'

export function LockActionButton() {
  const {
    action: { locked },
    updateAction,
  } = useAction()
  return (
    <LockButton
      locked={locked}
      setLocked={async (l) => {
        await updateAction({ locked: l })
      }}
    />
  )
}
