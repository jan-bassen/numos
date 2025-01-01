'use client'

import Link from 'next/link'
import type { ButtonProps } from '@repo/ui/components/ui/button'
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
import type { Action } from '@/types/database.types'
import { deleteAction } from '@/lib/supabase/db/actions'
import type { ActionTrigger } from '@/types/actions.types'
import { triggerOptions } from '@/lib/constants/triggers'
import {
  ElementCardButton,
  ElementCardLink,
  type ElementCardSize,
} from '@/components/layouts/simple/element-card'

export type ExtendedAction = Action & { collection_slug: string }
interface ActionCardProps extends ButtonProps {
  action?: Action
  collectionSlug: string
  size?: ElementCardSize
}

export default function ActionCard({
  action,
  collectionSlug,
  className,
  size,
  ...props
}: ActionCardProps) {
  if (!action) {
    return (
      <ElementCardButton
        {...props}
        size={size ?? 'md'}
        variant="new"
        label="New Action"
      />
    )
  }
  const trigger = action.trigger as ActionTrigger | undefined
  const href = `/collections/${collectionSlug}/actions/${action.slug}`
  return (
    <AlertDialog>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <ElementCardLink
            size={size ?? 'md'}
            className={className}
            href={href}
            label={action.name ?? 'Unnamed Action'}
            subtitle={action.description}
            icon={triggerOptions[trigger?.type || 'api'].Icon}
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
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
            onClick={() => {
              deleteAction(action.id, collectionSlug)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
