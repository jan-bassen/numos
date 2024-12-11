import type { Direction } from '@/types/database.types'
import { cn } from '@repo/ui/lib/utils'
import type { GenericDisplayProps } from '../generic-display'
import { directions } from '@/lib/constants/directions'
import type { OptionalValue } from '@repo/engine/types/value-types'

export type DirectionDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: OptionalValue<Direction>
}

export default function DirectionDisplay({
  value,
  className,
}: DirectionDisplayProps) {
  if (!value) return null
  return (
    <div className={cn('rounded-md border border-border p-2', className)}>
      {directions[value].icons?.stroke({ className: 'size-5' })}
    </div>
  )
}
