'use client'

import { EditableImage } from '@/components/supabase/editable-image'
import { useCollection } from '../collection-context'
import { updateCollectionImage } from '@/lib/supabase/db/collections'
import { cn } from '@repo/ui/lib/utils'

export function CollectionImage({ className }: { className?: string }) {
  const {
    collection: { id, image, settings_locked },
  } = useCollection()
  return (
    <EditableImage
      location={{
        bucket: 'collection-images',
        path: `${id}/`,
        name: crypto.randomUUID(),
      }}
      initial={image || undefined}
      updateFunction={async (fullPath) => {
        return await updateCollectionImage(id, fullPath)
      }}
      alt="Collection Image"
      className={cn('size-20', className)}
      locked={settings_locked}
      width={80}
      height={80}
    />
  )
}
