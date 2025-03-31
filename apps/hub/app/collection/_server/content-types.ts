import { Err } from '@repo/shared/result/err'
import { Ok } from '@repo/shared/result/ok'
import { type Result, tryCatch } from '@repo/shared/result/try'
import { z } from 'zod'

const mediaTypesSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('image'),
    format: z.enum(['png', 'jpg', 'jpeg', 'gif', 'svg+xml']),
  }),
  z.object({
    type: z.literal('video'),
    format: z.enum(['mp4', 'webm']),
  }),
  z.object({
    type: z.literal('audio'),
    format: z.enum(['wav', 'mp3', 'mpeg', 'ogg']),
  }),
  z.object({
    type: z.literal('application'),
    format: z.enum(['json', 'xml', 'pdf', 'octet-stream']),
  }),
  z.object({
    type: z.literal('text'),
    format: z.enum(['plain', 'html', 'css', 'javascript']),
  }),
  z.object({
    type: z.literal('model'),
    format: z.enum(['glb', 'gltf']),
  }),
])

type MediaType = z.infer<typeof mediaTypesSchema>

type MediaSource = {
  source: 'alchemy' | 'pinata' | 'opensea'
  type: MediaType
  url: string
}

type ImageFormat = Extract<MediaType, { type: 'image' }>['format']
type VideoFormat = Extract<MediaType, { type: 'video' }>['format']
type AudioFormat = Extract<MediaType, { type: 'audio' }>['format']
type ApplicationFormat = Extract<MediaType, { type: 'application' }>['format']
type TextFormat = Extract<MediaType, { type: 'text' }>['format']
type ModelFormat = Extract<MediaType, { type: 'model' }>['format']

export function parseContentType(contentType: string): Result<MediaType> {
  return tryCatch(
    () => {
      if (contentType.includes('/')) {
        const [type, format] = contentType.split('/')
        const mediaType = mediaTypesSchema.parse({
          type: type,
          format: format,
        })
        return new Ok(mediaType)
      }
      if (
        contentType.includes('png') ||
        contentType.includes('jpg') ||
        contentType.includes('jpeg') ||
        contentType.includes('gif') ||
        contentType.includes('svg+xml')
      ) {
        const mediaType = mediaTypesSchema.parse({
          type: 'image',
          format: contentType,
        })
        return new Ok(mediaType)
      }
      if (contentType.includes('mp4') || contentType.includes('webm')) {
        const mediaType = mediaTypesSchema.parse({
          type: 'video',
          format: contentType,
        })
        return new Ok(mediaType)
      }
      if (
        contentType.includes('wav') ||
        contentType.includes('mp3') ||
        contentType.includes('mpeg') ||
        contentType.includes('ogg')
      ) {
        const mediaType = mediaTypesSchema.parse({
          type: 'audio',
          format: contentType,
        })
        return new Ok(mediaType)
      }
      if (
        contentType.includes('json') ||
        contentType.includes('xml') ||
        contentType.includes('pdf') ||
        contentType.includes('octet-stream')
      ) {
        const mediaType = mediaTypesSchema.parse({
          type: 'application',
          format: contentType,
        })
        return new Ok(mediaType)
      }
      return new Err(
        'Unsupported or incorrectly formatted content type',
        'parseContentType',
        {
          internalMessage: 'Could not parse content type',
          contentType: contentType,
        },
      )
    },
    (error) => {
      return new Err(
        'Unsupported or incorrectly formatted content type',
        'parseContentType',
        {
          internalMessage: 'Could not parse content type',
          contentType: contentType,
        },
      )
    },
  )
}
