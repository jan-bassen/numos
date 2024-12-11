import type { TriggerType } from '@/types/database.types'
import { z } from 'zod'
import cron from 'cron-validate'
import { valueTypeKeys } from '@repo/engine/datatypes/constants/value-types'

export const triggerSettingsSchema = (type: TriggerType) => {
  switch (type) {
    case 'api':
      return z.object({
        params: z
          .array(
            z.object({
              key: z
                .string({
                  required_error: 'Every parameter needs a key',
                  invalid_type_error: 'Key must be a string',
                })
                .min(1, 'Every parameter needs a key'),
              type: z.enum(valueTypeKeys),
              list: z.boolean().default(false),
            }),
          )
          .refine((params) => {
            const keys = params.map((param) => param.key)
            return new Set(keys).size === keys.length
          }, 'Every parameter needs a unique key'),
      })
    case 'interval':
      return z.object({
        start: z.coerce.number().optional(),
        end: z.coerce.number().optional(),
        interval: z.coerce
          .number({
            required_error:
              'To use an interval trigger, you need to set an interval',
            invalid_type_error: 'Interval must be a number',
          })
          .positive('Interval must be positive')
          .int('Interval must be a whole number'),
        unit: z.enum(['minutes', 'hours', 'days'], {
          required_error: 'You need to select a unit',
        }),
      })
    case 'schedule':
      return z.object({
        start: z.coerce.number().optional(),
        end: z.coerce.number().optional(),
        schedule: z
          .object({
            schedule: z
              .string({
                required_error:
                  'To use a schedule trigger, you need to set a schedule',
              })
              .optional()
              .refine(
                (schedule) => {
                  if (!schedule) return true
                  const cronResult = cron(schedule, {
                    preset: 'aws-cloud-watch',
                  })
                  if (cronResult.isValid()) {
                    return true
                  }
                  return false
                },
                {
                  message: "Schedule doesn't match cron format",
                },
              ),
            description: z.string().optional(),
          })
          .optional(),
      })
    case 'token':
      return z.object({
        event: z.enum(['mint', 'transfer', 'burn', 'approve'], {
          required_error:
            'To use token trigger, you need to specify the event type',
        }),
      })
    default:
      throw new Error('Invalid trigger type')
  }
}
