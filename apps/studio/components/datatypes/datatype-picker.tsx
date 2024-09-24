import {
  SelectContent,
  type SelectContentProps,
  SelectItem,
} from '@repo/ui/components/ui/select'
import { dataTypes } from '@/lib/supabase/constants/datatypes'

export function DatatypeSelectContent(props: SelectContentProps) {
  return (
    <SelectContent /* position="item-aligned" */
      side="bottom"
      scrollable
      collisionPadding={0}
      className="min-w-44"
    >
      {Object.entries(dataTypes).map(([key, dataType], index) => {
        if (!dataType.attribute) return
        return (
          <SelectItem
            key={`key-${key}`}
            value={key}
            className="flex-col items-start justify-center py-2 pl-9"
          >
            <h3 className="flex items-center gap-2 pb-0.5 font-semibold">
              {dataType.icons.stroke({
                className: 'size-4',
              })}
              {dataType.title}
            </h3>
            <p className="text-ellipsis text-xs text-muted-foreground">
              {dataType.description}
            </p>
          </SelectItem>
        )
      })}
    </SelectContent>
  )
}
