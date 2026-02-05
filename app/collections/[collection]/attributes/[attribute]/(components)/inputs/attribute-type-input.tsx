'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { useAttribute } from '../../attribute-context'
import { attributeTypeOptions } from '@/lib/constants/datatypes'
import { removeAttributeFromLocalForm } from '@/app/collections/[collection]/attributes/(functions)/utils'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import type { ValueType } from '@repo/shared/types/values'

export function AttributeTypeInput() {
  const {
    attribute: { locked, slug, value },
    updateAttribute,
  } = useAttribute()
  const {
    collection: { slug: collection },
  } = useCollection()
  if (!value) return null
  return (
    <TabSelect
      disabled={locked}
      options={attributeTypeOptions}
      value={value.type}
      onValueChange={async (v: string) => {
        const newValue = {
          ...value,
          type: v as ValueType,
          restrictions: undefined,
        }
        const res = await updateAttribute({
          value: newValue as typeof value,
        })
        console.log('res', res)
        removeAttributeFromLocalForm(collection, slug)
      }}
    />
  )
}
