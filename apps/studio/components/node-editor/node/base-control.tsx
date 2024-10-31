'use client'

import type { Schemes } from '@/types/editor.types'
import { Drag, Presets, type ReactArea2D } from 'rete-react-plugin'
import GenericInput, {
  type GenericInputProps,
} from '@/components/datatypes/generic-input'
import type { Control as ControlClass } from '@/lib/rete/classes/control'
import { cn } from '@repo/ui/lib/utils'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { dataTypes } from '@/lib/supabase/constants/datatypes'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { useRef } from 'react'
import ListInput from '@/components/datatypes/list-input'
import type {
  RawSingleValue,
  Value,
  ValueMap,
  ValueType,
} from '@repo/engine/types/value-types'

declare type ControlProps = {
  className: string
  emit: (props: ReactArea2D<Schemes>) => void
  payload: ControlClass
}

const { RefControl } = Presets.classic

export function BaseControl(props: ControlProps) {
  return <RefControl {...props} name={props.className} />
}

export function ControlComponent(payload: { data: ControlClass }) {
  const control = payload.data
  const dragRef = useRef<HTMLSpanElement | null>(null)
  Drag.useNoDrag(dragRef)

  if (!control) return null

  if (control.value.format !== 'single') {
    return (
      <Popover>
        <span ref={dragRef}>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-full justify-start gap-3 px-3',
              !control.valid && 'border-warning bg-warning/10',
            )}
          >
            {dataTypes[control.value.type].icons.stroke({
              className: 'size-4',
            })}
            List ({control.value.value?.length || 0})
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            sideOffset={10}
            className="w-56 space-y-1 p-1 "
          >
            <ListInput
              value={control.value}
              onValueChange={(v: Value<ValueType, 'objectarray', true>) => {
                control.setValue(v)
              }}
              valid={control.valid}
              issues={control.getIssues()}
              settings={control.definition?.settings}
              placeholder={control.definition?.placeholder}
              locked={false}
              classNames={{
                container: 'w-full',
                item: 'w-full',
                button: 'h-7 ',
                handle: 'h-7',
                input: 'h-7',
              }}
            />
          </PopoverContent>
        </span>
      </Popover>
    )
  }
  const props = {
    datatype: control.value.type,
    valid: control.valid,
    value: payload.data.value.value,
    settings: control.settings,
    layertree:
      control.value.type === 'image'
        ? payload.data.node.context.editor.context.layers
        : undefined,
    onValueChange: (v: RawSingleValue | null) => {
      control.setValue({
        value: v,
        type: control.value.type,
        format: control.value.format,
      } as Value<ValueType, 'single' | 'objectarray', true>)
    },
  } as GenericInputProps
  return (
    <GenericInput
      {...props}
      environment="node"
      id={`control-${control.id}`}
      className={cn('peer', props.className)}
    />
  )
}
