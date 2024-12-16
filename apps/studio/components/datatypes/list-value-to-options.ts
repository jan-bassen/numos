import type { SelectOption } from '@/types/nodes.types'
import type { Value } from '@repo/engine/types/value-types'

export function valueToOptions(
  value: Value<'enum', 'objectarray', true>,
): SelectOption[] {
  const res: SelectOption[] = value.value
    .map((v) => {
      if (!v.value) return null
      return {
        value: v.value,
        label: v.value,
      }
    })
    .filter((v) => v !== null)
  return res
}

export function optionsToValue(
  options: SelectOption[],
): Value<'enum', 'objectarray', true> {
  return {
    type: 'enum',
    value: options.map((option) => ({
      id: crypto.randomUUID(),
      value: option.value,
      label: option.label,
    })),
    format: 'objectarray',
  } as Value<'enum', 'objectarray', true>
}
