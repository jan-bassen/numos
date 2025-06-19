import type { UploadsTree, ResolvedFolder } from '@/types/database.types'
import FolderListItem from './folder-list-item'
import UploadsListItem from './upload-list-item'
import NewFolderListItem from './new-folder-list-item'
import { Accordion } from '@repo/ui/components/accordion'
import type { FolderState, TreeContext } from './tree'
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react'

export default function UploadFolderView({
  version,
  tree,
  folder,
  newFolder,
  setNewFolder,
  folderState,
  setFolderState,
  level,
  context,
}: {
  version: string
  tree: UploadsTree
  folder: ResolvedFolder | null
  newFolder: boolean
  setNewFolder: (value: boolean) => void
  folderState: FolderState
  setFolderState: Dispatch<SetStateAction<FolderState>>
  level: number
  context: TreeContext
}) {
  const id = folder?.id || null

  const folders = folder
    ? folder.subfolders
    : Object.values(tree.folders)
        .filter((folder) => folder.parent === null)
        .map((folder) => folder.id)

  const uploads = folder
    ? folder.uploads
    : Object.values(tree.uploads)
        .filter((upload) => upload.folder === null)
        .map((upload) => upload.id)

  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!!folder || event.button !== 0) return
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.resetSelection()
      }
    },
    [context.resetSelection, folder],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <div ref={ref} className="space-y-0.5">
      {newFolder && (
        <NewFolderListItem
          version={version}
          parentId={id}
          setNewFolder={setNewFolder}
          level={level}
        />
      )}
      <Accordion
        value={folderState[id || 'root'] || []}
        onValueChange={(value) => {
          setFolderState((prev) => {
            return { ...prev, [id || 'root']: value }
          })
        }}
        type="multiple"
        className="space-y-0.5 overflow-visible"
      >
        {folders.map((folder, index) => (
          <FolderListItem
            key={tree.folders[folder]?.id}
            tree={tree}
            folderId={folder}
            level={level}
            context={context}
            folderState={folderState}
            setFolderState={setFolderState}
          />
        ))}
      </Accordion>
      {uploads.map((upload, index) => (
        <UploadsListItem
          key={tree.uploads[upload]?.id}
          tree={tree}
          uploadId={upload}
          level={level}
          context={context}
        />
      ))}
    </div>
  )
}
