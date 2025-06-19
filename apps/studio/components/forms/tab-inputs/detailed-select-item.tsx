import { SelectItem } from '@repo/ui/components/select'
import type { TabOption } from '@/components/forms/tab-inputs/tab-option'

export function DetailedSelectItem({
  option,
}: {
  option: TabOption
}) {
  return (
    <SelectItem
      value={option.value}
      className="flex-col items-start justify-center py-2 pl-9"
    >
      <h3 className="flex items-center gap-2 pb-0.5 font-semibold">
        {option.Icon?.({
          className: 'size-4',
        })}
        {option.label}
      </h3>
      <p className="line-clamp-2 max-w-96 text-ellipsis text-left text-muted-foreground text-xs">
        {option.description}
      </p>
    </SelectItem>
  )
}
