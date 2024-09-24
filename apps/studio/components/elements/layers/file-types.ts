import type { ImageType } from '@/types/database.types'

export type ImageTypeDefinition = {
  type: ImageType
  name: string
  extension: string
  mimeType: string
}

export const fileTypes: Record<ImageType, ImageTypeDefinition> = {
  jpg: {
    type: 'jpg',
    name: 'JPG',
    extension: 'jpg',
    mimeType: 'image/jpeg',
  },
  jpeg: {
    type: 'jpeg',
    name: 'JPEG',
    extension: 'jpeg',
    mimeType: 'image/jpeg',
  },
  png: {
    type: 'png',
    name: 'PNG',
    extension: 'png',
    mimeType: 'image/png',
  },
  gif: {
    type: 'gif',
    name: 'GIF',
    extension: 'gif',
    mimeType: 'image/gif',
  },
  'svg+xml': {
    type: 'svg+xml',
    name: 'SVG',
    extension: 'svg',
    mimeType: 'image/svg+xml',
  },
  webp: {
    type: 'webp',
    name: 'WEBP',
    extension: 'webp',
    mimeType: 'image/webp',
  },
  avif: {
    type: 'avif',
    name: 'AVIF',
    extension: 'avif',
    mimeType: 'image/avif',
  },
}

export const validImageTypes = Object.keys(fileTypes) as ImageType[]
export const validImageExtensions = Object.values(fileTypes).map(
  (type) => type.extension,
)
export const imageAcceptString = validImageTypes
  .map((type) => `${fileTypes[type].mimeType}`)
  .join(', ')
