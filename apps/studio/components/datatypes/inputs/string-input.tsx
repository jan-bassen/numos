import { cn } from '@/lib/utils'
import { type FocusEvent, useRef } from 'react'
import { Textarea } from '@repo/ui/components/ui/textarea'
import type { StringInputProps } from '../generic-input'
import { Drag } from 'rete-react-plugin'

export default function StringInput({
  className,
  onValueChange,
  onChange,
  onBlur,
  locked,
  environment,
  valid,
  value,
  ...props
}: StringInputProps) {
  function _onBlur(e: FocusEvent<HTMLTextAreaElement, Element>) {
    if (!locked && onBlur) onBlur(e)
  }
  const dragRef = useRef<HTMLTextAreaElement>(null)
  Drag.useNoDrag(dragRef)
  return (
    <Textarea
      value={value || ''}
      rows={1}
      disabled={locked}
      className={cn(
        '!min-h-0 scrollbar-none h-10 w-full max-w-96',
        environment === 'node' &&
          'flex h-7 items-center rounded-lg px-2 py-1 text-sm',
        environment === 'list' && 'items-center py-1.5 pl-2',
        valid === false && 'border-warning bg-warning/10',
        className,
      )}
      onBlur={_onBlur}
      onChange={(e) => {
        if (locked) return
        onValueChange?.(e.target.value)
        onChange?.(e)
      }}
      ref={environment === 'node' ? dragRef : undefined}
      {...props}
    />
  )
}
