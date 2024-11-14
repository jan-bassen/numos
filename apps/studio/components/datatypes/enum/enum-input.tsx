import type { EnumInputProps } from '../generic-input'
import { cn } from '@repo/ui/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import {
  type ChangeEvent,
  forwardRef,
  use,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Drag } from 'rete-react-plugin'
import SelectOptionItem from '../select-option'

export default function EnumInput({
  settings,
  staticoptions,
  value,
  className,
  onValueChange,
  onChange,
  placeholder,
  onBlur,
  locked,
  environment,
  valid,
  defaultValue,
  ...props
}: EnumInputProps) {
  function _onBlur(e: ChangeEvent<Element>) {
    if (!locked && onBlur) onBlur(e)
  }

  const options =
    settings && 'options' in settings ? settings.options : staticoptions || []

  if (value && !options?.find((option) => option.value === value)) {
    onValueChange?.(null)
    onChange?.(null)
  }

  const labelMap = options?.reduce((acc: { [key: string]: string }, option) => {
    acc[option.value] = option.label || option.value
    return acc
  }, {})

  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  return (
    <Select
      defaultValue={value || undefined}
      onValueChange={(e) => {
        if (locked) return
        onValueChange?.(e)
        onChange?.(e)
      }}
      disabled={locked}
    >
      <div ref={environment === 'node' ? dragRef : undefined}>
        <SelectTrigger
          id={props.id}
          className={cn(
            'w-full disabled:cursor-default',
            environment === 'node' && 'h-7 rounded-lg px-2 py-1 text-sm',
            valid === false && 'border-warning bg-warning/10',
            className,
          )}
          disabled={locked}
          onBlur={_onBlur}
        >
          <p className="w-full text-left">
            {value && labelMap?.[value] ? labelMap[value] : placeholder}
          </p>
        </SelectTrigger>
        <SelectContent className={cn('min-h-8')}>
          <SelectGroup>
            {options?.map((option, index) => {
              if (option.value === '' || option.value === undefined) {
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
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <SelectOptionItem option={option} key={option.value + index} />
              )
            })}
          </SelectGroup>
        </SelectContent>
      </div>
    </Select>
  )
}
