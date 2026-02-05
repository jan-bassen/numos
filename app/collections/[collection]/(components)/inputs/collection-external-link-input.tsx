'use client'

import { useCollection } from '@/app/collections/[collection]/collection-context'
import ErrorMessage from '@/components/state/error-message'
import { cn } from '@repo/ui/lib/utils'
import { Input } from '@repo/ui/components/input'

export function CollectionExternalLinkInput() {
  const {
    collection: { externalLink, settingsLocked },
    updateCollection,
    getErrorMessage,
  } = useCollection()

  const error = getErrorMessage(['externalLink'])

  return (
    <>
      <Input
        placeholder="https://example.com"
        disabled={settingsLocked}
        value={externalLink || ''}
        onChange={async (e) => {
          await updateCollection(
            { externalLink: e.target.value },
            { debounce: true },
          )
        }}
        className={cn('', error && 'border-destructive bg-destructive/10')}
      />
      <ErrorMessage error={error} />
    </>
  )
}
