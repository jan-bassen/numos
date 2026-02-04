'use client'

import {
  PiCurlyBracesCodeCheckStroke,
  PiCurlyBracesCodeDefaultStroke,
} from '@repo/ui/icons/pika'
import { useAttribute } from '@/app/collections/[collection]/attributes/[attribute]/attribute-context'
import type { TabOption } from '@/components/forms/tab-inputs/tab-option'
import { TabToggle } from '@/components/forms/tab-inputs/tab-toggle'

export const optionalOptionMap = {
  single: {
    value: false,
    label: 'Required',
    slug: 'required',
    subtext: 'Has to be filled',
    Icon: PiCurlyBracesCodeCheckStroke,
  },
  list: {
    value: true,
    label: 'Optional',
    slug: 'optional',
    subtext: 'Can be left empty',
    Icon: PiCurlyBracesCodeDefaultStroke,
  },
}

export const optionalOptions: TabOption<boolean>[] =
  Object.values(optionalOptionMap)

export function AttributeOptionalInput() {
  const {
    attribute: { locked, value },
    updateAttribute,
  } = useAttribute()
  return (
    <TabToggle
      disabled={locked}
      options={optionalOptions}
      className="w-full max-w-[40rem]"
      value={value.optional}
      onChange={async (v) => {
        updateAttribute({
          value: {
            ...value,
            optional: v ?? false,
          },
        })
      }}
    />
  )
}
