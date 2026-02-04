'use client'

import { EditableImage } from '@/components/supabase/editable-image'
import { cn } from '@repo/ui/lib/utils'
import { toast } from 'sonner'
import { useCollection } from '@/app/collections/[collection]/collection-context'

export function CollectionImage({ className }: { className?: string }) {
  const { collection, updateCollection } = useCollection()
  return (
    <EditableImage
      location={{
        bucket: 'collection-images',
        path: `${collection.id}/`,
        name: collection.image,
      }}
      uploadTo={{
        bucket: 'collection-images',
        path: `${collection.id}/`,
        name: crypto.randomUUID(),
      }}
      onUpload={async (location) => {
        const res = await updateCollection({
          image: location.name,
        })
        if (!res.ok) {
          toast.error(res.message)
        }
      }}
      onUploadError={(error) => {
        toast.error(error)
      }}
      options={{
        placeholder: true,
      }}
      alt="Collection Image"
      className={cn('size-20', className)}
      locked={collection.settings_locked}
      width={80}
      height={80}
    />
  )
}
