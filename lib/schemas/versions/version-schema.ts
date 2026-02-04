import { z } from 'zod'
import {
  sharedDescription,
  noId,
  sharedLocked,
  sharedName,
} from '@/lib/schemas/shared'

const externalLinkSchema = z.string().url().optional()

export const updateVersionSchema = z.object({
  id: noId,
  locked: sharedLocked,
  updated_at: z.never().optional(),
  created_at: z.never().optional(),
  //Metadata
  name: sharedName.optional(),
  description: sharedDescription.optional(),
  external_link: externalLinkSchema.optional(),
  image: z.string().uuid().optional(),
  banner: z.string().uuid().optional(),
  featured: z.string().uuid().optional(),
})
