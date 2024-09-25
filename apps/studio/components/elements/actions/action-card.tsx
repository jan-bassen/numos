'use client'

import Link from 'next/link'
import {
  Button,
  type ButtonProps,
  buttonVariants,
} from '@repo/ui/components/ui/button'
import { cn } from '@/lib/utils'
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
  PiAddAddStroke,
  PiAutomationStroke,
  PiDeleteDustbin02Stroke,
  PiPencilEditBoxStroke,
} from '@repo/ui/icons/pika'
import type { Action } from '@/types/database.types'
import { deleteAction } from '@/lib/supabase/db/actions'
import { toast } from 'sonner'
import { type ActionTrigger, actionTypes } from './action-schema'
import { forwardRef } from 'react'

export type ExtendedAction = Action & { collection_slug: string }
interface ActionCardProps extends ButtonProps {
  action?: Action
  collectionSlug: string
}

const ActionCard = forwardRef<HTMLButtonElement, ActionCardProps>(
  ({ action, collectionSlug, className, ...props }, ref) => {
    if (!action) {
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
            New Action
          </h3>
        </Button>
      )
    }
    const trigger = action.trigger as ActionTrigger | undefined
    const href = `/studio/${collectionSlug}/actions/${action.slug}`
    return (
      <AlertDialog>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Link
              href={href}
              key={action.slug}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'block h-28 space-y-3 px-4 py-3 md:h-36',
              )}
            >
              <div className="flex h-fit w-full items-center justify-start gap-3">
                {actionTypes[trigger?.type || 'api'].icon({
                  className: ' size-4.5 [&>path]:!stroke-2.5',
                })}
                <h3 className="!line-clamp-1 flex w-[80%] justify-between overflow-hidden text-ellipsis pr-1 text-left font-semibold text-lg">
                  {action?.name ? action.name : 'Select Collection'}
                </h3>
              </div>
              <p className="line-clamp-3 font-normal text-muted-foreground text-xs">
                {action.description ? action.description : 'No description'}
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
  },
)

ActionCard.displayName = 'ActionCard'
export default ActionCard
