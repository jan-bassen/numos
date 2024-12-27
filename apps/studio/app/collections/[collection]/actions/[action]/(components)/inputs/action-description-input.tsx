'use client'

import { Textarea } from '@repo/ui/components/ui/textarea'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'

export function ActionDescriptionInput() {
  const {
    action: { description, locked },
    updateAction,
  } = useAction()
  return (
    <Textarea
      disabled={locked}
      /* className="disabled:opacity-100 disabled:resize-none disabled:border-background disabled:cursor-auto" */
      value={description || ''}
      onChange={async (event) => {
        await updateAction(
          { description: event.target.value },
          { debounce: true },
        )
      }}
    />
  )
}
