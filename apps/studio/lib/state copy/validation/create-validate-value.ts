import type { Schema, SchemaEntry } from '@/types/schema.types'
import type {
  NestedErrors,
  UpdateValue,
  ValidateUpdateValue,
  ValidateValue,
} from '@/types/state.types'
import type { Result } from '@repo/shared/types/result'
import { type SetStateAction, useCallback } from 'react'
import { ZodError, type ZodType } from 'zod'

function validateSchema<
  T extends Record<string, any>,
  S extends SchemaEntry<(...args: any) => ZodType>,
  K extends keyof T,
>(
  value: any,
  schema: S,
  params?: Array<T[keyof T]>,
): Result<T[K], ZodError | string> {
  try {
    if (typeof schema === 'function') {
      const _params = params || []
      const zodSchema = schema(..._params)
      return { result: zodSchema.parse(value) }
    }
    return { result: schema.parse(value) }
  } catch (e) {
    if (e instanceof ZodError) {
      return { error: e }
    }
    throw e
  }
}

export function createValidateValue<
  T extends Record<string, any>,
  S extends Schema<T, ((...args: any) => ZodType) | undefined>,
>(
  schema: S,
  state: T,
  errors: NestedErrors,
  setErrors: (value: SetStateAction<NestedErrors>) => void,
): ValidateValue<T> {
  return useCallback(
    async (key, value, options) => {
      const schemaEntry = schema[key]
      if (!schemaEntry) return { error: 'No schema found for key' }
      const schemaParamKeys = options?.schemaParams || []
      const schemaParams = schemaParamKeys.map((key) => state[key])

      const { error: validationError, result: validatedValue } = validateSchema(
        value,
        schemaEntry,
        schemaParams,
      )

      if (validationError) {
        const errorMessage =
          validationError instanceof ZodError
            ? validationError.issues.map((issue) => issue.message).join(', ')
            : validationError

        setErrors((prev) => {
          if (prev[key as string] !== errorMessage) {
            return { ...prev, [key]: errorMessage }
          }
          return prev
        })
        return {
          error: `Not saved: ${errorMessage}`,
        }
      }
      if (errors[key as string] !== undefined) {
        setErrors((prev) => {
          return { ...prev, [key]: undefined }
        })
      }
      return { result: validatedValue }
    },
    [schema, state, errors, setErrors],
  )
}
