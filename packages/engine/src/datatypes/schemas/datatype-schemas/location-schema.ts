import { z } from 'zod'
import { numberSchema } from '@repo/engine/datatypes/schemas/datatype-schemas/number-schema'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema'
import { validateDefaultFormat } from '@repo/engine/datatypes/schemas/refinements'

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
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
