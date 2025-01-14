'use client'

import { HeaderTitleInput } from '@/components/page/header-title-input'
import { useAttribute } from '../attribute-context'

export function AttributeTitle() {
  const {
    attribute: { name, locked },
    updateAttribute,
  } = useAttribute()
  return (
    <HeaderTitleInput
      value={name || 'Unnamed Attribute'}
      disabled={locked}
      onChange={(e) =>
        updateAttribute({ name: e.target.value }, { debounce: true })
      }
    />
  )
}
