import { z } from 'zod'

const noId = z.never().optional()
const id = z.string().uuid().optional()

const updated_at = z.never().optional()
const created_at = z.never().optional()
const version = z.never().optional()

const name = z
  .string()
  .min(2, {
    message: 'Name must be at least 2 characters.',
  })
  .max(40, {
    message: 'Name must be less than 40 characters.',
  })
  .optional()
  .nullable()

const description = z
  .string()
  .max(300, {
    message: 'Description must be less than 300 characters.',
  })
  .optional()
  .nullable()

const locked = z.boolean().default(false)

export const sharedSlugSchema = z
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

//TODO: Make slug unique for schemas to verify individually
export const sharedUpdateSchema = {
  id: noId,
  updated_at: updated_at,
  created_at: created_at,
  version: version.optional(),
  name: name,
  description: description.optional(),
  locked: locked.optional(),
}

export const sharedInsertSchema = {
  id: id,
  version: version,
  name: name,
  description: description.optional(),
  locked: locked,
  updated_at: updated_at,
  created_at: created_at,
}
