import type {
  UpdateValue,
  ValidateUpdateValue,
  ValidateValue,
} from '@/types/state.types'
import { useCallback } from 'react'

export function createValidatedUpdateValue<T extends Record<string, any>>(
  updateValue: UpdateValue<T, keyof T>,
  validateValue: ValidateValue<T>,
): ValidateUpdateValue<T> {
  return useCallback(
    async (id, key, value, options) => {
      const res = await validateValue(key, value, options)
      if (res.error) {
        return { ok: false, message: res.error }
      }
      return updateValue(id, key, res.result, options)
    },
    [updateValue, validateValue],
  )
}
