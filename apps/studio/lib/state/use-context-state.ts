import { useState } from 'react'
import type { ZodType } from 'zod'
import type {
  NestedErrors,
  SetState,
  Update,
  UpdateOptions,
  Validate,
  ValidateUpdate,
} from '@/types/state.types'
import { createValidatedUpdate } from './update/create-validated-update'
import { asyncDebounce } from '@repo/shared/utils/async-debounce'
import { createGetError } from './validation/create-get-error'
import { createValidate } from './validation/create-validate'

export type ContextState<T extends Record<string, any>> = {
  state: T
  update: SetState<T>
  validate: Validate<T>
  getError: (path: string) => string | undefined
}

export function useContextState<T extends Record<string, any>>(
  initialValue: T,
  update: Update<T>,
  schema: ZodType,
  config?: { debounce?: number },
): ContextState<T> {
  const [state, setState] = useState(initialValue)
  const [errors, setErrors] = useState<NestedErrors>({})

  // Update

  const validate = createValidate<T>(schema, errors, setErrors)

  const validatedUpdate = createValidatedUpdate(update, validate)

  const debouncedUpdate = asyncDebounce<ValidateUpdate<T>>(
    validatedUpdate,
    config?.debounce || 1000,
  )

  const _update = async (value: Partial<T>, options?: UpdateOptions) => {
    const prev = state
    try {
      setState((prev) => {
        return { ...prev, ...value }
      })
      if (!state.id) return { ok: false, message: 'No id specified' }
      const res = await debouncedUpdate(state.id, value, options)
      return res
    } catch (e) {
      setState(prev)
      return { ok: false, message: 'Unable to update state' }
    }
  }

  const getError = createGetError(errors)

  return {
    state,
    update: _update,
    validate,
    getError,
  }
}
