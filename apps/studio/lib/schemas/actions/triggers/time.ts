import cron from 'cron-validate'
import { z } from 'zod'

export const intervalSchema = z.object({
  type: z.literal('interval'),
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

export const cronSchema = z.object({
  type: z.literal('cron'),
  schedule: z
    .string({
      required_error: 'To use a cron trigger, you need to set a cron schedule',
    })
    .optional()
    .refine((schedule) => {
      if (!schedule) return true
      const cronResult = cron(schedule, {
        preset: 'aws-cloud-watch',
      })
      return cronResult.isValid()
    }),
  description: z.string().optional(),
})

export const scheduleSchema = z.union([intervalSchema, cronSchema])

export const timeTriggerSchema = z.object({
  type: z.literal('time'),
  settings: z
    .object({
      start: z.coerce
        .number()
        .min(new Date().getTime(), 'Start can not be in the past')
        .optional(),
      end: z.coerce.number().optional(),
      schedule: scheduleSchema.optional(),
    })
    .refine((data) => {
      if (data.start && data.end && data.start > data.end) {
        return false
      }
      return true
    }, 'Start can not be after end'),
})

/*

const oldInterval = {
type: 'interval',
settings: {
    start: 1710508800000,
    end: 1710595200000,
    interval: 1,
    unit: 'minutes',
  } 
}

const newInterval = {
    type: 'time',
    settings: {
      start: 1710508800000,
      end: 1710595200000,
      schedule: {
        type: 'interval',
        interval: 1,
        unit: 'minutes',
      },
    },
  }

  const oldSchedule = {
    type: 'schedule',
    settings: {
      schedule: '0 0 * * *',
      description: 'Every day at midnight',
    },
  }

  const newSchedule = {
    type: 'time',
    settings: {
      start: 1710508800000,
      end: 1710595200000,
      schedule: {
        type: 'interval',
        interval: 1,
        unit: 'minutes',
      },
    },
  }


*/
