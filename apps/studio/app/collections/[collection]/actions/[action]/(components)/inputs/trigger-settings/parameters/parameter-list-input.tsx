import { useCollection } from '@/app/collections/[collection]/collection-context'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import type { ListInputComponentProps } from '@/components/datatypes/list/list-input'
import { removeActionParameterFromLocalForm } from '@/app/collections/[collection]/actions/(functions)/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { listOptionMap, listOptions } from '@/lib/constants/list-options'

export function ParameterListInput({
  paramKey,
  value,
  onChange,
  locked,
}: Omit<ListInputComponentProps<boolean>, 'remove' | 'draggableProps'> & {
  paramKey: string
}) {
  const {
    collection: { slug: collectionSlug },
  } = useCollection()
  const {
    action: { slug },
  } = useAction()
  return (
    <Select
      onValueChange={(v) => {
        onChange(v === 'list')
        removeActionParameterFromLocalForm(collectionSlug, slug, paramKey)
      }}
      defaultValue={value ? 'list' : 'single'}
    >
      <SelectTrigger disabled={locked}>
        <SelectValue>
          {listOptionMap[value ? 'list' : 'single'].Icon({
            className: 'h-4 w-4 mr-1.5',
          })}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-44 overflow-visible">
        {listOptions.map((option) => {
          return (
            <SelectItem
              className=" hover:bg-muted"
              key={option.slug}
              value={option.slug as string}
            >
              <div className="flex flex-row items-center gap-2">
                {option.Icon({
                  className: 'h-4 w-4 ',
                })}
                {option.label}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
