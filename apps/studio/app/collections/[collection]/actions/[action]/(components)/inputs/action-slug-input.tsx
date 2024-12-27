'use client'

import { Input } from '@repo/ui/components/ui/input'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import ErrorMessage from '@/components/state/error-message'
import { useState } from 'react'
import { cn, handleReturnInfo } from '@repo/ui/lib/utils'
import { Button } from '@repo/ui/components/ui/button'
import { PiCheckTick } from '@repo/ui/icons/pika'

export function ActionSlugInput() {
  const {
    collection: { slug: collectionSlug },
  } = useCollection()
  const {
    action: { slug, locked },
    updateAction,
    validateAction,
    getError,
  } = useAction()
  const [value, setValue] = useState(slug)
  const errorEntry = getError(['slug'])?.message || undefined
  const error = typeof errorEntry === 'string' ? errorEntry : undefined

  return (
    <>
      {/* <label
        htmlFor="slug"
        className="text-muted-foreground text-xs"
      >{`studio.numos.xyz/collections/${collectionSlug}/attributes/${slug}`}</label> */}
      <div className="flex w-full gap-2">
        <Input
          disabled={locked}
          value={value}
          onChange={async (e) => {
            setValue(e.target.value)
            await validateAction({ slug: e.target.value })
          }}
          className={cn('', error && 'border-destructive bg-destructive/10')}
        />
        {value !== slug && !error && (
          <Button
            disabled={locked}
            variant={'outline'}
            size={'icon'}
            className="shrink-0"
            onClick={async () => {
              const res = await updateAction(
                { slug: value },
                {
                  redirect: `/collections/${collectionSlug}/actions/${value}`,
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
