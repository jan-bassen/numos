'use client'

import { useProfile } from '@/app/(providers)/profile-context'
import { SupabaseImage } from '@/components/supabase/supabase-image'
import type { ImageProps } from 'next/image'

type AvatarProps = Omit<ImageProps, 'src' | 'alt'> & {
  placeholder?: boolean
}

export function Avatar(props: AvatarProps) {
  const {
    profile: { avatar_url },
  } = useProfile()

  return (
    <SupabaseImage {...props} src={`avatars/${avatar_url}`} alt="User Avatar" />
  )
}
