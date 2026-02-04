import { z } from 'zod'

export const basicMetadataSchema = z.object({
  image: z.string(),
  animation_url: z.string().nullable(),
  name: z.string(),
  description: z.string(),
  external_url: z.string().nullable(),
  attributes: z.array(
    z.object({
      trait_type: z.string(),
      value: z.string(),
    }),
  ),
  background_color: z.string().nullable(),
  youtube_url: z.string().nullable(),
})

export type BasicMetadata = z.infer<typeof basicMetadataSchema>

export const metadataSchema =
  basicMetadataSchema /* z.union([basicMetadataSchema]) */

export type Metadata = z.infer<typeof metadataSchema>
