'use client'
import { useAuth } from '@payloadcms/ui'
import type { User } from '@/payload-types.ts'
import Image from 'next/image'

export default function Avatar() {
  const { user } = useAuth<User>()

  const src = user?.thumbnailURL
  if (!src) return null
  return (
    <Image
      src={src}
      alt="avatar"
      width={100}
      height={100}
      className="aspect-square size-10 rounded-full object-contain"
    />
  )
}
