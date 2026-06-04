'use client'

import type { Collection, UploadsTree } from '@/types/database.types'
import { type DragEvent, useEffect, useRef, useState } from 'react'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import { Button, buttonVariants } from '@repo/ui/components/button'
import {
  PiFolderPlusStroke,
  PiPhotoImageArrowUpSolid,
  PiPhotoImageArrowUpStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { handleFileUpload } from '@/app/collections/[collection]/uploads/(functions)/upload'
import UploadFolderView from './upload-folder-view'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/context-menu'
import { useHotkeys } from 'react-hotkeys-hook'
import { imageAcceptString } from '@/app/collections/[collection]/uploads/(functions)/file-types'
import { moveUploadsAndFolders } from '@/lib/data/uploads'
import { toast } from 'sonner'
import Main from '@/components/page/main'
import { Page } from '@/components/page/page'

// TODO: Clean up

export const childrenOffset = 1.2 // rem

export type TreeElement = {
  type: 'folder' | 'upload'
  id: string
  path: string[]
}
export type TreeSelection = { folder: TreeElement[]; upload: TreeElement[] }

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
  /* deleteSelection: () => void */
}
export type FolderState = {
  [key: string]: string[]
}

export default function UploadsTreeView({
  collection,
  tree,
}: { collection: Collection; tree: UploadsTree }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [locked, setLocked] = useState(false)
  const [newFolder, setNewFolder] = useState(false)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [draggedElement, setDraggedElement] = useState<TreeElement | null>(null)

  const isEmpty =
    Object.keys(tree.uploads).length === 0 &&
    Object.keys(tree.folders).length === 0

  const [folderState, setFolderState] = useState<FolderState>({})

  useEffect(() => {
    setFolderState(
      JSON.parse(localStorage.getItem(`folder-state-${collection.id}`) || '{}'),
    )
  }, [collection.id])

  const [selection, setSelection] = useState<TreeSelection>({
    folder: [],
    upload: [],
  })

  useEffect(() => {
    localStorage.setItem(
      `folder-state-${collection.id}`,
      JSON.stringify(folderState),
    )
  }, [folderState, collection.id])

  const version = collection.editable_version
  if (!version) return null

  const resetSelection = () => {
    setSelection({ folder: [], upload: [] })
  }

  const setSelectionTo = (element: TreeElement) => {
    if (element.type === 'folder') {
      setSelection({ folder: [element], upload: [] })
    } else {
      setSelection({ folder: [], upload: [element] })
    }
  }

  const addToSelection = (element: TreeElement) => {
    const isAlreadySelected =
      element.type === 'folder'
        ? selection.folder.some((item) => item.id === element.id)
        : selection.upload.some((item) => item.id === element.id)
    if (isAlreadySelected) return
    if (element.type === 'folder') {
      setSelection((prev) => ({
        ...prev,
        folder: [...prev.folder, element],
      }))
    } else {
      setSelection({
        ...selection,
        upload: [...selection.upload, element],
      })
    }
  }

  const addBetweenToSelection = (/* element: TreeElement*/) => {
    //TODO: Implement
    console.error('addBetweenToSelection not implemented')

    /*     const openFolders = Object.values(folderState).flat()
    const visibleSelection = selection.folder
      .concat(selection.upload)
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
        upload: prev.upload.filter((el) => el.id !== element.id),
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
    const filteredUploads = selection.upload.filter((item) => {
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

    const promise = moveUploadsAndFolders(
      filteredUploads.map((upload) => upload.id),
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

  // TODO: Doesnt work yet because selection gets cleared too quickly
  /* const deleteSelection = async () => {
    if (locked) return
    setLocked(true)
    const selectedLayers = selection.layer.map((item) => item.id)
    const selectedFolders = selection.folder.map((item) => item.id)
    const layerPromise = deleteLayers(selectedLayers)
    const folderPromise = deleteFolders(selectedFolders)
    const promise = Promise.all([layerPromise, folderPromise])
    toast.promise(promise, {
      loading: 'Deleting...',
      success: () => {
        setLocked(false)
        resetSelection()
        return 'Deleted'
      },
      error: (error) => error.message,
    })
  } */

  useHotkeys('esc', () => {
    resetSelection()
  })

  const directChildren = {
    folder: Object.entries(tree.folders)
      .filter(([key, folder]) => folder.parent === null)
      .map(([key, folder]) => key),
    upload: Object.entries(tree.uploads)
      .filter(([key, upload]) => upload.folder === null)
      .map(([key, upload]) => key),
  }

  const isDirectChild = () => {
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
      if (!collection.editable_version) throw new Error('No version')
      const files = Array.from(e.dataTransfer?.items || [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file) => file !== null)
      handleFileUpload(collection.editable_version, null, files, null)
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
    <Page>
      <Header
        back={{
          href: `/collections/${collection.slug}`,
          label: collection.name ?? 'Collection',
        }}
      >
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Uploads</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
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
          </HeaderActions>
        </HeaderContent>
      </Header>
      <Main className="p-4">
        <input
          type="file"
          accept={imageAcceptString}
          id="file-input"
          className="hidden"
          ref={fileInputRef}
          multiple
          onChange={(event) => {
            if (!collection.editable_version) throw new Error('No version')
            handleFileUpload(
              collection.editable_version,
              null,
              Array.from(event.target?.files || []),
              fileInputRef,
            )
          }}
        />
        <ContextMenu>
          <ContextMenuTrigger
            className={cn(
              'h-full',
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
                  Drag and drop your first upload here
                </p>
              </div>
            ) : (
              <UploadFolderView
                version={version}
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
                  /* deleteSelection, */
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
      </Main>
    </Page>
  )
}
