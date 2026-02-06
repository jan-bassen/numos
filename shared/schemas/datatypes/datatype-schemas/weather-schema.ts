import { z } from 'zod'
import { weatherCodes } from '@repo/shared/constants/weather-codes'
import { valueSchemas } from '../value-schema'
import { validateDefaultFormat } from '../refinements'

export const weatherSchema = z.enum(weatherCodes, {
  error: (issue) => issue.input === undefined ? 'Value is required' : 'Must be a valid weather condition',
})

export const fullWeatherSchema = z
  .object({
    type: z.literal('weather'),
    list: z.boolean(),
    /* default: valueSchemas('weather', weatherSchema).optional(), */
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
