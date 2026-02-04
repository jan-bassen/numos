'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { useAttribute } from '../../attribute-context'
import type { Display } from '@/types/database.types'
import { attributeDisplayOptions } from '@/lib/constants/display-options'

export function AttributeDisplayInput() {
  const {
    attribute: { display, locked },
    updateAttribute,
  } = useAttribute()
  return (
    <TabSelect
      disabled={locked}
      options={attributeDisplayOptions}
      value={display}
      onValueChange={async (value: string) => {
        await updateAttribute({ display: value as Display })
      }}
    />
  )
}
