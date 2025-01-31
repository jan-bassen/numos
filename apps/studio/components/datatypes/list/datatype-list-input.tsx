'use client'

import { cn } from '@repo/ui/lib/utils'
import { useMemo } from 'react'
import type {
  ObjectValue,
  RawValue,
  Value,
  ValueType,
} from '@repo/shared/types/values'
import {
  getDataTypeInput,
  type SingleDataTypeInputProps,
} from '../single-datatype-input'
import type { ZodErrorInfo } from '@/types/state.types'
import ListInput, { type ListItem } from './list-input'
import { DefaultListItemWrapper } from './default-list-item-wrapper'

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
  defaultItem?: RawValue<T, 'single', false>
}

export default function DatatypeListInput<T extends ValueType>({
  value: listValue,
  restrictions,
  locked = false,
  classNames,
  environment,
  onChange,
  placeholder,
  errors,
  defaultItem,
  ...props
}: ListInputProps<T>) {
  const valueArray = useMemo(
    () => listValue?.value || [],
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
    <ListInput<RawValue<T, 'single', true>>
      {...props}
      defaultNewValue={() => defaultItem}
      locked={locked}
      errors={errors}
      onChange={onListChange}
      value={valueArray}
      environment={environment}
      input={(props) => (
        <DefaultListItemWrapper<RawValue<T, 'single', true>>
          {...props}
          className={cn(
            environment === 'simulation' && 'h-9 rounded-r-lg',
            classNames?.item,
          )}
          errors={errors}
        >
          <SingleDatatypeInput
            id={props.id}
            key={props.id}
            type={listValue.type as T}
            value={
              {
                value: props.value,
                type: listValue.type,
                format: 'single',
              } as Value<T, 'single', true>
            }
            onChange={(v) =>
              props.onChange(v.value as RawValue<T, 'single', true>)
            }
            restrictions={restrictions}
            locked={locked}
            valid={!errors?.[props.index]}
            environment={'list'}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-md',
              false &&
                'border-destructive/50 bg-destructive/10 focus-visible:ring-destructive/50',
              !locked && 'rounded-l-none',
              classNames?.input,
            )}
          />
        </DefaultListItemWrapper>
      )}
    />
  )
}
