'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { useAttribute } from '../../attribute-context'
import { attributeTypeOptions } from '@/lib/constants/datatypes'
import { removeAttributeFromLocalForm } from '@/app/collections/[collection]/attributes/(functions)/utils'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import type { ValueType } from '@repo/shared/types/values'

export function AttributeTypeInput() {
  const {
    attribute: { type, locked, slug, value },
    updateAttribute,
  } = useAttribute()
  const {
    collection: { slug: collection },
  } = useCollection()
  return (
    <TabSelect
      disabled={locked}
      options={attributeTypeOptions}
      value={type}
      onValueChange={async (v: string) => {
        const res = await updateAttribute({
          type: v as ValueType,
          value: {
            ...value,
            type: v as ValueType,
            default: undefined,
            restrictions: undefined,
          },
        })
        console.log('res', res)
        removeAttributeFromLocalForm(collection, slug)
      }}
    />
  )
}
