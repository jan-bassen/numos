import type { ListInputComponentProps } from '@/components/datatypes/list/list-input'
import type { ValueRestrictions, ValueType } from '@repo/shared/types/values'
import { Button } from '@repo/ui/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { PiSettings02Stroke } from '@repo/ui/icons/pika'

export function ParameterRestrictions<VT extends ValueType, L extends boolean>(
  props: Omit<
    ListInputComponentProps<ValueRestrictions<VT, L>>,
    'remove' | 'draggableProps'
  >,
) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} size={'icon'}>
          <PiSettings02Stroke className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end">
        <div>Restrictions</div>
      </PopoverContent>
    </Popover>
  )
}
