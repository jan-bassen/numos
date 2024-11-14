'use client'

import type { ExtendedCollection } from '@/types/database.types'
import Link from 'next/link'
import {
  Button,
  type ButtonProps,
  buttonVariants,
} from '@repo/ui/components/ui/button'
import { cn, handleReturnInfo } from '@repo/ui/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/ui/context-menu'
import { deleteCollection } from '@/lib/supabase/db/collections'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@repo/ui/components/ui/alert-dialog'
import { PiAddAddStroke, PiDeleteDustbin01Stroke } from '@repo/ui/icons/pika'
import InputDeleteDialogContent from '@repo/ui/components/dialogs/input-delete-dialog'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import { forwardRef } from 'react'

interface CollectionCardProps extends ButtonProps {
  collection?: ExtendedCollection
  cardSize?: 'small' | 'medium'
  className?: string
}

const CollectionCard = forwardRef<HTMLButtonElement, CollectionCardProps>(
  ({ collection, cardSize, className, ...props }, ref) => {
    if (!collection) {
      return (
        <Button
          ref={ref}
          variant={'outline'}
          className={cn(
            'flex items-start justify-start gap-4 border-dashed bg-[hsl(var(--muted)/0.15)] p-4',
            cardSize === 'small'
              ? 'h-24'
              : cardSize === 'medium'
                ? 'h-32'
                : 'h-44',
            className,
          )}
          {...props}
        >
          <h3 className="flex gap-1.5 stroke-muted-foreground text-left font-medium text-lg text-muted-foreground">
            <PiAddAddStroke strokeWidth={2.5} className="my-auto h-4 w-4" />
            New Collection
          </h3>
        </Button>
      )
    }

    return (
      <AlertDialog>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Link
              href={`/collections/${collection.slug}`}
              key={collection.slug}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'flex items-start justify-start gap-4 p-4',
                cardSize === 'small'
                  ? 'h-24'
                  : cardSize === 'medium'
                    ? 'h-32'
                    : 'h-44',
              )}
            >
              <SupabaseImage
                src={
                  collection?.image
                    ? `collection-images/${collection.image}`
                    : undefined
                }
                alt="Collection Image"
                width={142}
                height={142}
                className="aspect-square h-full shrink-0 rounded-sm object-cover"
              />
              <div className="flex h-fit flex-col gap-3 md:gap-2">
                <h3 className="line-clamp-1 inline text-ellipsis text-left font-semibold text-lg">
                  {collection?.name ? collection.name : 'Select Collection'}
                </h3>
                <p className="line-clamp-3 font-normal text-muted-foreground text-xs">
                  {collection?.description || 'No description'}
                </p>
              </div>
            </Link>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <AlertDialogTrigger asChild>
              <ContextMenuItem>
                <PiDeleteDustbin01Stroke className="mr-1.5 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </AlertDialogTrigger>
          </ContextMenuContent>
        </ContextMenu>
        <InputDeleteDialogContent
          title="collection"
          onDelete={async () => {
            const res = await deleteCollection(collection.id)
            handleReturnInfo(res)
          }}
        />
      </AlertDialog>
    )
  },
)

CollectionCard.displayName = 'CollectionCard'
export default CollectionCard
