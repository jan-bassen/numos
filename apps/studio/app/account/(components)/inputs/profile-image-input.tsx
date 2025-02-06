'use client'

import { useProfile } from '@/app/(providers)/profile-context'
import { EditableImage } from '@/components/supabase/editable-image'
import { updateProfileImage } from '@/lib/supabase/db/profile/update'
import { cn } from '@repo/ui/lib/utils'
import { toast } from 'sonner'

export function ProfileImageInput({
  width,
  height,
  className,
}: {
  width?: number
  height?: number
  className?: string
}) {
  const { profile, updateProfile } = useProfile()
  return (
    <EditableImage
      location={{ bucket: 'avatars', name: profile?.avatar_url }}
      uploadTo={{ bucket: 'avatars', name: profile?.id }}
      className={cn('size-20', className)}
      onUpload={async (location) => {
        const res = await updateProfile({
          avatar_url: location.name,
        })
        if (!res.ok) {
          toast.error(res.message)
        }
      }}
      alt="Profile Image"
      width={width || 80}
      height={height || 80}
    />
  )
}
