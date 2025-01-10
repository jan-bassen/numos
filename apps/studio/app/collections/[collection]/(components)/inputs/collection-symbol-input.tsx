'use client'

import { useCollection } from '@/app/collections/[collection]/collection-context'
import ErrorMessage from '@/components/state/error-message'
import { cn } from '@repo/ui/lib/utils'
import { Input } from '@repo/ui/components/ui/input'

export function CollectionSymbolInput() {
  const {
    collection: { symbol, settings_locked },
    updateCollection,
    getErrorMessage,
  } = useCollection()

  const error = getErrorMessage(['symbol'])

  return (
    <>
      <Input
        placeholder="BAYC"
        disabled={settings_locked}
        value={symbol || ''}
        onChange={async (e) => {
          await updateCollection({ symbol: e.target.value }, { debounce: true })
        }}
        className={cn('', error && 'border-destructive bg-destructive/10')}
      />
      <ErrorMessage error={error} />
    </>
  )
}
