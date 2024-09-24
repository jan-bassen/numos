import { H2 } from '@/components/layout/pages/headings'
import { Button } from '@repo/ui/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/ui/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@repo/ui/components/ui/dialog'
import { Input } from '@repo/ui/components/ui/input'
import {
  PiCalendarCheckContrast,
  PiDatabaseContrast,
  PiDeleteDustbin02Stroke,
  PiInputFieldStroke,
  PiPhotoImageDefaultContrast,
  PiPhotoImageDefaultStroke,
} from '@/lib/icons'
import { deleteLayer, updateLayer } from '@/lib/supabase/db/layers'
import { SupabaseImage } from '@/lib/supabase/storage/supabaseImage'
import type {
  LayerTree,
  LegacyResolvedFolder,
  LegacyResolvedLayer,
} from '@/types/database.types'
import Decimal from 'decimal.js'
import { type DragEvent, type MouseEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { childrenOffset, type TreeContext, type TreeElement } from './tree'
import { cn, handleReturnInfo } from '@/lib/utils'

export default function LayerListItem({
  layerId,
  tree,
  level,
  context,
}: {
  layerId: string
  tree: LayerTree
  level: number
  context: TreeContext
}) {
  const layer = tree.layers[layerId]
  const [dialogOpen, setDialogOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(layer?.name || '')
  const nameInputRef = useRef<HTMLInputElement>(null)

  if (!layer) return null

  const folder = layer.folder ? tree.folders[layer.folder] : undefined
  const selectionElement: TreeElement = {
    type: 'layer' as const,
    id: layer.id,
    path: layer.folder && folder ? folder.path.concat(layer.folder) : [],
  }
  const isSelected = context.selection.layer.some(
    (item) => item.id === layer.id,
  )

  const handleRename = async () => {
    if (name === layer.name) {
      setRenaming(false)
      return
    }

    const res = await updateLayer(layer.id, { name })
    if (!res.ok) {
      toast.error(res.message)
      return
    }
    setName(name)
    setRenaming(false)
  }

  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    if (e.button !== 0 && e.button !== 2) return
    e.stopPropagation()

    e.preventDefault()
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
      context.addBetweenToSelection(selectionElement)
      return
    }
    context.setSelectionTo(selectionElement)
  }

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (context.locked) {
      e.preventDefault()
      return
    }
    context.addToSelection(selectionElement)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', layer.id || '')
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
              src={layer.signedUrl}
              alt={layer.name || 'Unnamed Layer'}
              className="size-8 shrink-0 rounded-md"
              width={64}
              height={64}
              signed
            />
            {renaming ? (
              <Input
                value={name || undefined}
                placeholder="Unnamed Layer"
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
                {name || 'Unnamed Layer'}
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
              const res = await deleteLayer(layer.id)
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
          <div className="flex -md:flex-col gap-10">
            <div className="max-h-[50vh] w-full md:max-w-[33vw]">
              <SupabaseImage
                src={layer.signedUrl}
                alt={layer.name || 'Unnamed Layer'}
                loading="eager"
                className="contain h-full w-full drop-shadow-sm"
                width={1000}
                height={1000}
                signed
              />
            </div>
            <div className="flex -md:w-full flex-col justify-end gap-3 md:min-w-56 md:max-w-[33vw] md:gap-2">
              <DialogDescription className="flex items-center gap-3 text-muted-foreground text-xs ">
                <span className="flex items-center gap-[0.28rem]">
                  <PiPhotoImageDefaultContrast className="size-[0.75rem] opacity-80" />
                  {layer.type.toUpperCase()}
                </span>
                <span className="flex items-center gap-[0.28rem]">
                  <PiDatabaseContrast className="size-[0.75rem] opacity-80" />
                  {new Decimal(layer.bytes / 1000000)
                    .toDecimalPlaces(2)
                    .toNumber()}
                  MB
                </span>
                <span className="flex items-center gap-[0.28rem]">
                  <PiCalendarCheckContrast className="size-[0.75rem] opacity-80" />
                  {new Date(layer.created_at).toLocaleString()}
                </span>
              </DialogDescription>
              <DialogTitle className="font-semibold text-2xl leading-tight">
                {layer.name}
              </DialogTitle>
              <div className="h-5" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ContextMenu>
  )
}
