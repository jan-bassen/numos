'use client'

import { PiListDefaultStroke, PiSquareDotStroke } from '@repo/ui/icons/pika'
import { useAttribute } from '../../attribute-context'
import type { TabOption } from '@/components/forms/tab-inputs/tab-option'
import { TabToggle } from '@/components/forms/tab-inputs/tab-toggle'
import { removeAttributeFromLocalForm } from '@/app/collections/[collection]/attributes/(functions)/utils'
import { useCollection } from '@/app/collections/[collection]/collection-context'

export const listOptionMap = {
  single: {
    value: false,
    label: 'Single',
    slug: 'single',
    subtext: 'Single value',
    Icon: PiSquareDotStroke,
  },
  list: {
    value: true,
    label: 'List',
    slug: 'list',
    subtext: 'Multiple values',
    Icon: PiListDefaultStroke,
  },
}

export const listOptions: TabOption<boolean>[] = Object.values(listOptionMap)

export function AttributeListInput() {
  const {
    collection: { slug: collection },
  } = useCollection()
  const {
    attribute: { locked, value, slug },
    updateAttribute,
  } = useAttribute()
  return (
    <TabToggle
      disabled={locked}
      options={listOptions}
      className="w-full max-w-form-input"
      value={value.list}
      onChange={async (v) => {
        updateAttribute({
          list: v,
          value: {
            ...value,
            list: v ?? false,
            default: undefined,
            restrictions: undefined,
          },
        })
        removeAttributeFromLocalForm(collection, slug)
      }}
    />
  )
}
