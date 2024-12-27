import { z } from 'zod'

export const intervalTriggerSchema = z.object({
  type: z.literal('interval'),
  settings: z
    .object({
      start: z.coerce
        .number()
        .min(new Date().getTime(), 'Start can not be in the past')
        .optional(),
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
    .refine((data) => {
      if (data.start && data.end && data.start > data.end) {
        return false
      }
      return true
    }, 'Start can not be after end'),
})
