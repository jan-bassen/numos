import { Input } from '@repo/ui/components/ui/input'
import { cn } from '@repo/ui/lib/utils'
import { type FocusEvent, forwardRef, useRef } from 'react'
import type { AddressInputProps } from '../generic-input'
import { Drag } from 'rete-react-plugin'

export default function AddressInput({
  className,
  onValueChange,
  onChange,
  onBlur,
  locked,
  environment,
  valid,
  id,
  value,
  ...props
}: AddressInputProps) {
  function _onBlur(e: FocusEvent<HTMLInputElement, Element>) {
    if (!locked && onBlur) onBlur(e)
  }
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  return (
    <Input
      value={value || ''}
      id={id}
      disabled={locked}
      inputMode="text"
      className={cn(
        'w-full',
        environment === 'node' &&
          'flex h-7 items-center rounded-lg px-2 text-sm',
        valid === false && 'border-warning bg-warning/10',
        className,
      )}
      onChange={(e) => {
        if (onValueChange) onValueChange(e.target.value)
        onChange?.(e)
      }}
      onBlur={_onBlur}
      ref={environment === 'node' ? dragRef : undefined}
      {...props}
    />
  )
}
