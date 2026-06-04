'use client'

import Link from 'next/link'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/context-menu'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog'
import {
  PiAutomationStroke,
  PiDeleteDustbin02Stroke,
  PiPencilEditBoxStroke,
} from '@repo/ui/icons/pika'
import DeleteDialogContent from '@repo/ui/blocks/dialogs/delete-dialog'
import type { ComponentProps } from 'react'
import { deleteLayerBySlug } from '@/lib/data/layers/delete'

interface LayerContextMenuProps {
  children?: React.ReactNode
  layerSlug: string
  collectionSlug: string
  versionId: string
}

export default function LayerContextMenu({
  onOpenChange,
  children,
  layerSlug,
  collectionSlug,
  versionId,
  ...props
}: LayerContextMenuProps & ComponentProps<typeof ContextMenu>) {
  const href = `/collections/${collectionSlug}/image/${layerSlug}`
  return (
    <AlertDialog>
      <ContextMenu {...props}>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="min-w-40">
          <ContextMenuItem asChild>
            <Link href={href} className="flex gap-1.5">
              <PiPencilEditBoxStroke className="h-4 w-4" />
              Edit
            </Link>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Link href={`${href}/logic`} className="flex gap-1.5">
              <PiAutomationStroke className="h-4 w-4" />
              Edit Logic
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
          const res = await deleteLayerBySlug(versionId, layerSlug)
          handleReturnInfo(res)
        }}
      />
    </AlertDialog>
  )
}
