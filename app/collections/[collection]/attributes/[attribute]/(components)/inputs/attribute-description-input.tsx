'use client'

import { Textarea } from '@repo/ui/components/textarea'
import { useAttribute } from '../../attribute-context'

export function AttributeDescriptionInput() {
  const {
    attribute: { description, locked },
    updateAttribute,
  } = useAttribute()
  return (
    <Textarea
      disabled={locked}
      /* className="disabled:opacity-100 disabled:resize-none disabled:border-background disabled:cursor-auto" */
      value={description || ''}
      onChange={async (event) => {
        await updateAttribute(
          { description: event.target.value },
          { debounce: true },
        )
      }}
    />
  )
}
