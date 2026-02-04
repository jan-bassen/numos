import { z } from 'zod'
import {
  sharedInsertSchema,
  sharedSlug,
  sharedUpdateSchema,
} from '@/lib/schemas/shared'
import { valueTypeKeys } from '@repo/shared/constants/value-types'
import { fullDatatypeSchema } from '@repo/shared/schemas/datatypes/datatype-schema'

//TODO: Delete token_specific, type, list & settings
const token_specific = z.boolean().default(true)
const settings = z.null().optional()
const list = z.boolean().default(false)
const type = z.enum(valueTypeKeys, {
  required_error: 'You need to select a data type',
})
const slug = sharedSlug
/* .refine(
        async (slug) => {
          return await !isAttributeSlugTaken(slug)
        },
        { message: 'Identifier already taken' },
      ) */

export type Display = 'public' | 'hidden' | 'private'
const display = z.enum(['public', 'hidden', 'private']).default('public')

export const updateAttributeSchema = z.object({
  ...sharedUpdateSchema,
  slug: slug.optional(),
  display: display.optional(),
  value: fullDatatypeSchema.nullable().optional(),
  //------------
  token_specific: token_specific.optional(),
  list: list.optional(),
  type: type.optional(),
  settings,
})

export const newAttributeSchema = z.object({
  ...sharedInsertSchema,
  slug: slug,
  display: display.optional(),
  value: fullDatatypeSchema.nullable().optional(),
  //------------
  token_specific: token_specific.optional(),
  list: list,
  type: type,
  settings: settings.optional(),
})
