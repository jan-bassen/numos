import { parameterTypeOptions, dataTypes } from '@/lib/constants/datatypes'
import { useCollection } from '@/app/collections/[collection]/collection-context'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import type { ListInputComponentProps } from '@/components/datatypes/list/list-input'
import { removeActionParameterFromLocalForm } from '@/app/collections/[collection]/actions/(functions)/utils'
import type { DataType, ValueType } from '@repo/shared/types/values'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'

export function ParameterTypeInput({
  paramKey,
  value,
  onChange,
  locked,
}: Omit<ListInputComponentProps<ValueType>, 'remove' | 'draggableProps'> & {
  paramKey: string
}) {
  const {
    collection: { slug: collectionSlug },
  } = useCollection()
  const {
    action: { slug },
  } = useAction()
  return (
    <div>
      <Select
        onValueChange={(v) => {
          onChange(v as ValueType)
          removeActionParameterFromLocalForm(collectionSlug, slug, paramKey)
        }}
        defaultValue={value || undefined}
      >
        <SelectTrigger disabled={locked}>
          <SelectValue>
            {value &&
              dataTypes[value].icons.stroke({
                className: 'h-4 w-4 mr-1.5',
              })}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-44 overflow-visible">
          {parameterTypeOptions.map((option) => {
            return (
              <SelectItem
                className="hover:bg-muted"
                key={option.value}
                value={option.value}
              >
                <div className="flex flex-row items-center gap-2">
                  {dataTypes[option.value as DataType].icons.stroke({
                    className: 'h-4 w-4',
                  })}
                  {dataTypes[option.value as DataType].title}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
