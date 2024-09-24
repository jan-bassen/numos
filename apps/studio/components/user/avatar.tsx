'use client'

import { PiPencilEditSolid, PiUserEditSolid } from '@/lib/icons'
import { createSupabaseClient } from '@/lib/supabase/client'
import { SupabaseImage } from '@/lib/supabase/storage/supabaseImage'
import { uploadAvatar } from '@/lib/supabase/storage/uploaders'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

export function EditableAvatar({
  internal,
  src,
  size,
  locked = false,
  className,
}: {
  internal: boolean
  src: string
  size: number
  locked: boolean
  className?: string
}) {
  const [avatar, setAvatar] = useState<string | null>(null)
  const { getRootProps, getInputProps, open } = useDropzone({
    disabled: locked,
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.svg', '.webp', '.avif'],
    },
    maxFiles: 1,
    onDropAccepted: async (files) => {
      if (!files[0]) return
      const newAvatar = await uploadAvatar(files[0])
      if (newAvatar) setAvatar(newAvatar)
    },
  })
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button
        type="button"
        onClick={open}
        className="group grid place-items-center"
        disabled={locked}
      >
        <>
          {!locked && (
            <PiPencilEditSolid className="z-10 col-span-1 col-start-1 row-span-1 row-start-1 size-6 pr-1 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          )}
          {internal || avatar ? (
            <SupabaseImage
              src={`avatars/${avatar || src}`}
              alt="User Avatar"
              width={size}
              height={size}
              className={cn(
                `col-span-1 col-start-1 row-span-1  row-start-1 mr-1 size-[${
                  size * 2
                }px] rounded-md`,
                className,
              )}
            />
          ) : (
            <Image
              src={src || '/images/placeholder.png'}
              alt="User Avatar"
              width={size}
              height={size}
              className={cn(
                `col-span-1 col-start-1 row-span-1  row-start-1 mr-1 size-[${
                  size * 2
                }px] rounded-md`,
                className,
              )}
            />
          )}
        </>
      </button>
    </div>
  )
}

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
