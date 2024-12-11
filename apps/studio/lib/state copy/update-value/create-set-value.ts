import type {
  ContextStateConfig,
  ContextStateConfigEntry,
  SetValue,
  UpdateValue,
  UpdateValueOptions,
  ValidateUpdateValue,
} from '@/types/state.types'
import type { AsyncDebouncedFunc } from '@repo/shared/utils/async-debounce'
import { isEqual } from 'lodash'
import { useCallback, type SetStateAction } from 'react'

export function createSetValue<T extends Record<string, any>>(
  id: string,
  config: ContextStateConfig<T>,
  setState: (value: SetStateAction<T>) => void,
  debouncedFunctionsRecord: Record<
    keyof T,
    AsyncDebouncedFunc<ValidateUpdateValue<T>>
  >,
  validateUpdateValue: ValidateUpdateValue<T>,
): SetValue<T, keyof T> {
  return useCallback(
    async (key, value) => {
      const configEntry = config?.[key]
      let prevValue: any
      setState((prev) => {
        prevValue = prev[key]
        if (!isEqual(prevValue, value)) {
          return { ...prev, [key]: value }
        }
        return prev
      })

      const updateOptions: UpdateValueOptions = {
        basePath: config.root.basePath,
        revalidate: configEntry?.revalidate,
        redirect: configEntry?.redirect,
      }

      const res = debouncedFunctionsRecord[key]
        ? await debouncedFunctionsRecord[key](id, key, value, updateOptions)
        : await validateUpdateValue(id, key, value, updateOptions)

      if (!res) {
        setState((prev) => {
          return { ...prev, [key]: prevValue }
        })
        return { ok: false, message: 'Failed to update' }
      }
      return res
    },
    [config, setState, debouncedFunctionsRecord, id, validateUpdateValue],
  )
}
