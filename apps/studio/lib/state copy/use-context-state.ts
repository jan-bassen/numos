import type { Schema } from '@/types/schema.types'
import { useState } from 'react'
import type { ZodType } from 'zod'

import type {
  ContextStateConfig,
  NestedErrors,
  SetState,
  SetValue,
  Update,
  UpdateValue,
  Validate,
  ValidateUpdate,
  ValidateValue,
} from '@/types/state.types'
import { createSetValue } from './update-value/create-set-value'
import { createValidatedUpdateValue } from './update-value/create-validated-update-value'
import { createFunctionsObject } from './update-value/create-debounced-update-value'
import { createValidatedUpdate } from './update/create-validated-update'
import { createSetState } from './update/create-set-state'
import { asyncDebounce } from '@repo/shared/utils/async-debounce'
import { createGetError } from './validation/create-get-error'
import { createValidate } from './validation/create-validate'
import { createValidateValue } from './validation/create-validate-value'

export type ContextState<T extends Record<string, any>> = {
  state: T
  update: SetState<T>
  updateValue: SetValue<T, keyof T>
  validate: Validate<T>
  validateValue: ValidateValue<T>
  getError: (path: string) => string | undefined
}

export function useContextState<
  T extends Record<string, any>,
  S extends Schema<T, ((...args: any) => ZodType) | undefined>,
>(
  id: string,
  initialValue: T,
  update: Update<T>,
  updateValue: UpdateValue<T, keyof T>,
  schema: S,
  config: ContextStateConfig<T>,
): ContextState<T> {
  const [state, setState] = useState(initialValue)
  const [errors, setErrors] = useState<NestedErrors>({})

  // Update Value

  const validateValue = createValidateValue(schema, state, errors, setErrors)

  const validatedUpdateValue = createValidatedUpdateValue(
    updateValue,
    validateValue,
  )

  const updateFunctions = createFunctionsObject(validatedUpdateValue, config)

  const setValue: SetValue<T, keyof T> = createSetValue(
    id,
    config,
    setState,
    updateFunctions,
    validatedUpdateValue,
  )

  // Update

  const validate = createValidate(schema, state, errors, setErrors)

  const validatedUpdate = createValidatedUpdate(update, validate)

  const debouncedUpdate = config?.root?.debounce
    ? asyncDebounce<ValidateUpdate<T>>(validatedUpdate, config.root.debounce)
    : validatedUpdate

  const set = createSetState(id, config, setState, debouncedUpdate)

  const getError = createGetError(errors)

  return {
    state,
    update: set,
    updateValue: setValue,
    validate,
    validateValue,
    getError,
  }
}
