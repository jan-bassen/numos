import { z } from 'zod'

export const intervalTriggerSchema = z.object({
  type: z.literal('interval'),
  start: z.coerce.number().optional(),
  end: z.coerce.number().optional(),
  interval: z.coerce
    .number({
      required_error: 'To use an interval trigger, you need to set an interval',
      invalid_type_error: 'Interval must be a number',
    })
    .positive('Interval must be positive')
    .int('Interval must be a whole number'),
  unit: z.enum(['minutes', 'hours', 'days'], {
    required_error: 'You need to select a unit',
  }),
})
