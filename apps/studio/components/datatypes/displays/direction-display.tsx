import type { Direction } from '@/types/database.types'
import { cn } from '@repo/ui/lib/utils'
import type { GenericDisplayProps } from '../generic-display'
import { directions } from '@/lib/supabase/constants/directions'

export type DirectionDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: Direction
}

export default function DirectionDisplay({
  value,
  className,
}: DirectionDisplayProps) {
  const Icon = directions[value].Icon
  return (
    <div className={cn('rounded-md border border-border p-2', className)}>
      <Icon className={'size-5'} />
    </div>
  )
}
