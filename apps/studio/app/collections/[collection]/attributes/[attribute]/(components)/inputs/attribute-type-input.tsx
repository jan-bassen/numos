'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { useAttribute } from '../../attribute-context'
import { attributeTypeOptions } from '@/lib/constants/datatypes'
import { removeAttributeFromLocalForm } from '../../../(functions)/utils'
import { useCollection } from '@/app/collections/[collection]/context'
import type { ValueType } from '@repo/engine/types/value-types'
import type { InsertAttribute } from '@/types/database.types'

export function AttributeTypeInput() {
  const {
    attribute: { type, locked, slug },
    updateAttribute,
  } = useAttribute()
  const { slug: collection } = useCollection()
  return (
    <TabSelect
      disabled={locked}
      options={attributeTypeOptions}
      value={type}
      onValueChange={async (value) => {
        const settingRes = await updateAttribute({
          type: value as ValueType,
          value: null,
        } as InsertAttribute)
        removeAttributeFromLocalForm(collection, slug)
      }}
    />
  )
}
