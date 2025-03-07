import { cn } from '@repo/ui/lib/utils'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import { useRef, useState } from 'react'
import { Drag } from 'rete-react-plugin'
import { PiFolderDefaultSolid, PiHomeDefaultSolid } from '@repo/ui/icons/pika'
import { Button } from '@repo/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import Breadcrumbs from '@/components/navigation/breadcrumbs'
import { BreadcrumbItem } from '@repo/ui/components/ui/breadcrumb'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function ImageInput({
  value,
  onChange,
  locked,
  className,
  uploads,
  environment,
  valid,
  type,
  ...props
}: SingleDataTypeInputProps<'image'>) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  const [open, setOpen] = useState<boolean>(false)
  const [openFolderId, setOpenFolderId] = useState<string | null>(null)

  if (!uploads) return null
  const openFolder = openFolderId ? uploads.folders[openFolderId] : undefined

  const folders = openFolder
    ? openFolder.subfolders
        .map((folderId) => uploads.folders[folderId])
        .filter((folder) => !!folder)
    : Object.values(uploads.folders).filter(
        (folder) => folder && folder.parent === null,
      )
  const uploadsArray = openFolder
    ? openFolder.uploads
        .map((uploadId) => uploads.uploads[uploadId])
        .filter((upload) => !!upload)
    : Object.values(uploads.uploads).filter((upload) => upload.folder === null)

  const breadcrumbs = [
    {
      type: 'element' as const,
      key: 'root',
      element: (
        <Button
          variant="ghost"
          className="gap-1.5 px-1.5"
          size={'sm'}
          onClick={() => setOpenFolderId(null)}
        >
          <PiHomeDefaultSolid className="size-3.5" />
          Home
        </Button>
      ),
    },
  ]

  if (openFolderId && openFolder) {
    for (const folderId of openFolder.path) {
      breadcrumbs.push({
        type: 'element' as const,
        key: folderId,
        element: (
          <BreadcrumbItem>
            <Button
              variant="ghost"
              className="gap-1.5 px-1.5"
              size={'sm'}
              onClick={() => setOpenFolderId(folderId)}
            >
              {openFolder.name}
            </Button>
          </BreadcrumbItem>
        ),
      })
    }
    breadcrumbs.push({
      type: 'element' as const,
      key: openFolderId,
      element: (
        <Button variant="ghost" className="gap-1.5 px-1.5" size={'sm'}>
          {openFolder.name}
        </Button>
      ),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        id={props.id}
        ref={environment === 'node' ? dragRef : undefined}
        disabled={locked}
        className={cn(
          'aspect-square size-20 cursor-pointer overflow-hidden rounded-lg border border-border bg-background',
          valid === false
            ? environment === 'node'
              ? 'border-warning bg-warning/10'
              : 'border-destructive bg-destructive/10'
            : '',
          environment === 'simulation' &&
            'h-9 items-center rounded-lg py-1.5 text-sm',
          environment === 'node' && 'translate-y-0.5 transform',
        )}
      >
        <SupabaseImage
          src={
            value.value ? uploads?.uploads[value.value]?.signedUrl : undefined
          }
          className={cn('size-full object-cover', className)}
          width={160}
          height={160}
          alt="Image"
          signed="true"
        />
      </DialogTrigger>
      <DialogContent
        className="flex min-h-96 max-w-[36rem] flex-col gap-2"
        aria-description="Dialog to select a layer"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle>Select Image</DialogTitle>
          <Breadcrumbs
            items={breadcrumbs}
            className="h-10 w-full gap-1 pb-2 sm:gap-1"
          />
        </DialogHeader>
        {folders.length === 0 && uploadsArray.length === 0 ? (
          <div className="grid h-[17.5rem] w-full place-items-center">
            <p className="font-medium text-muted-foreground text-sm">
              - Empty -
            </p>
          </div>
        ) : (
          <div className="grid h-fit w-fit grid-cols-5 gap-3">
            {folders.map((folder) => (
              <div key={folder.id} className="group flex flex-col gap-1">
                <Button
                  id={`folder-${folder.id}`}
                  variant="muted"
                  size="none"
                  className="size-24 rounded-md border border-border shadow-xs hover:text-secondary-foreground"
                  onClick={() => setOpenFolderId(folder.id)}
                >
                  <PiFolderDefaultSolid className="size-14 shrink-0" />
                </Button>
                <label
                  htmlFor={`folder-${folder.id}`}
                  className="line-clamp-1 h-4 max-w-24 cursor-pointer overflow-hidden text-ellipsis pl-1 text-muted-foreground text-xs group-hover:text-secondary-foreground"
                >
                  {folder.name}
                </label>
              </div>
            ))}
            {uploadsArray.map((upload) => (
              <div key={upload.id} className="group flex flex-col gap-1">
                <Button
                  id={`upload-${upload.id}`}
                  key={upload.id}
                  variant="outline"
                  size="none"
                  className={cn(
                    'size-fit rounded-md shadow-xs',
                    value.value === upload.id && 'bg-muted',
                  )}
                  onClick={() => {
                    onChange?.({
                      type: 'image',
                      value: upload.id,
                      format: 'single',
                    })
                    setOpen(false)
                  }}
                >
                  <SupabaseImage
                    src={upload.signedUrl}
                    alt={upload.name || 'Unnamed Upload'}
                    className="size-24 shrink-0 rounded-md object-cover"
                    width={192}
                    height={192}
                    signed="true"
                  />
                </Button>
                <label
                  htmlFor={`upload-${upload.id}`}
                  className="line-clamp-1 h-4 max-w-24 cursor-pointer overflow-hidden text-ellipsis pl-1 text-muted-foreground text-xs group-hover:text-secondary-foreground"
                >
                  {upload.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
