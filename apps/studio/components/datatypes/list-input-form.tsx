'use client'

import type { ValueDataType, ValueSettings } from '@/types/database.types'
import {
  type ArrayPath,
  type FieldArray,
  type Path,
  type UseFormReturn,
  useFieldArray,
} from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { PiCrossCross, PiThreeByTwoDotsVertical } from '@repo/ui/icons/pika'
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

export type ListInputProps<
  SchemaType extends Record<string, any>,
  Key extends ArrayPath<SchemaType>,
> = {
  datatype: ValueDataType
  form: UseFormReturn<SchemaType>
  itemKey: Key
  defaultItemValue: FieldArray<SchemaType, Key>
  settings?: ValueSettings
  defaultValue?: Array<any>
  placeholder?: string
  locked?: boolean
  classNames?: {
    container?: string
    item?: string
    button?: string
    input?: string
    handle?: string
    deleteButton?: string
  }
  limitAxis?: 'x' | 'y'
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

export default function ListFormInput<
  SchemaType extends Record<string, any>,
  ListKey extends ArrayPath<SchemaType>,
>({
  datatype,
  form,
  itemKey,
  settings,
  defaultValue = [],
  defaultItemValue,
  placeholder,
  locked = false,
  classNames,
  limitAxis,
}: ListInputProps<SchemaType, ListKey>) {
  const rootState = form.getFieldState(itemKey as Path<SchemaType>)
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control,
      name: itemKey,
    },
  )

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
    <>
      <div
        className={cn(
          'grid min-h-16 max-w-[50rem] grid-cols-1 gap-3 rounded-lg border border-border bg-muted/20 p-4 md:grid-cols-2 xl:grid-cols-3',
          rootState.invalid && 'border-destructive',
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
          <SortableContext items={fields}>
            {fields.map((field, index) => {
              const { invalid, isDirty, isTouched, isValidating, error } =
                form.getFieldState(
                  `${itemKey}.${index}.value` as Path<SchemaType>,
                )
              return (
                <SortableItem key={field.id} id={field.id}>
                  {({ attributes, listeners }) => (
                    <div key={field.id} className="relative w-full">
                      <div className="flex w-full items-start">
                        {!locked && (
                          <div
                            className={cn(
                              'grid h-10 place-items-center rounded-l-md border border-border border-r-0 bg-background px-0.5 text-muted-foreground transition-colors duration-200 hover:bg-muted/10',
                              invalid &&
                                'border-destructive/50 bg-destructive/10',
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
                        <FormField
                          control={form.control}
                          name={`${itemKey}.${index}.value` as Path<SchemaType>}
                          render={({ field }) => {
                            const { ref, ...rest } = field
                            return (
                              <FormItem
                                className={cn(
                                  'w-full md:space-y-0.5',
                                  classNames?.item,
                                )}
                              >
                                <FormControl>
                                  <GenericInput
                                    {...rest}
                                    settings={settings}
                                    datatype={datatype}
                                    placeholder={placeholder}
                                    locked={locked}
                                    environment="list"
                                    className={cn(
                                      'rounded-md',
                                      invalid &&
                                        'border-destructive/50 bg-destructive/10 focus-visible:ring-destructive/50',
                                      !locked && 'rounded-l-none',
                                      classNames?.input,
                                    )}
                                  />
                                </FormControl>
                                <FormMessage className="pl-1 text-xs" />
                              </FormItem>
                            )
                          }}
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
                            form.trigger(itemKey as Path<SchemaType>)
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
            onClick={() => append(defaultItemValue)}
            variant={'outline'}
            className={cn('h-10 gap-1', classNames?.button)}
            type="button"
          >
            <Plus className="size-3.5" />
            Add {dataTypes[datatype].title}
          </Button>
        )}
      </div>
      <FormField
        control={form.control}
        name={itemKey as Path<SchemaType>}
        render={() => <FormMessage />}
      />
    </>
  )
}
