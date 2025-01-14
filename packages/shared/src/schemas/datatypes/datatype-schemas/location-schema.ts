import { z } from 'zod'
import { numberSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/number-schema'
import { valueSchemas } from '../value-schema'
import { validateDefaultFormat } from '../refinements'

export const locationSchema = z.object({
  lat: numberSchema
    .min(-90, "Can't be less than -90")
    .max(90, "Can't be greater than 90"),
  lng: numberSchema
    .min(-180, "Can't be less than -180")
    .max(180, "Can't be greater than 180"),
})

export const fullLocationSchema = z
  .object({
    type: z.literal('location'),
    list: z.boolean(),
    default: valueSchemas('location', locationSchema).optional(),
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
