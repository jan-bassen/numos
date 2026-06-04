import type { UpdateVersion, Version } from '@/types/database.types'
import { createSafeUpdate } from '@/lib/data/create-safe-update'
import { updateVersionSchema } from '@/lib/schemas/versions/version-schema'
import { patch } from '@/lib/data/store'

export async function updateVersionBase(id: string, values: UpdateVersion) {
  const updated = await patch<Version>('versions', id, values)
  if (!updated) {
    return { ok: false, message: 'Version not found' }
  }
  return { ok: true, message: 'Version updated' }
}

export const updateVersion = createSafeUpdate<UpdateVersion>(
  updateVersionBase,
  updateVersionSchema,
)
