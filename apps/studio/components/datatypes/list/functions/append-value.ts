import type { RawSingleValue } from '@repo/engine/types/value-types'
import type { ObjectValue } from '@repo/engine/types/value-types'
import type { Value } from '@repo/engine/types/value-types'
import type { RawValueTypesMap } from '@repo/engine/types/value-types'
import type { ValueType } from '@repo/engine/types/value-types'

export function getAppendValue<V extends Record<string, any>>(
  value: V[],
  onChange?: (value: V[]) => void,
) {
  return (v: V) => {
    if (!onChange) return
    const newValueArray: V[] = value ? [...value] : []
    newValueArray.push(v)
    onChange(newValueArray)
  }
}
