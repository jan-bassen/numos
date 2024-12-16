'use client'

import { Plus } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import { PiCrossCross, PiThreeByTwoDotsVertical } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { dataTypes } from '@/lib/constants/datatypes'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToParentElement,
  restrictToHorizontalAxis,
} from '@dnd-kit/modifiers'
import { useMemo } from 'react'
import type { ZodIssue } from 'zod'
import type {
  ObjectValue,
  RawSingleValue,
  RawValue,
  Value,
  ValueType,
} from '@repo/engine/types/value-types'
import {
  getDataTypeInput,
  type SingleDataTypeInputProps,
} from '../single-datatype-input'
import dynamic from 'next/dynamic'
import type { ZodErrorInfo } from '@/types/state.types'
import ErrorMessage from '@/components/state/error-message'

const SortableItem = dynamic(
  () => import('@/components/datatypes/list/sortable-item'),
  {
    ssr: false,
  },
)

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
  issues?: ZodIssue[]
  addButtonLabel?: string
}

export default function ListInput<T extends ValueType>({
  value,
  restrictions,
  locked = false,
  classNames,
  limitAxis,
  errors = [],
  environment,
  addButtonLabel,
  onChange,
}: ListInputProps<T>) {
  const valueArray = useMemo(() => value.value || [], [value])

  const onSingleValueChange = (
    v: Value<ValueType, 'single', true>,
    index: number,
  ) => {
    if (!onChange) return
    const newValueArray = valueArray ? [...valueArray] : []
    const newSingleValue = v.value as RawValue<'single', true>
    if (newValueArray[index]) {
      newValueArray[index].value = newSingleValue
      const newValue = {
        ...value,
        value: newValueArray,
      } as Value<T, 'objectarray', true>
      onChange(newValue)
    }
  }

  const move = (from: number, to: number) => {
    if (!onChange) return
    if (
      from < 0 ||
      from >= valueArray.length ||
      to < 0 ||
      to >= valueArray.length
    )
      return
    const newValueArray = valueArray ? [...valueArray] : []
    const [removed] = newValueArray.splice(from, 1)
    if (removed === undefined) return
    newValueArray.splice(to, 0, removed)
    const newValue = {
      ...value,
      value: newValueArray,
    } as Value<T, 'objectarray', true>
    onChange(newValue)
  }

  const remove = (index: number) => {
    if (!onChange) return
    const newValueArray = valueArray ? [...valueArray] : []
    newValueArray.splice(index, 1)
    const newValue = {
      ...value,
      value: newValueArray,
    } as Value<T, 'objectarray', true>
    onChange(newValue)
  }

  const append = (v: ObjectValue<RawSingleValue, true>) => {
    if (!onChange) return
    const newValueArray: ObjectValue<RawSingleValue, true>[] = valueArray
      ? [...valueArray]
      : []
    newValueArray.push(v)
    const newValue = {
      ...value,
      value: newValueArray,
    } as Value<T, 'objectarray', true>
    onChange(newValue)
  }

  const modifiers = [restrictToParentElement]
  switch (limitAxis) {
    case 'x':
      modifiers.push(restrictToHorizontalAxis)
      break
    case 'y':
      modifiers.push(restrictToVerticalAxis)
      break
    default:
      break
  }

  const SingleDatatypeInput = getDataTypeInput<typeof value.type>(value.type)
  if (!SingleDatatypeInput) return null

  return (
    <div
      className={cn(
        'flex max-w-[50rem] flex-col gap-2 p-2',
        classNames?.container,
      )}
    >
      <DndContext
        modifiers={modifiers}
        onDragEnd={(event) => {
          const { active, over } = event
          if (over && active.id !== over?.id) {
            const activeIndex = active.data.current?.sortable?.index
            const overIndex = over.data.current?.sortable?.index
            if (activeIndex !== undefined && overIndex !== undefined) {
              move(activeIndex, overIndex)
            }
          }
        }}
      >
        <SortableContext items={valueArray}>
          {valueArray.map((arrayItem, index) => {
            return (
              <SortableItem key={arrayItem.id} id={arrayItem.id}>
                {({ attributes, listeners }) => (
                  <div key={arrayItem.id} className="relative w-full">
                    <div className="flex w-full items-start">
                      {!locked && (
                        <div
                          className={cn(
                            'grid h-10 place-items-center rounded-l-md border border-border border-r-0 bg-background px-0.5 text-muted-foreground transition-colors duration-200 hover:bg-muted/10',
                            false && 'border-destructive/50 bg-destructive/10',
                            classNames?.handle,
                          )}
                        >
                          <PiThreeByTwoDotsVertical
                            className="size-4 focus:outline-none"
                            {...attributes}
                            {...listeners}
                          />
                        </div>
                      )}
                      <SingleDatatypeInput
                        type={value.type as T}
                        value={
                          {
                            value: arrayItem.value,
                            type: value.type,
                            format: 'single',
                          } as Value<T, 'single', true>
                        }
                        onChange={(v) => onSingleValueChange(v, index)}
                        restrictions={restrictions}
                        locked={locked}
                        valid={!errors?.[index]}
                        environment={environment}
                        className={cn(
                          'w-full rounded-md',
                          false &&
                            'border-destructive/50 bg-destructive/10 focus-visible:ring-destructive/50',
                          !locked && 'rounded-l-none',
                          classNames?.input,
                        )}
                      />
                    </div>
                    {errors?.[index] && (
                      <ErrorMessage
                        error={errors?.[index].message}
                        className={cn('mt-1', !locked && 'ml-6')}
                      />
                    )}
                    {!locked && (
                      <Button
                        variant={'outline'}
                        size={'none'}
                        type="button"
                        className={cn(
                          '-right-1.5 -top-1.5 absolute size-5 shrink-0 items-center justify-center rounded-full',
                          classNames?.deleteButton,
                        )}
                        onClick={() => {
                          remove(index)
                        }}
                      >
                        <PiCrossCross className="size-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </SortableItem>
            )
          })}
        </SortableContext>
      </DndContext>
      {!locked && (
        <Button
          onClick={() => append({ id: crypto.randomUUID(), value: undefined })}
          variant={'outline'}
          className={cn('w-full h-10 rounded-md gap-1', classNames?.button)}
          type="button"
        >
          <Plus className="size-3.5" />
          {addButtonLabel || `Add ${dataTypes[value.type].title}`}
        </Button>
      )}
    </div>
  )
}
