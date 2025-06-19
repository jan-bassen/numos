'use client'

import { useCollection } from '@/app/collections/[collection]/collection-context'
import ErrorMessage from '@/components/state/error-message'
import { cn } from '@repo/ui/lib/utils'
import { Input } from '@repo/ui/components/input'

export function CollectionExternalLinkInput() {
  const {
    collection: { external_link, settings_locked },
    updateCollection,
    getErrorMessage,
  } = useCollection()

  const error = getErrorMessage(['external_link'])

  return (
    <>
      <Input
        placeholder="https://example.com"
        disabled={settings_locked}
        value={external_link || ''}
        onChange={async (e) => {
          await updateCollection(
            { external_link: e.target.value },
            { debounce: true },
          )
        }}
        className={cn('', error && 'border-destructive bg-destructive/10')}
      />
      <ErrorMessage error={error} />
    </>
  )
}
