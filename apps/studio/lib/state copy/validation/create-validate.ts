import type { Schema, SchemaEntry } from '@/types/schema.types'
import type { NestedErrors, Validate } from '@/types/state.types'
import { type SetStateAction, useCallback } from 'react'
import { ZodError, type ZodType } from 'zod'
import type { Result } from '@repo/shared/types/result'

export function validateStateSchema<
  T extends Record<string, any>,
  S extends SchemaEntry<(...args: any) => ZodType>,
>(
  value: Partial<T>,
  schema: S,
  params?: Array<T[keyof T]>,
): Result<Partial<T>, ZodError> {
  try {
    if (typeof schema === 'function') {
      const _params = params || []
      const zodSchema = schema(..._params)
      return { result: zodSchema.parse(value) }
    }
    console.log(value)
    return { result: schema.parse(value) }
  } catch (e) {
    if (e instanceof ZodError) {
      return { error: e }
    }
    throw e
  }
}

export function createValidate<
  T extends Record<string, any>,
  S extends Schema<T, ((...args: any) => ZodType) | undefined>,
>(
  schema: S,
  state: T,
  errors: NestedErrors,
  setErrors: (value: SetStateAction<NestedErrors>) => void,
): Validate<T> {
  return useCallback(
    async (value, options) => {
      const schemaEntry = schema.root
      if (!schemaEntry) return { error: 'Schema not found' }
      const schemaParamKeys = options?.schemaParams || []
      const schemaParams = schemaParamKeys.map((key) => state[key as keyof T])

      const { error: validationError, result: validatedValue } =
        validateStateSchema(value, schemaEntry, schemaParams)
      const newErrorState = errors

      const changedKeys = Object.keys(value)
      for (const key of changedKeys) {
        newErrorState[key] = undefined
      }

      if (validationError) {
        for (const issue of validationError.issues) {
          let current = newErrorState

          issue.path.forEach((key, index) => {
            if (index === issue.path.length - 1) {
              current[key] = issue.message
            } else {
              if (
                typeof current[key] !== 'object' ||
                current[key] === undefined
              ) {
                current[key] = {}
              }
              current = current[key] as NestedErrors
            }
          })
        }

        setErrors(newErrorState)

        return {
          error: 'Not saved',
        }
      }
      setErrors(newErrorState)

      if (!validatedValue) {
        return {
          error: 'No changes',
        }
      }

      return { result: validatedValue }
    },
    [schema, state, errors, setErrors],
  )
}
