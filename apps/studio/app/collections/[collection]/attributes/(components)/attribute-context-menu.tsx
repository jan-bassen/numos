'use client'

import Link from 'next/link'
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
import { deleteAttributeBySlug } from '@/lib/supabase/db/attributes'
import DeleteDialogContent from '@repo/ui/components/dialogs/delete-dialog'
import { removeAttributeFromLocalForm } from '../(functions)/utils'

interface AttributeContextMenuProps {
  children?: React.ReactNode
  attributeSlug: string
  collectionSlug: string
  versionId: string
}

export default function AttributeContextMenu({
  children,
  attributeSlug,
  collectionSlug,
  versionId,
}: AttributeContextMenuProps) {
  const href = `/collections/${collectionSlug}/attributes/${attributeSlug}`
  return (
    <AlertDialog>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="min-w-40">
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
          const res = await deleteAttributeBySlug(versionId, attributeSlug)
          handleReturnInfo(res, () => {
            removeAttributeFromLocalForm(collectionSlug, attributeSlug)
          })
        }}
      />
    </AlertDialog>
  )
}
