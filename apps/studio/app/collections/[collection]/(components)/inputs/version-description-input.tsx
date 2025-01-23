'use client'

import { useVersion } from '@/app/collections/[collection]/version-context'
import ErrorMessage from '@/components/state/error-message'
import { cn } from '@repo/ui/lib/utils'
import { Textarea } from '@repo/ui/components/ui/textarea'

export function VersionDescriptionInput() {
  const {
    version: { description, locked },
    updateVersion,
    getErrorMessage,
  } = useVersion()

  const error = getErrorMessage(['max_supply'])

  return (
    <>
      <Textarea
        disabled={locked}
        value={description || ''}
        onChange={async (e) => {
          await updateVersion({ description: e.target.value })
        }}
        className={cn('', error && 'border-destructive bg-destructive/10')}
      />
      <ErrorMessage error={error} />
    </>
  )
}
