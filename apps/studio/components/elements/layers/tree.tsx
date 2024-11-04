'use client'

import type { Collection, LayerTree } from '@/types/database.types'
import { type DragEvent, useEffect, useRef, useState } from 'react'
import Header from '@/components/layout/pages/header'
import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import {
  PiFolderPlusStroke,
  PiPhotoImageArrowUpSolid,
  PiPhotoImageArrowUpStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { handleFileUpload } from './upload'
import LayerFolderView from './layer-folder-view'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/ui/context-menu'
import { useHotkeys } from 'react-hotkeys-hook'
import { imageAcceptString } from './file-types'
import { moveLayersAndFolders } from '@/lib/supabase/db/layers'
import { toast } from 'sonner'

// TODO: Clean up

export const childrenOffset = 1.2 // rem

export type TreeElement = {
  type: 'folder' | 'layer'
  id: string
  path: string[]
}
export type TreeSelection = { folder: TreeElement[]; layer: TreeElement[] }

export type TreeContext = {
  locked: boolean
  setLocked: (value: boolean) => void
  draggedElement: TreeElement | null
  setDraggedElement: (value: TreeElement | null) => void
  draggedOver: string | null
  setDraggedOver: (value: string | null) => void
  selection: TreeSelection
  resetSelection: () => void
  setSelection: (value: TreeSelection) => void
  setSelectionTo: (element: TreeElement) => void
  addToSelection: (element: TreeElement) => void
  addBetweenToSelection: (element: TreeElement) => void
  removeFromSelection: (element: TreeElement) => void
  moveSelection: (target: TreeElement) => void
}
export type FolderState = {
  [key: string]: string[]
}

export default function LayerTreeView({
  collection,
  tree,
}: { collection: Collection; tree: LayerTree }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [locked, setLocked] = useState(false)
  const [newFolder, setNewFolder] = useState(false)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [draggedElement, setDraggedElement] = useState<TreeElement | null>(null)

  const isEmpty =
    Object.keys(tree.layers).length === 0 &&
    Object.keys(tree.folders).length === 0

  //TODO: Validate folderState?
  const [folderState, setFolderState] = useState<FolderState>(
    JSON.parse(localStorage.getItem(`folder-state-${collection.id}`) || '{}'),
  )
  const [selection, setSelection] = useState<TreeSelection>({
    folder: [],
    layer: [],
  })

  useEffect(() => {
    localStorage.setItem(
      `folder-state-${collection.id}`,
      JSON.stringify(folderState),
    )
  }, [folderState, collection.id])

  const resetSelection = () => {
    setSelection({ folder: [], layer: [] })
  }

  const setSelectionTo = (element: TreeElement) => {
    if (element.type === 'folder') {
      setSelection({ folder: [element], layer: [] })
    } else {
      setSelection({ folder: [], layer: [element] })
    }
  }

  const addToSelection = (element: TreeElement) => {
    const isAlreadySelected =
      element.type === 'folder'
        ? selection.folder.some((item) => item.id === element.id)
        : selection.layer.some((item) => item.id === element.id)
    if (isAlreadySelected) return
    if (element.type === 'folder') {
      setSelection((prev) => ({
        ...prev,
        folder: [...prev.folder, element],
      }))
    } else {
      setSelection({
        ...selection,
        layer: [...selection.layer, element],
      })
    }
  }

  const addBetweenToSelection = (element: TreeElement) => {
    //TODO: Implement
    console.error('addBetweenToSelection not implemented')

    /*     const openFolders = Object.values(folderState).flat()
    const visibleSelection = selection.folder
      .concat(selection.layer)
      .filter(
        (item) =>
          item.treePath.length === 0 ||
          item.treePath.every((id) => openFolders.includes(id)),
      )
    const sortedSelection = visibleSelection.sort(
      (a, b) => a.globalIndex - b.globalIndex,
    )
    const selectionAboveElement = sortedSelection.filter(
      (item) => item.globalIndex < element.globalIndex,
    )
    if (selectionAboveElement.length === 0) {
      console.log('no selection above')

      const selectionBelowElement = sortedSelection.filter(
        (item) => item.globalIndex > element.globalIndex,
      )
      if (selectionBelowElement.length === 0) {
        console.log('no selection below')
        return
      }
      const closestSelectionBelow =
        selectionBelowElement[selectionBelowElement.length - 1]
      console.log(closestSelectionBelow)
    }
    const closestSelectionAbove =
      selectionAboveElement[selectionAboveElement.length - 1]
    console.log(closestSelectionAbove) */
  }

  const removeFromSelection = (element: TreeElement) => {
    if (element.type === 'folder') {
      setSelection((prev) => ({
        ...prev,
        folder: prev.folder.filter((el) => el.id !== element.id),
      }))
    } else {
      setSelection((prev) => ({
        ...prev,
        layer: prev.layer.filter((el) => el.id !== element.id),
      }))
    }
  }

  const moveSelection = async (target: TreeElement | null) => {
    if (locked) return
    setLocked(true)
    const filteredFolders = selection.folder.filter((selectedFolder) => {
      const isTopLevel =
        selectedFolder.path.length === 0 ||
        selectedFolder.path.filter((folderId) =>
          selection.folder.some((folder) => folder.id === folderId),
        ).length === 0
      const isTarget = target && selectedFolder.id === target.id
      const isParentOfTarget =
        target?.path.some((folderId) =>
          selectedFolder.path.includes(folderId),
        ) || false
      return isTopLevel && !isTarget && !isParentOfTarget
    })
    const filteredLayers = selection.layer.filter((item) => {
      const isTopLevel =
        item.path.length === 0 ||
        item.path.filter((folderId) =>
          filteredFolders.some((folder) => folder.id === folderId),
        ).length === 0
      const isTarget = target && item.id === target.id
      const isParentOfTarget =
        target?.path.some((folderId) => item.path.includes(folderId)) || false
      return isTopLevel && !isTarget && !isParentOfTarget
    })

    const promise = moveLayersAndFolders(
      filteredLayers.map((layer) => layer.id),
      filteredFolders.map((folder) => folder.id),
      target?.id || null,
    )

    toast.promise(promise, {
      loading: 'Moving...',
      success: () => {
        setLocked(false)
        resetSelection()
        return 'Moved'
      },
      error: (error) => error.message,
    })
  }

  useHotkeys('esc', () => {
    resetSelection()
  })

  const directChildren = {
    folder: Object.entries(tree.folders)
      .filter(([key, folder]) => folder.parent === null)
      .map(([key, folder]) => key),
    layer: Object.entries(tree.layers)
      .filter(([key, layer]) => layer.folder === null)
      .map(([key, layer]) => key),
  }

  const isDirectChild = () => {
    console.log(draggedElement)
    if (!draggedElement) return false
    return directChildren[draggedElement.type].includes(draggedElement.id)
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggedOver(null)

    if (locked) return

    //Handle internal drop
    if (draggedElement) {
      if (isDirectChild()) return
      moveSelection(null)
      return
    }

    //Handle external drop
    if (e.dataTransfer?.items.length > 0) {
      const files = Array.from(e.dataTransfer?.items || [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file) => file !== null)
      handleFileUpload(collection.id, null, files, null)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDirectChild()) {
      setDraggedOver(null)
      return
    }
    setDraggedOver('root')
  }

  return (
    <>
      <Header
        title="Layers"
        subtitle="Layers make up the images of your tokens. For example they can be backgrounds or represent specific traits."
      >
        <Button
          variant={'outline'}
          className="shrink-0 gap-2"
          onClick={() => setNewFolder(true)}
        >
          <PiFolderPlusStroke className="size-4" />
          New Folder
        </Button>
        <label
          htmlFor="file-input"
          className={cn(buttonVariants({}), 'cursor-pointer gap-2')}
        >
          <PiPhotoImageArrowUpStroke className="size-4" />
          Upload
        </label>
      </Header>
      <input
        type="file"
        accept={imageAcceptString}
        id="file-input"
        className="hidden"
        ref={fileInputRef}
        multiple
        onChange={(event) =>
          handleFileUpload(
            collection.id,
            null,
            Array.from(event.target?.files || []),
            fileInputRef,
          )
        }
      />
      <ContextMenu>
        <ContextMenuTrigger
          className={cn(
            'h-full min-h-[50dvh]',
            isEmpty &&
              'grid cursor-pointer place-items-center rounded-md bg-muted/30 ring-2 ring-border/70 ring-offset-2',
            draggedOver === 'root' &&
              'rounded-md ring-2 ring-primary ring-offset-0',
          )}
          onDrop={handleDrop}
          onDragLeave={() => {
            setDraggedOver(null)
          }}
          onDragOver={handleDragOver}
          onClick={() => {
            if (isEmpty) {
              fileInputRef.current?.click()
            }
          }}
        >
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <PiPhotoImageArrowUpSolid className="size-10 opacity-20" />
              <p className="text-sm opacity-35">
                Drag and drop your first layer here
              </p>
            </div>
          ) : (
            <LayerFolderView
              collectionId={collection.id}
              tree={tree}
              folder={null}
              newFolder={newFolder}
              setNewFolder={setNewFolder}
              level={0}
              folderState={folderState}
              setFolderState={setFolderState}
              context={{
                locked,
                setLocked,
                draggedElement,
                setDraggedElement,
                draggedOver,
                setDraggedOver,
                selection,
                resetSelection,
                setSelection,
                setSelectionTo,
                addToSelection,
                addBetweenToSelection,
                removeFromSelection,
                moveSelection,
              }}
            />
          )}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => fileInputRef.current?.click()}
            className="flex gap-1.5"
          >
            <PiPhotoImageArrowUpStroke className="size-4" />
            Upload
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => setNewFolder(true)}
            className="flex gap-1.5"
          >
            <PiFolderPlusStroke className="size-4" />
            New Folder
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
