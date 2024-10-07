'use client'

import { PiPencilEditSolid } from '@repo/ui/icons/pika'
import { SupabaseImage } from '@/lib/supabase/storage/supabaseImage'
import { uploadAvatar } from '@/lib/supabase/storage/uploaders'
import { cn } from '@repo/ui/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

export function Avatar({
  internal,
  src,
  size,
  className,
}: {
  internal: boolean
  src: string
  size: number
  className?: string
}) {
  return (
    <>
      {internal ? (
        <SupabaseImage
          src={`avatars/${src}`}
          alt="User Avatar"
          width={size}
          height={size}
          className={className}
        />
      ) : (
        <Image
          src={src || '/images/placeholder.png'}
          alt="User Avatar"
          width={size}
          height={size}
          className={className}
        />
      )}
    </>
  )
}
