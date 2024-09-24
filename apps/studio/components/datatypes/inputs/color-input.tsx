import type { ColorInputProps } from '../generic-input'
import { RgbaColorPicker } from 'react-colorful'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { type FocusEvent, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Color } from '@/types/database.types'
import { Drag } from 'rete-react-plugin'
import { colorSchema } from '../schemas'

export default function ColorInput({
  value,
  onValueChange,
  onChange,
  onBlur,
  locked,
  className,
  environment,
  valid,
  ...props
}: ColorInputProps) {
  function _onBlur(e: FocusEvent<HTMLInputElement>) {
    if (!locked && onBlur) onBlur(e)
  }
  const color: Color | null =
    colorSchema
      .nullable()
      .optional()
      .parse(value || null) || null

  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  return (
    <Popover>
      <span ref={environment === 'node' ? dragRef : undefined}>
        <PopoverTrigger
          id={props.id}
          disabled={locked}
          style={{
            backgroundColor: color
              ? `rgba(${color.r},${color.g},${color.b},${color.a})`
              : 'transparent',
          }}
          className={cn(
            'flex h-10 min-w-30 items-center justify-center rounded-lg border border-border',
            environment === 'node' &&
              ' h-7 items-center rounded-lg px-2 outline-0',
            valid === false && 'border-warning bg-warning/10',
            className,
          )}
        >
          <p className="w-fit font-thin text-sm text-white mix-blend-difference">
            {color
              ? `${color.r}, ${color.g}, ${color.b}, ${color.a}`
              : 'Select Color'}
          </p>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={10}
          className="w-fit rounded-lg border-none bg-transparent p-0"
        >
          <RgbaColorPicker
            color={color || undefined}
            onChange={(c) => {
              if (locked) return
              onValueChange?.(c || undefined)
              onChange?.(c || undefined)
            }}
            onBlur={_onBlur}
            {...props}
          />
        </PopoverContent>
      </span>
    </Popover>
  )
}
