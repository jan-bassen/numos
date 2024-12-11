'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { useAttribute } from '../../attribute-context'
import type { Display } from '@/types/database.types'
import { displayOptions } from '@/lib/schemas/attribute-schema'

export function AttributeDisplayInput() {
  const {
    attribute: { display, locked },
    updateAttribute,
  } = useAttribute()
  return (
    <TabSelect
      disabled={locked}
      options={displayOptions}
      value={display}
      onValueChange={async (value) => {
        await updateAttribute({ display: value as Display })
      }}
    />
  )
}
