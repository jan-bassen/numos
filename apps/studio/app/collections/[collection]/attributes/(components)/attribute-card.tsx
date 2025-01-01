'use client'

import Link from 'next/link'
import type { ButtonProps } from '@repo/ui/components/ui/button'
import { handleReturnInfo } from '@repo/ui/lib/utils'
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
  PiDeleteDustbin02Stroke,
  PiPencilEditBoxStroke,
} from '@repo/ui/icons/pika'
import { deleteAttribute } from '@/lib/supabase/db/attributes/delete'
import type { Attribute, ValueDataType } from '@/types/database.types'
import DeleteDialogContent from '@repo/ui/components/dialogs/delete-dialog'
import { removeAttributeFromLocalForm } from '@/app/collections/[collection]/attributes/(functions)/utils'
import { useRouter } from 'next/navigation'
import {
  ElementCardButton,
  ElementCardLink,
  type ElementCardSize,
} from '@/components/layouts/simple/element-card'
import { dataTypes } from '@/lib/constants/datatypes'

interface AttributeCardProps extends ButtonProps {
  attribute?: Attribute
  size?: ElementCardSize
  collectionSlug: string
}

export default function AttributeCard({
  attribute,
  collectionSlug,
  className,
  size,
  ...props
}: AttributeCardProps) {
  const router = useRouter()
  if (!attribute) {
    return (
      <ElementCardButton
        {...props}
        size={size ?? 'md'}
        variant="new"
        label="New Attribute"
      />
    )
  }
  const href = `/collections/${collectionSlug}/attributes/${attribute.slug}`
  return (
    <AlertDialog>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <ElementCardLink
            size={size ?? 'md'}
            className={className}
            href={href}
            label={attribute.name ?? 'Unnamed Attribute'}
            subtitle={attribute.description}
            icon={dataTypes[attribute.type as ValueDataType].icons.stroke}
          />
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
}
