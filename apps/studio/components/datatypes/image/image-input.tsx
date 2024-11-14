import { cn } from '@repo/ui/lib/utils'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import type { ImageInputProps } from '../generic-input'
import { useRef, useState } from 'react'
import { Drag } from 'rete-react-plugin'
import {
  PiFolderDefaultSolid,
  PiHomeDefaultSolid,
  PiPhotoImagePlusStroke,
} from '@repo/ui/icons/pika'
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
import Link from 'next/link'

export function ImageInput({
  value,
  onValueChange,
  onChange,
  locked,
  className,
  layertree,
  environment,
  valid,
  ...props
}: ImageInputProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [openFolderId, setOpenFolderId] = useState<string | null>(null)

  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  if (!layertree) return null
  const openFolder = openFolderId ? layertree.folders[openFolderId] : undefined

  const folders = openFolder
    ? openFolder.subfolders
        .map((folderId) => layertree.folders[folderId])
        .filter((folder) => !!folder)
    : Object.values(layertree.folders).filter(
        (folder) => folder && folder.parent === null,
      )
  const layers = openFolder
    ? openFolder.layers
        .map((layerId) => layertree.layers[layerId])
        .filter((layer) => !!layer)
    : Object.values(layertree.layers).filter((layer) => layer.folder === null)

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
      <span ref={environment === 'node' ? dragRef : undefined}>
        <DialogTrigger
          id={props.id}
          disabled={locked}
          className={cn(
            'aspect-square size-20 cursor-pointer overflow-hidden rounded-lg border border-border bg-background',
            valid === false && 'border-warning bg-warning/10',
            environment === 'node' && 'translate-y-0.5 transform',
          )}
        >
          <SupabaseImage
            src={value ? layertree?.layers[value]?.signedUrl : undefined}
            className={cn('size-full', className)}
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
            <DialogTitle>Select Layer</DialogTitle>
            <Breadcrumbs
              items={breadcrumbs}
              className="h-10 w-full gap-1 pb-2 sm:gap-1"
            />
          </DialogHeader>
          {folders.length === 0 && layers.length === 0 ? (
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
                    className="size-24 rounded-md border border-border shadow-sm hover:text-secondary-foreground"
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
              {layers.map((layer) => (
                <div key={layer.id} className="group flex flex-col gap-1">
                  <Button
                    id={`layer-${layer.id}`}
                    key={layer.id}
                    variant="outline"
                    size="none"
                    className={cn(
                      'size-fit rounded-md shadow-sm',
                      value === layer.id && 'bg-muted',
                    )}
                    onClick={() => {
                      onChange?.(layer.id)
                      onValueChange?.(layer.id)
                      setOpen(false)
                    }}
                  >
                    <SupabaseImage
                      src={layer.signedUrl}
                      alt={layer.name || 'Unnamed Layer'}
                      className="size-24 shrink-0 rounded-md"
                      width={192}
                      height={192}
                      signed="true"
                    />
                  </Button>
                  <label
                    htmlFor={`layer-${layer.id}`}
                    className="line-clamp-1 h-4 max-w-24 cursor-pointer overflow-hidden text-ellipsis pl-1 text-muted-foreground text-xs group-hover:text-secondary-foreground"
                  >
                    {layer.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </span>
    </Dialog>
  )
}
