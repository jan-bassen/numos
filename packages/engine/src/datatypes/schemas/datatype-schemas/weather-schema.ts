import { z } from 'zod'
import { weatherCodes } from '@repo/engine/datatypes/constants/weather-codes'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema'
import { validateDefaultFormat } from '../refinements.js'

export const weatherSchema = z.enum(weatherCodes, {
  invalid_type_error: 'Must be a valid weather condition',
  required_error: 'Value is required',
})

export const fullWeatherSchema = z
  .object({
    type: z.literal('weather'),
    list: z.boolean(),
    default: valueSchemas('weather', weatherSchema).optional(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
