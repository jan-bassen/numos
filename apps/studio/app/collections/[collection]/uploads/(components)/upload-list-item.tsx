'use client'

import { Button } from '@repo/ui/components/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@repo/ui/components/dialog'
import { Input } from '@repo/ui/components/input'
import {
  PiCalendarCheckContrast,
  PiDatabaseContrast,
  PiDeleteDustbin02Stroke,
  PiInputFieldStroke,
  PiPhotoImageDefaultContrast,
  PiPhotoImageDefaultStroke,
} from '@repo/ui/icons/pika'
import { deleteUpload, updateUpload } from '@/lib/data/uploads'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import type { UploadsTree } from '@/types/database.types'
import Decimal from 'decimal.js'
import { type DragEvent, type MouseEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { childrenOffset, type TreeContext, type TreeElement } from './tree'
import { cn, handleReturnInfo } from '@repo/ui/lib/utils'

export default function UploadsListItem({
  uploadId,
  tree,
  level,
  context,
}: {
  uploadId: string
  tree: UploadsTree
  level: number
  context: TreeContext
}) {
  const upload = tree.uploads[uploadId]
  const [dialogOpen, setDialogOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(upload?.name || '')
  const nameInputRef = useRef<HTMLInputElement>(null)

  if (!upload) return null

  const folder = upload.folder ? tree.folders[upload.folder] : undefined
  const selectionElement: TreeElement = {
    type: 'upload' as const,
    id: upload.id,
    path: upload.folder && folder ? folder.path.concat(upload.folder) : [],
  }
  const isSelected = context.selection.upload.some(
    (item) => item.id === upload.id,
  )

  const handleRename = async () => {
    if (name === upload.name) {
      setRenaming(false)
      return
    }

    const res = await updateUpload(upload.id, { name })
    if (!res.ok) {
      toast.error(res.message)
      return
    }
    setName(name)
    setRenaming(false)
  }

  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    if (e.button !== 0 && e.button !== 2) return
    if (e.button === 0) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (e.metaKey) {
      if (isSelected) {
        context.removeFromSelection(selectionElement)
        return
      }
      context.addToSelection(selectionElement)
      return
    }
    if (e.shiftKey) {
      if (isSelected) return
      context.addToSelection(selectionElement)
      return
    }
    context.setSelectionTo(selectionElement)
  }

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (context.locked || renaming) {
      e.preventDefault()
      return
    }
    context.addToSelection(selectionElement)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', upload.id || '')
    context.setDraggedElement(selectionElement)
  }

  return (
    <ContextMenu>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <ContextMenuTrigger asChild>
          <Button
            variant="ghost"
            size="none"
            className={cn(
              'h-10 w-full justify-start gap-1 rounded-md p-1.5 focus-visible:ring-0',
              isSelected && 'bg-muted',
            )}
            style={{
              paddingLeft: `${2 + level * childrenOffset}rem`,
            }}
            onClick={handleClick}
            onDoubleClick={() => setDialogOpen(true)}
            onContextMenu={handleClick}
            onDragStart={handleDragStart}
            onDragEnd={(e) => {
              context.setDraggedElement(null)
            }}
            draggable
          >
            <SupabaseImage
              src={upload.signedUrl}
              alt={upload.name || 'Unnamed Upload'}
              className="size-8 shrink-0 rounded-md object-cover "
              width={64}
              height={64}
              signed="true"
              onClick={() => setDialogOpen(true)}
            />
            {renaming ? (
              <Input
                value={name || undefined}
                placeholder="Unnamed Upload"
                onChange={(e) => setName(e.target.value)}
                ref={nameInputRef}
                className="h-8 w-full border-0 bg-transparent p-2 pl-3 font-normal text-secondary-foreground text-sm ring-offset-transparent focus-visible:ring-transparent"
                aria-readonly={!renaming}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename()
                  }
                }}
                autoFocus
              />
            ) : (
              <p
                className="line-clamp-1 cursor-text text-ellipsis p-3 font-normal text-sm"
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  context.setSelectionTo(selectionElement)
                  setRenaming(true)
                  setTimeout(() => {
                    nameInputRef.current?.select()
                  }, 50)
                }}
              >
                {name || 'Unnamed Upload'}
              </p>
            )}
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-36">
          <ContextMenuItem
            onClick={() => setDialogOpen(true)}
            className="flex gap-1.5"
          >
            <PiPhotoImageDefaultStroke className="size-4" />
            Show Layer
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              setRenaming(true)
              setTimeout(() => {
                nameInputRef.current?.select()
              }, 200)
            }}
            className="flex gap-1.5"
          >
            <PiInputFieldStroke className="size-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem
            onClick={async () => {
              const res = await deleteUpload(upload.id)
              handleReturnInfo(res)
            }}
            className="flex gap-1.5"
          >
            <PiDeleteDustbin02Stroke className="size-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
        <DialogContent
          className="max-w-[95vw] md:max-w-[70vw] md:p-10 md:pr-16"
          onContextMenu={(e) => e.stopPropagation()}
        >
          <div className="flex max-md:flex-col gap-10">
            <div className="max-h-[50vh] w-full md:max-w-[33vw]">
              <SupabaseImage
                src={upload.signedUrl}
                alt={upload.name || 'Unnamed Upload'}
                loading="eager"
                className="contain h-full w-full drop-shadow-xs"
                width={1000}
                height={1000}
                signed="true"
              />
            </div>
            <div className="flex max-md:w-full flex-col justify-end gap-3 md:min-w-56 md:max-w-[33vw] md:gap-2">
              <DialogDescription className="flex items-center gap-3 text-muted-foreground text-xs ">
                <span className="flex items-center gap-[0.28rem]">
                  <PiPhotoImageDefaultContrast className="size-[0.75rem] opacity-80" />
                  {upload.type.toUpperCase()}
                </span>
                <span className="flex items-center gap-[0.28rem]">
                  <PiDatabaseContrast className="size-[0.75rem] opacity-80" />
                  {new Decimal(upload.bytes / 1000000)
                    .toDecimalPlaces(2)
                    .toNumber()}
                  MB
                </span>
                <span className="flex items-center gap-[0.28rem]">
                  <PiCalendarCheckContrast className="size-[0.75rem] opacity-80" />
                  {new Date(upload.created_at).toLocaleString()}
                </span>
              </DialogDescription>
              <DialogTitle className="font-semibold text-2xl leading-tight">
                {upload.name}
              </DialogTitle>
              <div className="h-5" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ContextMenu>
  )
}
