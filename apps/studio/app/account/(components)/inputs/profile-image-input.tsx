'use client'

import { useProfile } from '@/app/(providers)/profile-context'
import { EditableImage } from '@/components/supabase/editable-image'
import { updateProfileImage } from '@/lib/supabase/db/profile/update'
import { cn } from '@repo/ui/lib/utils'

export function ProfileImageInput({
  width,
  height,
  className,
}: {
  width?: number
  height?: number
  className?: string
}) {
  const { profile } = useProfile()
  async function updateImage(fullPath: string) {
    const res = await updateProfileImage(profile.id, fullPath)
    return res
  }
  return (
    <EditableImage
      location={{ bucket: 'avatars', name: crypto.randomUUID() }}
      initial={profile?.avatar_url || undefined}
      updateFunction={updateImage}
      className={cn('size-20', className)}
      alt="Profile Image"
      width={width || 80}
      height={height || 80}
    />
  )
}
