'use client'

import { useCollection } from '@/app/collections/[collection]/collection-context'
import ErrorMessage from '@/components/state/error-message'
import { cn } from '@repo/ui/lib/utils'
import { Textarea } from '@repo/ui/components/ui/textarea'

export function CollectionDescriptionInput() {
  const {
    collection: { description, settings_locked },
    updateCollection,
    getErrorMessage,
  } = useCollection()

  const error = getErrorMessage(['max_supply'])

  return (
    <>
      <Textarea
        disabled={settings_locked}
        value={description || ''}
        onChange={async (e) => {
          await updateCollection(
            { description: e.target.value },
            { debounce: true },
          )
        }}
        className={cn('', error && 'border-destructive bg-destructive/10')}
      />
      <ErrorMessage error={error} />
    </>
  )
}
