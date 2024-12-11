import { Input } from '@repo/ui/components/ui/input'
import { cn } from '@repo/ui/lib/utils'
import { type FocusEvent, forwardRef, useRef } from 'react'
import { Drag } from 'rete-react-plugin'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function AddressInput({
  className,
  onChange,
  onBlur,
  locked,
  environment,
  valid,
  id,
  value,
  placeholder,
  ...props
}: SingleDataTypeInputProps<'address'>) {
  function _onBlur(e: FocusEvent<HTMLInputElement, Element>) {
    if (!locked && onBlur) onBlur(e)
  }
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  return (
    <Input
      value={value.value || ''}
      id={id}
      disabled={locked}
      inputMode="text"
      className={cn(
        'w-full',
        environment === 'node' &&
          'flex h-7 w-44 items-center rounded-lg px-2 text-sm',
        environment === 'node' && value && 'w-80',
        valid === false
          ? environment === 'node'
            ? 'border-warning bg-warning/10'
            : 'border-destructive bg-destructive/10'
          : '',
        className,
      )}
      onChange={(e) => {
        onChange?.({ value: e.target.value, type: 'address', format: 'single' })
      }}
      onBlur={_onBlur}
      ref={environment === 'node' ? dragRef : undefined}
      placeholder={placeholder || '0x...'}
      {...props}
    />
  )
}
