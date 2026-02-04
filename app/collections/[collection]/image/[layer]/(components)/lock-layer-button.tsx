'use client'

import { LockButton } from '@/components/forms/buttons/lock-button'
import { useLayer } from '@/app/collections/[collection]/image/[layer]/context'

export function LockLayerButton() {
  const {
    layer: { locked },
    updateLayer,
  } = useLayer()
  return (
    <LockButton
      locked={locked}
      setLocked={async (l) => {
        await updateLayer({ locked: l })
      }}
    />
  )
}
