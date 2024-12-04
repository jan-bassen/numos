import type { ReturnInfo } from '@repo/ui/lib/utils'
import { debounce } from 'lodash'
import { useState } from 'react'

type UpdateValue<S extends Record<string, any>, K extends keyof S = keyof S> = (
  id: string,
  key: K,
  value: S[K],
  options?: {
    revalidate?: boolean
  },
) => Promise<ReturnInfo>

type SetValue<S extends Record<string, any>, K extends keyof S> = (
  key: K,
  value: S[K],
) => Promise<ReturnInfo>

export function useContextState<T extends Record<string, any>>(
  id: string,
  initialValue: T,
  updateValue: UpdateValue<T, keyof T>,
  options?: {
    revalidate?: boolean
    debounce?: number
  },
): { state: T; setValue: SetValue<T, keyof T> } {
  const [state, setState] = useState(initialValue)
  const debouncedUpdateValue = debounce(updateValue, options?.debounce || 500)
  const setValue: SetValue<T, keyof T> = async (key, value) => {
    setState((prev) => {
      return { ...prev, [key]: value }
    })
    const res = options?.debounce
      ? debouncedUpdateValue(id, key, value, {
          revalidate: options?.revalidate,
        })
      : updateValue(id, key, value, { revalidate: options?.revalidate })
    if (!res) return { ok: false, message: 'Failed to update' }
    return { ok: true, message: 'Successfully updated' }
  }
  return {
    state,
    setValue,
  }
}
