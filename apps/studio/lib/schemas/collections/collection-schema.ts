import { z } from 'zod'
import { sharedName, sharedDescription, noId, sharedLocked } from '../shared'
import { isCollectionSlugTaken } from '@/lib/supabase/db/collections'

const symbolSchema = z.string().max(10, {
  message: 'Symbol must be less than 10 characters.',
})

const externalLinkSchema = z.string().url().optional()

const maxSupplySchema = z.coerce
  .number()
  .int()
  .min(-1, { message: 'Must be positive' })
  .max(100000, {
    message:
      "We're only supporting up to 100.000 Tokens per collection for now. Contact us if you need more.",
  })

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
  settings_locked: sharedLocked,
  name: sharedName.optional(),
  slug: updateSlug.optional(),
  description: sharedDescription.optional(),
  symbol: symbolSchema.optional(),
  external_link: externalLinkSchema.optional(),
  max_supply: maxSupplySchema.optional(),
  account: z.never().optional(),
  editable_version: z.never().optional(),
  id: noId,
  updated_at: z.never().optional(),
  created_at: z.never().optional(),
  image: z.never().optional(),
  banner: z.never().optional(),
})
