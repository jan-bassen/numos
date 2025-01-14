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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/ui/alert-dialog'
import {
  PiAutomationStroke,
  PiDeleteDustbin02Stroke,
  PiPencilEditBoxStroke,
} from '@repo/ui/icons/pika'
import { deleteActionBySlug } from '@/lib/supabase/db/actions'

interface ActionContextMenuProps {
  children?: React.ReactNode
  actionSlug: string
  collectionSlug: string
  versionId: string
}

export default function ActionContextMenu({
  children,
  actionSlug,
  collectionSlug,
  versionId,
}: ActionContextMenuProps) {
  const href = `/collections/${collectionSlug}/actions/${actionSlug}`
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
          {/* TODO: Make this depending on the action type */}
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete this action?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const res = await deleteActionBySlug(versionId, actionSlug)
              handleReturnInfo(res)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
