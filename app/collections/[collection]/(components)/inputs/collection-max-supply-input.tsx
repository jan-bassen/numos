'use client'

import { Input } from '@repo/ui/components/input'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import ErrorMessage from '@/components/state/error-message'
import { cn } from '@repo/ui/lib/utils'

export function CollectionMaxSupplyInput() {
  const {
    collection: { max_supply, settings_locked },
    updateCollection,
    getErrorMessage,
  } = useCollection()

  const error = getErrorMessage(['max_supply'])

  return (
    <>
      <Input
        type="numeric"
        disabled={settings_locked}
        value={max_supply ?? ''}
        onChange={async (e) => {
          await updateCollection(
            { max_supply: Number(e.target.value) },
            { debounce: true },
          )
        }}
        className={cn('', error && 'border-destructive bg-destructive/10')}
      />
      <ErrorMessage error={error} />
    </>
  )
}
