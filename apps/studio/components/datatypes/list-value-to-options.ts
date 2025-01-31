import type { SelectOption } from '@/types/nodes.types'
import type { Value } from '@repo/shared/types/values'

export function valueToOptions(
  value: Value<'string', 'objectarray', true>,
): SelectOption[] {
  const res: SelectOption[] = value.value.map((v) => {
    return {
      id: v.id,
      value: v.value || '',
      label: v.value || '',
    }
  })
  return res
}

export function optionsToValue(
  options: SelectOption[],
): Value<'string', 'objectarray', true> {
  return {
    type: 'string',
    value: options.map((option) => ({
      id: option.id || crypto.randomUUID(),
      value: option.value,
      label: option.label,
    })),
    format: 'objectarray',
  } as Value<'string', 'objectarray', true>
}
