'use client'

import { SupabaseImage } from '@/lib/supabase/storage/supabaseImage'
import type { UserData } from '@/types/database.types'
import Image, { type ImageProps } from 'next/image'

type AvatarProps = Omit<ImageProps, 'src' | 'alt'> & {
  user: UserData
}
export function Avatar({ user, ...props }: AvatarProps) {
  return (
    <>
      {user.internal_avatar ? (
        <SupabaseImage
          {...props}
          src={`avatars/${user.internal_avatar}`}
          alt="User Avatar"
        />
      ) : (
        <Image
          {...props}
          src={user.external_avatar || '/images/placeholder.png'}
          alt="User Avatar"
        />
      )}
    </>
  )
}
