import { SupabaseImage } from '@/components/supabase/supabase-image'
import {
  type StorageLocation,
  uploadFile,
} from '@/lib/supabase/storage/uploaders'
import { PiPencilEditSolid } from '@repo/ui/icons/pika'
import { cn, type ReturnInfo } from '@repo/ui/lib/utils'
import type { ImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type EditableImageProps = {
  location: StorageLocation
  updateFunction?: (fullPath: string) => Promise<ReturnInfo>
  initial?: string
} & Omit<ImageProps, 'src'>

export function EditableImage({
  location,
  updateFunction,
  initial,
  className,
  ...props
}: EditableImageProps) {
  const [image, setImage] = useState<string | undefined>(initial)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setImage(initial)
  }, [initial])

  return (
    <div className="size-fit p-0">
      <input
        type="file"
        accept="image/*"
        id="image-input"
        ref={imageInputRef}
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) return
          const newImage = await uploadFile(
            location,
            file,
            updateFunction,
            image,
          )
          if (newImage) setImage(newImage)
        }}
      />
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className="group grid place-items-center"
      >
        <>
          <PiPencilEditSolid className="z-10 col-span-1 col-start-1 row-span-1 row-start-1 size-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />

          <SupabaseImage
            {...props}
            src={image ? `${location.bucket}/${image}` : undefined}
            className={cn(
              'col-span-1 col-start-1 row-span-1 row-start-1 aspect-square rounded-md object-cover',
              className,
            )}
          />
        </>
      </button>
    </div>
  )
}
