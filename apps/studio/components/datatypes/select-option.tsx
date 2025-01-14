import type { SelectOption } from '@/types/nodes.types'
import { SelectItem } from '@repo/ui/components/ui/select'
import { cn } from '@repo/ui/lib/utils'

export default function SelectOptionItem({ option }: { option: SelectOption }) {
  return (
    <SelectItem
      value={option.value}
      className="flex-col items-start justify-center py-2 pl-9"
    >
      <h3
        className={cn(
          'flex items-center gap-2 pb-0.5',
          option.description ? 'font-semibold' : '',
        )}
      >
        {option.icons?.stroke({
          className: 'size-4',
        })}
        {option.label || option.value}
      </h3>
      <p className="text-ellipsis text-muted-foreground text-xs">
        {option.description}
      </p>
    </SelectItem>
  )
}
