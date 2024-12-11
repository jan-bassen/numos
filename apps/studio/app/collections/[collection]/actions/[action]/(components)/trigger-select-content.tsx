import { triggerOptionsArray } from '@/lib/constants/triggers'
import {
  SelectContent,
  type SelectContentProps,
  SelectItem,
} from '@repo/ui/components/ui/select'

export function TriggerSelectContent(props: SelectContentProps) {
  return (
    <SelectContent className="min-w-44" scrollable>
      {triggerOptionsArray.map((option, index) => {
        return (
          <SelectItem
            key={`key-${option.value}`}
            value={option.value}
            className="flex-col items-start justify-center py-2 pl-9"
          >
            <h3 className="flex items-center gap-2 pb-0.5 font-semibold">
              {option.icons?.stroke({
                className: 'size-4',
              })}
              {option.label}
            </h3>
            <p className="text-ellipsis text-left text-muted-foreground text-xs">
              {option.description}
            </p>
          </SelectItem>
        )
      })}
    </SelectContent>
  )
}
