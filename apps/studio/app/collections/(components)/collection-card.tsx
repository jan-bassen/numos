'use client'

import type { ExtendedCollection } from '@/types/database.types'
import type { ButtonProps } from '@repo/ui/components/ui/button'
import { handleReturnInfo } from '@repo/ui/lib/utils'
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
import { PiDeleteDustbin01Stroke } from '@repo/ui/icons/pika'
import InputDeleteDialogContent from '@repo/ui/components/dialogs/input-delete-dialog'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import {
  ElementCardButton,
  ElementCardLink,
  type ElementCardSize,
} from '@/components/layouts/simple/element-card'

interface CollectionCardProps extends ButtonProps {
  collection?: ExtendedCollection
  size?: ElementCardSize
  className?: string
}

export default function CollectionCard({
  collection,
  size,
  className,
  ...props
}: CollectionCardProps) {
  if (!collection) {
    return (
      <ElementCardButton
        {...props}
        size={size ?? 'md'}
        variant="new"
        label="New Collection"
      />
    )
  }

  return (
    <AlertDialog>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <ElementCardLink
            size={size ?? 'md'}
            className={className}
            href={`/collections/${collection.slug}`}
            label={collection.name ?? 'Unnamed Collection'}
            subtitle={collection.description}
            image={
              <SupabaseImage
                src={
                  collection?.image
                    ? `collection-images/${collection.image}`
                    : undefined
                }
                alt="Collection Image"
                width={100}
                height={100}
                className="aspect-square object-cover size-full"
              />
            }
          />
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
}
