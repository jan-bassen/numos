'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { useAttribute } from '../../attribute-context'
import { attributeTypeOptions } from '@/lib/constants/datatypes'
import { removeAttributeFromLocalForm } from '../../../(functions)/utils'
import { useCollection } from '@/app/collections/[collection]/context'
import type { FullValue, ValueType } from '@repo/engine/types/value-types'
import type { InsertAttribute } from '@/types/database.types'

export function AttributeTypeInput() {
  const {
    attribute: { type, locked, slug, value },
    updateAttribute,
  } = useAttribute()
  const { slug: collection } = useCollection()
  return (
    <TabSelect
      disabled={locked}
      options={attributeTypeOptions}
      value={type}
      onValueChange={async (v: string) => {
        const settingRes = await updateAttribute({
          type: v as ValueType,
          value: {
            ...value,
            type: v as ValueType,
            default: undefined,
            restrictions: undefined,
          },
        })
        removeAttributeFromLocalForm(collection, slug)
      }}
    />
  )
}
