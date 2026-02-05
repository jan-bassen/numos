'use client'

import { Input } from '@repo/ui/components/input'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import ErrorMessage from '@/components/state/error-message'
import { cn } from '@repo/ui/lib/utils'

export function CollectionMaxSupplyInput() {
  const {
    collection: { maxSupply, settingsLocked },
    updateCollection,
    getErrorMessage,
  } = useCollection()

  const error = getErrorMessage(['maxSupply'])

  return (
    <>
      <Input
        type="numeric"
        disabled={settingsLocked}
        value={maxSupply ?? ''}
        onChange={async (e) => {
          await updateCollection(
            { maxSupply: Number(e.target.value) },
            { debounce: true },
          )
        }}
        className={cn('', error && 'border-destructive bg-destructive/10')}
      />
      <ErrorMessage error={error} />
    </>
  )
}
