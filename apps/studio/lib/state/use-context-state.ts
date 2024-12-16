import { useState } from 'react'
import type { ZodType } from 'zod'
import type {
  ZodErrorInfo,
  NestedErrors,
  SetState,
  Update,
  UpdateOptions,
  Validate,
  ValidateUpdate,
} from '@/types/state.types'
import { createValidatedUpdate } from '@/lib/state/update/create-validated-update'
import { asyncDebounce } from '@repo/shared/utils/async-debounce'
import { createGetError } from '@/lib/state/validation/create-get-error'
import { createValidate } from '@/lib/state/validation/create-validate'

export type ContextState<
  T extends Record<string, any>,
  UT extends Record<string, any>,
> = {
  state: T
  update: SetState<UT>
  validate: Validate<UT>
  getError: (path: Array<string | number>) => NestedErrors | undefined
}

export function useContextState<
  T extends Record<string, any>,
  UT extends Record<string, any>,
>(
  initialValue: T,
  update: Update<UT>,
  schema: ZodType,
  config?: { debounce?: number },
): ContextState<T, UT> {
  const [state, setState] = useState(initialValue)
  const [errors, setErrors] = useState<NestedErrors>({})

  // Update

  const validate = createValidate<UT>(schema, errors, setErrors)

  const validatedUpdate = createValidatedUpdate(update, validate)

  const debouncedUpdate = asyncDebounce<ValidateUpdate<UT>>(
    validatedUpdate,
    config?.debounce || 1000,
  )

  const _update = async (value: UT, options?: UpdateOptions) => {
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
      return { ok: false, message: 'Resetting: Unable to update state' }
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
