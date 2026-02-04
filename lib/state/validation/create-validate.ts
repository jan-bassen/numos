import type { NestedErrors, Validate } from '@/types/state.types'
import { type SetStateAction, useCallback } from 'react'
import { ZodError, type ZodType } from 'zod'
import type { Result } from '@repo/shared/types/result'
import { setValueAtPath } from '@/lib/state/validation/traverse-object'

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
export function createValidate<UT extends Record<string, any>>(
  schema: ZodType,
  errors: NestedErrors,
  setErrors: (value: SetStateAction<NestedErrors>) => void,
): Validate<UT> {
  return useCallback(
    async (value) => {
      try {
        const changedKeys = Object.keys(value)
        const res = { result: await schema.parseAsync(value) }
        const newErrorState = { ...errors }
        for (const key of changedKeys) {
          newErrorState[key] = null
        }
        setErrors(newErrorState)
        return res
      } catch (error) {
        if (error instanceof ZodError) {
          console.log('error', error)
          let newErrorState = errors
          const changedKeys = Object.keys(value)
          for (const key of changedKeys) {
            newErrorState[key] = null
          }

          if (error) {
            for (const issue of error.issues) {
              const n = setValueAtPath(newErrorState, issue.path, {
                message: issue.message,
                code: issue.code,
              })
              newErrorState = n
            }
          }
          setErrors(newErrorState)
          return { error: 'Not saved due to invalid inputs' }
        }
        throw error
      }
    },
    [schema, errors, setErrors],
  )
}
