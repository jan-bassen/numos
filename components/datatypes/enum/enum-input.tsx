import { cn } from '@repo/ui/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from '@repo/ui/components/select'
import { type ChangeEvent, useMemo, useRef } from 'react'
import { Drag } from 'rete-react-plugin'
import SelectOptionItem from '../select-option'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function EnumInput({
  restrictions,
  value,
  className,
  onChange,
  placeholder,
  onBlur,
  locked,
  environment,
  valid,
  type,
  ...props
}: SingleDataTypeInputProps<'enum'>) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  function _onBlur(e: ChangeEvent<Element>) {
    if (!locked && onBlur) onBlur(e)
  }

  if (
    value.value &&
    !restrictions?.options?.find((option) => option.value === value.value)
  ) {
    onChange?.({ type: 'enum', value: null, format: 'single' })
  }

  const labelMap = useMemo(
    () =>
      restrictions?.options?.reduce(
        (acc: { [key: string]: string | undefined }, option) => {
          if (!option.value) return acc
          acc[option.value] = option.label
          return acc
        },
        {},
      ),
    [restrictions?.options],
  )

  return (
    <Select
      defaultValue={value.value || undefined}
      onValueChange={(e) => {
        if (locked) return
        onChange?.({ type: 'enum', value: e, format: 'single' })
      }}
      disabled={locked}
    >
      <SelectTrigger
        id={props.id}
        ref={environment === 'node' ? dragRef : undefined}
        className={cn(
          'w-full disabled:cursor-default',
          environment === 'node' && 'h-7 rounded-lg px-2 py-1 text-sm',
          valid === false
            ? environment === 'node'
              ? 'border-warning bg-warning/10'
              : 'border-destructive bg-destructive/10'
            : '',
          className,
          environment === 'simulation' &&
            'h-9 items-center rounded-lg py-1.5 text-sm',
        )}
        disabled={locked}
        onBlur={_onBlur}
      >
        <p className="w-full text-left">
          {value.value ? labelMap?.[value.value] || value.value : ''}
        </p>
      </SelectTrigger>
      <SelectContent className={cn('min-h-8')}>
        <SelectGroup>
          {restrictions?.options?.map((option, index) => {
            if (option.value === '' || !option.value) {
              return null
            }
            if (typeof option === 'string') {
              const _option = { value: option, label: option }
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <SelectOptionItem option={_option} key={option + index} />
              )
            }
            return (
              <SelectOptionItem
                option={option}
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={option.value + index}
              />
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
