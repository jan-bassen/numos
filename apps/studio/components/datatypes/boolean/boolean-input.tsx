import { Switch } from '@repo/ui/components/ui/switch'
import { type FocusEvent, useRef } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { Drag } from 'rete-react-plugin'
import {
  PiCheckTickSquareStroke,
  PiCrossCrossSquare,
  PiSquareDotStroke,
} from '@repo/ui/icons/pika'
import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { Button } from '@repo/ui/components/ui/button'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function BooleanInput({
  value,
  className,
  onChange,
  onBlur,
  locked,
  environment,
  valid,
  type,
  ...props
}: SingleDataTypeInputProps<'boolean'>) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  function _onBlur(e: FocusEvent<HTMLButtonElement, Element>) {
    if (!locked && onBlur) onBlur(e)
  }

  function convertBooleanToString(value?: boolean | null) {
    return value === undefined || value === null
      ? 'undefined'
      : value.toString()
  }
  function convertStringToBoolean(value?: string) {
    if (value === 'true') return true
    if (value === 'false') return false
    if (value === 'undefined') return undefined
    throw new Error(`Cannot convert ${value} to boolean.`)
  }

  const setValue = (value: boolean | null) => {
    if (locked) return
    onChange?.({ type: 'boolean', value, format: 'single' })
  }

  if (environment === 'form') {
    return (
      <TabSelect
        value={convertBooleanToString(value.value)}
        options={[
          {
            value: 'undefined',
            subtext: 'No Default Value',
            label: 'Undefined',
            Icon: PiSquareDotStroke,
          },
          {
            value: 'true',
            label: 'Yes',
            subtext: 'Default is Yes',
            Icon: PiCheckTickSquareStroke,
          },
          {
            value: 'false',
            label: 'No',
            subtext: 'Default is No',
            Icon: PiCrossCrossSquare,
          },
        ]}
        onValueChange={(v) => {
          const newValue = convertStringToBoolean(v)
          setValue(newValue === undefined ? null : newValue)
        }}
        disabled={locked || false}
        className={cn(className)}
      />
    )
  }
  if (environment === 'list') {
    return (
      <Button
        variant={'outline'}
        type="button"
        disabled={locked}
        className={cn(
          'h-10 w-full min-w-30',
          className,
          value.value
            ? 'text-creative hover:bg-creative/10 hover:text-creative'
            : 'text-destructive hover:bg-destructive/10 hover:text-destructive',
        )}
        onClick={() => setValue(!value.value)}
      >
        <p className="pr-2">
          {value.value === true
            ? 'Yes'
            : value.value === false
              ? 'No'
              : 'Undefined'}
        </p>
      </Button>
    )
  }
  if (environment === 'node') {
    if (value === undefined || value === null) {
      setValue(false)
    }
  }
  return (
    <Switch
      disabled={locked}
      checked={value.value === null ? undefined : value.value}
      className={cn(
        environment === 'node' && 'mt-1',
        valid === false && 'border-warning bg-warning/10',
        className,
      )}
      defaultChecked={false}
      onBlur={_onBlur}
      onCheckedChange={setValue}
      ref={environment === 'node' ? dragRef : undefined}
      {...props}
    />
  )
}
