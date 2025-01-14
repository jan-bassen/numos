'use client'

import { Textarea } from '@repo/ui/components/ui/textarea'
import { useLayer } from '../../context'

export function LayerDescriptionInput() {
  const {
    layer: { description, locked },
    updateLayer,
  } = useLayer()
  return (
    <Textarea
      disabled={locked}
      /* className="disabled:opacity-100 disabled:resize-none disabled:border-background disabled:cursor-auto" */
      value={description || ''}
      onChange={async (event) => {
        await updateLayer(
          { description: event.target.value },
          { debounce: true },
        )
      }}
    />
  )
}
