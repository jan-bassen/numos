import type { TriggerType } from '@/types/database.types'
import { z } from 'zod'
import cron from 'cron-validate'
import type { ValueMap, ValueTypeMap } from '@repo/engine/types/value-types'
import type {
  ActionTrigger,
  ParameterInfo,
  ParameterState,
} from '@/types/actions.types'
import { datatypeSchema } from '@repo/engine/datatypes/schemas'
import { valueTypeKeys } from '@repo/engine/datatypes/constants/value-types'

export const newActionSchema = z.object({
  trigger: z.enum(['api', 'interval', 'token', 'schedule'], {
    required_error: 'You need to select a trigger type',
  }),
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(40, {
      message: 'Name must be less than 40 characters.',
    })
    .optional(),
  slug: z
    .string({
      required_error:
        'We need a unique identifier to differentiate this action from others',
    })
    .max(40, {
      message: 'Identifier must be less than 40 characters.',
    })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: 'Identifier must be alphanumeric, dashes, or underscores.',
    }),
  description: z
    .string()
    .max(300, {
      message: 'Description must be less than 300 characters.',
    })
    .optional(),
})

export const actionSchema = (type: TriggerType) =>
  z.object({
    name: z
      .string()
      .min(2, {
        message: 'Name must be at least 2 characters.',
      })
      .max(40, {
        message: 'Name must be less than 40 characters.',
      })
      .optional(),
    description: z
      .string()
      .max(300, {
        message: 'Description must be less than 300 characters.',
      })
      .optional(),
    trigger: triggerSchema(type),
  })

export const triggerSchema = (type: TriggerType) => {
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

export function getDefaultTriggerSettings(type: TriggerType): ActionTrigger {
  switch (type) {
    case 'api':
      return {
        type: 'api',
        settings: {
          params: [],
        },
      }
    case 'interval':
      return {
        type: 'interval',
        settings: {
          interval: 7,
          unit: 'days',
        },
      }
    case 'token':
      return {
        type: 'token',
        settings: {
          event: 'mint',
        },
      }
    case 'schedule':
      return {
        type: 'schedule',
        settings: {
          schedule: '0 0 * * *',
        },
      }
    default:
      throw new Error('Invalid trigger type')
  }
}

export const getParametersSchema = (
  params: ParameterInfo[],
  optional?: boolean,
) =>
  z.object(
    Object.fromEntries(
      params.map((param) => [
        param.key,
        param.list
          ? optional
            ? z.array(
                z.object({
                  value: datatypeSchema[param.type].nullable().optional(),
                }),
              )
            : z.array(z.object({ value: datatypeSchema[param.type] }))
          : optional
            ? datatypeSchema[param.type].nullable().optional()
            : datatypeSchema[param.type],
      ]),
    ),
  )

export function getDefaultValuesFromParameters(
  parameters: ParameterInfo[],
  state?: ParameterState,
) {
  const defaultValues = parameters.reduce((acc, parameter) => {
    const value = state?.[parameter.key]
    if (value) {
      acc[parameter.key] = value
    }
    return acc
  }, {} as ValueMap)
  return defaultValues
}

export const getParameterTypes = (
  parameters: ParameterInfo[],
): ValueTypeMap => {
  return parameters.reduce((accumulator, parameter) => {
    accumulator[parameter.key] = { type: parameter.type, list: parameter.list }
    return accumulator
  }, {} as ValueTypeMap)
}
