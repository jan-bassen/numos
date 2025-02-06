'use client'

import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image, { type ImageLoaderProps, type ImageProps } from 'next/image'
import { placeholderImage } from '@repo/shared/utils/placeholder-image'
import { useState } from 'react'

const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
if (!projectId) {
  throw new Error('Missing database service key environment variable')
}

/* async function privateSupabaseLoader(payload: ImagePayload) {
  const supabase = await createSupabaseClient()
  const bucketName = payload.src.split('/')[0]
  const imagePath = payload.src.split('/').slice(1).join('/')
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(imagePath)
  if (error) {
    throw new Error('Error with fetching image')
  }
  return URL.createObjectURL(data)
} */

export function publicSupabaseLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const url = new URL(
    `https://${projectId}.supabase.co/storage/v1/object/public/${src}`,
  )
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}

export function signedSupabaseLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const url = new URL(src)
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}

export function SupabaseImage({
  placeholder,
  signed,
  src,
  ...props
}: Omit<ImageProps, 'src' | 'placeholder'> & {
  src?: string | StaticImport | null
  signed?: 'true' | 'false'
  placeholder?: boolean
}) {
  const [showPlaceholder, setShowPlaceholder] = useState(false)

  if (!src || showPlaceholder) {
    if (!placeholder) {
      return null
    }
    return (
      <Image
        {...props}
        alt={props.alt || 'Image'}
        src={'/images/placeholder.png'}
      />
    )
  }

  if (signed === 'true') {
    return (
      <Image
        {...props}
        src={src}
        key={Date.now()}
        alt={props.alt || 'Image'}
        loader={signedSupabaseLoader}
        onError={() => setShowPlaceholder(true)}
      />
    )
  }
  return (
    <Image
      {...props}
      key={Date.now()}
      alt={props.alt || 'Image'}
      loader={publicSupabaseLoader}
      src={src}
      onError={() => setShowPlaceholder(true)}
    />
  )
}
