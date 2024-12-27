import cron from 'cron-validate'
import { z } from 'zod'

export const scheduleTriggerSchema = z.object({
  type: z.literal('schedule'),
  settings: z
    .object({
      start: z.coerce
        .number()
        .min(new Date().getTime(), 'Start can not be in the past')
        .optional(),
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
    .refine((data) => {
      if (data.start && data.end && data.start > data.end) {
        return false
      }
      return true
    }, 'Start can not be after end'),
})
