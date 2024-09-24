'use client'

import type {
  DatatypeObjectValue,
  DataTypeValue,
  NotatedDataTypeValue,
  NotatedListDataTypeValue,
  ValueSettings,
} from '@/types/database.types'
import { Plus } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import { PiCrossCross, PiThreeByTwoDotsVertical } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { dataTypes } from '@/lib/supabase/constants/datatypes'
import GenericInput from './generic-input'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToParentElement,
  restrictToHorizontalAxis,
} from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { type ChangeEvent, useMemo } from 'react'
import type { ZodIssue } from 'zod'

export type ListInputProps = {
  value: NotatedListDataTypeValue<true, true>
  settings?: ValueSettings
  placeholder?: string
  locked?: boolean
  onChange?: (value: NotatedListDataTypeValue<true, true>) => void
  onValueChange?: (value: NotatedListDataTypeValue<true, true>) => void
  onBlur?: (e: ChangeEvent<Element>) => void
  classNames?: {
    container?: string
    item?: string
    button?: string
    input?: string
    handle?: string
    deleteButton?: string
  }
  limitAxis?: 'x' | 'y'
  valid?: boolean
  issues?: ZodIssue[]
}

type UseSortableReturn = Omit<
  ReturnType<typeof useSortable>,
  'setNodeRef' | 'transform' | 'transition'
>

function SortableItem(props: {
  id: string
  children: (args: UseSortableReturn) => React.ReactNode
}) {
  const { setNodeRef, transform, transition, ...rest } = useSortable({
    id: props.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children({ ...rest })}
    </div>
  )
}

export default function ListInput({
  value,
  settings,
  placeholder,
  locked = false,
  classNames,
  limitAxis,
  issues = [],
  onValueChange,
}: ListInputProps) {
  const valueArray = useMemo(
    () => value.value || [{ id: crypto.randomUUID(), value: undefined }],
    [value],
  )

  const changeValue = (v: DataTypeValue<true>, index: number) => {
    if (!onValueChange) return
    const newValueArray = valueArray ? [...valueArray] : []
    if (newValueArray[index]) {
      // @ts-ignore
      newValueArray[index].value = v
      const newValue = {
        ...value,
        value: newValueArray,
      } as NotatedListDataTypeValue<true, true>
      onValueChange(newValue)
    }
  }

  const move = (from: number, to: number) => {
    if (!onValueChange) return
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
    } as NotatedListDataTypeValue<true, true>
    onValueChange(newValue)
  }

  const remove = (index: number) => {
    if (!onValueChange) return
    const newValueArray = valueArray ? [...valueArray] : []
    newValueArray.splice(index, 1)
    const newValue = {
      ...value,
      value: newValueArray,
    } as NotatedListDataTypeValue<true, true>
    onValueChange(newValue)
  }

  const append = (v: DatatypeObjectValue<DataTypeValue, true>) => {
    if (!onValueChange) return
    const newValueArray: DatatypeObjectValue<DataTypeValue, true>[] = valueArray
      ? [...valueArray]
      : []
    newValueArray.push(v)
    const newValue = {
      ...value,
      value: newValueArray,
    } as NotatedListDataTypeValue<true, true>
    onValueChange(newValue)
  }

  if (value.type === 'generic') {
    console.error('ListInput: Generic type not supported')
    return null
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
                      {/* @ts-ignore */}
                      <GenericInput
                        datatype={value.type}
                        value={arrayItem.value}
                        onValueChange={(v) => changeValue(v, index)}
                        settings={settings}
                        placeholder={placeholder}
                        locked={locked}
                        valid={!issues.some((issue) => issue.path[0] === index)}
                        environment="node"
                        className={cn(
                          'w-full rounded-md',
                          false &&
                            'border-destructive/50 bg-destructive/10 focus-visible:ring-destructive/50',
                          !locked && 'rounded-l-none',
                          classNames?.input,
                        )}
                      />
                    </div>
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
          className={cn('w-full gap-1', classNames?.button)}
          type="button"
        >
          <Plus className="size-3.5" />
          Add {dataTypes[value.type].title}
        </Button>
      )}
    </div>
  )
}
