import type {
  ContextStateConfig,
  ContextStateConfigEntry,
  SetState,
  Update,
  UpdateValueOptions,
  ValidateUpdate,
} from '@/types/state.types'
import type { AsyncDebouncedFunc } from '@repo/shared/utils/async-debounce'
import { useCallback, type SetStateAction } from 'react'

export function createSetState<T extends Record<string, any>>(
  id: string,
  config: ContextStateConfig<T>,
  setState: (value: SetStateAction<T>) => void,
  validatedUpdate: ValidateUpdate<T> | AsyncDebouncedFunc<ValidateUpdate<T>>,
): SetState<T> {
  return useCallback(
    async (value) => {
      const configEntry = config?.root

      let prevValue: any
      setState((prev) => {
        prevValue = prev
        return { ...prev, ...value }
      })

      const updateOptions: UpdateValueOptions<T> = {
        basePath: config.root.basePath,
        revalidate: configEntry?.revalidate,
        redirect: configEntry?.redirect,
        schemaParams: configEntry?.schemaParams,
      }

      const res = await validatedUpdate(id, value, updateOptions)

      if (!res) {
        setState(prevValue)
        return { ok: false, message: 'Failed to update' }
      }
      return res
    },
    [id, config, setState, validatedUpdate],
  )
}
