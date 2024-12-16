/* import type {
  ValueSelectOption,
  ValueType,
} from '@repo/engine/types/value-types'
import { SelectItem, type SelectItemProps } from '@repo/ui/components/ui/select'
import { cn } from '@repo/ui/lib/utils'

export default function ValueSelectOptionItem<VT extends ValueType>({
  option,
  className,
  ...props
}: Omit<SelectItemProps, 'value'> & { option: ValueSelectOption<VT> }) {
  return (
    <SelectItem
      value={option.key}
      className={cn('flex-col items-start justify-center py-2 pl-9', className)}
      {...props}
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
 */
