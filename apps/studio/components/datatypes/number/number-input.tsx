import { Input } from '@repo/ui/components/ui/input'
import { cn } from '@repo/ui/lib/utils'
import { type FocusEvent, useRef } from 'react'
import { Drag } from 'rete-react-plugin'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function NumberInput({
  className,
  onBlur,
  onChange,
  locked,
  environment,
  valid,
  value,
  placeholder,
  ...props
}: SingleDataTypeInputProps<'number'>) {
  function _onBlur(e: FocusEvent<HTMLInputElement, Element>) {
    if (!locked && onBlur) onBlur(e)
  }
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  const _value =
    value.value === null || value.value === undefined ? '' : value.value
  return (
    <Input
      {...props}
      onChange={(e) => {
        if (locked) return
        // @ts-ignore TODO: Fix with parsing somehow?!
        onChange?.({ value: e.target.value, type: 'number', format: 'single' })
      }}
      disabled={locked}
      type="number"
      inputMode="numeric"
      className={cn(
        'w-full',
        valid === false
          ? environment === 'node'
            ? 'border-warning bg-warning/10'
            : 'border-destructive bg-destructive/10'
          : '',
        environment === 'node' &&
          'flex h-7 w-44 items-center rounded-lg px-2 text-sm',
        environment === 'simulation' &&
          'h-9 items-center rounded-lg py-1.5 text-sm',
        className,
      )}
      value={_value}
      onBlur={_onBlur}
      ref={environment === 'node' ? dragRef : undefined}
      placeholder={placeholder || '0'}
    />
  )
}
