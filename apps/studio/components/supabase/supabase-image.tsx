'use client'

import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image, { type ImageLoaderProps, type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'
import { getBlob } from '@/lib/data/store'

/** Passthrough loader — images are local object/data URLs, nothing to optimize. */
function passthroughLoader({ src }: ImageLoaderProps) {
  return src
}

function isDirectUrl(src: string) {
  return (
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('/')
  )
}

/**
 * Resolves an image `src` to something renderable. Direct URLs (object/data/http
 * or a local public path) pass through untouched. Anything else is treated as a
 * stored-blob key (e.g. an upload id or `bucket/.../id` path) and resolved to an
 * object URL from IndexedDB.
 */
function useResolvedSrc(src?: string | StaticImport | null) {
  const [resolved, setResolved] = useState<string | StaticImport | null>(null)

  useEffect(() => {
    if (!src) {
      setResolved(null)
      return
    }
    if (typeof src !== 'string') {
      setResolved(src)
      return
    }
    if (isDirectUrl(src)) {
      setResolved(src)
      return
    }

    const key = src.split('/').filter(Boolean).pop()
    if (!key || key === 'null' || key === 'undefined') {
      setResolved(null)
      return
    }

    let objectUrl: string | null = null
    let active = true
    getBlob(key)
      .then((blob) => {
        if (!active) return
        if (blob) {
          objectUrl = URL.createObjectURL(blob)
          setResolved(objectUrl)
        } else {
          setResolved(null)
        }
      })
      .catch(() => {
        if (active) setResolved(null)
      })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  return resolved
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
  const resolved = useResolvedSrc(src)

  if (!resolved || showPlaceholder) {
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

  return (
    <Image
      {...props}
      key={typeof resolved === 'string' ? resolved : undefined}
      alt={props.alt || 'Image'}
      src={resolved}
      loader={typeof resolved === 'string' ? passthroughLoader : undefined}
      unoptimized
      onError={() => setShowPlaceholder(true)}
    />
  )
}
