import type { Update, Validate, ValidateUpdate } from '@/types/state.types'
import { useCallback } from 'react'

export function createValidatedUpdate<UT extends Record<string, any>>(
  update: Update<UT>,
  validate: Validate<UT>,
): ValidateUpdate<UT> {
  return useCallback(
    async (id, value, options) => {
      const res = await validate(value)
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
