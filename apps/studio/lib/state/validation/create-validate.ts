import type { NestedErrors, Validate } from '@/types/state.types'
import { type SetStateAction, useCallback } from 'react'
import { ZodError, type ZodType } from 'zod'
import type { Result } from '@repo/shared/types/result'

export function validateStateSchema<T extends Record<string, any>>(
  value: Partial<T>,
  schema: ZodType,
): Result<Partial<T>, ZodError> {
  try {
    return { result: schema.parse(value) }
  } catch (e) {
    if (e instanceof ZodError) {
      return { error: e }
    }
    throw e
  }
}

// TODO: Handle Array Paths
export function createValidate<T extends Record<string, any>>(
  schema: ZodType,
  errors: NestedErrors,
  setErrors: (value: SetStateAction<NestedErrors>) => void,
): Validate<T> {
  return useCallback(
    async (value) => {
      try {
        return { result: await schema.parseAsync(value) }
      } catch (error) {
        if (error instanceof ZodError) {
          const newErrorState = errors

          const changedKeys = Object.keys(value)
          for (const key of changedKeys) {
            newErrorState[key] = undefined
          }

          if (error) {
            for (const issue of error.issues) {
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
        }
        throw error
      }
    },
    [schema, errors, setErrors],
  )
}
