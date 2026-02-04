'use client'

import { HeaderTitleInput } from '@/components/page/header-title-input'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'

export function ActionTitle() {
  const {
    action: { name, locked },
    updateAction,
  } = useAction()
  return (
    <HeaderTitleInput
      value={name || 'Unnamed Attribute'}
      disabled={locked}
      onChange={(e) =>
        updateAction({ name: e.target.value }, { debounce: true })
      }
    />
  )
}
