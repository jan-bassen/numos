import { z } from 'zod'

const id = z.never()
const updated_at = z.never()
const created_at = z.never()
const version = z.never()

export const name = z
  .string()
  .min(2, {
    message: 'Name must be at least 2 characters.',
  })
  .max(40, {
    message: 'Name must be less than 40 characters.',
  })
  .optional()

export const description = z
  .string()
  .max(300, {
    message: 'Description must be less than 300 characters.',
  })
  .nullable()

export const locked = z.boolean().default(false)

export const slug = z
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

export const sharedUpdateSchema = {
  id: id.optional(),
  updated_at: updated_at.optional(),
  created_at: created_at.optional(),
  version: version.optional(),
  name: name.optional(),
  description: description.optional(),
  locked: locked.optional(),
  slug: slug.optional(),
}

export const sharedSchema = {
  id,
  updated_at,
  created_at,
  version,
  name,
  description,
  locked,
  slug,
}
