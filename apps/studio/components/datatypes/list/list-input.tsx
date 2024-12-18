import 'client-only'
import { Plus } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import { PiCrossCross, PiThreeByTwoDotsVertical } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import dynamic from 'next/dynamic'
import type { ZodErrorInfo } from '@/types/state.types'
import ErrorMessage from '@/components/state/error-message'
import { getChangeValue } from '@/components/datatypes/list/functions/change-value'
import { getMoveValue } from '@/components/datatypes/list/functions/move-value'
import { getRemoveValue } from '@/components/datatypes/list/functions/remove-value'
import { getAppendValue } from '@/components/datatypes/list/functions/append-value'
import { getModifiers } from '@/components/datatypes/list/functions/modifiers'
import { getEndDrag } from '@/components/datatypes/list/functions/end-drag'

const SortableItem = dynamic(
  () => import('@/components/datatypes/list/sortable-item'),
  {
    ssr: false,
  },
)

export type ListInputProps<V> = {
  value: ListItem<V>[]
  onChange?: (value: ListItem<V>[]) => void
  input: (props: {
    id: string
    index: number
    value: V | null
    onChange: (value: V | null) => void
  }) => React.ReactNode
  errors?: Array<ZodErrorInfo | undefined>
  limitAxis?: 'x' | 'y'
  addButtonLabel?: string
  locked?: boolean
  classNames?: {
    container?: string
    button?: string
    handle?: string
    deleteButton?: string
  }
}

export type ListItem<V> = {
  id: string
  value: V | null
}

export default function ListInput<V>({
  value,
  onChange,
  input,
  locked = false,
  classNames,
  limitAxis,
  errors = [],
  addButtonLabel,
}: ListInputProps<V>) {
  const changeValue = getChangeValue(value, onChange)
  const move = getMoveValue(value, onChange)
  const remove = getRemoveValue(value, onChange)
  const append = getAppendValue(value, onChange)

  const modifiers = getModifiers(limitAxis)
  const endDrag = getEndDrag(move)

  return (
    <div
      className={cn(
        'flex max-w-[50rem] flex-col gap-2 p-2',
        classNames?.container,
      )}
    >
      <DndContext modifiers={modifiers} onDragEnd={endDrag}>
        <SortableContext items={value}>
          {value.map((arrayItem, index) => {
            const onChange = (value: V | null) => {
              changeValue({ ...arrayItem, value }, index)
            }
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
                      {input({
                        index,
                        id: arrayItem.id,
                        value: arrayItem.value,
                        onChange,
                      })}
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
          onClick={() => append({ id: crypto.randomUUID(), value: null })}
          variant={'outline'}
          className={cn('h-10 w-full gap-1 rounded-md', classNames?.button)}
          type="button"
        >
          <Plus className="size-3.5" />
          {addButtonLabel || 'Add new value'}
        </Button>
      )}
    </div>
  )
}
