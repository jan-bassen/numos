import { cn } from '@repo/ui/lib/utils'
import { type FocusEvent, useRef } from 'react'
import { Textarea } from '@repo/ui/components/textarea'
import { Drag } from 'rete-react-plugin'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function StringInput({
  className,
  onChange,
  onBlur,
  locked,
  environment,
  valid,
  value,
  placeholder,
  ...props
}: SingleDataTypeInputProps<'string'>) {
  function _onBlur(e: FocusEvent<HTMLTextAreaElement, Element>) {
    if (!locked && onBlur) onBlur(e)
  }
  const dragRef = useRef<HTMLTextAreaElement>(null)
  Drag.useNoDrag(dragRef)
  return (
    <Textarea
      value={value.value || ''}
      rows={1}
      disabled={locked}
      className={cn(
        '!min-h-0 scrollbar-none h-10 w-full',
        locked && 'resize-none',
        environment === 'node' &&
          'flex h-7 w-44 items-center rounded-lg px-2 py-1 text-sm',
        environment === 'list' && 'items-center pl-2',
        environment === 'simulation' &&
          'h-9 items-center rounded-lg py-1.5 text-sm',
        valid === false
          ? environment === 'node'
            ? 'border-warning bg-warning/10'
            : 'border-destructive bg-destructive/10'
          : '',
        className,
      )}
      onBlur={_onBlur}
      onChange={(e) => {
        if (locked) return
        onChange?.({ value: e.target.value, type: 'string', format: 'single' })
      }}
      ref={environment === 'node' ? dragRef : undefined}
      placeholder={placeholder || 'Text'}
      {...props}
    />
  )
}
