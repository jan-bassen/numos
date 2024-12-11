import type {
  ContextStateConfigEntry,
  ValidateUpdateValue,
} from '@/types/state.types'
import {
  asyncDebounce,
  type AsyncDebouncedFunc,
} from '@repo/shared/utils/async-debounce'
import { useMemo } from 'react'

export function createFunctionsObject<T extends Record<string, any>>(
  validatedUpdateValue: ValidateUpdateValue<T>,
  config?: Partial<Record<keyof T, ContextStateConfigEntry>>,
): Record<
  keyof T,
  ValidateUpdateValue<T> | AsyncDebouncedFunc<ValidateUpdateValue<T>>
> {
  return useMemo(() => {
    Object.entries(config || {}).reduce(
      (acc, [key, value]) => {
        if (value?.debounce) {
          acc[key as keyof T] = asyncDebounce<ValidateUpdateValue<T>>(
            validatedUpdateValue,
            value.debounce,
          )
        } else {
          acc[key as keyof T] = validatedUpdateValue
        }
        return acc
      },
      {} as Record<keyof T, AsyncDebouncedFunc<ValidateUpdateValue<T>>>,
    )
    return {} as Record<keyof T, AsyncDebouncedFunc<ValidateUpdateValue<T>>>
  }, [config, validatedUpdateValue])
}
