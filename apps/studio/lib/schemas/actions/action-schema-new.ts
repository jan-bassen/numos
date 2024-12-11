import type { Action, TriggerType } from '@/types/database.types'
import { z } from 'zod'
import type { Schema } from '@/types/schema.types'
import { sharedSchema, sharedUpdateSchema } from '../shared'
import { triggerSettingsSchema } from './trigger-settings-schema'

type TriggerSettingsSchemaFunction = (type: TriggerType) => z.ZodType

export type ActionSchema = Schema<Action, TriggerSettingsSchemaFunction>

const trigger_type = z.enum(['api', 'interval', 'token', 'schedule'], {
  required_error: 'You need to select a trigger type',
})

export const updateActionSchema = (type: TriggerType) =>
  z.object({
    trigger_type,
    trigger: triggerSettingsSchema(type),
    ...sharedUpdateSchema,
  })

export const actionSchema: ActionSchema = {
  root: updateActionSchema,
  trigger: triggerSettingsSchema,
  ...sharedSchema,
}

export const triggerSchema = z.object({})

export const update = z.object({
  ...sharedUpdateSchema,
  trigger: triggerSchema,
})
