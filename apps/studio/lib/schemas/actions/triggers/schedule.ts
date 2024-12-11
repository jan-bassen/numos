import cron from 'cron-validate'
import { z } from 'zod'

export const scheduleTriggerSchema = z.object({
  type: z.literal('schedule'),
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
