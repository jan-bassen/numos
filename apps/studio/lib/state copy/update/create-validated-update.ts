import type { Update, Validate, ValidateUpdate } from '@/types/state.types'
import { useCallback } from 'react'

export function createValidatedUpdate<T extends Record<string, any>>(
  update: Update<T>,
  validate: Validate<T>,
): ValidateUpdate<T> {
  return useCallback(
    async (id, value, options) => {
      const res = await validate(value, options)
      if (res.error) {
        return { ok: false, message: res.error }
      }
      if (!res.result) {
        return { ok: false, message: 'No changes' }
      }
      return update(id, res.result, options)
    },
    [update, validate],
  )
}
