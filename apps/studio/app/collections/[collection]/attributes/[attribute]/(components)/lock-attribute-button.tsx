'use client'

import { LockButton } from '@/components/forms/buttons/lock-button'
import { useAttribute } from '../attribute-context'

export function LockAttributeButton() {
  const {
    attribute: { locked },
    updateAttribute,
  } = useAttribute()
  return (
    <LockButton
      locked={locked}
      setLocked={(l) => updateAttribute({ locked: l })}
    />
  )
}
