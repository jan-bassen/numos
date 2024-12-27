'use client'

import Link from 'next/link'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { PiAutomationStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'

export function CustomLogicButton() {
  const {
    action: { slug, locked },
  } = useAction()
  const {
    collection: { slug: collectionSlug },
  } = useCollection()
  return (
    <Link
      href={`/collections/${collectionSlug}/actions/${slug}/logic`}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'relative flex min-h-28 w-fulitems-center max-w-form-input justify-center gap-2 overflow-hidden',
      )}
    >
      <PiAutomationStroke className="my-auto size-4" />
      {locked ? 'View Logic' : 'Edit Logic'}
      <div className="!bg-dots_grid absolute size-full translate-x-[12.5px] translate-y-[15px] bg-[50px_50px] bg-[length:100px_100px] opacity-25" />
    </Link>
  )
}
