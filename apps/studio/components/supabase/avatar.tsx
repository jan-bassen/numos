'use client'

import { useProfile } from '@/app/(providers)/profile-context'
import { useUser } from '@/app/(providers)/user-context'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import type { UserData } from '@/types/database.types'
import Image, { type ImageProps } from 'next/image'

type AvatarProps = Omit<ImageProps, 'src' | 'alt'>

export function Avatar(props: AvatarProps) {
  const {
    profile: { avatar_url },
  } = useProfile()
  const {
    user: { user_metadata },
  } = useUser()
  if (avatar_url) {
    return (
      <SupabaseImage
        {...props}
        src={`avatars/${avatar_url}`}
        alt="User Avatar"
      />
    )
  }
  if (user_metadata.avatar_url) {
    return <Image {...props} src={user_metadata.avatar_url} alt="User Avatar" />
  }
  return <Image {...props} src="/images/placeholder.png" alt="User Avatar" />
}
