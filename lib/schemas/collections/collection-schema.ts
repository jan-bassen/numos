import { z } from 'zod'
import { noId } from '@/lib/schemas/shared'
import { isCollectionSlugTaken } from '@/lib/supabase/db/collections'

export const updateSlug = z
  .string({
    required_error:
      'We need a unique identifier to differentiate this attribute',
  })
  .max(40, {
    message: 'Identifier must be less than 40 characters.',
  })
  .regex(/^[a-zA-Z0-9-_]+$/, {
    message:
      'Identifiers can only contain letters, numbers, dashes, or underscores.',
  })
  .refine(
    async (slug) => {
      const isTaken = await isCollectionSlugTaken(slug)
      return !isTaken
    },
    { message: 'Identifier already taken' },
  )

export const updateCollectionSchema = z.object({
  slug: updateSlug.optional(),
  account: z.never().optional(),
  editable_version: z.never().optional(),
  image: z.string().uuid().optional(),
  id: noId,
  updated_at: z.never().optional(),
  created_at: z.never().optional(),
})
