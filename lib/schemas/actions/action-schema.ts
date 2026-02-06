import { z } from 'zod'
import {
  sharedInsertSchema,
  sharedSlug,
  sharedUpdateSchema,
} from '@/lib/schemas/shared'
import { apiTriggerSchema } from '@/lib/schemas/actions/triggers/api'
import { tokenTriggerSchema } from '@/lib/schemas/actions/triggers/token'
import { zDiscriminatedUnion } from '@repo/shared/schemas/discriminated-union'
import { timeTriggerSchema } from '@/lib/schemas/actions/triggers/time'

export type ActionTrigger = z.infer<typeof triggerSchema>

export const triggerSchema = zDiscriminatedUnion(
  'type',
  [apiTriggerSchema, timeTriggerSchema, tokenTriggerSchema],
)

export const newActionSchema = z.object({
  ...sharedInsertSchema,
  slug: sharedSlug,
  trigger: triggerSchema.optional(),
})

export const updateActionSchema = z.object({
  ...sharedUpdateSchema,
  slug: sharedSlug.optional(),
  trigger: triggerSchema.optional(),
})
