import { z } from 'zod'
import { weatherCodes } from '@repo/shared/constants/weather-codes'
import { valueSchemas } from '@repo/shared/schemas/datatypes/value-schema'
import { validateDefaultFormat } from '@repo/shared/schemas/datatypes/refinements'

export const weatherSchema = z.enum(weatherCodes, {
  invalid_type_error: 'Must be a valid weather condition',
  required_error: 'Value is required',
})

export const fullWeatherSchema = z
  .object({
    type: z.literal('weather'),
    list: z.boolean(),
    default: valueSchemas('weather', weatherSchema).optional(),
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
