import type { TabOption } from './tab-option'
import { TabSelect, type TabSelectProps } from './tab-select'

function convertStringToBoolean(value: string) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'undefined') return undefined
  throw new Error(`Cannot convert ${value} to boolean.`)
}

function convertBooleanToString(value: boolean) {
  return value ? 'true' : 'false'
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

type TabToggleProps = Omit<TabSelectProps, 'value' | 'options' | 'onChange'> & {
  options: TabOption<boolean>[]
  value?: boolean
  onChange: (value?: boolean) => void
}

export function TabToggle({
  options,
  value,
  onChange,
  ...props
}: TabToggleProps) {
  const stringValue =
    value !== undefined && value !== null
      ? convertBooleanToString(value)
      : undefined
  const _onChange = (v: string) => onChange(convertStringToBoolean(v))
  return (
    <TabSelect
      {...props}
      options={convertTabOptionsFromBoolean(options)}
      value={stringValue}
      onValueChange={_onChange}
    />
  )
}
