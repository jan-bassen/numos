import { Input } from '@repo/ui/components/ui/input'
import { PiFolderPlusSolid } from '@/lib/icons'
import { insertFolder } from '@/lib/supabase/db/layers'
import type { InsertFolder } from '@/types/database.types'
import { use, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { childrenOffset } from './tree'

export default function NewFolderListItem({
  collectionId,
  parentId,
  setNewFolder,
  level,
}: {
  collectionId: string
  parentId: string | null
  setNewFolder: (value: boolean) => void
  level: number
}) {
  const [name, setName] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => {
      nameInputRef.current?.select()
    }, 200)
  }, [])

  const handleNewFolder = async () => {
    if (name === '') {
      setNewFolder(false)
      return
    }
    const folder: InsertFolder = {
      collection: collectionId,
      name: name,
      parent: parentId,
    }
    const res = await insertFolder(folder)
    if (!res.ok) {
      toast.error(res.message)
      return
    }
    setName('')
    setNewFolder(false)
  }

  return (
    <div
      className="flex w-full items-center gap-2 rounded-md bg-secondary p-1.5 text-secondary-foreground"
      style={{
        paddingLeft: `${1.625 + level * childrenOffset}rem`,
      }}
    >
      <PiFolderPlusSolid className="size-8" />
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New Folder"
        className="h-8 w-full border-0 bg-transparent p-2 text-secondary-foreground ring-offset-transparent focus-visible:ring-transparent"
        ref={nameInputRef}
        onBlur={handleNewFolder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleNewFolder()
          }
        }}
        autoFocus
      />
    </div>
  )
}
