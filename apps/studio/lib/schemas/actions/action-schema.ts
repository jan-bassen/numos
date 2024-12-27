import { z } from 'zod'
import {
  sharedInsertSchema,
  sharedSlug,
  sharedUpdateSchema,
} from '@/lib/schemas/shared'
import { apiTriggerSchema } from '@/lib/schemas/actions/triggers/api'
import { intervalTriggerSchema } from '@/lib/schemas/actions/triggers/interval'
import { tokenTriggerSchema } from '@/lib/schemas/actions/triggers/token'
import { scheduleTriggerSchema } from '@/lib/schemas/actions/triggers/schedule'
import { zDiscriminatedUnion } from '@repo/engine/datatypes/schemas/discriminated-union'

export const triggerSchema = zDiscriminatedUnion('type', [
  apiTriggerSchema,
  intervalTriggerSchema,
  tokenTriggerSchema,
  scheduleTriggerSchema,
])

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
