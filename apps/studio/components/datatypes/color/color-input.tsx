'use client'

import { RgbaColorPicker } from 'react-colorful'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { type FocusEvent, useRef } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { Drag } from 'rete-react-plugin'
import { colorSchema } from '@repo/engine/datatypes/schemas'
import type { Color } from '@repo/engine/types/value-types'
import { Button } from '@repo/ui/components/ui/button'
import { PiRefreshStroke } from '@repo/ui/icons/pika'
import type { SingleDataTypeInputProps } from '../single-datatype-input'
import { toast } from 'sonner'

export function ColorInput({
  value,
  onChange,
  onBlur,
  locked,
  className,
  environment,
  valid,
  ...props
}: SingleDataTypeInputProps<'color'>) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  function _onBlur(e: FocusEvent<HTMLInputElement>) {
    if (!locked && onBlur) onBlur(e)
  }
  let color: Color | null = null
  try {
    color =
      colorSchema
        .nullable()
        .optional()
        .parse(value.value || null) || null
  } catch {
    console.log(value)
    toast.error('invalid color')
  }

  return (
    <Popover>
      <PopoverTrigger
        ref={environment === 'node' ? dragRef : undefined}
        id={props.id}
        disabled={locked}
        style={{
          backgroundColor: color
            ? `rgba(${color.r},${color.g},${color.b},${color.a})`
            : '',
        }}
        className={cn(
          'flex h-10 w-full min-w-36 items-center justify-center rounded-lg border border-border bg-background text-sm',
          environment === 'node' &&
            '!font-normal flex h-7 w-full rounded-lg px-2 outline-0',
          valid === false
            ? environment === 'node'
              ? 'border-warning bg-warning/10'
              : 'border-destructive bg-destructive/10'
            : '',
          className,
        )}
      >
        {color ? (
          <p className="w-fit font-light text-sm text-white mix-blend-difference">
            {`${color.r}, ${color.g}, ${color.b}, ${color.a}`}
          </p>
        ) : (
          <p className="w-fit text-sm">Select Color</p>
        )}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={10}
        className="relative w-fit rounded-lg border-none bg-transparent p-0"
      >
        <RgbaColorPicker
          color={color || undefined}
          onChange={(c) => {
            if (locked) return
            onChange?.({ value: c, type: 'color', format: 'single' })
          }}
          onBlur={_onBlur}
          {...props}
        />
        <Button
          size="iconSmall"
          variant={'outline'}
          className="absolute top-2 right-2"
          onClick={() => {
            onChange?.({ value: null, type: 'color', format: 'single' })
          }}
        >
          <PiRefreshStroke className="size-4" />
        </Button>
      </PopoverContent>
    </Popover>
  )
}
