import type { TabOption } from './tab-option'
import { TabSelect, type TabSelectProps } from './tab-select'

function convertStringToBoolean(value: string) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'undefined') return undefined
  throw new Error(`Cannot convert ${value} to boolean.`)
}

function convertBooleanToString(value: boolean) {
  return value.toString()
}

function convertTabOptionsFromBoolean(
  option: TabOption<boolean>[],
): TabOption[] {
  return option.map((o) => {
    return {
      ...o,
      value: convertBooleanToString(o.value),
    }
  })
}

export function TabToggle({
  options,
  value,
  onChange,
  onBlur,
  locked = false,
  className,
}: Omit<TabSelectProps, 'value' | 'options' | 'onChange'> & {
  options: TabOption<boolean>[]
  value?: boolean
  onChange: (arg0?: boolean) => void
}) {
  const stringValue = value ? convertBooleanToString(value) : undefined
  const _onChange = (v: string) => onChange(convertStringToBoolean(v))
  return (
    <TabSelect
      options={convertTabOptionsFromBoolean(options)}
      value={stringValue}
      onChange={_onChange}
      onBlur={onBlur}
      locked={locked}
      className={className}
    />
  )
}
