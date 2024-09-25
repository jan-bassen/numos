import { datatypeSchema } from '@/components/datatypes/schemas'
import {
  PiCalendarFilledStroke,
  PiLinkChainHorizontalStroke,
  PiNftBoltMintStroke,
  PiTimerDefaultStroke,
} from '@repo/ui/icons/pika'
import { valueDataTypeKeys } from '@/lib/supabase/constants/datatypes'
import type {
  DataTypeMap,
  IntervalUnit,
  NotatedDataTypeValue,
  TriggerType,
  ValueDataType,
} from '@/types/database.types'
import type { SelectOptions } from '@/types/nodes.types'
import { Interval } from 'luxon'
import { z } from 'zod'
import cron from 'cron-validate'

export const actionTypes: Record<
  TriggerType,
  { name: string; icon: (props: JSX.IntrinsicElements['svg']) => JSX.Element }
> = {
  api: {
    name: 'API',
    icon: PiLinkChainHorizontalStroke,
  },
  interval: {
    name: 'Interval',
    icon: PiTimerDefaultStroke,
  },
  schedule: {
    name: 'Schedule',
    icon: PiCalendarFilledStroke,
  },
  token: {
    name: 'Token',
    icon: PiNftBoltMintStroke,
  },
}

export const triggerOptions: SelectOptions = [
  {
    value: 'api',
    label: 'API',
    subtext: 'Call from your app',
    description:
      'Trigger via an API call from your app, website or other service',
    icons: { stroke: PiLinkChainHorizontalStroke },
  },
  {
    value: 'interval',
    label: 'Interval',
    subtext: 'Every X minutes',
    description: 'Trigger automatically at a set interval, e.g. every 3 days',
    icons: { stroke: PiTimerDefaultStroke },
  },
  {
    value: 'schedule',
    label: 'Schedule',
    subtext: 'Custom Schedule',
    icons: { stroke: PiCalendarFilledStroke },
    description:
      'Trigger automatically at a set (cron) schedule, e.g. every first day of the month',
  },
  {
    value: 'token',
    label: 'Token',
    subtext: 'On mint, transfer, ...',
    description:
      'Trigger automatically when a token event occurs, e.g. when a token is minted',
    icons: { stroke: PiNftBoltMintStroke },
  },
]

export type TokenEvent = 'mint' | 'transfer' | 'burn' | 'approve'

export const tokenEventOptions: SelectOptions = [
  { value: 'mint', label: 'On Mint' },
  { value: 'transfer', label: 'On Transfer' },
  { value: 'burn', label: 'On Burn' },
  { value: 'approve', label: 'On Approval' },
]

export const intervalUnitOptions: SelectOptions = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
]

export type ActionTrigger =
  | {
      type: 'api'
      settings: {
        params: {
          type: ValueDataType
          list: boolean
          key: string
        }[]
      }
    }
  | {
      type: 'interval'
      settings: {
        start?: number
        end?: number
        interval: number
        unit: IntervalUnit
      }
    }
  | {
      type: 'schedule'
      settings: {
        start?: number
        end?: number
        schedule: string
      }
    }
  | {
      type: 'token'
      settings: {
        event: TokenEvent
      }
    }

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
              type: z.enum(valueDataTypeKeys),
              list: z.boolean(),
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

export type Parameter = { type: ValueDataType; key: string; list: boolean }
export type ParameterState = Record<string, NotatedDataTypeValue>

export const getParametersSchema = (params: Parameter[], optional?: boolean) =>
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
  parameters: Parameter[],
  state?: ParameterState,
) {
  const defaultValues = parameters.reduce(
    (acc, parameter) => {
      const value = state?.[parameter.key]
      if (value) {
        acc[parameter.key] = value
      }
      return acc
    },
    {} as Record<string, NotatedDataTypeValue>,
  )
  return defaultValues
}

export const getParameterTypes = (parameters: Parameter[]): DataTypeMap => {
  return parameters.reduce((accumulator, parameter) => {
    accumulator[parameter.key] = { type: parameter.type, list: parameter.list }
    return accumulator
  }, {} as DataTypeMap)
}
