'use client'

import { cn } from '@repo/ui/lib/utils'
import { useMemo } from 'react'
import type {
  ObjectValue,
  RawValue,
  Value,
  ValueType,
} from '@repo/engine/types/value-types'
import {
  getDataTypeInput,
  type SingleDataTypeInputProps,
} from '../single-datatype-input'
import type { ZodErrorInfo } from '@/types/state.types'
import AnyListInput, { type ListItem } from './list-input'

export type ListInputProps<T extends ValueType = ValueType> = Omit<
  SingleDataTypeInputProps<T>,
  'value' | 'onChange' | 'className' | 'id' | 'valid'
> & {
  value: Value<T, 'objectarray', true>
  onChange?: (value: Value<T, 'objectarray', true>) => void
  errors?: Array<ZodErrorInfo | undefined>
  classNames?: {
    container?: string
    item?: string
    button?: string
    input?: string
    handle?: string
    deleteButton?: string
  }
  limitAxis?: 'x' | 'y'
  addButtonLabel?: string
}

export default function ListInput<T extends ValueType>({
  value: listValue,
  restrictions,
  locked = false,
  classNames,
  environment,
  onChange,
  placeholder,
  errors,
  ...props
}: ListInputProps<T>) {
  const valueArray = useMemo(
    () => listValue.value || [],
    [listValue],
  ) as ObjectValue<RawValue<T, 'single', false>, true>[]

  const SingleDatatypeInput = getDataTypeInput<T>(listValue.type as T)
  if (!SingleDatatypeInput) return null

  const onListChange = (value: ListItem<RawValue<T, 'single', true>>[]) => {
    onChange?.({
      type: listValue.type,
      value: value,
      format: 'objectarray',
    } as Value<T, 'objectarray', true>)
  }

  return (
    <AnyListInput<RawValue<T, 'single', true>>
      {...props}
      locked={locked}
      errors={errors}
      onChange={onListChange}
      value={valueArray}
      input={({ index, id, value, onChange }) => (
        <SingleDatatypeInput
          id={id}
          key={id}
          type={listValue.type as T}
          value={
            {
              value: value,
              type: listValue.type,
              format: 'single',
            } as Value<T, 'single', true>
          }
          onChange={(v) => onChange(v.value as RawValue<T, 'single', true>)}
          restrictions={restrictions}
          locked={locked}
          valid={!errors?.[index]}
          environment={environment}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-md',
            false &&
              'border-destructive/50 bg-destructive/10 focus-visible:ring-destructive/50',
            !locked && 'rounded-l-none',
            classNames?.input,
          )}
        />
      )}
    />
  )
}
