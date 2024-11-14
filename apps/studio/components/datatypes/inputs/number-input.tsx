import { Input } from '@repo/ui/components/ui/input'
import { cn } from '@repo/ui/lib/utils'
import { type FocusEvent, useRef } from 'react'
import type { NumberInputProps } from '../generic-input'
import { Drag } from 'rete-react-plugin'

export default function NumberInput({
  className,
  onBlur,
  onChange,
  onValueChange,
  locked,
  environment,
  valid,
  value,
  placeholder,
  ...props
}: NumberInputProps) {
  function _onBlur(e: FocusEvent<HTMLInputElement, Element>) {
    if (!locked && onBlur) onBlur(e)
  }
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  const _value = value === null || value === undefined ? '' : value
  return (
    <Input
      onChange={(e) => {
        if (locked) return
        onValueChange?.(e.target.value === '' ? null : e.target.value)
        onChange?.(e)
      }}
      disabled={locked}
      inputMode="numeric"
      className={cn(
        'w-full',
        valid === false && 'border-warning bg-warning/10',
        environment === 'node' &&
          'flex h-7 w-44 items-center rounded-lg px-2 text-sm',
        className,
      )}
      value={_value}
      onBlur={_onBlur}
      ref={environment === 'node' ? dragRef : undefined}
      placeholder={placeholder || '0'}
      {...props}
    />
  )
}
