import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/ui/accordion'
import type { LayerTree } from '@/types/database.types'
import {
  PiChevronBigRightStroke,
  PiDeleteDustbin02Stroke,
  PiFolderDefaultSolid,
  PiFolderPlusStroke,
  PiInputFieldStroke,
  PiPhotoImageArrowUpStroke,
} from '@repo/ui/icons/pika'
import LayerFolderView from './layer-folder-view'
import {
  type Dispatch,
  type DragEvent,
  type MouseEvent,
  type SetStateAction,
  useState,
} from 'react'
import { useRef } from 'react'
import { handleFileUpload } from '../(functions)/upload'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@repo/ui/components/ui/context-menu'
import { deleteFolder, updateFolder } from '@/lib/supabase/db/layers'
import { toast } from 'sonner'
import { Input } from '@repo/ui/components/ui/input'
import {
  childrenOffset,
  type FolderState,
  type TreeContext,
  type TreeElement,
} from './tree'
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
import { cn, handleReturnInfo } from '@repo/ui/lib/utils'
import { imageAcceptString } from '../(functions)/file-types'

export default function FolderListItem({
  folderId,
  tree,
  level,
  context,
  folderState,
  setFolderState,
}: {
  folderId: string
  tree: LayerTree
  level: number
  context: TreeContext
  folderState: FolderState
  setFolderState: Dispatch<SetStateAction<FolderState>>
}) {
  const folder = tree.folders[folderId]
  const [newFolder, setNewFolder] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(folder?.name || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  if (!folder) return null

  const selectionElement: TreeElement = {
    type: 'folder' as const,
    id: folder.id,
    path: folder.path,
  }

  const isSelected = context.selection.folder.some(
    (item) => item.id === folder.id,
  )

  const directChildren = {
    folder: folder.subfolders,
    layer: folder.layers,
  }

  const isDirectChild = () => {
    if (!context.draggedElement) return false
    return directChildren[context.draggedElement.type].includes(
      context.draggedElement.id,
    )
  }

  const handleRename = async () => {
    if (name === folder.name) {
      setRenaming(false)
      return
    }

    const res = await updateFolder(folder.id, { name })
    if (!res.ok) {
      toast.error(res.message)
      return
    }
    setName(name)
    setRenaming(false)
  }

  const handleDelete = async () => {
    const res = await deleteFolder(folder.id)
    handleReturnInfo(res)
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
      context.addBetweenToSelection(selectionElement)
      return
    }
    context.setSelectionTo(selectionElement)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDirectChild()) {
      context.setDraggedOver(null)
      return
    }
    context.setDraggedOver(folder.id)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    context.setDraggedOver(null)

    if (context.locked) return

    //Handle internal drop
    if (context.draggedElement) {
      if (isDirectChild()) return
      context.moveSelection(selectionElement)
      return
    }

    //Handle external drop
    if (e.dataTransfer?.items.length > 0) {
      const files = Array.from(e.dataTransfer?.items || [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file) => file !== null)
      handleFileUpload(folder.collection, folder.id, files, null)
    }
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (context.locked) {
      e.preventDefault()
      return
    }
    context.addToSelection(selectionElement)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', folder.id || '')
    context.setDraggedElement(selectionElement)
  }

  return (
    <AlertDialog>
      <AccordionItem
        value={folder.id}
        className={cn(
          'border-b-0',
          context.draggedOver === folder.id &&
            'z-20 rounded-md ring-2 ring-primary ring-inset ',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDragEnd={(e) => {
          context.setDraggedElement(null)
        }}
        draggable={!context.locked}
      >
        <ContextMenu>
          <ContextMenuTrigger
            className={cn(
              'flex h-10 cursor-pointer gap-4 rounded-md p-1.5 hover:bg-muted',
              isSelected && 'bg-muted',
            )}
            onClick={handleClick}
            onContextMenu={handleClick}
          >
            <input
              type="file"
              id="file-input"
              accept={imageAcceptString}
              className="hidden"
              ref={fileInputRef}
              multiple
              onChange={(event) =>
                handleFileUpload(
                  folder.collection,
                  folder.id,
                  Array.from(event.target?.files || []),
                  fileInputRef,
                )
              }
            />
            <div className="flex items-center gap-1">
              <AccordionTrigger
                className={cn(
                  'gap-1 hover:no-underline [&[data-state=open]_#chevron]:rotate-90',
                )}
                style={{
                  paddingLeft: `${0.375 + level * childrenOffset}rem`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
                hideChevron
              >
                <PiChevronBigRightStroke
                  className="size-4 shrink-0 transition-transform duration-200"
                  id="chevron"
                />
                <PiFolderDefaultSolid className="size-8 shrink-0 text-secondary-foreground" />
              </AccordionTrigger>
              {renaming ? (
                <Input
                  value={name || undefined}
                  placeholder="Unnamed Folder"
                  onChange={(e) => setName(e.target.value)}
                  ref={nameInputRef}
                  className="h-8 w-full border-0 bg-transparent p-2 pl-3 font-normal text-secondary-foreground text-sm ring-offset-transparent focus-visible:ring-transparent"
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
                  {name || 'Unnamed Folder'}
                </p>
              )}
            </div>
          </ContextMenuTrigger>
          <AlertDialogContent className="space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure to delete this folder?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone and will delete all layers within
                this folder.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
          <ContextMenuContent className="min-w-36">
            <ContextMenuGroup>
              <ContextMenuItem
                onClick={() => {
                  fileInputRef.current?.click()
                }}
                className="flex gap-1.5"
              >
                <PiPhotoImageArrowUpStroke className="size-4" />
                Upload here
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  setNewFolder(true)
                }}
                className="flex gap-1.5"
              >
                <PiFolderPlusStroke className="size-4" />
                New Folder
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
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
              <AlertDialogTrigger asChild>
                <ContextMenuItem className="flex gap-1.5">
                  <PiDeleteDustbin02Stroke className="size-4" />
                  Delete
                </ContextMenuItem>
              </AlertDialogTrigger>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
        <AccordionContent className="px-0.5 pt-[calc(0.125rem-1px)] pb-0.5">
          <LayerFolderView
            collectionId={folder.collection}
            tree={tree}
            folder={folder}
            newFolder={newFolder}
            setNewFolder={setNewFolder}
            folderState={folderState}
            setFolderState={setFolderState}
            level={level + 1}
            context={context}
          />
        </AccordionContent>
      </AccordionItem>
    </AlertDialog>
  )
}
