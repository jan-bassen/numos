import type { Action, UpdateAction } from '@/types/database.types'
import { updateActionSchema } from '@/lib/schemas/actions/action-schema'
import { createSafeUpdate } from '@/lib/data/create-safe-update'
import { patch } from '@/lib/data/store'

export async function updateActionBase(id: string, values: UpdateAction) {
  const updated = await patch<Action>('actions', id, values)
  if (!updated) {
    return { ok: false, message: 'Action not found' }
  }
  return { ok: true, message: 'Action updated' }
}

export const updateAction = createSafeUpdate<UpdateAction>(
  updateActionBase,
  updateActionSchema,
)
