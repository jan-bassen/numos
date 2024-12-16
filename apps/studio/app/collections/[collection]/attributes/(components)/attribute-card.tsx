'use client'

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
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@repo/ui/components/ui/alert-dialog'
import {
  PiAddAddStroke,
  PiDeleteDustbin02Stroke,
  PiPencilEditBoxStroke,
} from '@repo/ui/icons/pika'
import { deleteAttribute } from '@/lib/supabase/db/attributes/delete'
import type { Attribute, ValueDataType } from '@/types/database.types'
import { dataTypes } from '@/lib/constants/datatypes'
import { forwardRef } from 'react'
import DeleteDialogContent from '@repo/ui/components/dialogs/delete-dialog'
import { removeAttributeFromLocalForm } from '@/app/collections/[collection]/attributes/(functions)/utils'
import { useRouter } from 'next/navigation'

interface AttributeCardProps extends ButtonProps {
  attribute?: Attribute
  collectionSlug: string
}

const AttributeCard = forwardRef<HTMLButtonElement, AttributeCardProps>(
  ({ attribute, collectionSlug, className, ...props }, ref) => {
    const router = useRouter()
    if (!attribute) {
      return (
        <Button
          ref={ref}
          variant={'outline'}
          className={cn(
            'flex h-28 items-start justify-start gap-4 border-dashed bg-[hsl(var(--muted)/0.15)] p-4 md:h-36',
            className,
          )}
          {...props}
        >
          <h3 className="flex gap-1.5 stroke-muted-foreground text-left font-medium text-lg text-muted-foreground">
            <PiAddAddStroke strokeWidth={2.5} className="my-auto h-4 w-4" />
            New Attribute
          </h3>
        </Button>
      )
    }
    const href = `/collections/${collectionSlug}/attributes/${attribute.slug}`
    return (
      <AlertDialog>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Link
              href={href}
              key={attribute.slug}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'block h-28 space-y-4 px-4 py-3 md:h-36',
              )}
            >
              <div className="flex h-fit w-full items-center justify-start gap-3">
                {dataTypes[attribute.type as ValueDataType].icons.stroke({
                  className: 'my-auto size-4.5 [&>path]:!stroke-2.5',
                })}
                <h3 className="!line-clamp-1 flex w-[80%] justify-between overflow-hidden text-ellipsis pr-1 text-left font-semibold text-lg">
                  {attribute?.name ? attribute.name : 'Unnamed Attribute'}
                  {attribute.list && ' (List)'}
                </h3>
              </div>
              <p className="line-clamp-3 font-normal text-muted-foreground text-xs">
                {attribute.description
                  ? attribute.description
                  : 'No description'}
              </p>
            </Link>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem asChild>
              <Link href={href} className="flex gap-1.5">
                <PiPencilEditBoxStroke className="h-4 w-4" />
                Edit
              </Link>
            </ContextMenuItem>
            <AlertDialogTrigger asChild>
              <ContextMenuItem>
                <PiDeleteDustbin02Stroke className="mr-1.5 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </AlertDialogTrigger>
          </ContextMenuContent>
        </ContextMenu>
        <DeleteDialogContent
          title="attribute"
          onDelete={async () => {
            const res = await deleteAttribute(attribute.id)
            handleReturnInfo(res, () => {
              removeAttributeFromLocalForm(collectionSlug, attribute.slug)
              router.push(`/collections/${collectionSlug}/attributes`)
            })
          }}
        />
      </AlertDialog>
    )
  },
)

AttributeCard.displayName = 'AttributeCard'
export default AttributeCard
