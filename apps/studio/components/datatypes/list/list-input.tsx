import 'client-only'
import { Plus } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { DndContext, type DraggableAttributes } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import dynamic from 'next/dynamic'
import { getChangeValue } from '@/components/datatypes/list/functions/change-value'
import { getMoveValue } from '@/components/datatypes/list/functions/move-value'
import { getRemoveValue } from '@/components/datatypes/list/functions/remove-value'
import { getAppendValue } from '@/components/datatypes/list/functions/append-value'
import { getModifiers } from '@/components/datatypes/list/functions/modifiers'
import { getEndDrag } from '@/components/datatypes/list/functions/end-drag'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import type { ZodErrorInfo } from '@/types/state.types'
import type { SingleDataTypeInputEnvironment } from '../single-datatype-input'

const SortableItem = dynamic(
  () => import('@/components/datatypes/list/sortable-item'),
  {
    ssr: false,
  },
)

export type ListInputComponentProps<V> = {
  id: string
  index: number
  value: V | null
  locked?: boolean
  onChange: (value: V | null) => void
  remove: () => void
  draggableProps: {
    attributes: DraggableAttributes
    listeners?: SyntheticListenerMap
  }
  className?: string
}

export type ListInputProps<V> = {
  value: ListItem<V>[]
  defaultNewValue?: (index: number) => V
  onChange?: (value: ListItem<V>[]) => void
  input: (props: ListInputComponentProps<V>) => React.ReactNode
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
  environment?: SingleDataTypeInputEnvironment
}

export type ListItem<V> = {
  id: string
  value: V | null
}

export default function ListInput<V>({
  value,
  defaultNewValue,
  onChange,
  input,
  locked = false,
  classNames,
  limitAxis,
  addButtonLabel,
  environment,
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
        environment === 'simulation' && 'p-0',
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
                {({ attributes, listeners }) =>
                  input({
                    index,
                    id: arrayItem.id,
                    value: arrayItem.value,
                    onChange,
                    locked,
                    remove: () => remove(index),
                    draggableProps: {
                      attributes,
                      listeners,
                    },
                  })
                }
              </SortableItem>
            )
          })}
        </SortableContext>
      </DndContext>
      {!locked && (
        <Button
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              value: defaultNewValue?.(value.length) || null,
            })
          }
          variant={'outline'}
          className={cn(
            'h-10 w-full gap-1 rounded-md',
            environment === 'simulation' && 'h-8 rounded-lg',
            classNames?.button,
          )}
          type="button"
        >
          <Plus className="size-3.5" />
          {addButtonLabel || 'Add new value'}
        </Button>
      )}
    </div>
  )
}
