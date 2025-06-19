'use client'

import { Input } from '@repo/ui/components/input'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import ErrorMessage from '@/components/state/error-message'
import { useState } from 'react'
import { cn, handleReturnInfo } from '@repo/ui/lib/utils'
import { Button } from '@repo/ui/components/button'
import { PiCheckTick } from '@repo/ui/icons/pika'

export function CollectionSlugInput() {
  const {
    collection: { slug, settings_locked },
    updateCollection,
    validateCollection,
    getErrorMessage,
  } = useCollection()

  const [value, setValue] = useState(slug)
  const error = value !== slug ? getErrorMessage(['slug']) : undefined

  return (
    <>
      <div className="flex w-full gap-2">
        <Input
          disabled={settings_locked}
          value={value}
          onChange={async (e) => {
            setValue(e.target.value)
            await validateCollection({ slug: e.target.value })
          }}
          className={cn('', error && 'border-destructive bg-destructive/10')}
        />
        {value !== slug && !error && !settings_locked && (
          <Button
            variant={'outline'}
            size={'icon'}
            className="shrink-0"
            onClick={async () => {
              const res = await updateCollection(
                { slug: value },
                {
                  redirect: `/collections/${slug}`,
                },
              )
              handleReturnInfo(res)
            }}
          >
            <PiCheckTick className="size-4" />
          </Button>
        )}
      </div>
      <ErrorMessage error={error} />
    </>
  )
}
